import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Service to handle confirmation dialogs for navigation protection.
 * Provides a centralized way to confirm user actions before navigation.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private _isOpen = signal<boolean>(false);
  readonly isOpen = this._isOpen.asReadonly();

  /**
   * Shows a confirmation dialog asking the user if they want to leave with unsaved changes.
   * Uses native browser confirm for simplicity and reliability.
   *
   * @param message - The message to display in the confirmation dialog
   * @returns Observable<boolean> that emits true if user confirms, false otherwise
   */
  confirm(message: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this._isOpen.set(true);

      // Use native confirm for interview simplicity
      // In production, this would be replaced with a custom Angular Material dialog
      const result = window.confirm(message);

      this._isOpen.set(false);
      observer.next(result);
      observer.complete();
    });
  }

  /**
   * Default message for unsaved changes confirmation
   */
  getUnsavedChangesMessage(): string {
    return 'You have unsaved changes. Are you sure you want to leave?';
  }
}
