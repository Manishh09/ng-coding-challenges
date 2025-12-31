# Challenge 02: Parallel API calls

**Estimated Time:** 30-45 minutes
**Difficulty:** Intermediate

## 1. Challenge 🎯
**Scenario:**
You are building an analytics dashboard that needs to aggregate data from multiple sources (Users, Posts, Photos) simultaneously. The dashboard should not show partial data; it needs everything to be ready before displaying.

**Task:**
Create a component that fetches data from three different API endpoints in parallel and displays a combined view.

## 2. Requirements 📋
*   [ ] **Service Layer**: Create a `DashboardService` with a method to fetch all data.
*   [ ] **RxJS**: Use `forkJoin` to trigger all requests in parallel.
*   [ ] **Component**: `DashboardComponent` should display the results.
*   [ ] **UI**: Show a loading spinner until *all* requests complete.
*   **API Endpoints**:
    *   Users: `https://jsonplaceholder.typicode.com/users`
    *   Posts: `https://jsonplaceholder.typicode.com/posts`
    *   Photos: `https://jsonplaceholder.typicode.com/photos`

## 3. Expected Output 🖼️
*   **Loading State**: Display "Loading Dashboard..." initially.
*   **Dashboard Layout**:
    *   **Users Section**: List of top 5 users (Name, Email).
    *   **Posts Section**: List of top 5 posts (Title).
    *   **Photos Section**: List of top 5 photos (Thumbnail, Title).

## 4. Edge Cases / Constraints ⚠️
*   **Performance**: Do not use chaining (nested subscribes). Use `forkJoin`.
*   **Error Handling**: If *any* of the requests fail, the entire specific section should show an error, or the whole dashboard depending on strategy (for this challenge, simple global error is fine).
*   **Constraint**: Use `AsyncPipe` or `takeUntilDestroyed` for subscription management.

## 5. Success Criteria ✅
*   [ ] Application compiles and runs without errors.
*   [ ] All three sections populate at the same time.
*   [ ] `forkJoin` is correctly implemented in the service or component.
