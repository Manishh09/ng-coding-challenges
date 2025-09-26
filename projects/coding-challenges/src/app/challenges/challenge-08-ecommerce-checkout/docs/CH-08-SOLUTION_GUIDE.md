# Challenge 08: Solution Guide – E-Commerce Checkout Flow with concatMap

## Steps

1. create models for Product, Order, PaymentResponse.
2. create ProductService to fetch products and update inventory.
3. create OrderService to create orders.
4. create CheckoutFacade to orchestrate the checkout flow using `concatMap`.
5. create CheckoutComponent to handle UI and user interactions.

---

## APIs
- **Get products**: `GET https://fakestoreapi.com/products`
- **Create order (cart)**: `POST https://fakestoreapi.com/carts`
- **Update inventory**: `PUT https://fakestoreapi.com/products/{id}` (simulate stock deduction)
- **Simulate payment**: Mock this step with a dummy `of({ status: 'success' })` observable.

---

## Explanation

- **Models**: Define interfaces for Product, Order, and PaymentResponse to structure data.
- **Services**:
  - `ProductService`: Fetches products and updates inventory.
  - `OrderService`: Creates orders.
- **CheckoutFacade**: Manages the checkout process using `concatMap` to ensure sequential execution of API calls.
- **CheckoutComponent**: Handles user interactions, displays products, and shows order/payment results.
- **RxJS `concatMap`**: Used to chain dependent API calls (create order → update inventory → process payment) ensuring each step completes before the next begins.
- **Error Handling**: Catches errors at each step and updates the UI accordingly.
- **Loading State**: Manages loading state to provide user feedback during the checkout process.

---

## Summary

- First creates an order, then updates inventory for each product in the order, and finally simulates a payment process.
- Uses `concatMap` to ensure that each step is completed before moving to the next, maintaining the correct sequence of operations.

## Key Learning

- `concatMap` ensures **sequential execution**: order → inventory → payment.
- Handles **dependent API calls** in Angular.
- Avoids race conditions that can occur with `mergeMap`.
- Demonstrates a **real-world e-commerce scenario** with multiple sequential steps.
