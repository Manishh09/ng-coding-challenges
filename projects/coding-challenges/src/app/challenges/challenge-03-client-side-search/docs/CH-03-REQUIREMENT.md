# Challenge 03 - Client-Side User Search

## Task

Build an **Angular component** that allows users to **search through a list of users in real-time** using data from the [JSONPlaceholder Users API](https://jsonplaceholder.typicode.com/users).

This challenge evaluates your ability to work with **Reactive Forms**, **RxJS operators**, **HTTP integration**, and proper **state handling** in an Angular application.

---

## Requirements

### Functional Requirements

1. **User List Fetching**

   - On component initialization, fetch the user list from:
     - `GET https://jsonplaceholder.typicode.com/users`
   - Show a loading indicator while data is being fetched.

2. **Search Input**

   - Add a **search box** powered by `FormControl` from Angular Reactive Forms.
   - Implement **real-time filtering** of the fetched users **as the user types**.
   - Do **not** use a submit button.
   - Load predefined user data into the UI and display respective data as user searches

3. **Filtering Behavior**

   - Use **RxJS operators** like:
     - `debounceTime`
     - `distinctUntilChanged`
     - `map` / `filter`
   - Perform **client-side filtering** by matching the search query against the user’s:
     - `name`
     - `username`
     - `email`

4. **Search Results Display**

   - Show a list of users matching the search query.
   - Each user should display:
     - Full Name
     - Optional:
       - Username
       - Email
   - If no results match, show a “No users found” message.

5. **Error Handling**

   - If the user fetch fails, show an appropriate error message.

6. **Clean-Up**
   - Ensure all subscriptions (e.g., from `valueChanges` or HTTP calls) are **properly cleaned up** on component destroy using techniques like:
     - `takeUntil`
     - `takeUntilDestroyed`
     - `Subscription` management

---

### Project Structure Requirements

To promote clean architecture and maintainability, candidates must follow Angular best practices:

- **Component**:  
  Create a dedicated component (e.g., `user-search.component.ts`) to encapsulate UI and search logic.

- **Service**:  
  Create a service (e.g., `user.service.ts`) responsible for fetching user data via HTTP.

- **Model**:  
  Define a `User` interface (e.g., `user.model.ts`) to strongly type the user data structure returned from the API.

---

## Evaluation Criteria

| Area                    | Details                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| Angular Proficiency     | Correct use of reactive forms, lifecycle hooks, and component structure |
| RxJS Knowledge          | Usage of `debounceTime`, `distinctUntilChanged`, and proper operators   |
| UI Responsiveness       | Real-time update of results without performance lag                     |
| Code Quality            | Clean, readable, and maintainable code                                  |
| Error & Empty State UX  | Graceful handling of no results and HTTP failures                       |
| Unsubscription Strategy | Correct and memory-leak-safe RxJS cleanup                               |

---

## Optional

- Add a loader spinner while the data is loading.
- Highlight the matching text within the results.
- Style the results using a component library or responsive CSS.
