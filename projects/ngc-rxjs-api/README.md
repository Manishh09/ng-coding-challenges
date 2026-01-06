# ngc-rxjs-api

RxJS & API Challenges - covering HTTP requests with HttpClient, RxJS operators (forkJoin, combineLatest, switchMap, mergeMap, concatMap), search patterns (debounce, distinctUntilChanged), caching strategies (shareReplay), data transformation, parallel & sequential API calls, and error handling.

## Project Structure

```
src/app/
├── challenges/                    # All challenge implementations
│   ├── challenge-XX-[name]/       # Individual challenge folder
│   │   ├── components/            # Challenge workspace components
│   │   ├── services/              # HTTP services
│   │   ├── models/                # TypeScript interfaces
│   │   └── docs/                  # Challenge documentation
│   │       ├── CH-XX-REQUIREMENT.md
│   │       └── CH-XX-SOLUTION_GUIDE.md
├── app.component.ts               # Root component
├── app.config.ts                  # Application configuration
└── app.routes.ts                  # Routing configuration
```

## Challenge List

| ID | Name | Link |
|---|---|---|
| CH-01 | Product List | [View](src/app/challenges/challenge-01-product-list/docs/CH-01-REQUIREMENT.md) |
| CH-02 | Parallel API calls | [View](src/app/challenges/challenge-02-parallel-apis/docs/CH-02-REQUIREMENT.md) |
| CH-03 | Client-Side Search | [View](src/app/challenges/challenge-03-client-side-search/docs/CH-03-REQUIREMENT.md) |
| CH-04 | Server-Side Search | [View](src/app/challenges/challenge-04-server-side-search/docs/CH-04-REQUIREMENT.md) |
| CH-05 | Caching with RxJS | [View](src/app/challenges/challenge-05-product-category-management-system/docs/CH-05-REQUIREMENT.md) |
| CH-06 | Data Joining & Filtering | [View](src/app/challenges/challenge-06-user-todos-filter/docs/CH-06-REQUIREMENT.md) |
| CH-07 | Dependent API Calls | [View](src/app/challenges/challenge-07-dependent-apis/docs/CH-07-REQUIREMENT.md) |
| CH-08 | Auto-Checkout (Sequential) | [View](src/app/challenges/challenge-08-ecommerce-checkout/docs/CH-08-REQUIREMENT.md) |

---

## Category Metadata

**Route:** `/challenges/rxjs-api`  
**Import Alias:** `@ngc-rxjs-api`  
**Exported Routes:** `NGC_RXJS_API_ROUTES`  
**Category ID:** `rxjs-api`  
**Category Order:** `1`
