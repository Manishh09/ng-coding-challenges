# Challenge 02: Dashboard with Parallel API Calls

## Solution Approach

This guide walks through the solution in **clear, logical steps**, explaining what to build, in what order, and how to wire everything together using **Angular + RxJS best practices**.

---

`Hint:` Use ForkJoin for this scenario to handle parallel api calls which are independent

## Steps Overview

1. Create Models (Interfaces)
2. Create a Service and add methods in it to Fetch API Data
3. Create the Dashboard Component
4. Create the Dashboard Template
5. Clear Up Subscriptions (Best Practice)

## Step 1: Create Models (Interfaces)

Define TypeScript interfaces for the expected API response types. This ensures **type safety** and clean code.

```ts
// models.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
}
```

---

## Step 2: Create a Service to Fetch API Data

**Purpose**: Encapsulate the logic to make **independent HTTP calls** using `forkJoin`.

```typescript
// Import necessary modules
import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private http = inject(HttpClient);

  getDashboardData() {
    // Use forkJoin to make parallel API calls
    return forkJoin({
      users: this.http.get<User[]>("USERS_API_ENDPOINT"),
      posts: this.http.get<Post[]>("POSTS_API_ENDPOINT"),
    });
  }
}
```

`Note:` All APIs are fired in parallel. Result is returned only when all calls complete successfully.

---

## Step 3: Create the Dashboard Component

```typescript
// Import necessary Angular modules and RxJS operators
import { Component, OnInit, inject } from "@angular/core";
import { finalize, tap } from "rxjs";

@Component({
  /*
  Component MetaData
  */
})
export class DashboardComponent implements OnInit {
  // Component properties
  // loading, error, data Properties

  // Inject Dashboard Service using inject function
  private dashboardService = inject(DashboardService);

  // ngOnInit lifecycle hook
  ngOnInit() {
    this.dashboardService
      .getDashboardData()
      .pipe(finalize(() => (
        // Handle loading state
      )))
      .subscribe({
        next: (data) => {
          // Handle successful response - limit to first 5 items
        },
        error: () => {
          // Handle error response
        },
      });
  }
}
```

`Note:` Component stays clean — only focuses on UI logic and state management.

---

## Step 4: Create the Dashboard Template

```html
<!-- dashboard.component.html -->

@if (loading) {
  <!-- Show Loading text / Loader -->
} @if (error) {
  <!-- Show error messages -->
 } @if (!loading && !error) {
<div>
  <h2>Users</h2>
  <ul>
    @for (user of users; track user.id) {
      <!-- User Data -->
    <li>{{ user.name }}</li>
    }
  </ul>

  <h2>Posts</h2>
  <ul>
    @for (post of posts; track post.id) {
      <!-- Posts Data -->
    <li>{{ post.title }}</li>
    }
  </ul>
</div>
}
```

`Note:` Data shown only when all calls complete successfully.

---

## Step 4: Clear Up Subscriptions (Best Practice)

### Why?

Even though `forkJoin()` completes after emitting once, it’s still a good practice to **clean up subscriptions**, especially when:

- You're using `subscribe()` manually
- You anticipate changes or reuse in logic

### Option 1: Use `takeUntilDestroyed()` (Angular v16+)

The modern, recommended approach using `DestroyRef`.

```ts
@Component({
  /*
  Metadata
  */
})
export class DashboardComponent {
  // Component Properties
  // loading, error, data Properties

  // prefer inject over constructor DI
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  loadData() {
     this.dashboardService
      .getDashboardData()
      .pipe(
        // ...other operators
        finalize(() => (
          // Handle loading state
        )),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => {
          // handle data
        },
        error: (err) => {
          // handle error
        },
      });
  }
}
```

### Option 2: Use Manual Subject + takeUntil() (Angular < v16)

Use this if you're working in Angular 15 or below.

```ts
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export class DashboardComponent implements OnInit, OnDestroy {
  // Component Properties

  // Subject to clear subscription
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.dashboardService
      .getDashboardData()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (
          // Handle loading state
        ))
      )
      .subscribe({
        next: (data) => {
          // Handle successful response
        },
        error: (err) => {
          // Handle error response
        },
      });
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Working Flow

1. User lands on DashboardComponent
2. Component triggers loadDashboardData() on init
3. Service makes 3 independent API calls using forkJoin()
4. Wait for all responses:
   - If success → update and display data
   - If error → show error message
5. Component manages loading/error UI with flags
