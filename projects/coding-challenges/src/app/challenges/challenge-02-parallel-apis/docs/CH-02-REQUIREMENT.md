# 🚀 Challenge 02: Dashboard with Parallel API Calls

Build a `DashboardComponent` that loads and displays **independent datasets** using **parallel API calls** with RxJS's `forkJoin`.

---

## 🎯 Objective

Create a dashboard that fetches and displays data from multiple REST APIs **in parallel**, handling loading, success, and error states effectively.

---

## 📚 Use Case: Home Page Dashboard

When the dashboard loads, it should display:

- 👤 A list of **Users**
- 📝 A list of **Posts**
- 🖼️ (Optional) A set of **Photos**

Each dataset comes from a separate API and is **independent**, but should be **fetched in parallel** on component initialization.

---

## 🌐 APIs to Use (JSONPlaceholder)

| Data Type | Endpoint |
|-----------|----------|
| Users     | `https://jsonplaceholder.typicode.com/users` |
| Posts     | `https://jsonplaceholder.typicode.com/posts` |
| Photos    | `https://jsonplaceholder.typicode.com/photos` |

---

## ✅ Requirements

### On Component Initialization

- Fetch all APIs **in parallel** using `forkJoin()`
- Display a **loading indicator** while data is being fetched
- On success:
  - Show the **first 5 Users** (Name + Email)
  - Show the **first 5 Posts** (Post Title)
  - (Optional) Show **first 3 Photos** (Thumbnail + Title)
- On failure:
  - Show an **error message** per failed API
  - Continue rendering successful data (The UI must wait for all API responses to be received before rendering the combined results)

---

## 🧱 Technical Constraints

- Use `HttpClient` for all API calls
- Use `forkJoin()` for parallel API execution
- Handle loading, success, and error states
- Maintain separation of concerns (service vs component)
- Use type-safe models (`User`, `Post`, `Photo`)
- No external libraries (except Angular & RxJS)

---

## ✨ Optional

- Use `async` pipe instead of manual `subscribe()`
- Use `takeUntilDestroyed()` if manually subscribing
- Simulate delay with `delay(1000)` for realism
- Break UI into child components (`UserListComponent`, `PostListComponent`)
- Add loading skeletons for each widget

---

## 🧾 Example Interface Models

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
