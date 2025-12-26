/**
 * Login Credentials Interface
 * Represents the structure of login form data
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login Response Interface
 * Represents a mock API response after successful login
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    email: string;
    name: string;
  };
}
