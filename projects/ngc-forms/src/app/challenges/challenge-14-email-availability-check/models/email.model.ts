/**
 * Email form data structure
 */
export interface EmailFormData {
  email: string;
  fullName: string;
}

/**
 * Response from email availability check API
 */
export interface EmailAvailabilityResponse {
  available: boolean;
  email: string;
  suggestedAlternatives?: string[];
}

/**
 * Validation error structure for email availability
 */
export interface EmailValidationError {
  emailTaken: {
    email: string;
    message: string;
    suggestedAlternatives?: string[];
  };
}
