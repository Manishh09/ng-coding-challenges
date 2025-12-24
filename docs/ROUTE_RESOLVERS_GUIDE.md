# Route Resolvers Implementation

## Overview

This document explains the **Route Resolver Pattern** implemented for the three-level routing architecture in the ng-coding-challenges application.

## What are Route Resolvers?

Route Resolvers are Angular services/functions that **pre-fetch data before a route activates**. They ensure that components have all necessary data available synchronously when they initialize.

## Benefits

### 1. **Centralized Data Fetching**
- All data loading logic lives in one place (resolvers)
- Components become simpler and focused on presentation
- Easier to maintain and test

### 2. **Better User Experience**
- Data is ready before component renders
- No "flash of empty content"
- Can show loading indicators at router level

### 3. **Future-Proof Architecture**
- Easy to switch from synchronous to asynchronous data sources
- Simple to add HTTP calls, caching, error handling
- Components don't need to change when data source changes

### 4. **Type Safety**
- Resolved data is strongly typed in route configuration
- Components receive data through `ActivatedRoute.data`
- Less prop drilling and manual data fetching

## Implementation

### Resolver Files

#### 1. **challenge-list.resolver.ts**
```typescript
export const challengeListResolver: ResolveFn<readonly Challenge[]> = (
  route: ActivatedRouteSnapshot
) => {
  const challengesService = inject(ChallengesService);
  const categoryId = route.data['categoryId'];

  if (!categoryId || categoryId === 'all') {
    return challengesService.getChallenges();
  }

  return challengesService.getChallengesByCategory(categoryId);
};
```

**Purpose**: Pre-fetches the list of challenges for a specific category

**When Used**: Level 1 routing (category list view)

**Route**: `/challenges/rxjs-api`

---

#### 2. **challenge-details.resolver.ts**
```typescript
export const challengeDetailsResolver: ResolveFn<ChallengeDetails | null> = (
  route: ActivatedRouteSnapshot
) => {
  const challengesService = inject(ChallengesService);
  const categoryId = route.parent?.data['categoryId'] || route.data['categoryId'];
  const challengeSlug = route.paramMap.get('challengeId');

  if (!challengeSlug || !categoryId) return null;

  // Convert slug to challenge by finding match
  const challenges = challengesService.getChallengesByCategory(categoryId);
  const challenge = Array.from(challenges).find(c => 
    createChallengeSlug(c.title) === challengeSlug
  );

  if (!challenge) return null;

  return challengesService.getChallengeDetailsById(challenge.id) || null;
};
```

**Purpose**: Pre-fetches detailed challenge information including requirements, learning outcomes, etc.

**When Used**: Level 2 routing (challenge details view)

**Route**: `/challenges/rxjs-api/fetch-products`

---

### Route Configuration

#### Main App Routes (ngc-shell)
```typescript
{
  path: '',
  loadComponent: () => import('@ng-coding-challenges/shared/ui').then(
    m => m.ChallengeListComponent
  ),
  resolve: {
    challenges: challengeListResolver  // ← Resolver added
  },
  data: { categoryId: 'all', categoryName: 'All Challenges' }
}
```

#### Sub-App Routes (ngc-rxjs-api)
```typescript
{
  path: '',
  component: ChallengeListComponent,
  resolve: {
    challenges: challengeListResolver  // ← Level 1
  },
  data: { 
    categoryId: 'rxjs-api',
    categoryName: 'RxJS & API Challenges'
  }
},
{
  path: ':challengeId',
  component: ChallengeDetailsComponent,
  resolve: {
    challenge: challengeDetailsResolver  // ← Level 2
  },
  data: { 
    categoryId: 'rxjs-api',
    categoryName: 'RxJS & API Challenges'
  }
}
```

---

### Component Usage

#### ChallengeListComponent
```typescript
// Reactive source for route data
private readonly routeData = toSignal(
  this.activatedRoute.data.pipe(takeUntilDestroyed()),
  { initialValue: {} }
);

// Derived signal: challenges from resolver
readonly challenges = computed<Challenge[]>(() => {
  const data = this.routeData() as { challenges?: readonly Challenge[] };
  
  // Resolver provides the data
  if (data.challenges) {
    return Array.from(data.challenges);
  }

  // Fallback for backwards compatibility
  const id = this.categoryId();
  return Array.from(this.challengesService.getChallengesByCategory(id));
});
```

#### ChallengeDetailsComponent
```typescript
// Challenge details from resolver
readonly challengeDetails = computed(() => {
  const data = this.routeData() as { challenge?: ChallengeDetails };
  
  // Resolver provides the data
  if (data?.challenge) {
    return data.challenge;
  }

  // Fallback for backwards compatibility
  // ... manual lookup logic
});
```

---

## Current vs. Future State

### Current Implementation (Synchronous)
- Data is stored in memory (`CHALLENGES` and `CHALLENGE_DETAILS` constants)
- Resolvers return data immediately
- No async operations needed

### Future Implementation (Asynchronous - when API is ready)

Simply update the resolvers to return Observables:

```typescript
export const challengeDetailsResolver: ResolveFn<ChallengeDetails | null> = (
  route: ActivatedRouteSnapshot
) => {
  const http = inject(HttpClient);
  const challengeId = route.paramMap.get('challengeId');

  // Return Observable - Angular Router will wait for it
  return http.get<ChallengeDetails>(`/api/challenges/${challengeId}`).pipe(
    catchError(() => of(null))
  );
};
```

**Components don't need to change!** They still read from `route.data`.

---

## Troubleshooting

### Build Errors: "Module has no exported member"

If you see this error after creating resolvers:

```
Module '"@ng-coding-challenges/shared/services"' has no exported member 'challengeListResolver'
```

**Solutions**:
1. Rebuild the shared library: `npm run build:shared-services`
2. Restart TypeScript server in VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
3. Verify exports in `libs/shared/services/src/public-api.ts`

### Resolver Not Firing

Check that:
1. Resolver is registered in route configuration's `resolve` property
2. Resolver function is exported correctly
3. Route data key matches what component expects

---

## Best Practices

### 1. **Always Provide Fallback**
Components should have fallback logic in case resolver fails:

```typescript
const data = this.routeData() as { challenges?: readonly Challenge[] };
return data.challenges || [];  // ← Fallback to empty array
```

### 2. **Type Safety**
Use type assertions for route data:

```typescript
const data = this.routeData() as { challenge?: ChallengeDetails };
```

### 3. **Error Handling**
Resolvers should return `null` or default values instead of throwing errors:

```typescript
if (!challengeSlug) return null;  // ← Don't throw
```

### 4. **Loading States**
Add loading indicators at router level using router events:

```typescript
this.router.events.pipe(
  filter(event => event instanceof NavigationStart)
).subscribe(() => this.loading.set(true));
```

---

## Testing

### Unit Testing Resolvers

```typescript
describe('challengeDetailsResolver', () => {
  it('should resolve challenge details', () => {
    const route = {
      paramMap: { get: () => 'fetch-products' },
      data: { categoryId: 'rxjs-api' }
    } as any;

    TestBed.configureTestingModule({
      providers: [ChallengesService]
    });

    const result = TestBed.runInInjectionContext(() =>
      challengeDetailsResolver(route, {} as any)
    );

    expect(result).toBeTruthy();
  });
});
```

---

## Summary

Route Resolvers provide a **clean, maintainable, and scalable** approach to data fetching in Angular applications. While they may seem like over-engineering for synchronous data, they:

1. ✅ **Future-proof** the architecture
2. ✅ **Simplify** components
3. ✅ **Centralize** data logic
4. ✅ **Improve** testability
5. ✅ **Follow** Angular best practices

When the application grows and needs to fetch data from APIs, **zero component changes** will be required—only resolver updates.
