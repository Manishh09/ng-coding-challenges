# Challenge 09: Component Communication

**Estimated Time:** 20-30 minutes
**Difficulty:** Beginner

## 1. Challenge 🎯
**Scenario:**
You need to build a "Product Dashboard". One component selects a product category (from an API), and another component displays the user's choice. They are siblings, so they must communicate via a Parent.

**Task:**
Implement a Parent-Child-Child communication flow using **Signals** and **Outputs**.
1.  **Child 1 (Selector)**: Fetches categories and emits the selection.
2.  **Parent**: Receives the selection and updates a Signal.
3.  **Child 2 (Display)**: Reads the Signal (via Input) and shows the result.

## 2. Requirements 📋
*   [ ] **Signal Inputs**: Use `input()` API.
*   [ ] **Signal Outputs**: Use `output()` API.
*   [ ] **Service**: Fetch categories from API.
*   **API Endpoint**: `https://fakestoreapi.com/products/categories`

## 3. Expected Output 🖼️
*   **Selector**: Dropdown list of categories.
*   **Display**: Large text "Selected Category: [Value]".
*   **Interaction**: Changing the dropdown updates the text immediately.

## 4. Edge Cases / Constraints ⚠️
*   **Fallback**: If API fails, provide default categories.
*   **Unidirectional**: Selector cannot talk to Display directly.

## 5. Success Criteria ✅
*   [ ] Signal Inputs/Outputs are used.
*   [ ] API data is loaded.
*   [ ] Parent acts as the mediator.