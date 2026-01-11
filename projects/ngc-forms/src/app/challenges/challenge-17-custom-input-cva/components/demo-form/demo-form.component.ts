import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { UserFormData } from '../../models/user-form.model';

/**
 * Demo Form Component
 *
 * Demonstrates the usage of the custom input component with ControlValueAccessor.
 * Shows how the custom input integrates seamlessly with Angular's reactive forms.
 *
 * Key Concepts:
 * - Using custom form controls with formControlName
 * - Parent-level validation (required, minLength, email)
 * - Error display based on parent form state
 * - Disabled state propagation from parent to CVA
 */
@Component({
  selector: 'ngc-demo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomInputComponent],
  templateUrl: './demo-form.component.html',
  styleUrls: ['./demo-form.component.scss']
})
export class DemoFormComponent implements OnInit {
  userForm!: FormGroup;
  submitted = signal(false);
  showSuccessMessage = signal(false);
  formData = signal<UserFormData | null>(null);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the reactive form with validation rules
   *
   * Validation happens at the parent form level, not inside the CVA component.
   * This is the recommended pattern for CVA implementations.
   */
  private initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Check if a field error should be displayed
   * Show errors only after field is touched (user has interacted with it)
   */
  shouldShowError(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  /**
   * Get the appropriate error message for a field
   * Returns human-readable error messages based on validation failures
   */
  getErrorMessage(fieldName: string): string {
    const control = this.userForm.get(fieldName);

    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }

    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }

    return 'Invalid value';
  }

  /**
   * Get user-friendly label for field name
   */
  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      email: 'Email'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Handle form submission
   * Validates the form and displays success message if valid
   */
  onSubmit(): void {
    this.submitted.set(true);

    // Mark all controls as touched to show validation errors
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });

    if (this.userForm.valid) {
      this.formData.set(this.userForm.value as UserFormData);
      this.showSuccessMessage.set(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.showSuccessMessage.set(false);
      }, 5000);
    }
  }

  /**
   * Reset the form to initial state
   */
  onReset(): void {
    this.userForm.reset();
    this.submitted.set(false);
    this.showSuccessMessage.set(false);
    this.formData.set(null);
  }
}
