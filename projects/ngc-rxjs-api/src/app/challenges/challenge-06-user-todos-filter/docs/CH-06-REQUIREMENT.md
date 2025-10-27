# Challenge 06: User Todos with Status Filter

## Description

Build an Angular component that fetches **todos** and **users** from the JSONPlaceholder API, merges these datasets using RxJS `combineLatest`, and displays a todo list enriched with corresponding user names. Implement a status filter for todos and present the data in an Angular Material table or a simple table.

---

## Requirements

### APIs

- Fetch todos from:  
  `https://jsonplaceholder.typicode.com/todos`

- Fetch users from:  
  `https://jsonplaceholder.typicode.com/users`

### Example Models

```ts
export interface User {
  id: number;
  name: string;
  // Add additional fields if needed
}

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoWithUser extends Todo {
  userName: string;
}
```
---


### Functional Requirements

- Use a service to fetch users and todos via HTTP.
- Use RxJS `combineLatest([todos$, users$])` to create a combined, enriched stream of `TodoWithUser` objects mapping todos to their user's name.
- Manage filter state (`all`, `completed`, `pending`) using Angular Signals (`signal`, `toObservable`, `toSignal`).
- Use `combineLatest([todosWithUser$, filter$])` to create a filtered todos list based on selected status.
- Default filter state should be `all`.

---

## UI / Template Requirements

- Implement a standalone Angular 19 component with separate `.ts`, `.html`, and `.scss` files.
- Use Angular's `inject()` function for dependency injection instead of constructor injection.
- Convert filtered todos observable into a Signal for template binding.
- Use Angular’s latest template control flow syntax:
  - `@for` to iterate and render the todo list.
  - `@if` to conditionally render a “No data available” message when the filtered list is empty.
- Use Angular Material components for:
  - Toolbar with a status filter dropdown (`MatSelect`).
  - Table (`MatTable`) to display:
    - User Name
    - Todo Title
    - Completion Status, styled with chips (green for completed, orange for pending).
- Wrap the content inside a Material card (`MatCard`) for a polished UI.

---

## Architecture: Component & Service Layers

- **Service Layer**  
  - Create a service to fetch todos and users from APIs.  
  - Return observables for both resources.

- **Component Layer**  
  - Fetch data streams and combine them using `combineLatest`.  
  - Manage filter state with Signals.  
  - Bind the filtered todos Signal directly to the template.  
  - Use the `inject()` function for dependency injection.

---

## Constraints & Expectations

- Use Angular’s `HttpClient` module for API calls.
- Use RxJS `combineLatest` to merge users and todos.
- Manage component state reactively with Angular Signals.
- Use Angular Material for UI consistency and accessibility.
- Avoid manual subscription management; prefer reactive and declarative patterns.
- Follow Angular 19 and best practices in component design.
- Provide a responsive and user-friendly UI.
- Properly handle empty states and loading indicators if applicable.

---

## Best Practices

- Centralize API calls within Angular services for separation of concerns.
- Create services services for users, todos and a facade service to manage both services
- Use the latest Angular features like Signals and standalone components effectively.
- Optimize observable streams using RxJS operators and avoid redundant or unnecessary API calls.
- Ensure clean, readable, and maintainable code with clear separation between service and component logic.
 - Use Angular’s new control flow directives (`@for`, `@if`) for streamlined templates.

