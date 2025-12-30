import { Component, OnInit, inject, signal } from '@angular/core';
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
 * - Use template variables to avoid calling methods twice
 * - Handle both control-level and group-level errors
 *
 * ⭐ Interview Approach: Simple and clear for 30-45 min timeframe
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

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
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
  // Error Message Methods
  // ⭐ Interview Approach: Simple methods with template variables
  // ==========================================

  /**
   * Get error message for leave type field
   */
  getLeaveTypeError(): string | null {
    const control = this.leaveForm?.get('leaveType');
    if (!control?.errors || !(control.touched || this.submitted())) return null;

    if (control.errors['required']) return 'Leave type is required';
    return null;
  }

  /**
   * Get error message for start date field
   */
  getStartDateError(): string | null {
    const control = this.leaveForm?.get('startDate');
    if (!control?.errors || !(control.touched || this.submitted())) return null;

    if (control.errors['required']) return 'Start date is required';
    return null;
  }

  /**
   * Get error message for end date field
   */
  getEndDateError(): string | null {
    const control = this.leaveForm?.get('endDate');
    if (!control?.errors || !(control.touched || this.submitted())) return null;

    if (control.errors['required']) return 'End date is required';
    return null;
  }

  /**
   * Get error message for reason field
   */
  getReasonError(): string | null {
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
  }

  /**
   * Get FormGroup-level error message
   * ⭐ Key Interview Point: This checks the FormGroup's errors, not individual controls
   */
  getGroupError(): string | null {
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
  }

  // ==========================================
  // Business Logic Methods
  // ==========================================

  /**
   * Calculate total days between start and end date
   */
  getTotalDays(): number {
    if (!this.leaveForm) return 0;

    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (startDate && endDate && !this.leaveForm.hasError('dateRangeInvalid')) {
      return calculateDaysBetween(startDate, endDate);
    }
    return 0;
  }

  /**
   * Check if selected days exceed maximum allowed for leave type
   */
  exceedsMaxDays(): boolean {
    if (!this.leaveForm) return false;

    const leaveType = this.leaveForm.get('leaveType')?.value;
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (!startDate || !endDate) return false;

    const leaveConfig = LEAVE_TYPES.find((type: LeaveTypeConfig) => type.value === leaveType);
    const maxDays = leaveConfig?.maxDays;

    if (maxDays === undefined) return false;

    return calculateDaysBetween(startDate, endDate) > maxDays;
  }

  /**
   * Get warning message when max days exceeded
   */
  getMaxDaysWarning(): string | null {
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
  }

  /**
   * Get character count for reason field
   */
  getCharacterCount(): number {
    if (!this.leaveForm) return 0;
    return this.leaveForm.get('reason')?.value?.length || 0;
  }

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
      `Leave request submitted successfully! ${this.getTotalDays()} days of ${formData.leaveType} leave from ${formData.startDate} to ${formData.endDate}.`
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
