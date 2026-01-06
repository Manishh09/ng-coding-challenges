import { Routes } from '@angular/router';
import { ChallengeListComponent, ChallengeDetailsComponent } from '@ng-coding-challenges/shared/ui';
import { challengeListResolver, challengeDetailsResolver } from '@ng-coding-challenges/shared/services';

/**
 * Challenge component mapping
 * Maps challengeId to workspace component
 * Add new challenges here as they are created
 */
const CHALLENGE_COMPONENTS: Record<string, () => Promise<any>> = {
  // Example: 'signal-basics': () =>
  //   import('./challenges/challenge-XX-signal-basics/components/signal-demo/signal-demo.component')
  //     .then(m => m.SignalDemoComponent),
};

/**
 * Angular Signals Challenges Routes
 *
 * Three-level architecture:
 * Level 1: /challenges/angular-signals - Challenge list for this category
 * Level 2: /challenges/angular-signals/:challengeId - Challenge details
 * Level 3: /challenges/angular-signals/:challengeId/workspace - Interactive challenge workspace
 *
 * Uses Route Resolvers:
 * - challengeListResolver: Pre-fetches challenge list data
 * - challengeDetailsResolver: Pre-fetches challenge details data
 */
export const NGC_SIGNALS_ROUTES: Routes = [
  // Level 1: Category challenge list
  {
    path: '',
    component: ChallengeListComponent,
    resolve: {
      challenges: challengeListResolver
    },
    data: {
      layoutType: 'landing-page',
      categoryId: 'angular-signals',
      categoryName: 'Angular Signals Challenges'
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
          layoutType: 'challenge-details',
          categoryId: 'angular-signals',
          categoryName: 'Angular Signals Challenges',
          challengeId
        }
      },
      // Level 3: Challenge workspace
      {
        path: 'workspace',
        loadComponent: componentLoader,
        data: {
          layoutType: 'challenge-workspace',
          categoryId: 'angular-signals',
          categoryName: 'Angular Signals Challenges',
          challengeId
        }
      }
    ]
  }))
];
