# Challenge 04 - Server-Side Search Solution Guide

## Overview

This solution guide provides an overview of the implementation for the server-side search feature in the Angular application. The goal is to create a responsive search interface that fetches user data from a server based on the user's input.

___

## Implementation Steps

`Step-1:` Create Models

Create a user model to define the structure of user data.

```typescript
// user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
}
```
___

`Step-2:` Create Service

Create a service to handle API requests for searching users.

```typescript
// user-search.service.ts
@Injectable({ providedIn: "root" })
export class UserSearchService {
  searchUsers(query: string) {
    // HTTP GET: https://dummyjson.com/users/search?q=<query>
    // handle errors
    // return observable of user list
  }
}
```
___

`Step-3:` Create Component
Create a component that uses Angular Reactive Forms to handle user input and display search results.

```typescript
// server-side-search.component.ts
@Component({
  /*Metadata*/
})
export class ServerSideSearchComponent {
  searchControl = new FormControl("");
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal("");
  hasSearched = signal(false);

  // inject service
  private userSearchService = inject(UserSearchService);

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          return this.userSearchService.searchUsers(query);
        }),
        takeUntilDestroyed(this.destroyRef) // Ensure to unsubscribe on component destroy
      )
      .subscribe({
        next: (users) => {},
        error: (error) => {},
      });
  }
}
```
___

`Step-4:` Create Template

```html
<!-- server-side-search.component.html -->
<div>
  <input [formControl]="searchControl" placeholder="Search users..." />
</div>
@if (loading()) {
<p class="loading">Loading...</p>

} @if (error()) {
<p class="error">{{ error() }}</p>
}

<ul>
  @for (user of users(); track user.id) {
  <li>{{ user.firstName }} {{ user.lastName }}</li>
  }
</ul>
```
___

## Working Flow

1. **User navigates** to the search component.
2. **User types** in the search input.
3. The input is processed with `debounceTime` to wait for the user to stop typing.
4. The `distinctUntilChanged` operator ensures that only new queries trigger an API call.
5. The `switchMap` operator cancels any previous API calls if a new query is received.
6. The results are processed and displayed in the UI.
7. The user can refine their search by modifying the input, which triggers the above flow again.