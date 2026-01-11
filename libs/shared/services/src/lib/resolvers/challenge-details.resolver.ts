import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChallengeDetails } from '@ng-coding-challenges/shared/models';
import { ChallengesService } from '../challenges/challenges.service';
import { ChallengeCategoryId } from '@ng-coding-challenges/shared/models';

/**
 * Route Resolver for Challenge Details
 *
 * Resolves challenge details data before the route activates using slug-based lookup.
 * Now supports async data loading from JSON configuration with O(1) lookup performance.
 *
 * Important: This resolver expects the challenge slug to be passed via route.data.challengeId,
 * not as a route parameter. This is because the routes use static paths (e.g., 'fetch-products')
 * rather than dynamic parameters (e.g., ':challengeId').
 *
 * Benefits:
 * - Loads data from JSON configuration
 * - O(1) lookup when categoryId is provided
 * - Component receives data via ActivatedRoute.data
 * - Better error handling at route level
 * - Direct slug-based lookup (no array iteration needed)
 *
 * Usage in route config:
 * ```typescript
 * {
 *   path: 'fetch-products',  // Static path, not :challengeId
 *   component: ChallengeDetailsComponent,
 *   resolve: { challenge: challengeDetailsResolver },
 *   data: {
 *     challengeId: 'fetch-products',  // ← Slug passed here
 *     categoryId: 'rxjs-api'          // ← Optional for O(1) lookup
 *   }
 * }
 * ```
 */
export const challengeDetailsResolver: ResolveFn<ChallengeDetails | null> = (
  route: ActivatedRouteSnapshot
): Observable<ChallengeDetails | null> => {
  const challengesService = inject(ChallengesService);

  // Get the challenge slug from route.data (passed from route configuration)
  const challengeSlug = route.data['challengeId'] as string;
  const categoryId = route.data['categoryId'] as ChallengeCategoryId;

  if (!challengeSlug) {
    console.warn('[ChallengeDetailsResolver] No challengeId found in route.data');
    console.log('[ChallengeDetailsResolver] Route data:', route.data);
    console.log('[ChallengeDetailsResolver] Route params:', route.params);
    return of(null);
  }

  // Use O(1) lookup if categoryId is provided, otherwise O(n) search
  return challengesService.getChallengeDetailsBySlug(challengeSlug, categoryId).pipe(
    map(details => {
      if (!details) {
        console.warn(`[ChallengeDetailsResolver] No details found for slug: ${challengeSlug}`);
      }
      return details || null;
    })
  );
};
