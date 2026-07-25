# Solution: Naukri — Job Search with Live Filters

## 🧠 Approach

**Use RxJS where it shines** (debounce + HTTP) and **Signals where they shine** (synchronous filters + template binding). The bridge is `toObservable()` and `toSignal()`.

```
searchKeyword (signal)
  → toObservable() → debounceTime → distinctUntilChanged → switchMap(HTTP)
  → startWith(null) → toSignal() → rawJobs (signal)
                                      ↓
                                   filteredJobs (computed) ← jobType, location, minSalary (signals)
                                      ↓
                                   jobStats (computed)
```

## 🚀 Step-by-Step Implementation

### Step 1: Search Signal → RxJS → Signal

```typescript
searchKeyword = signal('');

private rawJobs = toSignal<Job[] | null>(
  toObservable(this.searchKeyword).pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap(keyword => this.jobService.searchJobs(keyword)),
    startWith(null)
  ),
  { initialValue: null }
);
```

`toObservable()` subscribes to the signal and emits on every change. RxJS operators debounce and deduplicate. `switchMap` cancels in-flight requests. `startWith(null)` provides the loading sentinel. `toSignal()` brings it back.

### Step 2: Filter Signals

```typescript
jobType   = signal<string>('all');
location  = signal<string>('');
minSalary = signal<number>(0);
```

Plain signals — no RxJS needed. They change synchronously on user interaction.

### Step 3: Computed Filtered Results

```typescript
filteredJobs = computed(() => {
  const jobs = this.rawJobs();
  if (!jobs) return [];

  return jobs.filter(j =>
    (this.jobType() === 'all' || j.type === this.jobType()) &&
    (!this.location() || j.location.toLowerCase().includes(this.location().toLowerCase())) &&
    j.salary >= this.minSalary()
  );
});
```

This `computed` reads **four signals** — `rawJobs`, `jobType`, `location`, `minSalary`. It re-runs when any of them change.

### Step 4: Stats & Clear

```typescript
jobStats = computed(() => ({
  total: this.rawJobs()?.length ?? 0,
  filtered: this.filteredJobs().length
}));

clearFilters(): void {
  this.jobType.set('all');
  this.location.set('');
  this.minSalary.set(0);
}
```

### Step 5: Loading State

```typescript
isLoading = computed(() => this.rawJobs() === null);
```

```html
@if (isLoading()) {
  <!-- skeleton cards -->
} @else {
  @for (job of filteredJobs(); track job.id) { ... }
}
```

## 🌟 Key Takeaways

* **`toObservable()` is for pushing signals into RxJS** — use when you need time-based operators (debounce, throttle, delay).
* **`toSignal()` is for pulling Observables into signals** — use to avoid `async` pipe and enable `computed()`.
* **Client-side filters stay as plain signals** — no need to involve RxJS for synchronous filtering.
* **`startWith(null)` + `computed`** is the standard loading-state pattern with `toSignal()`.
* **`switchMap` cancels previous requests** — critical for search-as-you-type to avoid race conditions.
