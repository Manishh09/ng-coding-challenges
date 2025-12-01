import { Routes } from '@angular/router';
import { ChallengeListComponent, ChallengeDetailsComponent } from '@ng-coding-challenges/shared/ui';
import { challengeListResolver, challengeDetailsResolver } from '@ng-coding-challenges/shared/services';

/**
 * Challenge component mapping
 * Maps challengeId to workspace component
 */
const CHALLENGE_COMPONENTS = {
  'component-communication': () =>
    import('./challenges/challenge-09-component-communication/components/product-dashboard/product-dashboard.component')
      .then(m => m.ProductDashboardComponent),
};

/**
 * Angular Core Challenges Routes
 *
 * Three-level architecture:
 * Level 1: /challenges/angular-core - Challenge list for this category
 * Level 2: /challenges/angular-core/:challengeId - Challenge details
 * Level 3: /challenges/angular-core/:challengeId/workspace - Interactive challenge workspace
 *
 * Uses Route Resolvers:
 * - challengeListResolver: Pre-fetches challenge list data
 * - challengeDetailsResolver: Pre-fetches challenge details data
 */
export const NGC_CORE_ROUTES: Routes = [
  // Level 1: Category challenge list
  {
    path: '',
    component: ChallengeListComponent,
    resolve: {
      challenges: challengeListResolver
    },
    data: {
      categoryId: 'angular-core',
      categoryName: 'Angular Core Challenges'
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
          categoryId: 'angular-core',
          categoryName: 'Angular Core Challenges',
          challengeId
        }
      },
      // Level 3: Challenge workspace
      {
        path: 'workspace',
        loadComponent: componentLoader,
        data: {
          categoryId: 'angular-core',
          categoryName: 'Angular Core Challenges',
          challengeId
        }
      }
    ]
  }))
];
