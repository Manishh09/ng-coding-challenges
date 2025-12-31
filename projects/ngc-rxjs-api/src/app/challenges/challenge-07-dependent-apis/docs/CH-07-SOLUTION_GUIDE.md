# Solution: Dependent APIs

## 🧠 Approach
We have a classic "Waterfall" problem: We need Data A (Users) before we can get Data B (Posts).
1.  **Service**: Users API & Posts API.
2.  **Component**:
    *   Get Users.
    *   `.pipe(mergeMap(users => ...))` to switch to the next phase.
    *   Inside the mergeMap, create an array of Observables (one for each user) and run them with `forkJoin`.

## 🚀 Step-by-Step Implementation

### Step 1: Define the Interfaces
```typescript
interface User { id: number; firstName: string; }
interface Post { id: number; title: string; }
interface DashboardRow extends User { posts: Post[]; }
```

### Step 2: Create the Services
```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  getUsers() { return this.http.get<{users: User[]}>('https://dummyjson.com/users').pipe(map(r => r.users)); }
  getPostsForUser(id: number) { return this.http.get<{posts: Post[]}>(`https://dummyjson.com/posts/user/${id}`).pipe(map(r => r.posts)); }
}
```

### Step 3: Implement the Component (The Merge Logic)
This is a pattern worth memorizing: `Get List` -> `mergeMap` -> `forkJoin(List.map(Get Details))`.

```typescript
@Component({ ... })
export class DashboardComponent {
  private api = inject(ApiService);

  data$ = this.api.getUsers().pipe(
    // 1. We have the array of users. Now we need to fetch posts for EACH of them.
    mergeMap(users => {
      // 2. Create an array of HTTP calls
      const requests = users.map(user =>
        this.api.getPostsForUser(user.id).pipe(
          // 3. Map the result to include the user info (Join in memory)
          map(posts => ({ ...user, posts })),
          // 4. Catch errors for individual requests so one failure doesn't kill the whole page
          catchError(() => of({ ...user, posts: [] }))
        )
      );
      // 5. Fire them all in parallel
      return forkJoin(requests);
    })
  );
}
```

### Step 4: The Template
```html
@if (data$ | async; as rows) {
  <table>
    <tr><th>User</th><th>Posts</th></tr>
    @for (row of rows; track row.id) {
      <tr>
        <td>{{ row.firstName }}</td>
        <td>{{ row.posts.length }} posts ({{ row.posts[0]?.title ?? 'None' }})</td>
      </tr>
    }
  </table>
} @else {
  <p>Loading Dashboard...</p>
}
```

## 🌟 Best Practices Used
*   **mergeMap**: Flattens the "Outer Observable" (Users) into the "Inner Observable" (ForkJoin of Posts).
*   **forkJoin**: Used when you have a specific list of tasks to finish before continuing.
*   **Inner Error Handling**: The `catchError` inside the loop ensures that if User #5 has a broken API value, Users #1-#4 and #6-#10 still show up.
