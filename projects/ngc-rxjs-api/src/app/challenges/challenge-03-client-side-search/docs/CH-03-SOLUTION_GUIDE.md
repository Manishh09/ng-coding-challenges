# Solution: Client-Side Search

## 🧠 Approach
Since the dataset is small, we can fetch *all* users once and filter them in memory.
1.  **Service**: Fetch the list of users (`getUsers()`).
2.  **Component**:
    *   Create a `FormControl` for the input.
    *   Use `startWith` to emit the initial value.
    *   Use `debounceTime` to wait for 300ms of delay.
    *   Use `distinctUntilChanged` to only emit if value changes.
    *   Use `map` to filter the users based on the search term.
    *   Use `takeUntilDestroyed` to unsubscribe on destroy.
    *  Subscribe to users once, store them, and filter based on `valueChanges`. (We will show the Stream approach as it's more "RxJS-native").

## 🚀 Step-by-Step Implementation

### Step 1: Define the Interface
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}
```

### Step 2: Create the Service
Standard HTTP get call.
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }
}
```

### Step 3: Implement the Component
We need two streams: one for the Data, one for the Search Term. We combine them to produce the Result.

```typescript
@Component({ ... })
export class SearchComponent {
  private userService = inject(UserService);

  searchControl = new FormControl('');

  // Stream 1: Users (fetched once)
  this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(searchTerm => this.getSearchedUsers(searchTerm as string)),
      takeUntilDestroyed(this.destroyRef) // Unsubscribe on destroy
  );

  getSearchedUsers(searchTerm: string): User[] {
    if (!searchTerm.trim()) {
      return this.users;
    }
    const query = searchTerm.toLowerCase().trim();
    return this.users.filter(user =>
      user.name.toLowerCase().includes(query)
    );
  }
}
```

### Step 4: The Template
Bind the input and display the filtered results.

```html
<!-- Search Input -->
<input [formControl]="searchControl" placeholder="Search users by name or email..." />

<!-- Results -->
@if (filteredUsers$ | async; as users) {
  @if (users.length > 0) {
    <div class="user-grid">
      @for (user of users; track user.id) {
        <div class="card">
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
      }
    </div>
  } @else {
    <p>No users found.</p>
  }
}
```

## 🌟 Best Practices Used
*   **Reactive Forms**: Easy integration with RxJS operators (`valueChanges`).
*   **Optimization**: `debounceTime` prevents filtering on every single character, saving CPU/battery.
*   **Declarative Code**: We didn't manually subscribe. `combineLatest` handles the "when either changes, update the result" logic automatically.
