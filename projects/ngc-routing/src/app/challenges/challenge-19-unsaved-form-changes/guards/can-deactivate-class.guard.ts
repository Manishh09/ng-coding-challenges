import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanDeactivateComponent } from '../models/can-deactivate-component.interface';
import { ConfirmDialogService } from '../services/confirm-dialog.service';

/**
 * Class-based canDeactivate guard (Traditional Angular Pattern - Pre-v15)
 *
 * This is the older class-based approach for implementing canDeactivate guards.
 * Use this as a reference for legacy codebases or when you need dependency injection
 * in constructor (though inject() function is now preferred).
 *
 * For new projects, prefer the functional guard in `can-deactivate.guard.ts`
 *
 * Usage in routes:
 * {
 *   path: 'workspace',
 *   component: UserFormComponent,
 *   canDeactivate: [CanDeactivateGuardClass]
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuardClass implements CanDeactivate<CanDeactivateComponent> {

  constructor(private confirmService: ConfirmDialogService) {}

  canDeactivate(
    component: CanDeactivateComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    // Safety check: ensure component implements interface
    if (!component || typeof component.canDeactivate !== 'function') {
      return true;
    }

    // Ask the component if it can be deactivated
    const canDeactivate = component.canDeactivate();

    // Allow navigation if component says ok
    if (canDeactivate === true) {
      return true;
    }

    // Block and show confirmation if component says no
    if (canDeactivate === false) {
      return this.confirmService.confirm(
        this.confirmService.getUnsavedChangesMessage()
      );
    }

    // Handle Observable case
    return canDeactivate;
  }
}
