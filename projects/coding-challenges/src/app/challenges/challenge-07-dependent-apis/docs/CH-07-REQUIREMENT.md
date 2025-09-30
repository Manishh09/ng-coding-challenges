# Challenge 07: User & Posts Dashboard - Dependent APIs

## Description

Build a User & Posts Dashboard for a blogging platform using Angular 19. The dashboard should display a list of users alongside their posts in a single view. For each user, fetch their associated posts and combine these datasets so that each row in the table shows user details and the titles of their posts. Render the final data in a simple HTML table clearly showing the user-post relationship.


**Hint**:
- Dependent API calls

---

## Requirements

### APIs

- Fetch users from:  
  `https://dummyjson.com/users`

- Fetch posts from:  
  `https://dummyjson.com/posts`

- Fetch posts for a specific user from:  
  `https://dummyjson.com/posts/user/{userId}`  
  (e.g., `userId = 1`)


### Example Models

```ts
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  // Include additional necessary user fields
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  // Additional post fields as needed
}

export interface UserWithPosts extends User {
  posts: Post[];
}
```

---


### Functional Requirements

1. Define TypeScript models for `User` and `Post`.
2. Create a `UserService` to fetch all users.
3. Create a `PostService` to fetch posts for a given user.
4. Fetch users first, then for each user, fetch their posts (dependent API calls).
5. Combine user and post data so each user object includes their posts.
6. Display the combined results in a simple HTML table showing user info and post titles.

---

## UI / Template Requirements

- Build a standalone Angular 19 component with separate `.ts`, `.html`, and `.scss` files.
- Use Angular Material `MatSelect` to provide filter options (e.g., filter users by name or other criteria).
- Use Angular Signals to manage filter state.
- Use Angular’s new template control flow syntax (`@for` and `@if`) for rendering the list of users and posts.
- Render the combined user-post data in a basic HTML table for clarity and readability.
- Design the UI to be clean and user-friendly.

---

## Architecture: Component & Service Layers

- **Service Layer**  
  - `UserService` for retrieving users.  
  - `PostService` for retrieving posts by user ID.

- **Component Layer**  
  - Use dependency injection with Angular’s `inject()` function.  
  - Fetch users initially, then for each user, fetch posts using RxJS operators suitable for dependent calls (e.g., `mergeMap`).  
  - Manage filter state using Angular Signals.  
  - Bind the processed data to the template for rendering using Angular’s reactive and declarative patterns.

---

## Constraints & Expectations

- Use Angular’s `HttpClient` for all API calls.
- Use RxJS operator `mergeMap` to efficiently handle dependent API calls, avoiding nested subscriptions.
- Manage reactive state with Angular Signals.
- Follow Angular 19 best practices, including:
  - Standalone components by default.
  - Dependency injection with `inject()` function.
  - New template syntax such as `@for` and `@if`.
- Use Angular Material components (e.g., `MatSelect`) for UI elements like filters.
- Display combined data in a simple, accessible HTML table.
- Keep a clear separation of concerns between service and component layers.
- Ensure code is modular, clean, and maintainable.

---

## Best Practices

- Centralize all API calls and data management inside dedicated Angular services to promote reusability and maintainability.
- Create separate services for users, posts and a facade to manage both services
- Use RxJS `mergeMap` for dependent API calls to flatten nested observables and properly handle concurrency.
- Understand and consider alternatives like `concatMap` and `switchMap` to address specific use cases related to ordering and cancellation.
- Avoid manual subscription management by leveraging Angular Signals or the `async` pipe to handle reactive data streams declaratively.
- Utilize Angular's `inject()` function to simplify dependency injection in standalone components.
- Leverage Angular 19’s new template control flow directives (`@for`, `@if`) for cleaner and more intuitive templates.
- Use Angular Material components consistently for accessible and user-friendly UI.
- Write modular, readable, and maintainable code with well-defined responsibilities.


## Interview Tips

- Explain the reasoning behind choosing `mergeMap` for handling dependent API calls.
- Discuss alternative RxJS operators like `concatMap` and `switchMap` and their trade-offs.
- Emphasize separation of concerns—using facade services where applicable.
- Showcase understanding of Angular 19 features: Signals, new control flow directives, `inject()`, and standalone components.
