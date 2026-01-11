import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    false;
  }
  if (!auth.hasRole('admin')) {
    // NOTE: Navigate to proper route in PRODUCTION code
    // Redirect non-admin users back to login (they don't have sufficient privileges)
    return router.createUrlTree(['/challenges/angular-routing/admin-dashboard-access/login']);
  }
  return true;
};
