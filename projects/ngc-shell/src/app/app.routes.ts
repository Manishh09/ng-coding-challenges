import { Routes } from '@angular/router';
import { ChallengesBrowserComponent } from '@ng-coding-challenges/shared/ui';

import { LandingPageComponent } from '@ng-coding-challenges/shared/ui';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent,
  },

  {
    path: 'getting-started',
    loadComponent: () =>
      import('./components/get-started/get-started.component').then(
        m => m.GetStartedComponent
      ),
  },

  {
    path: 'challenges',
    children: [
      {
        path: '',
        component: ChallengesBrowserComponent,
        children: [

          // CATEGORY ROUTES (direct mappings)
          {
            path: 'rxjs-api',
            loadChildren: () =>
              import('@ngc-rxjs-api').then(m => m.NGC_RXJS_API_ROUTES),
          },
          {
            path: 'angular-core',
            loadChildren: () =>
              import('@ngc-core').then(m => m.NGC_CORE_ROUTES),
          },
          {
            path: 'angular-routing',
            loadChildren: () =>
              import('@ngc-routing').then(m => m.NGC_ROUTING_ROUTES),
          },
        ],
      },


      // Challenge Details (common for all categories)
      {
        path: ':categoryId/:id',
        loadComponent: () =>
          import('@ng-coding-challenges/shared/ui').then(
            m => m.ChallengeDetailsComponent
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];

