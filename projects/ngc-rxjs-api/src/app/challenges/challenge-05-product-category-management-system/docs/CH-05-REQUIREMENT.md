# Challenge 05: Caching with RxJS

**Estimated Time:** 45-60 minutes
**Difficulty:** Advanced

## 1. Challenge 🎯
**Scenario:**
Your e-commerce admin app has 3 different widgets: a "Filter Bar", a "New Product Form", and a "Category Stats" widget. All of them need the list of Product Categories. Currently, they are making 3 separate API calls.

**Task:**
Refactor the application so the Category List is fetched **once** and cached for the session, shared across all components.

## 2. Requirements 📋
*   [ ] **Service**: Implement `CategoryService` with caching.
*   [ ] **RxJS**: Use `shareReplay` to cache the stream .
*   [ ] **Components**: Create 3 simple components consuming the same service.
*   [ ] **Signal**: Use Angular Signals for state in the components.
*   **API Endpoint**: `https://fakestoreapi.com/products/categories`

## 3. Expected Output 🖼️
*   **Filter Component**: A dropdown list of categories.
*   **Creation Component**: Another dropdown list (simulating a form).
*   **Stats Component**: Text saying "Total Categories: X".
*   **Network Tab**: Only **ONE** request to `/categories`.

## 4. Edge Cases / Constraints ⚠️
*   **Late Subscribers**: If a component loads 10 seconds later, it should get the *cached* value instantly involved, not trigger a new call.
*   **Read-Only**: No need to implement "Add Category" for this challenge.

## 5. Success Criteria ✅
*   [ ] All 3 components display data.
*   [ ] Network tab shows exactly 1 HTTP request.
*   [ ] `shareReplay({ bufferSize: 1, refCount: true })` is used( subscription will be unsubscribed when there are no subscribers).
