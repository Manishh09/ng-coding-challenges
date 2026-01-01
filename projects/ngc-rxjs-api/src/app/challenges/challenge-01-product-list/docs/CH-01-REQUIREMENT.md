# Challenge 01: Product List

**Estimated Time:** 20-30 minutes
**Difficulty:** Beginner

## 1. Challenge 🎯
**Scenario:**
You are building an inventory dashboard for an e-commerce platform. The store manager needs a quick way to view all available products, their prices, and ratings to make restocking decisions.

**Task:**
Create an Angular component that fetches product data from a public API and displays it in a clean, structured table.

## 2. Requirements 📋
*   [ ] **Service Layer**: Create `ProductService` to fetch data using `HttpClient`.
*   [ ] **Component Layer**: Create `ProductListComponent` to display the data.
*   [ ] **Reactive**: Use the `AsyncPipe` in the template (avoid manual `.subscribe()`).
*   [ ] **Typing**: Define a `Product` interface for type safety.
*   **API Endpoint**: `https://fakestoreapi.com/products`

## 3. Expected Output 🖼️
*   **Header**: Display "Total Products: X" above the list.
*   **Table**: A table with the following columns:
    *   Title
    *   Category
    *   Price (formatted as Currency)
    *   Rating (Rate & Count)
*   **States**:
    *   show "Loading..." while fetching.
    *   Show "No products found" if the list is empty.

## 4. Edge Cases / Constraints ⚠️
*   **Error Handling**: If the API fails, display a user-friendly error message.
*   **Performance**: Ensure the API is called only once on initialization.
*   **Constraint**: Do not use any external UI libraries (Material/Bootstrap) for this challenge—use plain CSS.

## 5. Success Criteria ✅
*   [ ] Application compiles and runs without errors.
*   [ ] Data is successfully fetched and displayed in a table.
*   [ ] The `async` pipe is used in the HTML.
*   [ ] Currency pipe is used for the price.
