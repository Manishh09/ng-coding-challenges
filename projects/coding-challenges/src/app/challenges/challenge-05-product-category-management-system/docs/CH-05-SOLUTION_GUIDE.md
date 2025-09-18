# Challenge 05 – Product Category Management System Solution Guide

---

## Step 1: **Model Creation**

**Purpose:** Define a structured shape for category data, instead of using raw API strings.

```ts
// category.model.ts
interface Category {
  id: number; // unique identifier
  name: string; // category name
}
```

---

## Step 2: **Service Creation**

**Purpose:** Central place to fetch categories. Ensures the API call happens only once per session using `shareReplay`.

```ts
// category.service.ts
class CategoryService {
  categories$ = http.get(API_URL)
    → map(rawData → Category[])
    → shareReplay(1);

  getCategories() → categories$;
}
```

---

## Step 3: **Components**

### 3.1 **ProductFilterComponent**

**Purpose:** Provide a dropdown filter so users can filter products by category.

```html
<!-- product-filter.component.html -->
Dropdown (mat-select) @for (category of categories()) option → category.name
```

```ts
// product-filter.component.ts
class ProductFilterComponent {
  categories = signal<Category[]>([]);
  service = inject(CategoryService);

  ngOnInit() {
    service.getCategories().subscribe((res) => this.categories.set(res));
  }
}
```

---

### 3.2 **ProductCreationComponent**

**Purpose:** Allow category selection while creating or editing a product.

```html
<!-- product-creation.component.html -->
Dropdown (mat-select) @for (category of categories()) option → category.name
```

```ts
// product-creation.component.ts
class ProductCreationComponent {
  categories = signal<Category[]>([]);
  service = inject(CategoryService);

  ngOnInit() {
    service.getCategories().subscribe((res) => this.categories.set(res));
  }
}
```

---

### 3.3 **CategorySummaryComponent**

**Purpose:** Show total number of available categories, providing a quick overview.

```html
<!-- category-summary.component.html -->
<p>Total Categories: {{ categories().length }}</p>
```

```ts
// category-summary.component.ts
class CategorySummaryComponent {
  categories = signal<Category[]>([]);
  service = inject(CategoryService);

  ngOnInit() {
    service.getCategories().subscribe((res) => this.categories.set(res));
  }
}
```

---

## Key Takeaways

- **Model** → Provides a structured format for category data.
- **Service** → Fetches data once and caches it with `shareReplay`.
- **Components** → Use `signal` for local state, updated in `ngOnInit`.
- **Angular Material + @for** → Clean, modern, and user-friendly UI.

---


### Follow-up Interview Questions:

**1. Difference between shareReplay(1) and shareReplay({ bufferSize: 1, refCount: true })**

`shareReplay(1):`

- Keeps the subscription alive even when there are no subscribers
- This might not be desired in all scenarios because it can hold resources unnecessarily.

`shareReplay({ bufferSize: 1, refCount: true }):`

- Will unsubscribe from the source observable when there are no subscribers
- This can be more efficient in certain cases, especially with long-lived streams.


**2. DO you need Subscription Cleanup ?**
 
Example Component Code:

```typescript
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

```
**Answer:**

It depends on the **observable**:

- getCategories() with `shareReplay({ bufferSize: 1, refCount: true })`

- The source `(HttpClient.get)` completes after emitting once.

That means the subscription will `auto-complete`.

So No manual cleanup required.

That’s why you often see people safely using subscribe() with HTTP calls.

- If you later switch getCategories() to a long-lived observable (like `BehaviorSubject`, `interval`, `websocket`, etc.)

- Then your component would leak memory unless you unsubscribe (using `takeUntilDestroyed`, `async pipe`, or manual unsubscribe).
