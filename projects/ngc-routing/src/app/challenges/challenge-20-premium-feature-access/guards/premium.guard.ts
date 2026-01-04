import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionTier } from '../models/subscription-tier.model';

/**
 * Premium feature access guard using canMatch
 *
 * Simplified for interview scenario - single guard that reads tier requirement from route.data.
 *
 * This guard prevents route matching for users without required subscription tier.
 * Unlike canActivate, canMatch runs BEFORE route matching and lazy loading,
 * ensuring premium feature bundles never download for non-premium users.
 *
 * Key Benefits:
 * - Performance: Prevents unnecessary bundle downloads
 * - Security: Premium features invisible to non-premium users
 * - UX: Seamless redirect to upgrade page
 *
 * How it works:
 * 1. Check user's subscription tier from SubscriptionService
 * 2. If tier meets requirement → return true (route matches, component loads)
 * 3. If tier insufficient → return UrlTree (redirect to upgrade page)
 * 4. Router automatically tries next matching route (fallback pattern)
 *
 * canMatch vs canActivate:
 * - canMatch: Runs BEFORE route matching (prevents lazy loading)
 * - canActivate: Runs AFTER route matching (module already loaded)
 *
 * Use canMatch when:
 * - Preventing unnecessary code downloads (performance)
 * - Implementing feature flags
 * - Building SaaS subscription features
 * - Dual-route pattern (same path, different guards)
 *
 * Interview Focus:
 * - Demonstrates canMatch lifecycle clearly
 * - Easy to implement in 3-5 minutes
 * - Single guard reduces complexity
 *
 * @param route - Route configuration with optional requiredTier in data
 * @param segments - URL segments being matched
 * @returns true if user has required tier, UrlTree for redirect otherwise
 *
 * @example
 * ```typescript
 * // In routes configuration:
 * {
 *   path: 'premium-workspace',
 *   canMatch: [premiumGuard],
 *   loadComponent: () => import('./premium-dashboard'),
 *   data: { requiredTier: 'premium' }  // Optional, defaults to 'premium'
 * }
 * ```
 */
export const premiumGuard: CanMatchFn = (route, segments) => {
  const subscriptionService = inject(SubscriptionService);
  const router = inject(Router);

  // Get required tier from route data, default to 'premium'
  const requiredTier: SubscriptionTier = route.data?.['requiredTier'] || 'premium';

  // Check if user has required subscription tier
  const hasAccess = subscriptionService.hasTier(requiredTier);

  if (hasAccess) {
    console.log(`[premiumGuard] ✅ Access granted - User has ${subscriptionService.currentTier()} tier`);
    return true;
  }

  console.log(`[premiumGuard] ❌ Access denied - User tier: ${subscriptionService.currentTier()}, Required: ${requiredTier}`);
  console.log(`[premiumGuard] Redirecting to upgrade page...`);

  // Redirect to upgrade page (simple redirect, no complex query params for interview)
  return router.createUrlTree(['/challenges/angular-routing/premium-feature-access/upgrade']);
};
