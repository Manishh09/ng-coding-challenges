import { Observable } from 'rxjs';

/**
 * Interface that components must implement to work with the canDeactivate guard.
 * This enables reusable guard logic across different form components.
 */
export interface CanDeactivateComponent {
  /**
   * Determines if the component can be deactivated (navigated away from).
   * @returns true if navigation is allowed, false if it should be prevented,
   *          or an Observable<boolean> for async checks
   */
  canDeactivate(): boolean | Observable<boolean>;
}
