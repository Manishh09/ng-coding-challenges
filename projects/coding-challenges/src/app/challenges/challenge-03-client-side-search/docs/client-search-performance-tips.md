## Why Use `debounceTime` and `distinctUntilChanged` in Client-Side Search?

Even though client-side search filters data already loaded in memory, it’s still a good idea to use these RxJS operators for **better performance** and **user experience**.

---

### Why `switchMap` is used

- `switchMap` is used to switch to a new observable whenever the search term changes.
- This is useful for:
  - Ensuring proper sequencing: load → then search.
  - Canceling previous search requests if the user is typing quickly.
  - Ensuring that only the latest search result is considered.
- Example: If a user types "John", then quickly types "Doe", only the search for "Doe" will be processed.
- Without `switchMap`, you might end up with multiple filter operations running simultaneously, leading to inconsistent results.

---

### `debounceTime`

- **What it does**: Delays the emission of search terms until the user stops typing for a set period (e.g., 300ms).
- **Why it’s useful**:
  - Prevents running the filter function for **every keystroke**.
  - Improves UX by making the search feel smoother.
  - Example: Typing `"John"` without debounce → 4 filter runs; with `debounceTime(300)` → 1 filter run after the pause.

---

### `distinctUntilChanged`

- **What it does**: Only emits when the current search term is different from the last one.
- **Why it’s useful**:
  - Avoids redundant filtering when the search term hasn’t actually changed.
  - Prevents unnecessary UI updates when:
    - User types and deletes characters rapidly.
    - Same text is pasted multiple times.

---

### When You Should Include Them

- When dataset size is moderate or large.
- When live filtering could cause performance issues.
- When aiming to teach **production-grade RxJS patterns**.

---

### When You Might Skip Them

- Very small datasets (e.g., under 10–20 items).
- Filtering is triggered by **explicit actions** (like a Search button).
- Performance impact is negligible.

---

### What is the use of `startWith` operator here

- `startWith('')` emits an empty search term immediately, triggering the `filterUsers('')` call.
- Use `startWith()` when:

  - You want a default emission to kick off UI rendering.

  - You need an initial filter state before user interaction.

- Avoid `startWith()` if:

- The default emission would cause heavy/expensive operations (e.g., loading a huge dataset) — in that case, prefer lazy loading.
