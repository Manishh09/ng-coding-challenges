import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { ProjectFormData } from '../../models/project.model';
import { duplicateNameValidator } from '../../validators/duplicate-name.validator';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  projectForm!: FormGroup;

  // Signals for component state
  submitted = signal(false);
  showSuccessMessage = signal(false);
  successMessage = signal('');

  constructor(
    private fb: FormBuilder,
    public projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the reactive form with validators
   */
  private initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        duplicateNameValidator(this.projectService.projectNames())
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]]
    });
  }


  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.submitted.set(true);

    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      return;
    }

    const formData: ProjectFormData = this.projectForm.value;

    // For interview/demo purposes: Just show success without actually creating the project
    this.successMessage.set(`Form is valid! Project name "${formData.name}" would be unique.`);
    this.showSuccessMessage.set(true);
    setTimeout(() => this.showSuccessMessage.set(false), 3000);

    this.projectForm.reset();
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
   * Reset success/error messages
   */
  private resetMessages(): void {
    this.submitted.set(false);
    this.showSuccessMessage.set(false);
  }

  /**
   * Check if a form control has a specific error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.projectForm.get(fieldName);
    return !!(control && control.hasError(errorType) && (control.touched || this.submitted()));
  }

  /**
   * Get error message for a form control
   */
  getErrorMessage(fieldName: string): string {
    const control = this.projectForm.get(fieldName);
    if (!control || (!control.touched && !this.submitted())) {
      return '';
    }

    if (control.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${minLength} characters`;
    }

    if (control.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldLabel(fieldName)} cannot exceed ${maxLength} characters`;
    }

    if (control.hasError('duplicateName')) {
      const error = control.errors?.['duplicateName'];
      return error?.message || 'This project name already exists';
    }

    return '';
  }

  /**
   * Get user-friendly field label
   */
  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Project name',
      description: 'Description'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Get CSS class for form field based on validation state
   */
  getFieldClass(fieldName: string): string {
    const control = this.projectForm.get(fieldName);
    if (!control) return '';

    const isTouched = control.touched || this.submitted();

    if (!isTouched) return '';

    return control.valid ? 'is-valid' : 'is-invalid';
  }

  /**
   * Check if form field should show validation styles
   */
  shouldShowValidation(fieldName: string): boolean {
    const control = this.projectForm.get(fieldName);
    return !!(control && (control.touched || this.submitted()));
  }
}
