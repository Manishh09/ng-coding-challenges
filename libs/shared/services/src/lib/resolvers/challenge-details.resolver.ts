import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { ChallengeDetails } from '@ng-coding-challenges/shared/models';
import { ChallengesService } from '../challenges/challenges.service';

/**
 * Route Resolver for Challenge Details
 * 
 * Resolves challenge details data before the route activates using slug-based lookup.
 * This ensures data is available synchronously in the component with O(1) lookup performance.
 * 
 * Important: This resolver expects the challenge slug to be passed via route.data.challengeId,
 * not as a route parameter. This is because the routes use static paths (e.g., 'fetch-products')
 * rather than dynamic parameters (e.g., ':challengeId').
 * 
 * Benefits:
 * - Centralized data fetching logic
 * - Component receives data via ActivatedRoute.data
 * - Easy to extend for async data sources (HTTP, etc.)
 * - Better error handling at route level
 * - Direct slug-based lookup (no array iteration needed)
 * 
 * Usage in route config:
 * ```typescript
 * {
 *   path: 'fetch-products',  // Static path, not :challengeId
 *   component: ChallengeDetailsComponent,
 *   resolve: { challenge: challengeDetailsResolver },
 *   data: { challengeId: 'fetch-products' }  // ← Slug passed here
 * }
 * ```
 */
export const challengeDetailsResolver: ResolveFn<ChallengeDetails | null> = (
  route: ActivatedRouteSnapshot
) => {
  const challengesService = inject(ChallengesService);
  
  // Get the challenge slug from route.data (passed from route configuration)
  // The route configuration uses static paths (e.g., 'fetch-products') not dynamic params
  const challengeSlug = route.data['challengeId'] as string | undefined;

  if (!challengeSlug) {
    console.warn('[ChallengeDetailsResolver] No challengeId found in route.data');
    console.log('[ChallengeDetailsResolver] Route data:', route.data);
    console.log('[ChallengeDetailsResolver] Route params:', route.params);
    return null;
  }

  // Direct slug-based lookup - O(1) complexity
  const details = challengesService.getChallengeDetailsBySlug(challengeSlug);
  
  if (!details) {
    console.warn(`[ChallengeDetailsResolver] No details found for slug: ${challengeSlug}`);
  }

  return details || null;
};
