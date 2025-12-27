/**
 * Form Schema Models
 *
 * Defines TypeScript interfaces for server-driven dynamic form configuration.
 * These models represent the JSON schema structure used to generate forms at runtime.
 */

/**
 * Complete form schema structure
 */
export interface FormSchema {
  title: string;
  description?: string;
  fields: FieldConfig[];
}

/**
 * Individual field configuration
 */
export interface FieldConfig {
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  validators?: ValidatorConfig[];
  options?: SelectOption[];
  order?: number;
}

/**
 * Validator configuration for dynamic validation
 */
export interface ValidatorConfig {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max';
  value?: any;
  message?: string;
}

/**
 * Select dropdown option
 */
export interface SelectOption {
  value: string | number;
  label: string;
}

/**
 * Form submission data structure
 */
export interface FormSubmission {
  data: Record<string, any>;
  timestamp: string;
}
