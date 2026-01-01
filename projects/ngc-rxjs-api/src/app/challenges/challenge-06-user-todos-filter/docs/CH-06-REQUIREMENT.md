# Challenge 06: Data Joining & Filtering

**Estimated Time:** 30-45 minutes
**Difficulty:** Intermediate

## 1. Challenge 🎯
**Scenario:**
You have two separate APIs: one for "Todos" and one for "Users". The "Tokens" only have a `userId`, not the user's name. You need to show a dashboard of tasks with the *User Name* displayed, and filter them by status.

**Task:**
Fetch both datasets in parallel, join them locally (like a SQL JOIN), and filter the result reactively.

## 2. Requirements 📋
*   [ ] **RxJS**: Use `combineLatest` to join the streams: `Todos` + `Users` + `FilterState`.
*   [ ] **Filtering**: Default to 'All'. Support 'Completed' and 'Pending'.
*   [ ] **Data Join**: Map `todo.userId` to `user.name`.
*   **API Endpoints**:
    *   `https://jsonplaceholder.typicode.com/todos`
    *   `https://jsonplaceholder.typicode.com/users`

## 3. Expected Output 🖼️
*   **Filter Control**: A dropdown at the top (All / Completed / Pending).
*   **Table**:
    *   Task Title
    *   **Mapped User Name** (Crucial part)
    *   Status (Completed/Pending)

## 4. Edge Cases / Constraints ⚠️
*   **Missing User**: If a User ID doesn't exist in the Users list, handle gracefully (e.g., "Unknown User").
*   **Performance**: Do not make new API calls when changing the filter.
*   **Constraint**: No nested subscribes. Use Stream Combination.

## 5. Success Criteria ✅
*   [ ] Correct User Name appears next to each Todo.
*   [ ] Changing filter updates the list instantly.
*   [ ] `combineLatest` is used.
*   [ ] Two services are used to fetch the data for Todos and Users to maintain the separation of concerns.
*   [ ] facade pattern is used to handle the data fetching from the services
