# Challenge-02: Parallel API Calls with forkJoin

## Objective

Build a `DashboardComponent` that loads and displays **three independent datasets** using **parallel API calls** with **RxJS `forkJoin`**.

---

## Use Case: Home Page Dashboard

You are tasked with building a **dashboard page** that aggregates three types of data:

- 👤 Users
- 📝 Posts

Each dataset is **independent** and should be **fetched in parallel** when the component initializes.

---

## APIs to Use (from JSONPlaceholder)

These are public fake REST APIs:

| Data Type | Endpoint |
|-----------|----------|
| Users     | `https://jsonplaceholder.typicode.com/users` |
| Posts     | `https://jsonplaceholder.typicode.com/posts` |
| Photos    | `https://jsonplaceholder.typicode.com/photos` |

---

## Requirements

### On Component Initialization

- Fetch all three APIs **in parallel** using `forkJoin`
- Show a **loading indicator** while the data is being fetched
- Display the following on success:
  - **First 5 Users**: Name & Email
  - **First 5 Posts**: Post Title
- If **any** API call fails, show an error message:


---

## Technical Constraints

- Use `HttpClient` for all API calls
- Use `RxJS forkJoin()` for parallel execution
- Properly handle loading, success, and error states
- Keep component and service logic **separated**
- Use **type-safe interfaces** (`User`, `Post`, `Photo`)

---

## Optional

- Use `async` pipe instead of manual `subscribe()`
- Unsubscribe using `takeUntilDestroyed()` if subscribing manually
- Add artificial delays using `delay(1000)` for realism
- Use a service method like `getDashboardData()` to return all 3 results together
- Split each widget into its own child component

---

## Suggested Folder Structure

src/app/dashboard/
├── dashboard.component.ts
├── dashboard.component.html
├── dashboard.component.scss
├── dashboard.service.ts


