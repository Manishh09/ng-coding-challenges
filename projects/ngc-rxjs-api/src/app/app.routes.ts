import { Routes } from '@angular/router';
import { ChallengeListComponent } from '@ng-coding-challenges/shared/ui';

export const NGC_RXJS_API_ROUTES: Routes = [
  {
    path: '',
    component: ChallengeListComponent,

    children: [
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
      },
      {
        path: 'product-category-management',
        loadComponent: () => import('./challenges/challenge-05-product-category-management-system/components/product-category-dashboard/product-category-dashboard.component').then(m => m.ProductCategoryDashboardComponent)
      },
      {
        path: 'user-todos-filter',
        loadComponent: () => import('./challenges/challenge-06-user-todos-filter/components/user-todos/user-todos.component').then(m => m.UserTodosComponent)
      },
      {
        path: 'user-posts-dashboard',
        loadComponent: () => import('./challenges/challenge-07-dependent-apis/components/user-posts-dashboard/user-posts-dashboard.component').then(m => m.UserPostsDashboardComponent)
      },
      {
        path: 'ecommerce-checkout',
        loadComponent: () => import('./challenges/challenge-08-ecommerce-checkout/components/checkout/checkout.component').then(m => m.CheckoutComponent)
      },
    ]
  },


];
