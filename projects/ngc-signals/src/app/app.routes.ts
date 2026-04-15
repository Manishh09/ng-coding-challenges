import { Routes } from '@angular/router';
import { ChallengeListComponent, ChallengeDetailsComponent } from '@ng-coding-challenges/shared/ui';
import { challengeListResolver, challengeDetailsResolver } from '@ng-coding-challenges/shared/services';

/**
 * Challenge component mapping
 * Maps challengeId to workspace component
 * Add new challenges here as they are created
 */
const CHALLENGE_COMPONENTS: Record<string, () => Promise<any>> = {
  'signal-primitives-counter': () =>
    import('./challenges/challenge-20-signal-primitives-counter/components/seat-selector/seat-selector.component')
      .then(m => m.SeatSelectorComponent),
  'live-character-counter': () =>
    import('./challenges/challenge-21-live-character-counter/components/post-composer/post-composer.component')
      .then(m => m.PostComposerComponent),
  'signal-todo-manager': () =>
    import('./challenges/challenge-22-signal-todo-manager/components/task-board/task-board.component')
      .then(m => m.TaskBoardComponent),
  'signal-shopping-cart': () =>
    import('./challenges/challenge-23-signal-shopping-cart/components/swiggy-cart/swiggy-cart.component')
      .then(m => m.SwiggyCartComponent),
  'rxjs-signal-interop': () =>
    import('./challenges/challenge-24-rxjs-signal-interop/components/job-search/job-search.component')
      .then(m => m.JobSearchComponent),
  'custom-signal-store': () =>
    import('./challenges/challenge-25-custom-signal-store/components/booking-flow/booking-flow.component')
      .then(m => m.BookingFlowComponent),
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
