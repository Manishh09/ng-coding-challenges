import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExperienceFormData } from '../../models/experience.model';

/**
 * Challenge 16: Dynamic FormArray (Experience Section)
 *
 * Focus: FormArray with nested FormGroups, dynamic add/remove operations
 *
 * Key Concepts:
 * - Creating and managing FormArray
 * - Nested FormGroup within FormArray
 * - Dynamic add/remove controls
 * - Array length constraints (min 1, max 5)
 */

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './experience-form.component.html',
  styleUrl: './experience-form.component.scss'
})
export class ExperienceFormComponent implements OnInit {
  experienceForm!: FormGroup;

  // Signals for reactive state management
  submitted = signal<boolean>(false);
  showSuccessMessage = signal<boolean>(false);
  successMessage = signal<string>('');

  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize form with FormArray containing one experience entry
   * Key Interview Point: FormArray starts with minimum required entries
   */
  private initializeForm(): void {
    this.experienceForm = this.fb.group({
      experiences: this.fb.array([
        this.createExperienceGroup() // Start with 1 entry (minimum required)
      ])
    });
  }

  /**
   * Factory method to create a new experience FormGroup
   * Key Interview Point: Reusable factory pattern for consistent structure
   */
  private createExperienceGroup(): FormGroup {
    return this.fb.group({
      company: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      role: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      years: ['', [
        Validators.required,
        Validators.min(0.5),
        Validators.max(50)
      ]]
    });
  }

  /**
   * Getter for easy access to FormArray
   * Key Interview Point: Type casting to FormArray for array-specific methods
   */
  get experiences(): FormArray {
    return this.experienceForm.get('experiences') as FormArray;
  }

  /**
   * Add a new experience entry
   * Key Interview Point: Check max constraint before adding
   */
  addExperience(): void {
    if (this.experiences.length < 5) {
      this.experiences.push(this.createExperienceGroup());
    }
  }

  /**
   * Remove experience entry at specified index
   * Key Interview Point: Check min constraint before removing
   */
  removeExperience(index: number): void {
    if (this.experiences.length > 1) {
      this.experiences.removeAt(index);
    }
  }

  /**
   * Check if can add more experiences
   */
  canAdd(): boolean {
    return this.experiences.length < 5;
  }

  /**
   * Check if can remove experiences
   */
  canRemove(): boolean {
    return this.experiences.length > 1;
  }

  /**
   * Get error message for a specific control in an experience entry
   */
  getErrorMessage(index: number, fieldName: string): string | null {
    const control = this.experiences.at(index)?.get(fieldName);

    if (!control || !control.errors || !(control.touched || this.submitted())) {
      return null;
    }

    const errors = control.errors;

    if (errors['required']) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (errors['minlength']) {
      return `${this.getFieldLabel(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
    }

    if (errors['maxlength']) {
      return `${this.getFieldLabel(fieldName)} cannot exceed ${errors['maxlength'].requiredLength} characters`;
    }

    if (errors['min']) {
      return `${this.getFieldLabel(fieldName)} must be at least ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `${this.getFieldLabel(fieldName)} cannot exceed ${errors['max'].max}`;
    }

    return null;
  }

  /**
   * Check if field should show error
   */
  shouldShowError(index: number, fieldName: string): boolean {
    const control = this.experiences.at(index)?.get(fieldName);
    return !!(control && control.invalid && (control.touched || this.submitted()));
  }

  /**
   * Get user-friendly field label
   */
  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      company: 'Company',
      role: 'Role',
      years: 'Years'
    };
    return labels[fieldName] || fieldName;
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.submitted.set(true);

    if (this.experienceForm.invalid) {
      // Mark all controls in all entries as touched
      this.experiences.controls.forEach(group => {
        Object.keys((group as FormGroup).controls).forEach(key => {
          group.get(key)?.markAsTouched();
        });
      });
      return;
    }

    const formData: ExperienceFormData = this.experienceForm.value;

    this.successMessage.set(
      `Successfully submitted ${formData.experiences.length} work experience(s)!`
    );
    this.showSuccessMessage.set(true);

    // Auto-hide success message and reset form
    setTimeout(() => {
      this.experienceForm.reset();
      this.experiences.clear();
      this.experiences.push(this.createExperienceGroup());
      this.submitted.set(false);
      this.showSuccessMessage.set(false);
    }, 5000);
  }

  /**
   * Reset form to initial state
   */
  onReset(): void {
    this.experienceForm.reset();
    this.experiences.clear();
    this.experiences.push(this.createExperienceGroup());
    this.submitted.set(false);
    this.showSuccessMessage.set(false);
  }
}
