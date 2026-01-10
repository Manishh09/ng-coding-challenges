import { Routes } from '@angular/router';
import { ChallengeListComponent, ChallengeDetailsComponent } from '@ng-coding-challenges/shared/ui';
import { challengeListResolver, challengeDetailsResolver } from '@ng-coding-challenges/shared/services';

/**
 * Challenge component mapping
 * Maps challengeId to workspace component
 */
const CHALLENGE_COMPONENTS = {
  // Add community challenges here
  // Example:
  // 'challenge-name': () =>
  //   import('./challenges/challenge-XX-name/components/workspace/workspace.component')
  //     .then(m => m.WorkspaceComponent),
};

/**
 * Community Angular Challenges Routes
 *
 * Three-level architecture:
 * Level 1: /challenges/community - Challenge list for this category
 * Level 2: /challenges/community/:challengeId - Challenge details
 * Level 3: /challenges/community/:challengeId/workspace - Interactive challenge workspace
 *
 * Uses Route Resolvers:
 * - challengeListResolver: Pre-fetches challenge list data
 * - challengeDetailsResolver: Pre-fetches challenge details data
 */
export const NGC_COMMUNITY_ROUTES: Routes = [
  // Level 1: Category challenge list
  {
    path: '',
    component: ChallengeListComponent,
    resolve: {
      challenges: challengeListResolver
    },
    data: {
      layoutType: 'landing-page',
      categoryId: 'community',
      categoryName: 'Community Challenges'
    }
  },

  // Level 2 & 3: Individual challenge routes
  ...Object.entries(CHALLENGE_COMPONENTS).map(([challengeId, componentLoader]) => ({
    path: challengeId,
    children: [
      // Level 2: Challenge details (default)
      {
        path: '',
        component: ChallengeDetailsComponent,
        resolve: {
          challenge: challengeDetailsResolver
        },
        data: {
          layoutType: 'landing-page',
          categoryId: 'community',
          challengeId: challengeId
        }
      },

      // Level 3: Challenge workspace
      {
        path: 'workspace',
        loadComponent: componentLoader as () => Promise<any>,
        data: {
          layoutType: 'workspace',
          categoryId: 'community',
          challengeId: challengeId
        }
      }
    ]
  }))
];
