# Solution: Parallel API Calls

## 🧠 Approach
We need to wait for *three* independent requests to finish before showing the dashboard.
1.  **Service**: Use RxJS `forkJoin` to trigger all requests in parallel and join their results into a single object.
2.  **Component**: Call the service and expose the data as an `Observable`.
3.  **Template**: Use `@if` and `async` pipe to handle the loading and data states.

## 🚀 Step-by-Step Implementation

### Step 1: Define the Interfaces
Always start with types to ensure we know what data we are handling.

```typescript
export interface User { id: number; name: string; email: string; }
export interface Post { id: number; title: string; }
export interface Photo { id: number; title: string; thumbnailUrl: string; }

// Combine them for the View Model
export interface DashboardData {
  users: User[];
  posts: Post[];
  photos: Photo[];
}
```

### Step 2: Create the Service
We use `forkJoin` to execute multiple Observables in parallel. It waits for all of them to complete, then emits a single object containing all the results.

```typescript
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);

  getDashboardData(): Observable<DashboardData> {
    return forkJoin({
      users: this.http.get<User[]>('https://jsonplaceholder.typicode.com/users'),
      posts: this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts'),
      photos: this.http.get<Photo[]>('https://jsonplaceholder.typicode.com/photos')
    });
  }
}
```

### Step 3: Implement the Component
We treat the entire dashboard state as a single stream. `catchError` is vital here because `forkJoin` fails if *any* request fails.

```typescript
@Component({ ... })
export class DashboardComponent {
  private dashboardService = inject(DashboardService);

  // The single stream for our template
  data$ = this.dashboardService.getDashboardData().pipe(
    catchError(err => {
      this.error = 'Failed to load dashboard data.';
      return of(null); // Return null to stop the loading spinner
    })
  );

  error = '';
}
```

### Step 4: The Template
We use the `async` pipe to subscribe. Since `data$` is `null` initially (before response), we show a loading spinner.

```html
<div class="dashboard">
  <!-- Error State -->
  @if (error) {
    <div class="alert error">{{ error }}</div>
  }

  <!-- Data State -->
  @if (data$ | async; as data) {
    <section>
      <h2>Users</h2>
      <!-- Limit to 5 for brevity -->
      @for (user of data.users.slice(0,5); track user.id) {
        <div class="card">{{ user.name }}</div>
      }
    </section>

    <section>
      <h2>Posts</h2>
      @for (post of data.posts.slice(0,5); track post.id) {
        <div class="card">{{ post.title }}</div>
      }
    </section>
  } @else if (!error) {
    <!-- Loading State (if no error and no data yet) -->
    <div class="loader">Loading Dashboard...</div>
  }
</div>
```

## 🌟 Best Practices Used
*   **Parallel Execution**: `forkJoin` is much faster than chaining requests one by one.
*   **Single Source of Truth**: The template listens to one `data$` stream.
*   **Error Safety**: `catchError` ensures the app doesn't crash if an API is down.
*   **Memory Management**: `takeUntilDestroyed` is used to prevent memory leaks.
