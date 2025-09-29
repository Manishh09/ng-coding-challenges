# Challenge 06 - User Todos with Status Filter (JSONPlaceholder API)

### Challenge Name:
User Todos with Status Filter

### Description:
Build an Angular 19 component that fetches **todos** and **users** from JSONPlaceholder API, merges them using `combineLatest`, and displays a todo list enriched with user names. Add filtering capability based on todo completion status, and present the data in a Material table / a simple Table.

### Requirements:
- **Fetch APIs:**
  - `https://jsonplaceholder.typicode.com/todos`
  - `https://jsonplaceholder.typicode.com/users`

- **Data Handling:**
  - Create models for `User`, `Todo`, and `TodoWithUser`.
  - Use a **service** to fetch users and todos.
  - Use **RxJS `combineLatest([todos$, users$])`** to enrich todos with their corresponding user names.
  - Use **Signals API** (`signal`, `toObservable`, `toSignal`) for filter state management.

- **Filtering:**
  - Implement a filter for status: `all | completed | pending`.
  - Use `combineLatest([todosWithUser$, filter$])` to produce a filtered result.
  - Default filter: `all`.

- **Component:**
  - Standalone Angular 19 component with separate **TS, HTML, SCSS** files.
  - Use **inject()** for dependencies (no constructor injection).
  - Convert filtered todos observable into a **Signal** for template rendering.
  - Use Angular’s **new control flow syntax**:
    - `@for` to iterate todos.
    - `@if` to conditionally display “No data available” when filtered result is empty.

- **UI & Styling:**
  - Use **Angular Material** (`MatTable`, `MatSelect`, `MatToolbar`, etc.).
  - Display todos in a table with columns:
    - User
    - Task
    - Status (Completed / Pending with chip-like styling).
  

- **Expected Output:**
  - A Material card containing:
    - Toolbar with filter select (All, Completed, Pending).
    - A table of todos enriched with user names.
    - Proper status highlighting (green for completed, orange for pending).
    - Graceful empty state message.
