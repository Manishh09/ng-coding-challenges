# Challenge 01: Fetch and Display Products

## Description

Your task is to build a small Angular feature that fetches product data from a public API and displays it in a structured format.

---

## Requirements

### APIs

- Use the following REST API endpoint to get product data:  
  `https://fakestoreapi.com/products`

- Each product object contains the following fields (not exhaustive):
  - `id` (number)
  - `title` (string)
  - `price` (number)
  - `category` (string)
  - `rating` (object: `{ rate: number, count: number }`)

You may define a **TypeScript interface (`Product`)** to model this structure.

### Example Models

```typescript
// product.model.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

// rating.model.ts
export interface Rating {
  rate: number;
  count: number;
}
```

---

### Architecture

- **Service Layer**:

  - Implement a service named `ProductService`.
  - Add a method `getProducts(): Observable<Product[]>` to fetch products data.
  - Use Angular’s `HttpClient` to fetch data from the API.
  - Ensure all API logic is contained in the service (not inside the component).

- **Component Layer:**

  - Create a component named `ProductListComponent`.
  - In `ngOnInit()`, call `ProductService.getProducts()` to load data.
  - Do not manually subscribe in the TypeScript file. Instead, expose the observable to the template and use the `async` pipe.

---

### UI Requirements

- Display the **total number of products** above the results (e.g., “Total Products: 20”).
- Show product details in a simple **HTML table** with the following columns:
  - Title
  - Category
  - Price (formatted as local currency)
  - Rating (show both `rate` and `count`)

---

## Constraints & Expectations

- Use **Angular best practices** for code organization.
- Avoid hard-coding data; all values should be pulled from the API.
- Use **TypeScript interfaces** for strong typing.
- Use **async pipe** to handle observables in the template (instead of `.subscribe()` in TypeScript).
- The table should display clean, readable data but does not need advanced styling.

---

## Best Practices

- Use Angular’s best practices: services for API logic, Observables for async work, and `async` pipe in templates.
- Correct use of Angular **HttpClient** and **RxJS**
- Clean separation of concerns (service vs component)
- Type safety with **interfaces**
- Proper usage of **component lifecycle** (`ngOnInit`)
- Idiomatic Angular template binding and use of **async pipe**
- Code readability and maintainability
