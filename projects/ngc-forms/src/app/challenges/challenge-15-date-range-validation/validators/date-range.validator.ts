import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Cross-field validator that ensures end date is after start date
 *
 * This is a FormGroup-level validator that validates the relationship
 * between two date fields rather than validating them individually.
 *
 * Key Features:
 * - Validates date range at the FormGroup level
 * - Ensures end date is strictly greater than start date
 * - Skips validation if either field is empty (let required validators handle)
 * - Returns detailed error information for UI display
 *
 * @returns ValidatorFn that can be applied to a FormGroup
 *
 * @example
 * // Apply to FormGroup
 * this.fb.group({
 *   startDate: ['', [Validators.required]],
 *   endDate: ['', [Validators.required]]
 * }, {
 *   validators: [dateRangeValidator()] // FormGroup-level validator
 * });
 *
 * @example
 * // Check for errors in template
 * @if (form.hasError('dateRangeInvalid')) {
 *   <div>{{ form.errors?.['dateRangeInvalid']?.message }}</div>
 * }
 */
export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Control is the FormGroup, not individual FormControl
    const startDateControl = control.get('startDate');
    const endDateControl = control.get('endDate');

    // Get the values
    const startValue = startDateControl?.value;
    const endValue = endDateControl?.value;

    // Skip validation if either field is empty
    // Let the required validator handle empty field validation
    if (!startValue || !endValue) {
      return null;
    }

    // Convert ISO date strings to Date objects
    const startDate = new Date(startValue);
    const endDate = new Date(endValue);

    // Validate that dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return {
        invalidDate: {
          message: 'Invalid date format detected',
          startDate: startValue,
          endDate: endValue
        }
      };
    }

    // Check if end date is after start date
    // Using <= to ensure end date is strictly greater (not equal)
    if (endDate <= startDate) {
      return {
        dateRangeInvalid: {
          message: 'End date must be after start date',
          startDate: startValue,
          endDate: endValue
        }
      };
    }

    // Valid date range
    return null;
  };
}

/**
 * COMMENTED OUT FOR INTERVIEW SIMPLICITY
 *
 * Optional: Validator to prevent selection of past dates
 * Useful for production leave management where you can't apply for past dates
 *
 * Uncomment this function and apply it to individual controls if needed:
 * startDate: ['', [Validators.required, noPastDatesValidator('Start Date')]]
 */
/*
export function noPastDatesValidator(fieldName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();

    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return {
        pastDate: {
          message: `${fieldName} cannot be in the past`,
          selectedDate: control.value
        }
      };
    }

    return null;
  };
}
*/

/**
 * Calculates the number of days between two dates
 * Useful for displaying total leave days
 *
 * @param startDate - Start date (ISO string or Date object)
 * @param endDate - End date (ISO string or Date object)
 * @returns Number of days (inclusive of both start and end dates)
 *
 * @example
 * const days = calculateDaysBetween('2025-01-01', '2025-01-05'); // Returns 5
 */
export function calculateDaysBetween(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Reset time to midnight for accurate day calculation
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Add 1 to include both start and end dates
  return diffDays + 1;
}
