# Challenge 08 – E-Commerce Checkout

## Task
You are building an **Angular e-commerce checkout flow**.  
When a customer places an order, multiple **dependent API calls** must happen in sequence:

1. **Create the order** – Save the order details (cart, user, total).  
2. **Reserve inventory** – Deduct quantities from stock for each purchased product.  
3. **Process payment** – Simulate a payment API call (success/failure).  

Each step **depends on the previous one** — inventory should only be updated after the order is created, and payment should only happen once inventory is confirmed.  


## APIs – FakeStore API
- **Get products**: `GET https://fakestoreapi.com/products`  
- **Create order (cart)**: `POST https://fakestoreapi.com/carts`  
- **Update inventory**: `PUT https://fakestoreapi.com/products/{id}` (simulate stock deduction)  
- **Simulate payment**: Mock this step with a dummy `of({ status: 'success' })` observable.  

## Requirements
- Use **Angular 19**.  
- Implement services for `OrderService`, `ProductService`, and a **CheckoutFacade**.  
- Use **RxJS `concatMap`** to handle dependent API calls **sequentially**.  
- Use **Angular Material** for UI (button for "Place Order").  
- Display results in a simple HTML table showing:  
  - Order ID  
  - Ordered Products  
  - Payment Status  
- Implement **loading & error handling** with Angular’s new template control flow (`@if`).  
  
---

## Why `concatMap` here?
- **`mergeMap`** would fire multiple requests concurrently → payment might process before inventory update. ❌  
- **`switchMap`** would cancel previous calls if a new one is triggered. ❌  
  **`concatMap` ensures sequential execution** — order → inventory → payment.  

## Interview Tip
Emphasize that **checkout workflows are sequential** and must **guarantee ordering of dependent API calls**.  
This makes `concatMap` the **best fit** compared to other RxJS flattening operators.
