import { Routes } from '@angular/router';
import { ChallengesBrowserComponent, LandingPageComponent } from '@ng-coding-challenges/shared/ui';
import { challengeListResolver } from '@ng-coding-challenges/shared/services';

/**
 * Main application routes
 *
 * Architecture:
 * - Landing page at root
 * - Three-level challenge routing:
 *   Level 1: Category list (/challenges/rxjs-api)
 *   Level 2: Challenge details (/challenges/rxjs-api/fetch-products)
 *   Level 3: Challenge workspace (/challenges/rxjs-api/fetch-products/workspace)
 *
 * Uses Route Resolvers for pre-fetching data
 */
export const routes: Routes = [
  // Landing page
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent,
  },

  // Getting started guide
  {
    path: 'getting-started',
    loadComponent: () =>
      import('./components/get-started/get-started.component').then(
        m => m.GetStartedComponent
      ),
  },

  // Challenges section with shell layout
  {
    path: 'challenges',
    component: ChallengesBrowserComponent,
    children: [
      // Default route - show all challenges
      {
        path: '',
        loadComponent: () =>
          import('@ng-coding-challenges/shared/ui').then(
            m => m.ChallengeListComponent
          ),
        resolve: {
          challenges: challengeListResolver
        },
        data: { categoryId: 'rxjs-api', categoryName: 'RxJS & API Challenges' }
      },

      // RxJS API Category (lazy loaded sub-app)
      {
        path: 'rxjs-api',
        loadChildren: () =>
          import('@ngc-rxjs-api').then(m => m.NGC_RXJS_API_ROUTES),
        data: { categoryId: 'rxjs-api', categoryName: 'RxJS & API Challenges' }
      },

      // Angular Core Category (lazy loaded sub-app)
      {
        path: 'angular-core',
        loadChildren: () =>
          import('@ngc-core').then(m => m.NGC_CORE_ROUTES),
        data: { categoryId: 'angular-core', categoryName: 'Angular Core Challenges' }
      },

      // Angular Routing Category (lazy loaded sub-app)
      {
        path: 'angular-routing',
        loadChildren: () =>
          import('@ngc-routing').then(m => m.NGC_ROUTING_ROUTES),
        data: { categoryId: 'angular-routing', categoryName: 'Routing Challenges' }
      },
    ],
  },

  // 404 Not Found
  {
    path: '**',
    loadComponent: () =>
      import('@ng-coding-challenges/shared/ui').then(
        m => m.ChallengeNotFoundComponent
      ),
  },
];

