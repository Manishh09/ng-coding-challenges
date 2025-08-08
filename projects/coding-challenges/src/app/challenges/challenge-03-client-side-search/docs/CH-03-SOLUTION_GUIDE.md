# Challenge 03 - Solution Approach for Client-Side User Search

## Overview

This guide provides a structured approach to implementing the Client-Side User Search challenge using Angular Reactive Forms and RxJS operators. The goal is to create a responsive search component that filters user data in real-time.

## Implementation Steps

`Step-1:` **Define User Model**:

- Create a `User` interface to define the structure of user data, including properties like `id`, `name`, and `email`.

```ts
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}
```

---

`Step-2:` **Create UserService**:

- Use Angular's `HttpClient` to fetch user data from the JSONPlaceholder API.
- Implement a method to return an observable of users.

```ts
@Injectable({ providedIn: "root" })
export class UserService {
  private apiUrl = "API_URL";

  // inject httpClient
  private http = inject(HttpClient);

  // method to retrieve user data
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
```

---

`Step-3:` **Implement ClientSideSearchComponent**:

- Create a component that uses the `UserService` to fetch and display user data.
- Implement a search form using Angular Reactive Forms.

```ts
@Component({
  /*Metadata*/
})
export class ClientSideSearchComponent {
  ngOnInit(): void {
    // Fetch users once
    this.userService
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((users) => {
        // Handle user data
        // Store
      });

    // Set up filtered stream
    this.filteredUsers$ = this.searchControl.valueChanges.pipe(
      startWith(""),
      debounceTime(300),
      distinctUntilChanged(),
      map((searchTerm) => this.getSearchedUsers(searchTerm as string))
    );
  }

  getSearchedUsers(searchTerm: string): User[] {
    const query = searchTerm.toLowerCase().trim();
    return this.users.filter(
      (user) => user.name.toLowerCase().includes(query)
      // ||
      // user.email.toLowerCase().includes(query)
      // ||
      // user.username.toLowerCase().includes(query)
    );
  }
}
```

---

`Step-4:` **Bind data** in template

```html
@if (filteredUsers$ | async; as filteredUsers) { @if (filteredUsers.length > 0) {
<div class="user-list">
  @for (user of filteredUsers; track user.id) {
  <mat-card class="user-card">
    <mat-card-title class="user-name">{{ user.name }}</mat-card-title>
    <!-- Can be displayed if needed -->
    <!-- <mat-card-content>
                <p>Email: {{ user.email }}</p>
                <p>Phone: {{ user.phone }}</p>
                <p>Website: {{ user.website }}</p>
              </mat-card-content> -->
  </mat-card>
  }
</div>
} @else {
<p class="no-results">No users found.</p>
}
```

## Working Flow

## Working Flow

1. **Component Initialization**

   - When the component initializes (`ngOnInit`), it triggers a call to the `UserService` to fetch the list of users from the API.
   - While the data is loading, a loading indicator is shown.

2. **Data Fetching**

   - The service makes an HTTP GET request to `https://jsonplaceholder.typicode.com/users`.
   - On success, the full user list is stored in the component (`users`), and also copied to `filteredUsers` to display initially.
   - On failure, an error message is displayed to the user.

3. **Reactive Search Input**

   - The search input is controlled by an Angular `FormControl` (`searchControl`).
   - As the user types, the input emits `valueChanges` events.

4. **Search Filtering with RxJS**

   - The `valueChanges` stream is piped through RxJS operators:
     - `debounceTime(300)` to wait 300ms after the last keystroke before processing
     - `distinctUntilChanged()` to ignore consecutive duplicate search terms
     - `map()` to normalize the search term (convert to lowercase)
   - After these operators, the component filters the `users` array client-side based on whether the user’s `name`, `username`, or `email` contains the search term.

5. **Updating the Display**

   - The filtered list of users (`filteredUsers`) is updated in real-time as the user types.
   - If no users match the search query, a friendly "No users found" message is displayed.

6. **Cleanup**
   - All subscriptions to observables (HTTP calls and `valueChanges`) are unsubscribed automatically on component destruction (`ngOnDestroy`) using a `Subject` and the `takeUntil` operator or using `takeUntilDestroyed`, preventing memory leaks.
