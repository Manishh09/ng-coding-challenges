import { Routes } from '@angular/router';
import { ProductListComponent } from './challenge-01-product-list/components/product-list/product-list.component';
import { DashboardComponent } from './challenge-02-parallel-apis/components/dashboard/dashboard.component';

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
         }
      ]
   },
   {
      path: '**',
      redirectTo: '',
      
   }

];
