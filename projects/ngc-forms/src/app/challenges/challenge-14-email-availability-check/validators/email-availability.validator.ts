import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { EmailValidationService } from '../services/email-validation.service';

/**
 * Creates an asynchronous validator that checks email availability
 *
 * Key features:
 * - Debounces validation to reduce API calls
 * - Cancels previous requests when input changes (switchMap)
 * - Handles errors gracefully (fail-open strategy)
 * - Returns detailed error with suggestions
 *
 * @param emailService - Service to check email availability
 * @param debounceTime - Milliseconds to wait before validating (default: 500ms)
 * @returns AsyncValidatorFn that validates email availability
 *
 * @example
 * this.fb.group({
 *   email: ['',
 *     [Validators.required, Validators.email],
 *     [emailAvailabilityValidator(this.emailService)]
 *   ]
 * });
 */
export function emailAvailabilityValidator(
  emailService: EmailValidationService,
  debounceTime: number = 500
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    // No validation if empty (let required validator handle this)
    if (!control.value) {
      return of(null);
    }

    // Debounce: wait for user to stop typing before validating
    return timer(debounceTime).pipe(
      switchMap(() => emailService.checkEmailAvailability(control.value)),
      map(response => {
        if (response.available) {
          return null; // Email is available - validation passes
        }

        // Email is taken - return validation error
        return {
          emailTaken: {
            email: control.value,
            message: `Email "${control.value}" is already registered`,
            suggestedAlternatives: response.suggestedAlternatives
          }
        };
      }),
      catchError(error => {
        // On API error, fail-open: allow the email (don't block user)
        console.error('Email validation error:', error);
        return of(null);
      })
    );
  };
}
