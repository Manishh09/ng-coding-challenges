import { Routes } from '@angular/router';
import { authGuard } from './challenges/challenge-10-authorized-resource-access/guards/auth.guard';
import { adminGuard } from './challenges/challenge-11-admin-dashboard-access/guards/adming.guard';
import { ChallengeListComponent } from 'libs/shared/ui/src/lib/components/challenge-list/challenge-list.component';

export const NGC_ROUTING_ROUTES: Routes = [

  {
    path: '',
    component: ChallengeListComponent,
    children: [

      {
        path: 'login',
        loadComponent: () =>
          import('./challenges/shared/components/login/login.component').then((m) => m.LoginComponent),
      },
      // CH-10: Authorized Resource Access
      {
        path: 'products',
        loadComponent: () =>
          import(
            './challenges/challenge-10-authorized-resource-access/components/product-list/product-list.component').then((m) => m.ProductListComponent),
        canActivate: [authGuard],
      },
      // CH-11: Admin Dashboard Access
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./challenges/challenge-11-admin-dashboard-access/components/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'dashboard/users',
        loadComponent: () =>
          import('./challenges/challenge-11-admin-dashboard-access/components/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
        canActivate: [adminGuard],
      },
      {
        path: 'dashboard/posts',
        loadComponent: () =>
          import('./challenges/challenge-11-admin-dashboard-access/components/posts/posts.component').then(
            (m) => m.PostsComponent
          ),
        canActivate: [adminGuard],
      },

    ],
  },
  { path: '**', redirectTo: '' }
];
