import { Routes } from '@angular/router';
import { authGuard } from './challenges/challenge-10-authorized-resource-access/guards/auth.guard';
import { adminGuard } from './challenges/challenge-11-admin-dashboard-access/guards/admin.guard';
import { canDeactivateGuard } from './challenges/challenge-19-unsaved-form-changes/guards/can-deactivate.guard';
import { ChallengeListComponent, ChallengeDetailsComponent } from '@ng-coding-challenges/shared/ui';
import { challengeListResolver, challengeDetailsResolver } from '@ng-coding-challenges/shared/services';

/**
 * Challenge component mapping
 * Maps challengeId to workspace component
 */
const CHALLENGE_COMPONENTS = {
  'authorized-resource-access': () =>
    import('./challenges/challenge-10-authorized-resource-access/components/product-list/product-list.component')
      .then(m => m.ProductListComponent),

  'admin-dashboard-access': () =>
    import('./challenges/challenge-11-admin-dashboard-access/components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),

  'unsaved-form-changes': () =>
    import('./challenges/challenge-19-unsaved-form-changes/components/user-form/user-form.component')
      .then(m => m.UserFormComponent),
};

/**
 * Angular Routing Challenges Routes
 *
 * Three-level architecture:
 * Level 1: /challenges/angular-routing - Challenge list for this category
 * Level 2: /challenges/angular-routing/:challengeId - Challenge details
 * Level 3: /challenges/angular-routing/:challengeId/workspace - Interactive challenge workspace
 *
 * Uses Route Resolvers:
 * - challengeListResolver: Pre-fetches challenge list data
 * - challengeDetailsResolver: Pre-fetches challenge details data
 */
export const NGC_ROUTING_ROUTES: Routes = [
  // Level 1: Category challenge list
  {
    path: '',
    component: ChallengeListComponent,
    resolve: {
      challenges: challengeListResolver
    },
    data: {
      layoutType: 'landing-page',
      categoryId: 'angular-routing',
      categoryName: 'Routing Challenges'
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
          categoryId: 'angular-routing',
          categoryName: 'Routing Challenges',
          challengeId
        }
      },
      // Challenge-specific login routes
      ...(challengeId === 'authorized-resource-access' ? [{
        path: 'login',
        loadComponent: () =>
          import('./challenges/challenge-10-authorized-resource-access/components/login/login.component')
            .then(m => m.LoginComponent),
        data: { layoutType: 'challenge-workspace' }
      }] : []),
      ...(challengeId === 'admin-dashboard-access' ? [{
        path: 'login',
        loadComponent: () =>
          import('./challenges/challenge-11-admin-dashboard-access/components/login/login.component')
            .then(m => m.LoginComponent),
        data: { layoutType: 'challenge-workspace' }
      }] : []),

      // Level 3: Challenge workspace (with guards for routing challenges)
      {
        path: 'workspace',
        loadComponent: componentLoader,
        canActivate: challengeId === 'authorized-resource-access' ? [authGuard] :
          challengeId === 'admin-dashboard-access' ? [adminGuard] : [],
        canDeactivate: challengeId === 'unsaved-form-changes' ? [canDeactivateGuard] : [],
        data: {
          layoutType: 'challenge-workspace',
          categoryId: 'angular-routing',
          categoryName: 'Routing Challenges',
          challengeId
        }
      }
    ]
  })),

  { path: '**', redirectTo: '' }
];
