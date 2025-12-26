import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Creates a validator that checks if a project name already exists
 * Simple case-sensitive duplicate check
 *
 * @param existingNames - Array of existing project names
 * @returns ValidatorFn that validates uniqueness
 *
 * @example
 * const validator = duplicateNameValidator(['Project Alpha', 'Project Beta']);
 */
export function duplicateNameValidator(
  existingNames: string[]
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // No validation if empty (let required validator handle this)
    if (!value) {
      return null;
    }

    // Trim whitespace for comparison
    const trimmedValue = value.trim();

    // Check if name already exists (case-sensitive)
    const isDuplicate = existingNames.some(
      name => name.trim().toLowerCase() === trimmedValue.toLowerCase()
    );

    if (isDuplicate) {
      return {
        duplicateName: {
          value: control.value,
          message: `Project name "${trimmedValue}" already exists`
        }
      };
    }

    return null;
  };
}
