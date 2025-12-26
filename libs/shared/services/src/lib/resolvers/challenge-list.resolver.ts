import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { ChallengesService } from '../challenges/challenges.service';

/**
 * Route Resolver for Challenge List
 *
 * Resolves the list of challenges for a specific category before route activation.
 * Now returns Observable for async data loading from JSON configuration.
 *
 * Benefits:
 * - Pre-fetches challenge list data from JSON config
 * - Centralizes data loading logic
 * - Makes component cleaner (just reads from route.data)
 * - Easy to add loading indicators at router level
 * - O(1) category lookup performance
 *
 * Usage in route config:
 * ```typescript
 * {
 *   path: '',
 *   component: ChallengeListComponent,
 *   resolve: { challenges: challengeListResolver }
 * }
 * ```
 */
export const challengeListResolver: ResolveFn<readonly Challenge[]> = (
  route: ActivatedRouteSnapshot
): Observable<readonly Challenge[]> => {
  const challengesService = inject(ChallengesService);
  const categoryId = route.data['categoryId'];

  if (!categoryId) {
    return of([]);
  }

  return challengesService.getChallengesByCategory(categoryId);
};
