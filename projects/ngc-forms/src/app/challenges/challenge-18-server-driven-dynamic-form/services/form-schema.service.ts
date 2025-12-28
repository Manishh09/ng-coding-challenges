import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormSchema } from '../models/form-schema.model';

/**
 * Form Schema Service
 *
 * Provides form schema data for dynamic form generation.
 * In production, this would fetch schema from a REST API.
 * For this challenge, it returns hardcoded mock data.
 */
@Injectable({
  providedIn: 'root'
})
export class FormSchemaService {
  /**
   * Mock form schema data
   * In production: Replace with HttpClient.get<FormSchema>('/api/form-schema')
   */
  private readonly MOCK_SCHEMA: FormSchema = {
    title: 'Job Application Form',
    description: 'Apply for Software Engineer position',
    fields: [
      {
        name: 'fullName',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        validators: [
          { type: 'required', message: 'Full name is required' },
          { type: 'minLength', value: 3, message: 'Name must be at least 3 characters' },
          { type: 'maxLength', value: 50, message: 'Name cannot exceed 50 characters' }
        ],
        order: 1
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
        validators: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email address' }
        ],
        order: 2
      },
      {
        name: 'yearsExperience',
        type: 'number',
        label: 'Years of Experience',
        placeholder: 'Enter years of experience',
        validators: [
          { type: 'min', value: 0, message: 'Experience cannot be negative' },
          { type: 'max', value: 50, message: 'Please enter a valid number of years' }
        ],
        order: 3
      },
      {
        name: 'position',
        type: 'select',
        label: 'Position Applied For',
        required: true,
        validators: [
          { type: 'required', message: 'Please select a position' }
        ],
        options: [
          { value: '', label: 'Select a position' },
          { value: 'frontend', label: 'Frontend Engineer' },
          { value: 'backend', label: 'Backend Engineer' },
          { value: 'fullstack', label: 'Full Stack Engineer' },
          { value: 'devops', label: 'DevOps Engineer' },
          { value: 'qa', label: 'QA Engineer' }
        ],
        order: 4
      },
      {
        name: 'remoteWork',
        type: 'checkbox',
        label: 'Open to Remote Work',
        defaultValue: false,
        order: 5
      }
    ]
  };

  /**
   * Get form schema
   * Returns Observable to simulate async API call pattern
   *
   * @returns Observable<FormSchema>
   */
  getFormSchema(): Observable<FormSchema> {
    // Simulate API call with Observable
    // In production: return this.http.get<FormSchema>('/api/form-schema')
    return of(this.MOCK_SCHEMA);
  }

  /**
   * Get form schema synchronously
   * Useful for testing or when schema is known to be available
   *
   * @returns FormSchema
   */
  getFormSchemaSync(): FormSchema {
    return this.MOCK_SCHEMA;
  }
}
