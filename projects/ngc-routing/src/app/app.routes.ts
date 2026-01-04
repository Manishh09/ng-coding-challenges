import { Routes } from '@angular/router';
import { authGuard } from './challenges/challenge-10-authorized-resource-access/guards/auth.guard';
import { adminGuard } from './challenges/challenge-11-admin-dashboard-access/guards/adming.guard';
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
  // TEMPORARILY DISABLED - Routing conflicts with main app
  // Will be moved to standalone apps in future update
  // Shared login component for routing challenges
  {
    path: 'login',
    loadComponent: () =>
      import('./challenges/shared/components/login/login.component').then(m => m.LoginComponent),
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

  // Additional routes for admin dashboard sub-pages (CH-11)
  {
    path: 'admin-dashboard-access/workspace/users',
    loadComponent: () =>
      import('./challenges/challenge-11-admin-dashboard-access/components/user-list/user-list.component')
        .then(m => m.UserListComponent),
    canActivate: [adminGuard],
    data: {
      layoutType: 'challenge-workspace'
    }
  },
  {
    path: 'admin-dashboard-access/workspace/posts',
    loadComponent: () =>
      import('./challenges/challenge-11-admin-dashboard-access/components/posts/posts.component')
        .then(m => m.PostsComponent),
    canActivate: [adminGuard],
    data: {
      layoutType: 'challenge-workspace'
    }
  },

  { path: '**', redirectTo: '' }
];
