# Challenge 02: Dashboard with Parallel API Calls

## Task
Build a `DashboardComponent` that loads and displays **independent datasets** using **parallel API calls** with RxJS's `forkJoin`.

---

## Objective

- Fetch data from multiple REST APIs **simultaneously on component initialization**.
- Handle **loading**, **success**, and **error** states for each dataset.
- Render all datasets only **after all API calls have completed**.
- Display partial data from each dataset as specified.
- Show error messages per failed API without blocking successful data from rendering.

---



## APIs to Use (JSONPlaceholder)

| Data Type | Endpoint |
|-----------|----------|
| Users     | `https://jsonplaceholder.typicode.com/users` |
| Posts     | `https://jsonplaceholder.typicode.com/posts` |
| Photos    | `https://jsonplaceholder.typicode.com/photos` |

---

## Requirements

- Fetch all APIs **in parallel** using `forkJoin()`
- Display a **loading indicator** while data is being fetched
- On success:
  - Show the **first 5 Users** (Name + Email)
  - Show the **first 5 Posts** (Post Title)
  - (Optional) Show **first 3 Photos** (Thumbnail + Title)
- On failure:
  - Show an **error message** for each failed API
  - Continue rendering successful data (The UI must wait for all API responses to be received before rendering the combined results)

---

`Hint:` Handle errors inside each API call stream so that forkJoin can emit combined results even if some calls fail

## Technical Constraints

- Use `HttpClient` for all API calls
- Use `forkJoin()` for parallel API execution
- Handle loading, success, and error states
- Maintain separation of concerns (service vs component)
- Use type-safe models (`User`, `Post`, `Photo`)
- No external libraries (except Angular & RxJS)
- Use `takeUntilDestroyed()` if manually subscribing

---

## Optional

- Use `async` pipe instead of manual `subscribe()`
- Use `takeUntilDestroyed()` if manually subscribing
- Simulate delay with `delay(1000)` for realism
- Break UI into child components (`UserListComponent`, `PostListComponent`, `PhotoListComponent`)
- Add loading skeletons for each widget

---



## Example Interface Models

```ts
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

---
