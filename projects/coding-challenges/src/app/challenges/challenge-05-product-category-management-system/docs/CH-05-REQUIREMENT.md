# Challenge 05: Product Category Management System

## Description

Build a product category management feature in Angular where multiple components consume and display the same list of product categories. Optimize network usage by ensuring HTTP calls are minimized and data is efficiently shared using RxJS `shareReplay`.

---

## Requirements

### APIs

- Fetch categories from:  
  `https://fakestoreapi.com/products/categories`

### Example Models

```ts
export interface Category {
  id: number;
  name: string;
}
```


### Functional Requirements

1. Implement a `CategoryService` to fetch product categories exactly once per session, caching the response using `shareReplay`.
2. Transform the raw category data into the structured `Category` model.
3. Create three standalone Angular components that consume the shared category data:
   | Component                 | Purpose                                           |
   |---------------------------|-------------------------------------------------|
   | `ProductFilterComponent`  | Displays a category dropdown filter.             |
   | `ProductCreationComponent`| Provides a category selection dropdown in product creation/edit forms. |
   | `CategorySummaryComponent`| Displays the total number of categories and lists their names. |

---

## UI / Template Requirements

- Use Angular Material components for a professional and consistent design.
- Use Angular Signals for component state management.
- Use Angular’s new template syntax such as `@for` to iterate over categories.
- Each component must display the relevant category data as per its role.
- Ensure responsive and user-friendly UI across components.

---

## Architecture: Component & Service Layers

- **Service Layer**
  - create `CategoryService`  
  - Fetch categories from the API once and cache the result using RxJS `shareReplay`.  
  - Provide methods or signals exposing shared category data to consumers.

- **Component Layers**  
  - Create `ProductFilterComponent`, `ProductCreationComponent`, and `CategorySummaryComponent` should consume category data from `CategoryService`.  
  - Manage component state using Angular Signals.  
  - Use Angular Material UI components for dropdowns and display lists (If Required)

---

## Constraints & Expectations

- Use Angular’s `HttpClient` for API calls.  
- Use RxJS `shareReplay` to ensure categories are fetched exactly once per session and shared across components.  
- Use Angular Signals for reactive state management in components.  
- Implement minimal logic in components; delegate data fetching and caching to the service.
- Use Angular Material components for UI elements.(If needed)
- Use Angular’s new template control flow syntax (`@for`) for iteration.  
- Maintain clear separation of concerns between services and components.  
- Avoid redundant HTTP calls under any user interaction or navigation scenarios.  
- Ensure components handle loading states gracefully if applicable.

---

## Best Practices

- Centralize API interaction and data caching in services to promote reusability and maintainability.  
- Use `shareReplay` with appropriate parameters (`bufferSize: 1, refCount: true`) to cache HTTP responses safely.  
- Leverage Angular Signals and declarative template syntax for clean and reactive UI code.  
- Minimize state and logic complexity in components by relying on reactive service data.  
- Use Angular Material components consistently for accessibility and UI consistency.  
- Ensure all observables and subscriptions are managed to prevent memory leaks.
