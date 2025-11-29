import { Routes } from '@angular/router';
import { ChallengeListComponent, ChallengeDetailsComponent } from '@ng-coding-challenges/shared/ui';
import { challengeListResolver, challengeDetailsResolver } from '@ng-coding-challenges/shared/services';

/**
 * Challenge component mapping
 * Maps challengeId to workspace component
 */
const CHALLENGE_COMPONENTS = {
  'fetch-products': () => 
    import('./challenges/challenge-01-product-list/components/product-list/product-list.component')
      .then(m => m.ProductListComponent),
  
  'handle-parallel-apis': () => 
    import('./challenges/challenge-02-parallel-apis/components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
  
  'client-side-search': () => 
    import('./challenges/challenge-03-client-side-search/components/client-side-search/client-side-search.component')
      .then(m => m.ClientSideSearchComponent),
  
  'server-side-search': () => 
    import('./challenges/challenge-04-server-side-search/components/server-side-search/server-side-search.component')
      .then(m => m.ServerSideSearchComponent),
  
  'product-category-management': () => 
    import('./challenges/challenge-05-product-category-management-system/components/product-category-dashboard/product-category-dashboard.component')
      .then(m => m.ProductCategoryDashboardComponent),
  
  'user-todos-filter': () => 
    import('./challenges/challenge-06-user-todos-filter/components/user-todos/user-todos.component')
      .then(m => m.UserTodosComponent),
  
  'user-posts-dashboard': () => 
    import('./challenges/challenge-07-dependent-apis/components/user-posts-dashboard/user-posts-dashboard.component')
      .then(m => m.UserPostsDashboardComponent),
  
  'ecommerce-checkout': () => 
    import('./challenges/challenge-08-ecommerce-checkout/components/checkout/checkout.component')
      .then(m => m.CheckoutComponent),
};

/**
 * RxJS & API Challenges Routes
 * 
 * Three-level architecture:
 * Level 1: /challenges/rxjs-api - Challenge list for this category
 * Level 2: /challenges/rxjs-api/:challengeId - Challenge details with description, requirements, solution tabs
 * Level 3: /challenges/rxjs-api/:challengeId/workspace - Interactive challenge workspace
 * 
 * Uses Route Resolvers:
 * - challengeListResolver: Pre-fetches challenge list data
 * - challengeDetailsResolver: Pre-fetches challenge details data
 */
export const NGC_RXJS_API_ROUTES: Routes = [
  // Level 1: Category challenge list
  {
    path: '',
    component: ChallengeListComponent,
    resolve: {
      challenges: challengeListResolver
    },
    data: { 
      categoryId: 'rxjs-api',
      categoryName: 'RxJS & API Challenges'
    }
  },

  // Level 2 & 3: Individual challenge routes
  ...Object.entries(CHALLENGE_COMPONENTS).map(([challengeId, componentLoader]) => ({
    path: challengeId,
    children: [
      // Level 2: Challenge details (default)
      {
        path: '',
        component: ChallengeDetailsComponent,
        resolve: {
          challenge: challengeDetailsResolver
        },
        data: { 
          categoryId: 'rxjs-api',
          categoryName: 'RxJS & API Challenges',
          challengeId 
        }
      },
      // Level 3: Challenge workspace
      {
        path: 'workspace',
        loadComponent: componentLoader,
        data: { 
          categoryId: 'rxjs-api',
          categoryName: 'RxJS & API Challenges',
          challengeId 
        }
      }
    ]
  }))
];
