import { Component, OnInit, OnDestroy, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CanDeactivateComponent } from '../../models/can-deactivate-component.interface';
import { User } from '../../models/user.model';

/**
 * User form component demonstrating unsaved changes protection.
 *
 * Features:
 * - Reactive form with validation
 * - Tracks form dirty state
 * - Implements CanDeactivateComponent for guard integration
 * - Prevents navigation with unsaved changes
 * - Allows navigation after successful save
 * - Browser refresh/close warning
 */
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit, OnDestroy, CanDeactivateComponent {

  // inject form builder and router
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // reactive form group
  userForm!: FormGroup;

  // signals to track form state
  submitted = signal(false);
  saved = signal(false);
  saving = signal(false);

  // Initialize the form
  ngOnInit(): void {
    this.initializeForm();
  }



  /**
   * Initialize the reactive form with validation rules
   */
  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  /**
   * Implementation of CanDeactivateComponent interface.
   * Returns true if navigation is allowed, false if it should be blocked.
   */
  canDeactivate(): boolean {
    // Allow navigation if form is pristine (no changes made)
    if (this.userForm.pristine) {
      return true;
    }

    // Allow navigation if form was successfully saved
    if (this.saved()) {
      return true;
    }

    // Block navigation if form is dirty and not saved
    return false;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.submitted.set(true);

    if (this.userForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.saveForm();
  }

  /**
   * Simulate form save operation
   */
  private saveForm(): void {
    this.saving.set(true);

    // Simulate API call with 1.5 second delay
    setTimeout(() => {
      const userData: User = this.userForm.value;
      console.log('User data saved:', userData);

      this.saving.set(false);
      this.saved.set(true);

      // Mark form as pristine after successful save
      this.userForm.markAsPristine();

      // Show success message and navigate after brief delay
      setTimeout(() => {
        this.router.navigate(['/challenges/angular-routing']);

        // In a real app, navigate to a different page or reset the form
        // this.router.navigate(['/production-page']);
      }, 1000);
    }, 1500);
  }

  /**
   * Reset the form to initial state
   */
  resetForm(): void {
    this.userForm.reset();
    this.submitted.set(false);
    this.saved.set(false);
  }

  /**
   * Mark all form fields as touched to trigger validation messages
   */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Check if a field has errors and should show error message
   */
  hasError(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted()));
  }

  /**
   * Get error message for a specific field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);

    if (!field || !field.errors) return '';

    if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
    if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['email']) return 'Please enter a valid email address';
    if (field.errors['pattern']) return 'Please enter a valid phone number';

    return 'Invalid input';
  }

  /**
   * Get user-friendly label for field name
   */
  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      country: 'Country'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Browser refresh/close warning
   * This handles the case when user tries to close the browser tab/window
   */
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    if (this.userForm.dirty && !this.saved()) {
      $event.returnValue = true; // Modern browsers show generic message
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }
}
