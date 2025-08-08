import { Routes } from '@angular/router';
import { ProductListComponent } from './challenges/challenge-01-product-list/components/product-list/product-list.component';
import { DashboardComponent } from './challenges/challenge-02-parallel-apis/components/dashboard/dashboard.component';
import { ClientSideSearchComponent } from './challenges/challenge-03-client-side-search/components/client-side-search/client-side-search.component';

export const routes: Routes = [

   {
      path: 'challenges',
      children: [
         {
            path: '',
            redirectTo: '/',
            pathMatch: 'full'
         },
         {
            path: 'fetch-products',
            component: ProductListComponent
         },
         {
            path: 'handle-parallel-apis',
            component: DashboardComponent
         },
         {
            path: 'client-side-search',
            component: ClientSideSearchComponent
         }
      ]
   },
   {
      path: '**',
      redirectTo: '',
   }

];
