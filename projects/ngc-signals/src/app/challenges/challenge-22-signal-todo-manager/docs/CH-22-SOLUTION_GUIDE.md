# Solution: Jira-Style Task Board

## 🧠 Approach

Two independent source signals (`tasks` and `priorityFilter`) feed multiple `computed()` signals — three column views and one stats aggregate. All mutations go through `signal.update()` with immutable patterns.

**Signal dependency graph:**
```
tasks (signal<Task[]>) ─────────┐
                                ├─ todoTasks (computed)
priorityFilter (signal) ───────┤
                                ├─ inProgressTasks (computed)
                                ├─ doneTasks (computed)
                                │
tasks (signal<Task[]>) ────────── boardStats (computed)
```

## 🚀 Step-by-Step Implementation

### Step 1: Define the Task Model

```typescript
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
}
```

### Step 2: Source Signals

```typescript
tasks = signal<Task[]>([]);
priorityFilter = signal<PriorityFilter>('all');
```

Two independent signals — changing either one triggers the column computeds to re-evaluate.

### Step 3: Immutable CRUD Methods

```typescript
addTask(): void {
  this.tasks.update(tasks => [
    ...tasks,
    { id: this.nextId++, title, priority, status: 'todo' }
  ]);
}

deleteTask(id: number): void {
  this.tasks.update(tasks => tasks.filter(t => t.id !== id));
}

moveTask(id: number, newStatus: TaskStatus): void {
  this.tasks.update(tasks =>
    tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
  );
}
```

**Key pattern**: `update()` receives the current value and must return a **new** array/object. Never push, splice, or assign properties directly.

### Step 4: Multi-Signal Computed Columns

```typescript
private filterByStatusAndPriority(status: TaskStatus): Task[] {
  const filter = this.priorityFilter();
  return this.tasks().filter(t =>
    t.status === status && (filter === 'all' || t.priority === filter)
  );
}

todoTasks       = computed(() => this.filterByStatusAndPriority('todo'));
inProgressTasks = computed(() => this.filterByStatusAndPriority('in-progress'));
doneTasks       = computed(() => this.filterByStatusAndPriority('done'));
```

Each `computed` reads **both** `this.tasks()` and `this.priorityFilter()` inside `filterByStatusAndPriority` — Angular tracks both as dependencies.

### Step 5: Aggregate Stats

```typescript
boardStats = computed<BoardStats>(() => {
  const all = this.tasks();
  const total = all.length;
  const doneCount = all.filter(t => t.status === 'done').length;
  const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  return { total, todoCount, inProgressCount, doneCount, completionRate };
});
```

`boardStats` reads `this.tasks()` only — it ignores the filter to always show true sprint velocity.

### Step 6: Move UX with Expanded Card

```typescript
expandedTaskId = signal<number | null>(null);

toggleExpand(id: number): void {
  this.expandedTaskId.update(current => current === id ? null : id);
}
```

```html
<div class="card-top" (click)="toggleExpand(task.id)">...</div>
@if (expandedTaskId() === task.id) {
  <div class="card-actions">
    @for (target of getMoveTargets(task.status); track target.status) {
      <button (click)="moveTask(task.id, target.status)">
        Move to {{ target.label }}
      </button>
    }
  </div>
}
```

## 🌟 Key Takeaways

* **Two source signals, multiple derived views** — the core signal composition pattern for dashboards.
* **Immutable updates** with spread/map/filter ensure Angular detects changes correctly.
* **`computed()` auto-tracks all signals read inside it** — no manual dependency lists needed.
* **Stats computed ignores the filter** — a deliberate design choice to show true velocity.
* **`expandedTaskId` signal** manages UI state the same way as domain state — signals for everything.
