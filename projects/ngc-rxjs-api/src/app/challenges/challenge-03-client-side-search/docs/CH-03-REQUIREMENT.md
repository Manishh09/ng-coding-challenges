# Challenge 03: Client-Side User Search

## Description

Create an Angular component that enables users to perform **real-time search** over a list of users fetched from a fake API.

---

## Requirements

### APIs

- Fetch user data from the following API endpoint on component initialization:  
  `GET https://jsonplaceholder.typicode.com/users`

- Define a `User` TypeScript interface to strongly type the fetched data structure.

- **Example Model**

  ```ts
  export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
  }
  ```

---

## Functional Requirements

### User List Fetching

- Fetch the full list of users on component initialization.
- Display a loading indicator while fetching data.
- If fetching fails, show an appropriate error message.

### Real-Time Search Input

- Implement a search input using Angular Reactive Forms `FormControl`.
- Filtering should be reactive and update results in real time as the user types (no submit button).
- Use RxJS operators such as `debounceTime`, `distinctUntilChanged` and `map`/`filter` to optimize search.

### Filtering Behavior

- Filter the users client-side based on matching the search query against any of:
  - `name`
  - `username`
  - `email`

### Search Results Display

- Display a list of filtered users showing at minimum:
  - Full Name
  - (Optional) Username and Email
- If no matches are found, show a “No users found” message.

### Cleanup & Memory Management

- Properly handle subscription cleanup on component destroy using techniques like:
  - `takeUntil`
  - `takeUntilDestroyed`
  - Proper `Subscription` management

---

## Architecture

- **Service Layer**

  - Create a service (e.g., `UserService`) responsible for fetching users via HTTP.

- **Component Layer:**

  - Create a dedicated component (e.g., `UserSearchComponent`) for encapsulating UI and search logic.


---

## UI  Requirements

- Show a search input box bound to a Reactive Form `FormControl`.
- Display a loading spinner or indicator while fetching users.
- Dynamically show filtered results as the user types.
- Show meaningful messages for no results or errors.
- Keep UI clean, responsive, and user-friendly.

---
## Constraints & Expectations

- Use Angular’s `HttpClient` for all HTTP requests.
- Manage loading, error, and empty states effectively.
- Use Reactive Forms (`FormControl`) for the search input.
- Apply RxJS operators like `debounceTime`, `distinctUntilChanged` to optimize real-time search.
- Perform all filtering on the client using the fetched user list.
- Show a loading indicator while fetching data.
- Display user-friendly error messages if HTTP requests fail.
- Properly clean up all RxJS subscriptions on component destroy (e.g., using `takeUntil` or `takeUntilDestroyed`).
- Ensure the UI is responsive and handles empty states gracefully (e.g., show “No users found”).


---

## Best Practices

- Prefer using the `async` pipe in templates instead of manual subscription management where possible.
- Use RxJS operators such as `debounceTime` and `distinctUntilChanged` to optimize input streams and reduce unnecessary processing.
- Unsubscribe from observables on component destruction to prevent memory leaks.
- Encapsulate HTTP calls in services to maintain separation of concerns.
- Keep components focused on presentation and interaction logic.
- Provide clear user feedback during loading, error, and empty states.
- Modularize UI components if the scope grows, for better maintainability and testability.
- Write clean, readable, and maintainable TypeScript and template code.

---
