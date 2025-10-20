# Challenge 02: Dashboard with Parallel API Calls

## Description

Build a `DashboardComponent` in Angular that fetches and displays data from multiple APIs.

---

## Requirements

### APIs

| Data Type | Endpoint                                      |
| --------- | --------------------------------------------- |
| Users     | `https://jsonplaceholder.typicode.com/users`  |
| Posts     | `https://jsonplaceholder.typicode.com/posts`  |
| Photos    | `https://jsonplaceholder.typicode.com/photos` |

**Hint:**

- Use `forkJoin`
- Handle errors inside each API call stream so that forkJoin can emit combined results even if some calls fail

---

### Example Models

```typescript
// user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

// post.model.ts
export interface Post {
  id: number;
  title: string;
}

// photo.model.ts
export interface Photo {
  id: number;
  thumbnailUrl: string;
  title: string;
}
```

### UI Requirements

- Display a **loading indicator** while any API requests are in progress.
- After all API calls complete, render the data as follows:
  - Show the **first 5 Users** with their **Name** and **Email** in a list or table.
  - Show the **first 5 Posts** with their **Title**.
  - (Optional) Show the **first 3 Photos** with their **Thumbnail image** and **Title**.
- For any API call that fails, display a clear, contextual **error message** adjacent to or above the corresponding dataset section.
- Ensure the UI waits for all API responses before rendering combined results, but partial data from successful calls should be shown even if some calls fail.
- Keep the layout clean and simple, prioritizing clarity and usability over styling complexity.
- If splitting into child components, each should handle its own display logic including loading and error states.

---

## Architecture

- **Service Layer**

  - Implement a dedicated Angular service (e.g., `DashboardService`) responsible for all API interactions.
  - The service should provide methods to fetch users, posts, and photos.
  - Handle API error management within the service to return structured results or error notifications to the component.

- **Component Layer (`DashboardComponent`)**
  - Initiate parallel API calls using RxJS `forkJoin()` inside `ngOnInit()`.
  - Manage combined results (including partial successes and failures) within the component.
  - Maintain state representing loading, success, and error conditions to drive the UI.

---

## Constraints & Expectations

- Use `HttpClient` for all API calls
- Use `forkJoin()` for parallel API execution
- Handle loading, success, and error states
- Maintain separation of concerns (service vs component)
- Use type-safe models (`User`, `Post`, `Photo`)
- No external libraries (except Angular & RxJS)
- Use `takeUntilDestroyed()` if manually subscribing

---

## Best Practices

- Use `async` pipe instead of manual `subscribe()`
- Use `takeUntilDestroyed()` if manually subscribing
- Simulate delay with `delay(1000)` for realism
- Break UI into child components (`UserListComponent`, `PostListComponent`, `PhotoListComponent`)
- Add loading skeletons
