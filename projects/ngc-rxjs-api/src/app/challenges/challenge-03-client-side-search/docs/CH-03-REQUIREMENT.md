# Challenge 03: Client-Side Search

**Estimated Time:** 30-45 minutes
**Difficulty:** Intermediate

## 1. Challenge 🎯
**Scenario:**
Users of your **Contact Management App** are complaining that finding a specific person takes too long. They want a search bar that filters the list instantly as they type.

**Task:**
Implement a real-time, client-side search feature that filters a list of users by name or email without making new API calls for every keystroke.

## 2. Requirements 📋
*   [ ] **RxJS**: Use `debounceTime` and `distinctUntilChanged` to optimize the search input.
*   [ ] **Forms**: Use a `FormControl` for the search input.
*   [ ] **Filtering**: Filter the data locally (client-side) based on Name or Email.
*   [ ] **API**: Fetch the full list of users once on initialization.
*   **API Endpoint**: `https://jsonplaceholder.typicode.com/users`

## 3. Expected Output 🖼️
*   **Search Bar**: An input field at the top.
*   **User List**: A grid or list of cards displaying User details (Name, Email).
*   **Interaction**: The list updates automatically as you type.

## 4. Edge Cases / Constraints ⚠️
*   **No Results**: Show "No users found" if the search term doesn't match anything.
*   **Case Insensitivity**: Searching "alice" should find "Alice".
*   **Performance**: Do not use `ngModel`. Use Reactive Forms `valueChanges`.

## 5. Success Criteria ✅
*   [ ] list filters correctly.
*   [ ] `debounceTime` is set (e.g., 300ms).
*   [ ] Search is case-insensitive.
*   [ ] Data is fetched only once.
*   [ ] Loading state is displayed while fetching.
*   [ ] Error state is displayed on failure.
*   [ ] No additional API calls are made on every keystroke.
*   [ ] No memory leaks on component destroy (Used `takeUntilDestroyed`).
