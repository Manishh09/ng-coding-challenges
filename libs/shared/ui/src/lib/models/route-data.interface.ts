/**
 * Type-safe route data interfaces for components
 * Ensures type safety when accessing ActivatedRoute.data
 */

import { ChallengeDetails, Challenge } from '@ng-coding-challenges/shared/models';

/**
 * Route data interface for ChallengeDetailsComponent
 * Used when challenge details are resolved by challengeDetailsResolver
 */
export interface ChallengeDetailsRouteData {
  challenge: ChallengeDetails | null;
  categoryId?: string;
  challengeId?: string;
}

/**
 * Route data interface for ChallengeListComponent
 * Used when challenge list is resolved by challengeListResolver
 */
export interface ChallengeListRouteData {
  challenges: readonly Challenge[];
  categoryId: string;
}

/**
 * Generic route data type that can be used for optional data
 */
export type RouteData<T = unknown> = Record<string, T>;
