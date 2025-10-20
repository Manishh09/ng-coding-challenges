import { Routes } from '@angular/router';
import { ChallengeListComponent } from '@ng-coding-challenges/shared/ui';

export const NGC_CORE_ROUTES: Routes = [
  {
    path: '',
    component: ChallengeListComponent,

    children: [
      {
        path: 'component-communication',
        loadComponent: () => import('./challenges/challenge-01-component-communication/components/product-dashboard/product-dashboard.component').then(m => m.ProductDashboardComponent)
      },
    ]
  }
];
