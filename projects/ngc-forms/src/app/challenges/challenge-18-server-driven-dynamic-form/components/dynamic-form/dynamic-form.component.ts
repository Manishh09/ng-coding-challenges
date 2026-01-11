import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { FormSchema, FieldConfig, ValidatorConfig } from '../../models/form-schema.model';
import { FormSchemaService } from '../../services/form-schema.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Dynamic Form Component
 *
 * Demonstrates server-driven form generation from JSON schema.
 * Builds FormGroup dynamically at runtime with configurable validators.
 *
 * Key Concepts:
 * - Runtime form construction from JSON
 * - Validator factory pattern
 * - Dynamic field rendering with @switch
 * - Type-safe schema structure
 * - Service-based data loading
 */
@Component({
  selector: 'ngc-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  dynamicForm!: FormGroup;
  formSchema!: FormSchema;
  fields: FieldConfig[] = [];
  submitted = signal(false);
  showSuccessMessage = signal(false);
  submittedData = signal<Record<string, any> | null>(null);

  // Inject FormBuilder and FormSchemaService
  private fb = inject(FormBuilder);
  private formSchemaService = inject(FormSchemaService);

  // inject destroyRef
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadSchema();
  }

  /**
   * Load form schema from service
   * In production, this would be an async operation fetching from API
   */
  private loadSchema(): void {
    // Using subscribe pattern (simulates async API call)
    this.formSchemaService.getFormSchema().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(schema => {
      this.formSchema = schema;
      this.fields = this.formSchema.fields.sort((a, b) => (a.order || 0) - (b.order || 0));
      this.buildForm();
    });
  }

  /**
   * Build FormGroup dynamically from schema
   * Creates FormControls with validators based on field configuration
   */
  private buildForm(): void {
    const group: Record<string, any> = {};

    this.fields.forEach(field => {
      const validators = this.getValidators(field.validators || []);
      group[field.name] = [field.defaultValue || '', validators];
    });

    this.dynamicForm = this.fb.group(group);
  }

  /**
   * Validator Factory: Maps string-based validator configs to Angular ValidatorFn
   * This is the key pattern for dynamic forms - converting JSON to validators
   */
  private getValidators(configs: ValidatorConfig[]): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    configs.forEach(config => {
      switch (config.type) {
        case 'required':
          validators.push(Validators.required);
          break;
        case 'email':
          validators.push(Validators.email);
          break;
        case 'minLength':
          validators.push(Validators.minLength(config.value));
          break;
        case 'maxLength':
          validators.push(Validators.maxLength(config.value));
          break;
        case 'min':
          validators.push(Validators.min(config.value));
          break;
        case 'max':
          validators.push(Validators.max(config.value));
          break;
      }
    });

    return validators;
  }

  /**
   * Check if field error should be displayed
   */
  shouldShowError(fieldName: string): boolean {
    const control = this.dynamicForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || this.submitted()));
  }

  /**
   * Get error message for a field
   * Uses custom messages from schema or falls back to defaults
   */
  getErrorMessage(fieldName: string): string {
    const control = this.dynamicForm.get(fieldName);
    const field = this.fields.find(f => f.name === fieldName);

    if (!control || !control.errors || !field) {
      return '';
    }

    // Find matching validator config for custom message
    const errorKey = Object.keys(control.errors)[0];
    const validatorConfig = field.validators?.find(v => {
      if (errorKey === 'required') return v.type === 'required';
      if (errorKey === 'email') return v.type === 'email';
      if (errorKey === 'minlength') return v.type === 'minLength';
      if (errorKey === 'maxlength') return v.type === 'maxLength';
      if (errorKey === 'min') return v.type === 'min';
      if (errorKey === 'max') return v.type === 'max';
      return false;
    });

    // Return custom message or default
    if (validatorConfig?.message) {
      return validatorConfig.message;
    }

    // Default messages
    if (control.errors['required']) return `${field.label} is required`;
    if (control.errors['email']) return 'Invalid email format';
    if (control.errors['minlength']) {
      const min = control.errors['minlength'].requiredLength;
      return `Minimum ${min} characters required`;
    }
    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return `Maximum ${max} characters allowed`;
    }
    if (control.errors['min']) {
      const min = control.errors['min'].min;
      return `Minimum value is ${min}`;
    }
    if (control.errors['max']) {
      const max = control.errors['max'].max;
      return `Maximum value is ${max}`;
    }

    return 'Invalid value';
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.submitted.set(true);

    // Mark all fields as touched to show errors
    Object.keys(this.dynamicForm.controls).forEach(key => {
      this.dynamicForm.get(key)?.markAsTouched();
    });

    if (this.dynamicForm.valid) {
      this.submittedData.set(this.dynamicForm.value);
      this.showSuccessMessage.set(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.showSuccessMessage.set(false);
      }, 5000);
    }
  }

  /**
   * Reset form to initial state
   */
  onReset(): void {
    this.dynamicForm.reset();
    this.submitted.set(false);
    this.showSuccessMessage.set(false);
    this.submittedData.set(null);

    // Reset to default values
    this.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        this.dynamicForm.get(field.name)?.setValue(field.defaultValue);
      }
    });
  }
}
