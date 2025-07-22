import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'rxjs/01-fetch-products',
        pathMatch: 'full',
    },
    {
        path: 'rxjs/01-fetch-products',
        loadComponent: () =>
            import('./challenges/01-fetch-products/product-list/product-list.component')
        .then(m => m.ProductListComponent),
    },
];
