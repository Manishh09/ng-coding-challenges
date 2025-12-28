/**
 * User Form Data Interface
 * Simple form data structure for demo
 */
export interface UserFormData {
  name: string;
  email: string;
}

/**
 * Input Configuration
 * Props that can be passed to custom input component
 */
export interface InputConfig {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
}
