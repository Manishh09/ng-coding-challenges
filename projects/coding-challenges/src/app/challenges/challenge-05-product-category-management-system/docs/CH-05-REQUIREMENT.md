# Challenge 05 – Product Category Management System

## Task

Build an Product Manament System feature where multiple components consume and display the same list of product categories, while minimizing redundant HTTP calls.

---

## Requirements

1. Create a `CategoryService` to fetch categories from:  
   `https://fakestoreapi.com/products/categories`

2. Transform the raw data into a structured model:

    ```ts
    export interface Category {
      id: number;
      name: string;
    }
    ```

3. Ensure the HTTP request happens exactly **once per session** by using RxJS `shareReplay`.

4. Implement three standalone Angular components:

    | Component                  | Purpose |
    |----------------------------|---------|
    | ProductFilterComponent     | Display a category dropdown filter. |
    | ProductCreationComponent   | Provide a category selection dropdown when adding/editing a product. |
    | CategorySummaryComponent   | Display total number of categories available and cateogry names. |

5. Use Angular Signals for component state management and new Angular control flow (`@for`) in templates.

6. Style the components using Angular Material for a clean and professional look.

---
