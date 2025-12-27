import { Component, OnInit, computed, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeaveRequestFormData, LEAVE_TYPES, LeaveTypeConfig } from '../../models/leave-request.model';
import { dateRangeValidator, calculateDaysBetween } from '../../validators/date-range.validator';

/**
 * Challenge 15: Cross-Field Validation (Date Range)
 *
 * Focus: FormGroup-level validators that check relationships between fields
 *
 * Key Concepts:
 * - Apply validators at FormGroup level, not control level
 * - Use computed signals instead of methods in templates
 * - Handle both control-level and group-level errors
 */

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leave-form.component.html',
  styleUrl: './leave-form.component.scss'
})
export class LeaveFormComponent implements OnInit {
  leaveForm!: FormGroup;

  // Expose leave types configuration to template
  leaveTypes = LEAVE_TYPES;

  // Signals for reactive state management
  submitted = signal<boolean>(false);
  showSuccessMessage = signal<boolean>(false);
  successMessage = signal<string>('');

  // Signal to track form value/status changes for computed signal reactivity
  private formUpdateTrigger = signal<number>(0);

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();

    // Track form changes to make computed signals reactive
    this.leaveForm.valueChanges.subscribe(() => {
      this.formUpdateTrigger.update(v => v + 1);
    });

    this.leaveForm.statusChanges.subscribe(() => {
      this.formUpdateTrigger.update(v => v + 1);
    });
  }

  private initializeForm(): void {
    this.leaveForm = this.fb.group({
      leaveType: ['vacation', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      reason: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    }, {
      // Key Interview Point: Apply cross-field validator at FormGroup level
      validators: [dateRangeValidator()]
    });
  }

  // ==========================================
  // Computed Error Signals (Avoid methods in template)
  // ==========================================

  /**
   * Control-level error messages
   * Interview Point: Use computed signals for performance (memoized)
   */
  readonly leaveTypeError = computed(() => {
    this.formUpdateTrigger(); // Track form changes
    const control = this.leaveForm?.get('leaveType');
    if (!control?.errors || !(control.touched || this.submitted())) return null;

    if (control.errors['required']) return 'Leave type is required';
    return null;
  });

  readonly startDateError = computed(() => {
    this.formUpdateTrigger(); // Track form changes
    const control = this.leaveForm?.get('startDate');
    if (!control?.errors || !(control.touched || this.submitted())) return null;

    if (control.errors['required']) return 'Start date is required';
    return null;
  });

  readonly endDateError = computed(() => {
    this.formUpdateTrigger(); // Track form changes
    const control = this.leaveForm?.get('endDate');
    if (!control?.errors || !(control.touched || this.submitted())) return null;

    if (control.errors['required']) return 'End date is required';
    return null;
  });

  readonly reasonError = computed(() => {
    this.formUpdateTrigger(); // Track form changes
    const control = this.leaveForm?.get('reason');
    if (!control?.errors || !(control.touched || this.submitted())) return null;

    if (control.errors['required']) return 'Reason is required';
    if (control.errors['minlength']) {
      return `Reason must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    if (control.errors['maxlength']) {
      return `Reason cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
    }
    return null;
  });

  /**
   * FormGroup-level error message
   * Interview Key Point: This checks the FormGroup's errors, not individual controls
   */
  readonly groupError = computed(() => {
    this.formUpdateTrigger(); // Track form changes
    if (!this.leaveForm) return null;
    const startDateControl = this.leaveForm.get('startDate');
    const endDateControl = this.leaveForm.get('endDate');

    const shouldShow = (startDateControl?.touched || this.submitted()) &&
                       (endDateControl?.touched || this.submitted());

    if (!shouldShow) return null;

    if (this.leaveForm.hasError('dateRangeInvalid')) {
      return this.leaveForm.errors?.['dateRangeInvalid']?.message || 'Invalid date range';
    }

    if (this.leaveForm.hasError('invalidDate')) {
      return this.leaveForm.errors?.['invalidDate']?.message || 'Invalid date format';
    }

    return null;
  });

  // Business logic computed signals
  readonly totalDays = computed(() => {
    this.formUpdateTrigger(); // Track form changes
    if (!this.leaveForm) return 0;

    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (startDate && endDate && !this.leaveForm.hasError('dateRangeInvalid')) {
      return calculateDaysBetween(startDate, endDate);
    }
    return 0;
  });

  readonly exceedsMaxDays = computed(() => {
    this.formUpdateTrigger(); // Track form changes
    if (!this.leaveForm) return false;

    const leaveType = this.leaveForm.get('leaveType')?.value;
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (!startDate || !endDate) return false;

    const leaveConfig = LEAVE_TYPES.find((type: LeaveTypeConfig) => type.value === leaveType);
    const maxDays = leaveConfig?.maxDays;

    if (maxDays === undefined) return false;

    return calculateDaysBetween(startDate, endDate) > maxDays;
  });

  readonly maxDaysWarning = computed(() => {
    this.formUpdateTrigger(); // Track form changes
    if (!this.leaveForm) return null;

    const leaveType = this.leaveForm.get('leaveType')?.value;
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (!startDate || !endDate) return null;

    const leaveConfig = LEAVE_TYPES.find((type: LeaveTypeConfig) => type.value === leaveType);
    const maxDays = leaveConfig?.maxDays;

    if (maxDays === undefined) return null;

    const days = calculateDaysBetween(startDate, endDate);

    if (days > maxDays) {
      return `Your selected leave type allows a maximum of ${maxDays} days. You've selected ${days} days.`;
    }
    return null;
  });

  readonly characterCount = computed(() => {
    this.formUpdateTrigger(); // Track form changes
    if (!this.leaveForm) return 0;
    return this.leaveForm.get('reason')?.value?.length || 0;
  });

  // ==========================================
  // Form Actions
  // ==========================================

  onSubmit(): void {
    this.submitted.set(true);

    if (this.leaveForm.invalid) {
      // Mark all controls as touched to trigger validation display
      Object.keys(this.leaveForm.controls).forEach(key => {
        this.leaveForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.exceedsMaxDays()) return;

    const formData: LeaveRequestFormData = this.leaveForm.value;

    // Simulate submission
    this.successMessage.set(
      `Leave request submitted successfully! ${this.totalDays()} days of ${formData.leaveType} leave from ${formData.startDate} to ${formData.endDate}.`
    );
    this.showSuccessMessage.set(true);

    // Reset form after success
    setTimeout(() => {
      this.leaveForm.reset({
        leaveType: 'vacation'
      });
      this.submitted.set(false);
      this.showSuccessMessage.set(false);
    }, 5000);
  }

  onReset(): void {
    this.leaveForm.reset({ leaveType: 'vacation' });
    this.submitted.set(false);
    this.showSuccessMessage.set(false);
  }
}
