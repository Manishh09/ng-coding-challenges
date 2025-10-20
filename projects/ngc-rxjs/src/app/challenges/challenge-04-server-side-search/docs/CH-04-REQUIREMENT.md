# Challenge 04: Server-Side Search

## Description

Build an Angular search component that queries the server every time the user types, fetching only matching results from an API.

---


## Requirements

### APIs

Use a mock API that supports search query parameters, for example:  
- `https://dummyjson.com/users/search?q=<query>`  
- Or a custom mock API created with `json-server`

### Example Models

```ts
// user.model.ts
export interface User {
id: number;
firstName: string;
lastName: string;
email: string;
// Add additional fields as per API response
}
```

---

## Functional Requirements

1. **Server-Side Search**  
   - Fetch search results dynamically from the API as the user types.  
   - Each keystroke triggers a new query after debouncing.

2. **Reactive Search Input**  
   - Use Angular Reactive Forms (`FormControl`) to handle the search input in real time.  
   - No submit button; results should update automatically as the user types.

3. **API Call Optimization**  
   - Use RxJS operators:  
     - `debounceTime` to delay requests until typing pauses.  
     - `distinctUntilChanged` to avoid duplicate requests.  
     - `switchMap` to cancel the previous request if a new one is started.

4. **State Management**  
   - Show a loading indicator while API requests are underway.  
   - Gracefully handle and display error states if API calls fail.  
   - Display a “No results found” message if the query returns no matches.

5. **Use of Signals**  
   - Manage search results, loading, and error messages reactively using Angular `Signals`.

---

## UI / Template Requirements

- Create a search input bound to a Reactive Form `FormControl`.
- Show a loading spinner or indicator while waiting for API responses.
- Display filtered search results live as the user types.
- Show user-friendly messages for empty results or errors.
- Keep the UI clean, clear, and responsive.

---

## Architecture: Component & Service Layers

- **Service Layer**  
  - Implement a service (`SearchService`) to perform API calls based on search queries.  
  - Handle cancellation and errors inside the service.

- **Component Layer (`SearchComponent`)**  
  - Capture user input via Reactive Forms.  
  - Use RxJS operators `debounceTime`, `distinctUntilChanged`, and `switchMap` to manage API calls efficiently.  
  - Use Angular `Signals` or reactive properties to manage loading, results, and errors.  

---

## Constraints & Expectations

- Use Angular’s `HttpClient` for HTTP requests.  
- Cancel outdated requests on new input with `switchMap`.  
- Handle loading, empty, and error states clearly.  
- Use Reactive Forms (`FormControl`) for input control.  
- Use RxJS operators as specified for optimal performance.  
- Manage component state reactively using Angular `Signals` or similar.  
- Prevent memory leaks by proper subscription management.  
- Avoid external dependencies beyond Angular and RxJS.  
- Deliver a responsive, accessible, and user-friendly UI.

---

## Best Practices

- Use the `async` pipe or Angular `Signals` for handling observable or reactive state in templates.  
- Debounce and filter input to reduce unnecessary API calls.  
- Encapsulate all HTTP logic within services for separation of concerns.  
- Use `switchMap` to cancel prior requests when starting new ones.  
- Clean up subscriptions or rely on lifecycle-aware reactive patterns to prevent leaks.  
- Provide consistent and clear user feedback for loading, error, and no-results states.  
- Write clean, testable, and maintainable code following Angular style guidelines.

