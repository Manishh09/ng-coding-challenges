# Challenge 09 - Solution Approach Guide

## 1. APIs

- Use `https://fakestoreapi.com/products/categories` to fetch product categories.
- Handle API errors with fallback static categories.

## 2. Model

- Define a simple model:

```ts
export interface ProductCategory {
  category: string;
  name: string;
}
```


## 3. Service
- Create `ProductService` to:  
- Fetch categories from API using `HttpClient`.  
- Return fallback categories if API call fails.  
- Keep service injectable and reusable.

## 4. Components
- **ProductSelectorComponent (Provider)**
- Fetch categories via `ProductService`.  
- Show categories in a dropdown (`mat-select`).  
- Provide input field for custom products.  
- Emit selected or typed product via `@Output` using signals.  
- Use Angular’s new `@for` and `@if` directives for template flow.  

- **ProductDashboardComponent (Parent)**
- Store selected product in an Angular signal.  
- Listen to emitted events from selector and update signal.  
- Pass the signal value to display component via signal-friendly `@Input`.

- **ProductDisplayComponent (Receiver)**
- Receive product via `@Input`.  
- Display product or fallback message using `@if`.

## 5. UI & UX
- Create a Select Control to bind the category data from API.
- Create an Input Field to enter the product that is related to the selected category.
- Show loading indicator when fetching categories.  
- Show error message and fallback categories if API fails.  
- Reset input field after sending custom product. ( if required )  
- Use Angular Material controls (`mat-select`, `mat-input`, `mat-button`) for consistency. OR use  simple HTML elements.
- Layout components with simple, clear SCSS styles.

