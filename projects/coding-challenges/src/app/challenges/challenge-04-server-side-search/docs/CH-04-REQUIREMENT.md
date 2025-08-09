# Challenge 04: Server-Side Search

## Task

Build a search component that queries the server every time the user types, returning only matching results. Use **Reactive Forms** and **RxJS operators** to optimize API calls, prevent unnecessary requests, and handle loading/error states.

## Requirements

- Fetch results **from the API** based on the search query.

- Use **Angular Reactive Forms** (`FormControl`) to handle input.

- Use `debounceTime`, `distinctUntilChanged`, and `switchMap` from RxJS to:
  - Delay API calls until the user stops typing.
  - Prevent duplicate API calls for the same query.
  - Cancel previous requests when a new query starts.
- Show a **loading indicator** while results are being fetched.
  
- Handle **no results** and **error states** gracefully.
  
- Use `Signals` to manage the state of the search results, loading, and error messages.

## API Suggestion

Use a mock API that supports search parameters, such as:

- https://dummyjson.com/users/search?q=<query>
- or a custom mock API created with json-server

## Learning Outcomes
- Implementing server-side search in Angular applications.
- Using Reactive Forms for handling user input.
- Implementing efficient API call strategies to enhance performance using switchMap.
- Preventing memory leaks using unsubscribe patterns.