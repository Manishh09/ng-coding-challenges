# 🧭 Solution Approach: Parallel API Calls in Angular using `forkJoin`

This guide walks through the solution in **clear, logical steps**, explaining what to build, in what order, and how to wire everything together using **Angular + RxJS best practices**.

---

## Steps
1. Create Models (Interfaces)
2. Create a Service and add methods in it to Fetch API Data
3. Create the Dashboard Component
4. Create the Dashboard Template
5. Clear Up Subscriptions (Best Practice)


## ✅ Step 1: Create Models (Interfaces)

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
___

## ✅ Step 2: Create a Service to Fetch API Data
###   ServiceName: DashboardService (dashboard.service.ts)
**Purpose**: Encapsulate the logic to make 3 **independent HTTP calls** using `forkJoin`.

```ts
@Injectable({...})
export class DashboardService{
    // inject http client

    getDashboardData() {
      return forkJoin({
        users: this.http.get<User[]>('.../users'),
        posts: this.http.get<Post[]>('.../posts'),
         
      });
    }
}
```
💡 All APIs are fired in parallel. Result is returned only when all 2 complete successfully.

---

## ✅ Step 3: Create the Dashboard Component

```ts
// Inject Dashboard Service
constructor(private dashboardService: DashboardService) {}

// ngOnInit lifecycle hook
ngOnInit() {
  this.loading = true;

  this.dashboardService.getDashboardData()
    .pipe(tap(() => this.loading = false))
    .subscribe({
      next: (data) => {
        this.users = data.users.slice(0, 5);
        this.posts = data.posts.slice(0, 5);
      },
      error: () => this.error = true
    });
}

```
💡 Component stays clean — only focuses on UI logic and state management.

---

## ✅ Step 4: Create the Dashboard Template

```html
<!-- dashboard.component.html -->

@if (loading) {
    <div>Loading...</div>
}

@if (error) {
    <div>Error loading dashboard data.</div>
}

@if (!loading && !error) {
    <div>
        <h2>Users</h2>
        <ul>
            @for (user of users; track user.id) {
                <li>{{ user.name }}</li>
            }
        </ul>

        <h2>Posts</h2>
        <ul>
            @for (post of posts; track post.id) {
                <li>{{ post.title }}</li>
            }
        </ul>
    </div>
}
```
💡 Data shown only when all calls complete successfully.

---

## ✅ Step 4: Clear Up Subscriptions (Best Practice)

### 💡 Why?
Even though `forkJoin()` completes after emitting once, it’s still a good practice to **clean up subscriptions**, especially when:
- You're using `subscribe()` manually
- You anticipate changes or reuse in logic
- You want to show interviewer-level professionalism



### ✅ Option 1: Use `takeUntilDestroyed()` (Angular v16+)

The modern, recommended approach using `DestroyRef`.

```ts
@Component({...})
export class DashboardComponent {
  loading = false;
  // prefer inject over constructor DI
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  loadData() {
    this.loading = true;
    this.dashboardService.getDashboardData().pipe(
      // ...other operators
      finalize(() => this.loading = false),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: data => {
        // handle data
      },
      error: err => {
        // handle error
      }
    });
  }
}

### ✅ Option 2: Use Manual Subject + takeUntil() (Angular < v16)
Use this if you're working in Angular 15 or below.

ts
Copy
Edit
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.dashboardService.getDashboardData()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({ ... });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

```

✅ Final Summary of Flow 
  1. User lands on DashboardComponent
  2. Component triggers loadDashboardData() on init
  3. Service makes 3 independent API calls using forkJoin()
  4. Wait for all responses:
     - If success → update and display data
     - If error → show error message
  5. Component manages loading/error UI with flags