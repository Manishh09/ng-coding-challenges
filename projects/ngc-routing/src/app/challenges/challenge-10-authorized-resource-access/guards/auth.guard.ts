import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  // NOTE: Navigate to proper route in PRODUCTION code
  // redirect to challenge-10 specific login with returnUrl
  return router.createUrlTree(['/challenges/angular-routing/authorized-resource-access/login']);
};
