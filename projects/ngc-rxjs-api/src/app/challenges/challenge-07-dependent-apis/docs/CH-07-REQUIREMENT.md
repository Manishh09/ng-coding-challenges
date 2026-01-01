# Challenge 07: Dependent API Calls

**Estimated Time:** 45-60 minutes
**Difficulty:** Advanced

## 1. Challenge 🎯
**Scenario:**
You are building a User/Post dashboard. You need to fetch a list of Users, and for *each* user, you must fetch their specific Posts to display the count and latest title. The APIs are separate.

**Task:**
Fetch the Users first. Then, concurrently fetch the posts for *every* user found. Combines these into a single "Dashboard View".

## 2. Requirements 📋
*   [ ] **RxJS**: Use `mergeMap` (or `flatMap`) to trigger the Post calls after the User call returns.
*   [ ] **Concurrency**: Use `forkJoin` to handle the array of Post requests.
*   [ ] **State**: Handle the "Loading" state while all these requests complete.
*   **API Endpoints**:
    *   Users: `https://dummyjson.com/users`
    *   Posts: `https://dummyjson.com/posts/user/{userId}`

## 3. Expected Output 🖼️
*   **Table**:
    *   User Name
    *   Post Count
    *   Latest Post Title

## 4. Edge Cases / Constraints ⚠️
*   **Performance**: Since we are making N+1 requests (1 user list + N users), ensure we handle errors if *one* user's post request fails (don't break the whole dashboard).
*   **Order**: The order of the final list should match the user list order.

## 5. Success Criteria ✅
*   [ ] Dashboard populates with enriched data.
*   [ ] `mergeMap` is used to switch from "User List" stream to "Posts" streams.
*   [ ] `forkJoin` is used to execute the N post requests in parallel.
