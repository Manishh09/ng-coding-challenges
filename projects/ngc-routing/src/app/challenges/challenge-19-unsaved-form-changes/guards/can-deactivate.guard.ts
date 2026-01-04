import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivateComponent } from '../models/can-deactivate-component.interface';
import { ConfirmDialogService } from '../services/confirm-dialog.service';

/**
 * Functional canDeactivate guard that prevents navigation when there are unsaved changes.
 *
 * This guard:
 * - Works with any component implementing CanDeactivateComponent interface
 * - Shows confirmation dialog when user tries to navigate away with unsaved changes
 * - Allows navigation when there are no unsaved changes
 * - Reusable across multiple components
 *
 * Usage:
 * 1. Component must implement CanDeactivateComponent interface
 * 2. Component's canDeactivate() method should return true/false based on form state
 * 3. Apply guard to route: canDeactivate: [canDeactivateGuard]
 *
 * @param component - The component being deactivated (must implement CanDeactivateComponent)
 * @returns boolean or Observable<boolean> indicating if navigation should proceed
 */
export const canDeactivateGuard: CanDeactivateFn<CanDeactivateComponent> = (
  component
): boolean | Observable<boolean> => {
  // Using native confirm for simplicity and reliability in interviews
  const confirmService = inject(ConfirmDialogService);

  // If component doesn't implement the interface, allow navigation
  if (!component || typeof component.canDeactivate !== 'function') {
    return true;
  }

  // Ask the component if it can be deactivated
  const canDeactivate = component.canDeactivate();

  // If component allows deactivation (no unsaved changes), proceed
  if (canDeactivate === true) {
    return true;
  }

  // If component blocks deactivation (has unsaved changes), show confirmation
  if (canDeactivate === false) {

    return confirmService.confirm(
      confirmService.getUnsavedChangesMessage()
    );
  }

  // Handle Observable case (for async checks)
  return canDeactivate;
};
