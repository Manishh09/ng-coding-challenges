# Solution: Signal Communication

## 🧠 Approach
We follow the strict **Unidirectional Data Flow**:
*   **Data Up**: Child emits event (`output()`).
*   **Data Down**: Parent binds property (`signal`).
1.  **Service**: Load categories.
2.  **Selector (Child)**: `output<string>()` to send selection.
3.  **Parent**: Listen to event `(selectionChange)="val.set($event)"` and pass `[value]="val()"`.
4.  **Display (Child)**: `input<string>()` to receive value.

## 🚀 Step-by-Step Implementation

### Step 1: Create the Service
```typescript
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  getCategories() {
    return this.http.get<string[]>('https://fakestoreapi.com/products/categories')
      .pipe(catchError(() => of(['Default 1', 'Default 2'])));
  }
}
```

### Step 2: The Selector Component (Provider)
```typescript
@Component({ ... })
export class SelectorComponent {
  // Output API
  categorySelected = output<string>();

  categories = toSignal(inject(CategoryService).getCategories());

  onSelect(cat: string) {
    this.categorySelected.emit(cat);
  }
}
```

### Step 3: The Display Component (Receiver)
```typescript
@Component({ ... })
export class DisplayComponent {
  // Input API
  category = input.required<string>();
}
```

### Step 4: The Parent Component (Mediator)
```typescript
@Component({
  template: `
    <app-selector (categorySelected)="selectedCategory.set($event)" />
    <app-display [category]="selectedCategory()" />
  `
})
export class ParentComponent {
  selectedCategory = signal<string>('None');
}
```

## 🌟 Best Practices Used
*   **Mediator Pattern**: Siblings never talk directly. Prevents spaghetti code.
*   **Signal Inputs/Outputs**: The modern, type-safe way to handle props and events in Angular 17+.
*   **Validation**: `input.required` ensures the component isn't used incorrectly.

