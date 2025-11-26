import { Challenge, ChallengeDetails, DifficultyLevel, ChallengeCategoryId, Author } from '@ng-coding-challenges/shared/models';

const BASE_REPO = 'https://github.com/Manishh09/ng-coding-challenges/blob/develop';
const NGC_RXJS_API = `${BASE_REPO}/projects/ngc-rxjs-api/src/app/challenges`;
const NGC_CORE = `${BASE_REPO}/projects/ngc-core/src/app/challenges`;
const NGC_ROUTING = `${BASE_REPO}/projects/ngc-routing/src/app/challenges`;

// ============================================
// SHARED CONFIGURATION
// ============================================

const DEFAULT_AUTHOR: Author = {
  name: 'Manish Kumar',
  avatar: '/assets/avatars/manish.jpg',
  profileUrl: 'https://github.com/Manishh09'
};

const COMMON_TECH_STACK = {
  rxjsApi: ['Angular 19+', 'RxJS', 'TypeScript', 'HttpClient'],
  core: ['Angular 19+', 'Signals', 'TypeScript', 'Standalone Components'],
  routing: ['Angular 19+', 'Router', 'Signals', 'Route Guards']
};

// ============================================
// BASE CHALLENGE DATA (for lists/previews)
// ============================================

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: 'Challenge 01: Fetch Products',
    description: "Fetch product data from a fake API and display it in a table using Angular's HttpClient and RxJS.",
    link: 'fetch-products',
    category: 'rxjs-api',
    difficulty: 'Beginner',
    tags: ['HttpClient', 'API', 'RxJS', 'Observables']
  },
  {
    id: 2,
    title: 'Challenge 02: Dashboard Data - Parallel API Calls',
    description: "Perform parallel API calls in Angular using RxJS's forkJoin and display combined dashboard data.",
    link: 'handle-parallel-apis',
    category: 'rxjs-api',
    difficulty: 'Intermediate',
    tags: ['forkJoin', 'Parallel APIs', 'RxJS']
  },
  {
    id: 3,
    title: 'Challenge 03: Client-Side User Search',
    description: "Implement a client-side search using Angular Reactive Forms and RxJS with dummy user data.",
    link: 'client-side-search',
    category: 'rxjs-api',
    difficulty: 'Beginner',
    tags: ['Reactive Forms', 'Search', 'Filtering']
  },
  {
    id: 4,
    title: 'Challenge 04: Server-Side User Search (AutoComplete)',
    description: 'Implement a server-side search (auto-complete) using Angular Reactive Forms and RxJS with an API backend.',
    link: 'server-side-search',
    category: 'rxjs-api',
    difficulty: 'Intermediate',
    tags: ['AutoComplete', 'debounceTime', 'switchMap', 'API']
  },
  {
    id: 5,
    title: 'Challenge 05: Product Category Management - shareReplay',
    description: 'Build a product category management system where multiple components share category data using Signals and RxJS shareReplay.',
    link: 'product-category-management',
    category: 'rxjs-api',
    difficulty: 'Intermediate',
    tags: ['shareReplay', 'Caching', 'Signals']
  },
  {
    id: 6,
    title: 'Challenge 06: User Todos with Status Filter - combineLatest',
    description: 'Fetch todos and users from an API, merge them using RxJS combineLatest, and display an enriched table with status filters.',
    link: 'user-todos-filter',
    category: 'rxjs-api',
    difficulty: 'Intermediate',
    tags: ['combineLatest', 'Data Merging', 'Filtering']
  },
  {
    id: 7,
    title: 'Challenge 07: User Posts Dashboard - Dependent API Calls',
    description: 'Fetch users and their posts from DummyJSON API using RxJS mergeMap to handle dependent API calls.',
    link: 'user-posts-dashboard',
    category: 'rxjs-api',
    difficulty: 'Advanced',
    tags: ['mergeMap', 'Dependent APIs', 'Nested Observables']
  },
  {
    id: 8,
    title: 'Challenge 08: E-Commerce Checkout Process - Sequential API Calls',
    description: 'Implement a simplified e-commerce checkout process in Angular using RxJS to manage sequential API calls.',
    link: 'ecommerce-checkout',
    category: 'rxjs-api',
    difficulty: 'Advanced',
    tags: ['concatMap', 'Sequential APIs', 'Error Handling']
  },
  {
    id: 9,
    title: 'Challenge 09: Component Communication using Signals',
    description: 'Build a product dashboard demonstrating parent-child component communication using Angular Signals and standalone components.',
    link: 'component-communication',
    category: 'angular-core',
    difficulty: 'Beginner',
    tags: ['Signals', 'Component Communication', 'Input/Output']
  },
  {
    id: 10,
    title: 'Challenge 10: Authorized Resource Access',
    description: 'Implement a simple authentication system in Angular using Signals and route guards to protect authorized resources.',
    link: 'authorized-resource-access',
    category: 'angular-routing',
    difficulty: 'Intermediate',
    tags: ['Route Guards', 'Authentication', 'canActivate']
  },
  {
    id: 11,
    title: 'Challenge 11: Admin Dashboard Access',
    description: 'Create an admin dashboard in Angular with role-based access control using Signals and route guards.',
    link: 'admin-dashboard-access',
    category: 'angular-routing',
    difficulty: 'Intermediate',
    tags: ['RBAC', 'Route Guards', 'Authorization']
  }
];

// ============================================
// DETAILED CHALLENGE DATA (lazy loaded)
// ============================================

export const CHALLENGE_DETAILS: Record<number, ChallengeDetails> = {
  1: {
    ...CHALLENGES[0],
    longDescription: `
      This challenge introduces you to Angular's HttpClient module and RxJS observables.
      You'll learn how to fetch data from a REST API and display it in a structured format.
      This is a fundamental skill for any Angular developer working with backend services.
    `,
    learningOutcomes: [
      'Set up HttpClient in Angular standalone applications',
      'Make GET requests to REST APIs',
      'Handle observables with async pipe',
      'Display API data in tables',
      'Implement loading and error states'
    ],
    techStack: COMMON_TECH_STACK.rxjsApi,
    requirement: `${NGC_RXJS_API}/challenge-01-product-list/docs/CH-01-REQUIREMENT.md`,
    solutionGuide: `${NGC_RXJS_API}/challenge-01-product-list/docs/CH-01-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_RXJS_API}/challenge-01-product-list`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '30-45 minutes',
    prerequisites: ['Basic Angular knowledge', 'TypeScript fundamentals']
  },

  2: {
    ...CHALLENGES[1],
    longDescription: `
      Master parallel API calls using RxJS's forkJoin operator. This challenge simulates
      a real-world dashboard scenario where you need to fetch data from multiple endpoints
      simultaneously and combine the results efficiently.
    `,
    learningOutcomes: [
      'Use forkJoin for parallel API calls',
      'Combine multiple observable streams',
      'Handle loading states for multiple requests',
      'Manage errors in parallel operations',
      'Optimize API call performance'
    ],
    techStack: COMMON_TECH_STACK.rxjsApi,
    requirement: `${NGC_RXJS_API}/challenge-02-parallel-apis/docs/CH-02-REQUIREMENT.md`,
    solutionGuide: `${NGC_RXJS_API}/challenge-02-parallel-apis/docs/CH-02-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_RXJS_API}/challenge-02-parallel-apis`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '45-60 minutes',
    prerequisites: ['Challenge 01 completed', 'Understanding of Observables']
  },

  3: {
    ...CHALLENGES[2],
    longDescription: `
      Build a client-side search feature using Angular Reactive Forms and RxJS operators.
      Learn how to filter data efficiently without making API calls for every keystroke.
    `,
    learningOutcomes: [
      'Create reactive forms in Angular',
      'Implement client-side filtering',
      'Use RxJS operators for search optimization',
      'Handle form value changes reactively',
      'Build responsive search interfaces'
    ],
    techStack: COMMON_TECH_STACK.rxjsApi,
    requirement: `${NGC_RXJS_API}/challenge-03-client-side-search/docs/CH-03-REQUIREMENT.md`,
    solutionGuide: `${NGC_RXJS_API}/challenge-03-client-side-search/docs/CH-03-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_RXJS_API}/challenge-03-client-side-search`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '40-50 minutes',
    prerequisites: ['Reactive Forms basics', 'Array manipulation in JavaScript']
  },

  4: {
    ...CHALLENGES[3],
    longDescription: `
      Implement a professional autocomplete search feature that queries a backend API.
      Learn critical RxJS operators like debounceTime, distinctUntilChanged, and switchMap
      to create a performant search experience.
    `,
    learningOutcomes: [
      'Implement debounced search queries',
      'Use switchMap for request cancellation',
      'Handle rapid user input efficiently',
      'Create autocomplete UI components',
      'Optimize API call frequency'
    ],
    techStack: COMMON_TECH_STACK.rxjsApi,
    requirement: `${NGC_RXJS_API}/challenge-04-server-side-search/docs/CH-04-REQUIREMENT.md`,
    solutionGuide: `${NGC_RXJS_API}/challenge-04-server-side-search/docs/CH-04-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_RXJS_API}/challenge-04-server-side-search`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '60-75 minutes',
    prerequisites: ['Challenge 03 completed', 'Understanding of RxJS operators']
  },

  5: {
    ...CHALLENGES[4],
    longDescription: `
      Build a product category management system that demonstrates efficient data sharing
      between components. Learn how to use shareReplay to cache API responses and Angular
      Signals for reactive state management.
    `,
    learningOutcomes: [
      'Implement data caching with shareReplay',
      'Share data across multiple components',
      'Integrate Angular Signals with RxJS',
      'Optimize API call performance',
      'Build reactive component architectures'
    ],
    techStack: COMMON_TECH_STACK.rxjsApi,
    requirement: `${NGC_RXJS_API}/challenge-05-product-category-management-system/docs/CH-05-REQUIREMENT.md`,
    solutionGuide: `${NGC_RXJS_API}/challenge-05-product-category-management-system/docs/CH-05-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_RXJS_API}/challenge-05-product-category-management-system`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '60-90 minutes',
    prerequisites: ['Understanding of Signals', 'RxJS multicasting concepts']
  },

  6: {
    ...CHALLENGES[5],
    longDescription: `
      Create a todo management system that combines data from multiple sources and provides
      dynamic filtering. Master the combineLatest operator to synchronize multiple data streams.
    `,
    learningOutcomes: [
      'Use combineLatest for data synchronization',
      'Merge data from multiple API endpoints',
      'Implement dynamic filtering logic',
      'Create enriched data models',
      'Build complex reactive data flows'
    ],
    techStack: COMMON_TECH_STACK.rxjsApi,
    requirement: `${NGC_RXJS_API}/challenge-06-user-todos-filter/docs/CH-06-REQUIREMENT.md`,
    solutionGuide: `${NGC_RXJS_API}/challenge-06-user-todos-filter/docs/CH-06-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_RXJS_API}/challenge-06-user-todos-filter`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '75-90 minutes',
    prerequisites: ['Understanding of combineLatest', 'Data transformation skills']
  },

  7: {
    ...CHALLENGES[6],
    longDescription: `
      Tackle dependent API calls where the result of one request determines the next.
      Learn to use mergeMap (flatMap) to handle nested observables and create complex
      data flows for a user posts dashboard.
    `,
    learningOutcomes: [
      'Handle dependent API calls with mergeMap',
      'Flatten nested observables',
      'Manage complex asynchronous flows',
      'Build hierarchical data structures',
      'Optimize nested request patterns'
    ],
    techStack: COMMON_TECH_STACK.rxjsApi,
    requirement: `${NGC_RXJS_API}/challenge-07-dependent-apis/docs/CH-07-REQUIREMENT.md`,
    solutionGuide: `${NGC_RXJS_API}/challenge-07-dependent-apis/docs/CH-07-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_RXJS_API}/challenge-07-dependent-apis`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '90-120 minutes',
    prerequisites: ['Understanding of higher-order observables', 'Advanced RxJS operators']
  },

  8: {
    ...CHALLENGES[7],
    longDescription: `
      Implement a multi-step checkout process with sequential API calls. Learn to use
      concatMap to ensure operations happen in order, handle errors gracefully, and
      manage complex state throughout the checkout flow.
    `,
    learningOutcomes: [
      'Implement sequential API operations with concatMap',
      'Handle multi-step form processes',
      'Manage transaction-like operations',
      'Implement comprehensive error handling',
      'Build state machines with RxJS'
    ],
    techStack: COMMON_TECH_STACK.rxjsApi,
    requirement: `${NGC_RXJS_API}/challenge-08-ecommerce-checkout/docs/CH-08-REQUIREMENT.md`,
    solutionGuide: `${NGC_RXJS_API}/challenge-08-ecommerce-checkout/docs/CH-08-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_RXJS_API}/challenge-08-ecommerce-checkout`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '120-150 minutes',
    prerequisites: ['All previous RxJS challenges', 'Understanding of concatMap vs mergeMap']
  },

  9: {
    ...CHALLENGES[8],
    longDescription: `
      Master modern Angular component communication using Signals. Build a product dashboard
      with parent-child communication patterns, exploring input/output decorators and the
      new Signal-based APIs.
    `,
    learningOutcomes: [
      'Implement parent-child communication with Signals',
      'Use input() and output() functions',
      'Build standalone components',
      'Create reactive component architectures',
      'Handle component lifecycle with Signals'
    ],
    techStack: COMMON_TECH_STACK.core,
    requirement: `${NGC_CORE}/challenge-09-component-communication/docs/CH-09-REQUIREMENT.md`,
    solutionGuide: `${NGC_CORE}/challenge-09-component-communication/docs/CH-09-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_CORE}/challenge-09-component-communication`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '60-75 minutes',
    prerequisites: ['Angular Signals basics', 'Standalone components']
  },

  10: {
    ...CHALLENGES[9],
    longDescription: `
      Build a complete authentication system with protected routes. Learn to implement
      canActivate guards using functional guards and Signals to control access to
      authorized resources.
    `,
    learningOutcomes: [
      'Implement functional route guards',
      'Create authentication services with Signals',
      'Protect routes with canActivate',
      'Handle login/logout flows',
      'Manage authentication state'
    ],
    techStack: COMMON_TECH_STACK.routing,
    requirement: `${NGC_ROUTING}/challenge-10-authorized-resource-access/docs/CH-10-REQUIREMENT.md`,
    solutionGuide: `${NGC_ROUTING}/challenge-10-authorized-resource-access/docs/CH-10-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_ROUTING}/challenge-10-authorized-resource-access`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '90-120 minutes',
    prerequisites: ['Angular Router basics', 'Understanding of guards']
  },

  11: {
    ...CHALLENGES[10],
    longDescription: `
      Implement role-based access control (RBAC) for an admin dashboard. Learn advanced
      routing techniques including role-based guards, protecting multiple routes, and
      handling unauthorized access gracefully.
    `,
    learningOutcomes: [
      'Implement role-based access control',
      'Create complex authorization logic',
      'Handle multiple user roles',
      'Build secure route hierarchies',
      'Implement redirect strategies'
    ],
    techStack: COMMON_TECH_STACK.routing,
    requirement: `${NGC_ROUTING}/challenge-11-admin-dashboard-access/docs/CH-11-REQUIREMENT.md`,
    solutionGuide: `${NGC_ROUTING}/challenge-11-admin-dashboard-access/docs/CH-11-SOLUTION_GUIDE.md`,
    gitHub: `${NGC_ROUTING}/challenge-11-admin-dashboard-access`,
    author: DEFAULT_AUTHOR,
    estimatedTime: '120-150 minutes',
    prerequisites: ['Challenge 10 completed', 'Advanced routing concepts']
  }
};
