import { Routes } from '@angular/router';
import { ChallengeCategoryListComponent } from '@ng-coding-challenges/shared/ui';

import { LandingPageComponent } from '@ng-coding-challenges/shared/ui';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent
    // Component won't render because AppComponent hides router-outlet on root.
    // This keeps the router config valid while AppComponent controls landing view.
  },
  {
    path: 'getting-started',
    loadComponent: () => import('./components/get-started/get-started.component').then(m => m.GetStartedComponent)
  },

  {
    path: 'challenges',
    children: [
      {
        path: '',
        component: ChallengeCategoryListComponent
        // This path will show the challenge category list page
        // Component is handled via conditional template in AppComponent
      },

      {
        path: 'rxjs-api',
        loadChildren: () => import('@ngc-rxjs-api').then(m => m.NGC_RXJS_API_ROUTES)
      },
      {
        path: 'angular-core',
        loadChildren: () => import('@ngc-core').then(m => m.NGC_CORE_ROUTES)
      },
      {
        path: 'angular-routing',
        loadChildren: () => import('@ngc-routing').then(m => m.NGC_ROUTING_ROUTES)
      }



      // Add future challenge category routes here..

    ],
  },
  // {
  //   path: 'theme-demo',
  //   loadComponent: () => import('./components/theme-demo/theme-demo.component').then(m => m.ThemeDemoComponent)
  // },
  {
    path: '**',
    redirectTo: '',
  }

];
