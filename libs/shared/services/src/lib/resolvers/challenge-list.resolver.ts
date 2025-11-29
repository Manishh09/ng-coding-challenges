import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { ChallengesService } from '../challenges/challenges.service';

/**
 * Route Resolver for Challenge List
 * 
 * Resolves the list of challenges for a specific category before route activation.
 * 
 * Benefits:
 * - Pre-fetches challenge list data
 * - Centralizes data loading logic
 * - Makes component cleaner (just reads from route.data)
 * - Easy to add loading indicators at router level
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
) => {
  const challengesService = inject(ChallengesService);
  const categoryId = route.data['categoryId'];

  if (!categoryId || categoryId === 'all') {
    return challengesService.getChallenges();
  }

  return challengesService.getChallengesByCategory(categoryId);
};
