import { Routes } from '@angular/router';
import { ProductListComponent } from './challenges/challenge-01-product-list/components/product-list/product-list.component';
import { DashboardComponent } from './challenges/challenge-02-parallel-apis/components/dashboard/dashboard.component';
import { ClientSideSearchComponent } from './challenges/challenge-03-client-side-search/components/client-side-search/client-side-search.component';
import { ServerSideSearchComponent } from './challenges/challenge-04-server-side-search/components/server-side-search/server-side-search.component';
import { ThemeDemoComponent } from './components/theme-demo/theme-demo.component';
import { ChallengeListComponent, LandingPageComponent } from '@ng-coding-challenges/shared/ui';

export const routes: Routes = [
   {
      path: '',
      pathMatch: 'full',
      component: LandingPageComponent
      // Empty path will show the landing page
      // Component is handled via conditional template in AppComponent
   },
   {
      path: 'challenges',
      children: [
         {
            path: '',
            component: ChallengeListComponent
            // This path will show the challenges list page
            // Component is handled via conditional template in AppComponent
         },
         {
            path: 'fetch-products',
           loadComponent: () => import('./challenges/challenge-01-product-list/components/product-list/product-list.component').then(m => m.ProductListComponent)
         },
         {
            path: 'handle-parallel-apis',
            loadComponent: () => import('./challenges/challenge-02-parallel-apis/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
         },
         {
            path: 'client-side-search',
            loadComponent: () => import('./challenges/challenge-03-client-side-search/components/client-side-search/client-side-search.component').then(m => m.ClientSideSearchComponent)
         },
         {
            path: 'server-side-search',
            loadComponent: () => import('./challenges/challenge-04-server-side-search/components/server-side-search/server-side-search.component').then(m => m.ServerSideSearchComponent)
         }
      ]
   },
   {
      path: 'theme-demo',
      loadComponent: () => import('./components/theme-demo/theme-demo.component').then(m => m.ThemeDemoComponent)
   },
   {
      path: '**',
      redirectTo: '',
   }

];
