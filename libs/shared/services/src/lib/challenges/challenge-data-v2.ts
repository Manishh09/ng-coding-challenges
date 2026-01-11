// =============================
// Base Repository Constants
// =============================
const BASE_REPO = 'https://github.com/Manishh09/ng-coding-challenges/blob/develop';
const NGC_RXJS_API = `${BASE_REPO}/projects/ngc-rxjs-api/src/app/challenges`;
const NGC_CORE = `${BASE_REPO}/projects/ngc-core/src/app/challenges`;

// =============================
// Challenge Type Definition
// =============================
export interface Challenge {
  id: number;
  title: string;
  description: string;
  link: string;
  requirement: string;
  solutionGuide: string;
  gitHub: string;
}

// =============================
// Grouped Challenge Data
// =============================
export const CHALLENGE_CATEGORIES: Record<string, Challenge[]> = {
  'rxjs-api': [
    {
      id: 1,
      title: 'Challenge 01: Fetch Products',
      description:
        "Fetch product data from a fake API and display it in a table using Angular's HttpClient and RxJS.",
      link: 'fetch-products',
      requirement: `${NGC_RXJS_API}/challenge-01-product-list/docs/CH-01-REQUIREMENT.md`,
      solutionGuide: `${NGC_RXJS_API}/challenge-01-product-list/docs/CH-01-SOLUTION_GUIDE.md`,
      gitHub: `${NGC_RXJS_API}/challenge-01-product-list`,
    },
    {
      id: 2,
      title: 'Challenge 02: Dashboard Data - Parallel API Calls',
      description:
        "Perform parallel API calls in Angular using RxJS's forkJoin and display combined dashboard data.",
      link: 'handle-parallel-apis',
      requirement: `${NGC_RXJS_API}/challenge-02-parallel-apis/docs/CH-02-REQUIREMENT.md`,
      solutionGuide: `${NGC_RXJS_API}/challenge-02-parallel-apis/docs/CH-02-SOLUTION_GUIDE.md`,
      gitHub: `${NGC_RXJS_API}/challenge-02-parallel-apis`,
    },
    {
      id: 3,
      title: 'Challenge 03: Client-Side User Search',
      description:
        "Implement a client-side search using Angular Reactive Forms and RxJS with dummy user data.",
      link: 'client-side-search',
      requirement: `${NGC_RXJS_API}/challenge-03-client-side-search/docs/CH-03-REQUIREMENT.md`,
      solutionGuide: `${NGC_RXJS_API}/challenge-03-client-side-search/docs/CH-03-SOLUTION_GUIDE.md`,
      gitHub: `${NGC_RXJS_API}/challenge-03-client-side-search`,
    },
    {
      id: 4,
      title: 'Challenge 04: Server-Side User Search (AutoComplete)',
      description:
        'Implement a server-side search (auto-complete) using Angular Reactive Forms and RxJS with an API backend.',
      link: 'server-side-search',
      requirement: `${NGC_RXJS_API}/challenge-04-server-side-search/docs/CH-04-REQUIREMENT.md`,
      solutionGuide: `${NGC_RXJS_API}/challenge-04-server-side-search/docs/CH-04-SOLUTION_GUIDE.md`,
      gitHub: `${NGC_RXJS_API}/challenge-04-server-side-search`,
    },
    {
      id: 5,
      title: 'Challenge 05: Product Category Management - shareReplay',
      description:
        'Build a product category management system where multiple components share category data using Signals and RxJS shareReplay.',
      link: 'product-category-management',
      requirement: `${NGC_RXJS_API}/challenge-05-product-category-management-system/docs/CH-05-REQUIREMENT.md`,
      solutionGuide: `${NGC_RXJS_API}/challenge-05-product-category-management-system/docs/CH-05-SOLUTION_GUIDE.md`,
      gitHub: `${NGC_RXJS_API}/challenge-05-product-category-management-system`,
    },
    {
      id: 6,
      title: 'Challenge 06: User Todos with Status Filter - combineLatest',
      description:
        'Fetch todos and users from an API, merge them using RxJS combineLatest, and display an enriched table with status filters.',
      link: 'user-todos-filter',
      requirement: `${NGC_RXJS_API}/challenge-06-user-todos-filter/docs/CH-06-REQUIREMENT.md`,
      solutionGuide: `${NGC_RXJS_API}/challenge-06-user-todos-filter/docs/CH-06-SOLUTION_GUIDE.md`,
      gitHub: `${NGC_RXJS_API}/challenge-06-user-todos-filter`,
    },
    {
      id: 7,
      title: 'Challenge 07: User Posts Dashboard - Dependent API Calls',
      description:
        'Fetch users and their posts from DummyJSON API using RxJS mergeMap to handle dependent API calls.',
      link: 'user-posts-dashboard',
      requirement: `${NGC_RXJS_API}/challenge-07-dependent-apis/docs/CH-07-REQUIREMENT.md`,
      solutionGuide: `${NGC_RXJS_API}/challenge-07-dependent-apis/docs/CH-07-SOLUTION_GUIDE.md`,
      gitHub: `${NGC_RXJS_API}/challenge-07-dependent-apis`,
    },
    {
      id: 8,
      title: 'Challenge 08: E-Commerce Checkout Process - Sequential API Calls',
      description:
        'Implement a simplified e-commerce checkout process in Angular using RxJS to manage sequential API calls.',
      link: 'ecommerce-checkout',
      requirement: `${NGC_RXJS_API}/challenge-08-ecommerce-checkout/docs/CH-08-REQUIREMENT.md`,
      solutionGuide: `${NGC_RXJS_API}/challenge-08-ecommerce-checkout/docs/CH-08-SOLUTION_GUIDE.md`,
      gitHub: `${NGC_RXJS_API}/challenge-08-ecommerce-checkout`,
    },
  ],

  'angular-core': [
    {
      id: 9,
      title: 'Challenge 09: Component Communication using Signals',
      description:
        'Build a product dashboard demonstrating parent-child component communication using Angular Signals and standalone components.',
      link: 'component-communication',
      requirement: `${NGC_CORE}/challenge-09-component-communication/docs/CH-09-REQUIREMENT.md`,
      solutionGuide: `${NGC_CORE}/challenge-09-component-communication/docs/CH-09-SOLUTION_GUIDE.md`,
      gitHub: `${NGC_CORE}/challenge-09-component-communication`,
    },
  ],
};

// =============================
// Flatten All Challenges
// =============================
export const ALL_CHALLENGES: Challenge[] = Object.values(CHALLENGE_CATEGORIES).flat();
