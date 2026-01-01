# Challenge 04: Server-Side Search

**Estimated Time:** 30-45 minutes
**Difficulty:** Intermediate

## 1. Challenge 🎯
**Scenario:**
You are searching a massive database of users (millions of records). You cannot fetch everyone to the client; you must query the server as the user types.

**Task:**
Implement a search bar that queries a remote API. Crucially, it must **cancel proper pending requests** if the user keeps typing (to avoid race conditions) and wait for the user to stop typing before sending a request.

## 2. Requirements 📋
*   [ ] **RxJS**: Use `switchMap` to handle request cancellation.
*   [ ] **Optimization**: Use `debounceTime` (300ms) and `distinctUntilChanged`.
*   [ ] **Forms**: Use `FormControl` for input.
*   [ ] **State**: Handle loading, error, and data states explicitly.
*   **API Endpoint**: `https://dummyjson.com/users/search?q=[query]`

## 3. Expected Output 🖼️
*   **Search**: Input field that triggers API calls.
*   **Loading**: Spinner appears *while* the request is in flight.
*   **Results**: List of users (Name, Email) matching the query.

## 4. Edge Cases / Constraints ⚠️
*   **Race Conditions**: If I type "A", wait, then "B" quickly, ensuring the result for "AB" overrides "A". (Handled by `switchMap`).
*   **Empty Query**: If the input is cleared, the results should clear (or show default).
*   **Error**: Handle network errors gracefully without breaking the stream.

## 5. Success Criteria ✅
*   [ ] Network tab shows cancelled requests when typing fast.
*   [ ] Spinner shows/hides correctly.
*   [ ] `switchMap` is used.
*   [ ] No additional API calls are made on every keystroke.
*   [ ] No memory leaks on component destroy.

