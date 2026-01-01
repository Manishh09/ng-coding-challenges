# Solution: Join & Filter

## 🧠 Approach
We have 3 moving parts: `Todos`, `Users`, and `Filter Selection`.
We need a stream that emits whenever *any* of these change.
1.  **Service**: Fetches Todos and Users.
2.  **Component**:
    *   Signal/Subject for Filter.
    *   `combineLatest([todos$, users$, filter$])` -> Calculated View Model.

## 🚀 Step-by-Step Implementation

### Step 1: Define the Interfaces
```typescript
interface Todo { userId: number; title: string; completed: boolean; }
interface User { id: number; name: string; }
interface TodoView { title: string; userName: string; completed: boolean; }
```

### Step 2: Create the Service
```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  getTodos() { return this.http.get<Todo[]>('url/todos'); }
  getUsers() { return this.http.get<User[]>('url/users'); }
}
```

### Step 3: Implement the Component (The Logic)
This is the "RxJS Muscle" of the challenge.

```typescript
@Component({ ... })
export class TodoFilterComponent {
  private service = inject(DataService);
  filterControl = new FormControl('all'); // source of filter$

  // 1. Data Streams
  todos$ = this.service.getTodos();
  users$ = this.service.getUsers();
  filter$ = this.filterControl.valueChanges.pipe(startWith('all'));

  // 2. The Calculation (Join + Filter)
  vm$ = combineLatest([this.todos$, this.users$, this.filter$]).pipe(
    map(([todos, users, filter]) => {
      // Join
      const joined = todos.map(t => ({
        ...t,
        userName: users.find(u => u.id === t.userId)?.name || 'Unknown'
      }));

      // Filter
      if (filter === 'completed') return joined.filter(t => t.completed);
      if (filter === 'pending') return joined.filter(t => !t.completed);
      return joined;
    })
  );
}
```

### Step 4: The Template
Just display the `vm$` (View Model) stream.
```html
<select [formControl]="filterControl">
  <option value="all">All</option>
  <option value="completed">Completed</option>
  <option value="pending">Pending</option>
</select>

@if (vm$ | async; as todos) {
  <table>
    @for (t of todos; track t.title) {
      <tr>
        <td>{{ t.userName }}</td>
        <td>{{ t.title }}</td>
        <td>{{ t.completed ? '✅' : '⏳' }}</td>
      </tr>
    }
  </table>
}
```

## 🌟 Best Practices Used
*   **combineLatest**: The perfect tool for "Re-calculate everything when any input changes".
*   **Two services are used to fetch the data for Todos and Users to maintain the separation of concerns**.
*   **Facade pattern is used to handle the data fetching from the services**.
*   **Derived State**: We don't store "Filtered Todos" in a variable. It is calculated on-the-fly.
*   **Single Async Pipe**: One subscription manages the entire view.
