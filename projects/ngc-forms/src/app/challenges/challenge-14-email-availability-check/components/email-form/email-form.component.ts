import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailValidationService } from '../../services/email-validation.service';
import { EmailFormData } from '../../models/email.model';
import { emailAvailabilityValidator } from '../../validators/email-availability.validator';

@Component({
  selector: 'app-email-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.scss'
})
export class EmailFormComponent implements OnInit {
  emailForm!: FormGroup;

  // Signals for component state
  submitted = signal(false);
  showSuccessMessage = signal(false);
  successMessage = signal('');
  isValidating = signal(false);
  takenEmails = signal<string[]>([]);

  constructor(
    private fb: FormBuilder,
    public emailService: EmailValidationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupValidationStateMonitoring();
    this.loadTakenEmails();
  }

  /**
   * Load taken emails from API for display
   */
  private loadTakenEmails(): void {
    this.emailService.getTakenEmails().subscribe({
      next: (emails) => this.takenEmails.set(emails),
      error: (error) => console.error('Failed to load emails:', error)
    });
  }

  /**
   * Initialize the reactive form with validators
   * Email field has both sync validators (required, email) and async validator (availability)
   */
  private initializeForm(): void {
    this.emailForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email], // Synchronous validators
        [emailAvailabilityValidator(this.emailService)] // Asynchronous validators
      ],
      fullName: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
      ]
    });
  }

  /**
   * Monitor the email control's status to track PENDING state
   * Updates isValidating signal when async validation is running
   */
  private setupValidationStateMonitoring(): void {
    const emailControl = this.emailForm.get('email');

    emailControl?.statusChanges.subscribe(status => {
      this.isValidating.set(status === 'PENDING');
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.submitted.set(true);

    if (this.emailForm.invalid || this.emailForm.pending) {
      this.markFormGroupTouched(this.emailForm);
      return;
    }

    const formData: EmailFormData = this.emailForm.value;

    // For interview/demo purposes: Just show success without actually registering
    this.successMessage.set(`Registration successful! Welcome, ${formData.fullName}!`);
    this.showSuccessMessage.set(true);
    setTimeout(() => this.showSuccessMessage.set(false), 3000);

    this.emailForm.reset();
    this.submitted.set(false);
  }

  /**
   * Mark all form controls as touched to trigger validation display
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Check if a form control has a specific error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.emailForm.get(fieldName);
    return !!(control && control.hasError(errorType) && (control.touched || this.submitted()));
  }

  /**
   * Get error message for a form control
   */
  getErrorMessage(fieldName: string): string {
    const control = this.emailForm.get(fieldName);
    if (!control || (!control.touched && !this.submitted())) {
      return '';
    }

    if (control.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }

    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
    }

    if (control.hasError('emailTaken')) {
      const error = control.errors?.['emailTaken'];
      return error?.message || 'This email is already registered';
    }

    return '';
  }

  /**
   * Get suggested alternative emails from validation error
   */
  getSuggestedEmails(): string[] {
    const emailControl = this.emailForm.get('email');
    const error = emailControl?.errors?.['emailTaken'];
    return error?.suggestedAlternatives || [];
  }

  /**
   * Get user-friendly field label
   */
  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      email: 'Email address',
      fullName: 'Full name'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Get CSS class for form field based on validation state
   */
  getFieldClass(fieldName: string): string {
    const control = this.emailForm.get(fieldName);
    if (!control) return '';

    const isTouched = control.touched || this.submitted();

    if (!isTouched) return '';

    // Special handling for email field with async validation
    if (fieldName === 'email' && control.status === 'PENDING') {
      return 'is-validating';
    }

    return control.valid ? 'is-valid' : 'is-invalid';
  }

  /**
   * Check if form field should show validation styles
   */
  shouldShowValidation(fieldName: string): boolean {
    const control = this.emailForm.get(fieldName);
    return !!(control && (control.touched || this.submitted()));
  }

  /**
   * Check if submit button should be disabled
   */
  isSubmitDisabled(): boolean {
    return this.emailForm.invalid || this.emailForm.pending;
  }
}
