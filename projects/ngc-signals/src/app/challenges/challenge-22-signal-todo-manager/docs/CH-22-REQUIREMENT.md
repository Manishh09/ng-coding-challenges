# Challenge 22: Jira-Style Task Board

**Estimated Time:** 30-45 minutes  
**Difficulty:** Intermediate

## 1. Challenge 🎯

**Scenario:**  
You've joined a startup as the sole frontend developer. The product manager wants a Jira-style task board with signal-driven columns, live stats, and priority filtering — to be built in one sprint.

**Task:**  
Build a three-column Kanban board (Todo → In Progress → Done) with task creation, status transitions, priority tags, and a live velocity bar. Manage all state with `signal<Task[]>`, derive each column with `computed()`, and wire up a priority filter signal that combines with the task list.

## 2. Requirements 📋

* [ ] **Task CRUD**: Create `signal<Task[]>` with `Task` interface `{ id, title, priority: 'low'|'medium'|'high', status: 'todo'|'in-progress'|'done' }` — implement `addTask`, `deleteTask`, and `moveTask(id, newStatus)` using immutable `update()` patterns.
* [ ] **Filtered Columns**: Add `signal<'all'|'low'|'medium'|'high'>` for priority filter — create three `computed()` signals (`todoTasks`, `inProgressTasks`, `doneTasks`) each filtering by both status and priority — all three must react when either signal changes.
* [ ] **Board Stats**: Build a `computed boardStats()` returning `{ total, todoCount, inProgressCount, doneCount, completionRate }` — display as a live progress bar above the board showing sprint velocity.
* [ ] **Move UX**: Clicking a task card shows "Move To" buttons for the other two columns — each triggers `moveTask()` which updates the signal and reactively re-renders only the affected columns.

## 3. Expected Output 🖼️

| User Action | Result |
|-------------|--------|
| Type title + click "Add" | Task appears in Todo column |
| Click task → "Move to In Progress" | Task moves to In Progress column |
| Click task → "Move to Done" | Task moves to Done column, velocity bar updates |
| Select "High" filter | Only high-priority tasks visible in all columns |
| Select "All" filter | All tasks visible again |
| Click "Delete" | Task removed, stats update |

**Visual Feedback:**

* **Velocity Bar**: Gradient progress bar showing completion rate.
* **Column Counts**: Badge in each column header showing filtered task count.
* **Priority Badges**: Color-coded labels on each task card.
* **Border Accent**: Left border color on cards matches priority.

## 4. Edge Cases / Constraints ⚠️

* **Immutable Updates**: Never mutate the array or task objects directly — always use spread in `update()`.
* **Empty States**: Show "No tasks" placeholder when a column is empty (including after filtering).
* **Filter + Stats**: `boardStats` counts ALL tasks regardless of filter; columns show filtered tasks.
* **Unique IDs**: Use an auto-incrementing counter for task IDs.
* **Empty Title**: Disable "Add" button when title input is empty.

## 5. Success Criteria ✅

* [ ] `signal<Task[]>` is the single source of truth for all tasks.
* [ ] `signal<PriorityFilter>` is a separate, independent signal for the filter.
* [ ] Three `computed()` column signals derive from both `tasks` and `priorityFilter`.
* [ ] `boardStats` computed derives `total`, counts per status, and `completionRate`.
* [ ] `addTask`, `deleteTask`, `moveTask` all use immutable `update()` patterns.
* [ ] Clicking a card reveals move actions; clicking a move button transitions the task.
* [ ] Velocity progress bar updates reactively.
* [ ] No RxJS — only signal primitives are used.

### Key Concepts

| Concept | Example |
|---------|---------|
| Immutable array update | `tasks.update(t => [...t, newTask])` |
| Immutable object update | `tasks.update(t => t.map(x => x.id === id ? {...x, status} : x))` |
| Multi-signal computed | `computed(() => tasks().filter(t => t.status === s && filter() matches))` |
| Aggregate computed | `computed(() => ({ total: tasks().length, doneCount: ... }))` |
