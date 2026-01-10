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

  // Playground (Code Editor + StackBlitz)
  {
    path: 'playground',
    loadComponent: () =>
      import('./features/playground/components/playground-container/playground-container.component').then(
        m => m.PlaygroundContainerComponent
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

      // Angular Forms Category (lazy loaded sub-app)
      {
        path: 'angular-forms',
        loadChildren: () =>
          import('@ngc-forms').then(m => m.NGC_FORMS_ROUTES),
        data: { categoryId: 'angular-forms', categoryName: 'Angular Forms Challenges' }
      },

      // Angular Signals Category (lazy loaded sub-app)
      {
        path: 'angular-signals',
        loadChildren: () =>
          import('@ngc-signals').then(m => m.NGC_SIGNALS_ROUTES),
        data: { categoryId: 'angular-signals', categoryName: 'Angular Signals Challenges' }
      },

      // Community Category (lazy loaded sub-app)
      {
        path: 'community',
        loadChildren: () =>
          import('@ngc-community').then(m => m.NGC_COMMUNITY_ROUTES),
        data: { categoryId: 'community', categoryName: 'Community Challenges' }
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

