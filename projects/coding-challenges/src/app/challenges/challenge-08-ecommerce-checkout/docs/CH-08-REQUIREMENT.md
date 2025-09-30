# Challenge 08: E-Commerce Checkout

## Description

Build an e-commerce checkout flow feature involving multiple dependent API calls executed sequentially. The flow should simulate a real checkout where:

1. An order is created with user and cart details.
2. Inventory is reserved by deducting stock quantities for purchased products.
3. Payment is processed only after successful inventory reservation.

---

## APIs – FakeStore API

- Get products:  
  `GET https://fakestoreapi.com/products`

- Create order (cart):  
  `POST https://fakestoreapi.com/carts`

- Update inventory (simulate stock deduction):  
  `PUT https://fakestoreapi.com/products/{id}`

- Simulate payment:  
  Mock with a dummy observable like `of({ status: 'success' })`

### Models

```ts
export interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  quantity?: number; // quantity to order
}

export interface Order {
  id?: number;

  products: Product[];
  total?: number;
  paymentStatus?: PaymentStatus;
}

export type PaymentStatus = "pending" | "completed" | "failed";

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  status: PaymentStatus;
}
```

---

## Functional Requirements

- Implement services for `OrderService`, `ProductService`, and a `CheckoutFacade`.
- Use RxJS **`concatMap`** to handle dependent API calls sequentially:
  - Create order → Reserve inventory → Process payment.
- Display results in a simple HTML table showing:
  - Order ID
  - Ordered products
  - Payment status
- Use Angular Material for UI components including a "Place Order" button.
- Implement loading indicators and error handling using Angular’s new template control flow syntax (`@if`).

---

## Technical Considerations

- Sequential execution is critical; **`concatMap`** ensures that each API call completes before the next begins.
- Avoid `mergeMap` which fires all calls concurrently risking payment before inventory update.
- Avoid `switchMap` which cancels previous calls if new inputs occur, unsuitable for checkout flow.

---

## Architecture: Component & Service Layers

- **OrderService:** manages order creation API calls.
- **ProductService:** manages product inventory updates.
- **CheckoutFacade:** coordinates the checkout workflow, orchestrating sequential API calls.
- **CheckoutComponent:** standalone Angular 19 component invoking facade methods, managing UI state with Signals and reactive patterns.

---

## UI / Template Requirements

- Use Angular Material for styling and UI components.
- Provide a "Place Order" button to trigger the checkout process.
- Render order information in a simple HTML table: order id, products, payment status.
- Use Angular control flow directives (`@if`) for loading and error states.

---

## Constraints & Expectations

- Use Angular’s `HttpClient` for all backend API requests.
- Create separate services and a facade to manage those services.
- Ensure API calls execute sequentially using RxJS `concatMap` to respect dependent flow order.
- Manage reactive state using Angular Signals or reactive streams.
- Implement error handling and loading states clearly in the UI using Angular’s template control flow (`@if`).
- Use Angular Material components for user interface consistency and accessibility.
- Apply standalone component architecture with `inject()` for dependency injection.
- Keep components and services modular with clear separation of concerns.
- Avoid redundant or concurrent API calls that can lead to inconsistent checkout states.

---

## Best Practices

- Encapsulate all HTTP operations in dedicated Angular services to promote maintainability and reuse.
- Use `concatMap` to maintain ordered dependent API calls for workflows like checkout.
- Leverage Angular Signals and reactive template syntax for declarative and memory-safe UI state management.
- Adopt standalone components and Angular 19 features (`inject()`, new template syntax) for streamlined, modern codebases.
- Write modular, readable code with clear responsibilities per component and service.
- Include proper error handling and user-friendly feedback throughout the checkout process.
- Optimize performance by preventing unnecessary API calls and handling concurrency carefully.

---

## Interview Tips

- Emphasize the importance of sequential API call execution in checkout workflows.
- Explain why `concatMap` is preferred over `mergeMap` and `switchMap` for dependent sequences.
- Discuss how this pattern guarantees data consistency and user experience integrity.
- Highlight Angular 19 features leveraged like standalone components, Signals, and new template syntax.

---
