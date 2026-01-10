# Solution: Server-Side Search

## 🧠 Approach
We need to coordinate the User Input stream with the API Response stream.
1.  **Service**: Exposes a method `search(query)`.
2.  **Component**:
    *   Listens to input changes.
    *   Waits (`debounceTime`).
    *   Switches to the new API call (`switchMap`), cancelling any previous ones.
3.  **Template**: Displays the result of this pipeline.

## 🚀 Step-by-Step Implementation

### Step 1: Define the Interface
```typescript
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
```

### Step 2: Create the Service
```typescript
@Injectable({ providedIn: 'root' })
export class SearchService {
  private http = inject(HttpClient);
  // Returns { users: [...] } so we map to get the array
  search(q: string): Observable<User[]> {
    return this.http.get<any>(`https://dummyjson.com/users/search?q=${q}`).pipe(
      map(res => res.users)
    );
  }
}
```

### Step 3: Implement the Component
This is the core logic. We define a stream `results$` that reacts to `searchControl`.

```typescript
@Component({ ... })
export class ServerSearchComponent {
  private service = inject(SearchService);
  searchControl = new FormControl('');

  results$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => {
      // If empty, return empty array immediately
      if (!term.trim()) return of([]);

      // Start the search
      return this.service.search(term).pipe(
        catchError(() => of([])) // Handle error per request
      );
    })
  );
}
```

### Step 4: The Template
Simple async pipe usage. Note: Adding a loading indicator in the pure Observable pattern requires a bit more setup (e.g., using a separate `loading` signal or wrapping the data state), but for this challenge, getting the data flow right is priority #1.

```html
<input [formControl]="searchControl" placeholder="Search..." />

@if (results$ | async; as users) {
  <ul>
    @for (u of users; track u.id) {
      <li>{{ u.firstName }} {{ u.lastName }}</li>
    }
  </ul>
}
```

## 🌟 Best Practices Used
*   **switchMap**: The most critical operator here. It unsubscribes from the previous inner Observable (the old API call) when a new value arrives. This prevents race conditions.
*   **Deboucing**: Reducing server load.
*   **Defensive Coding**: Handling empty strings and errors inside the pipeline.
