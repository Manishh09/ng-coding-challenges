# Challenge 07 - User & Posts Dashboard - Dependent APIs

---

## Task Description

You are building an **User & Posts Dashboard** for a blogging platform that needs to display users and their related posts in a single view.

For each user, identify which posts belong to them and combine this data. The final result should be displayed in a simple HTML table, showing each user along with the titles of their posts.

**APIs to Use:**
  Users: `https://dummyjson.com/users`
  Posts: `https://dummyjson.com/posts`

`Hint`: Handling dependent API calls

---

## Requirements

1. **Models**

   - Define models for `User` and `Post`.

2. **Services**

   - `UserService` → fetch users.
   - `PostService` → fetch posts for a user.
 
3. **Components**

---

**Technical Constraints:**

   - Standalone Angular 19 component.
   - Use `inject()` for DI.
   - Use Angular Material `mat-select` for filter options.
   - Apply **Signals** for managing filter state.
   - Use new template control flow (`@for`, `@if`).
   - Display results in a **simple HTML table**.
 

---

## Interview Tips

- Be ready to explain why `mergeMap` is suitable for dependent API calls.
- Discuss alternative operators (`concatMap`, `switchMap`) and tradeoffs.
- Highlight separation of concerns with facade service.
- Showcase Angular 19 features: Signals, new control flow, inject(), standalone components.
