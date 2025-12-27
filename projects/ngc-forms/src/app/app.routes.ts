import { Routes } from '@angular/router';
import { ChallengeListComponent, ChallengeDetailsComponent } from '@ng-coding-challenges/shared/ui';
import { challengeListResolver, challengeDetailsResolver } from '@ng-coding-challenges/shared/services';

/**
 * Challenge component mapping
 * Maps challengeId to workspace component
 */
const CHALLENGE_COMPONENTS = {
  'reactive-login-form': () =>
    import('./challenges/challenge-12-reactive-login-form/components/login-form/login-form.component')
      .then(m => m.LoginFormComponent),
  'duplicate-project-name-validator': () =>
    import('./challenges/challenge-13-duplicate-project-name-validator/components/project-form/project-form.component')
      .then(m => m.ProjectFormComponent),
  'email-availability-check': () =>
    import('./challenges/challenge-14-email-availability-check/components/email-form/email-form.component')
      .then(m => m.EmailFormComponent),
  'date-range-validation': () =>
    import('./challenges/challenge-15-date-range-validation/components/leave-form/leave-form.component')
      .then(m => m.LeaveFormComponent),
};

/**
 * Angular Forms Challenges Routes
 *
 * Three-level architecture:
 * Level 1: /challenges/angular-forms - Challenge list for this category
 * Level 2: /challenges/angular-forms/:challengeId - Challenge details
 * Level 3: /challenges/angular-forms/:challengeId/workspace - Interactive challenge workspace
 *
 * Uses Route Resolvers:
 * - challengeListResolver: Pre-fetches challenge list data
 * - challengeDetailsResolver: Pre-fetches challenge details data
 */
export const NGC_FORMS_ROUTES: Routes = [
  // Level 1: Category challenge list
  {
    path: '',
    component: ChallengeListComponent,
    resolve: {
      challenges: challengeListResolver
    },
    data: {
      layoutType: 'landing-page',
      categoryId: 'angular-forms',
      categoryName: 'Angular Forms Challenges'
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
          categoryId: 'angular-forms',
          categoryName: 'Angular Forms Challenges',
          challengeId
        }
      },
      // Level 3: Challenge workspace
      {
        path: 'workspace',
        loadComponent: componentLoader,
        data: {
          layoutType: 'challenge-workspace',
          categoryId: 'angular-forms',
          categoryName: 'Angular Forms Challenges',
          challengeId
        }
      }
    ]
  }))
];
