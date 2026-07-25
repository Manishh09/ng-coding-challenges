# Challenge 24: Naukri — Job Search with Live Filters

**Estimated Time:** 30-45 minutes  
**Difficulty:** Intermediate

## 1. Challenge 🎯

**Scenario:**  
You're a frontend developer at Naukri. Build a job search page with debounced keyword search (RxJS) and live client-side filters (Signals) — bridging both worlds.

**Task:**  
Use `toObservable()` to pipe a search signal through RxJS operators for debouncing and API calls, then `toSignal()` to bring the result back into signal-land for template use and client-side filtering.

## 2. Requirements 📋

* [ ] **Debounced Search**: Create `signal<string>('')` for search keyword — convert with `toObservable()` → `debounceTime(400)` → `distinctUntilChanged()` → `switchMap(keyword => service.searchJobs(keyword))` — convert back with `toSignal({ initialValue: null })`.
* [ ] **Client-Side Filters**: Add three filter signals — `jobType` (all/full-time/part-time/contract/internship), `location` (text), `minSalary` (range slider) — build `computed filteredJobs()` applying all three on top of the API result signal.
* [ ] **Loading State**: Use `startWith(null)` before `toSignal()` — derive `isLoading = computed(() => rawJobs() === null)` — show skeleton cards when loading, job list when done.
* [ ] **Stats & Clear**: Build `computed jobStats()` returning `{ total, filtered }` — display as "Showing X of Y jobs" — add `clearFilters()` that resets all filter signals to defaults.

## 3. Expected Output 🖼️

| User Action | Result |
|-------------|--------|
| Type in search box | After 400ms debounce, results update |
| Select "Full-time" filter | Only full-time jobs shown |
| Type a location | Jobs filtered by location |
| Drag salary slider | Jobs below threshold hidden |
| Click "Clear" | All filters reset, full results shown |
| Page load | Skeleton cards shown briefly, then all jobs |

## 4. Edge Cases / Constraints ⚠️

* **Debounce**: Typing fast should NOT fire multiple API calls — `debounceTime` + `distinctUntilChanged` handle this.
* **Loading on every search**: Each new keyword triggers loading state via `startWith(null)`.
* **Filters are client-side only**: They don't trigger new API calls — they filter the existing API result.
* **Empty keyword**: Returns all jobs (the API handles this).

## 5. Success Criteria ✅

* [ ] `toObservable()` converts the search signal into an RxJS stream.
* [ ] `debounceTime(400)` + `distinctUntilChanged()` + `switchMap()` are applied.
* [ ] `toSignal()` converts the API result back into a signal.
* [ ] `isLoading` computed derives from `null` sentinel value.
* [ ] Three filter signals combine with the API result in `filteredJobs` computed.
* [ ] `clearFilters()` resets all filter signals in one call.
* [ ] No `async` pipe — all template reads use signal `()` syntax.

### Key Concepts

| Concept | When to use |
|---------|-------------|
| `toObservable()` | Push a signal into RxJS for operators like debounce, switchMap |
| `toSignal()` | Pull an Observable result into signal-land for template use |
| `signal` + `computed` | Client-side filters that don't need RxJS operators |
| `startWith(null)` | Sentinel value to derive loading state |
