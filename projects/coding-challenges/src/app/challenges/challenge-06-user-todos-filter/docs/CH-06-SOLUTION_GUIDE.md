# Solution Guide – Challenge 5: User Todos with Status Filter

## Challenge Overview

Build an Angular 19 component that fetches todos and users from JSONPlaceholder, merges them using **RxJS `combineLatest`**, and displays a table enriched with user names. Implement a status filter (All / Completed / Pending).

---

## Step 1: Define Models

Create TypeScript interfaces to type API responses.

```ts
interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface TodoWithUser extends Todo {
  userName: string;
}
```

---

## Step 2: Create API Services

Create separate services for todos and users.

```ts
class TodoService {
  getTodos() => HttpClient.get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
}

class UserService {
  getUsers() => HttpClient.get<User[]>('https://jsonplaceholder.typicode.com/users')
}
```

---

## Step 3: Create a Facade Service

Use a facade to merge todos and users with `combineLatest`. Manage filter state with a Signal.

```ts
class UserTodoFacadeService {
  filterStatus = signal<"all" | "completed" | "pending">("all");

  todosWithUsers$ = combineLatest([todoService.getTodos(), userService.getUsers()]).pipe(
    map(([todos, users]) =>
      todos.map((todo) => ({
        ...todo,
        userName: users.find((u) => u.id === todo.userId)?.name,
      }))
    )
  );
}
```

---

## Step 4: Create Standalone Component

Inject the facade using `inject()`. Expose streams and handle filter changes.

```ts
class UserTodosComponent {
  facade = inject(UserTodoFacadeService);
  todosWithUsers$ = facade.todosWithUsers$;
  filterStatus = facade.filterStatus;

  onFilterChange(status: "all" | "completed" | "pending") {
    filterStatus.set(status);
  }
}
```

---

## Key Angular Features Demonstrated

- **RxJS `combineLatest`** → merge todos + users streams.
- **Facade Pattern** → encapsulates data fetching & merging logic.
- **Signals API** → reactive filter state.
- **Standalone Components & `inject()`** → modern Angular DI.
- **New template control flow (`@for`, `@if`)** → template-level filtering (for interview discussion).
- Advanced filtering for production ready apps (Better to demonstrate in interview as well).


---

## Interview Tips

- Highlight the **facade pattern** for separating concerns.
- Explain why filtering is kept in the **template** to showcase Angular 19 control flow.
- Discuss how **combineLatest** works to merge multiple API streams reactively.
- Usage of `shareReplay` in services to cache API responses and optimize performance (can be discussed in interview).
- Emphasize **Signals** for reactive state management.
