# Solution: Caching with shareReplay

## 🧠 Approach
The key to efficiency is the **Service**. components shouldn't care about caching.
1.  **Service**: Defines a `categories$` stream that is "hot" (shared) and "replayed" (remembers values).
2.  **Components**: Simply subscribe to this stream (or use `toSignal`).

## 🚀 Step-by-Step Implementation

### Step 1: Define the Interface
The API returns a string array, implying our Model is just `string[]`.
```typescript
type Category = string;
```

### Step 2: Create the Service (The Cache)
This is where the magic happens.
```typescript
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);

  // The stream that holds the cache
  categories$ = this.http.get<string[]>('https://fakestoreapi.com/products/categories').pipe(
    shareReplay(1) // Cache the last 1 value and share across subscribers
  );
}
```

### Step 3: Implement the Consumer Components
All components look roughly the same: they inject the service and read `categories$`.

```typescript
// Example: FilterComponent
@Component({ ... })
export class FilterComponent {
  private service = inject(CategoryService);
  // Convert to signal for easy template use
  categories = toSignal(this.service.categories$, { initialValue: [] });
}
```

### Step 4: The Template
```html
<h3>Filter Products</h3>
<select>
  @for (cat of categories(); track cat) {
    <option [value]="cat">{{ cat }}</option>
  }
</select>
```

## 🌟 Best Practices Used
*   **shareReplay(1)**: Turns a "Cold" observable (one request per sub) into a "Hot" one (one request shared by all).
*   **toSignal**: Makes consuming Observables in templates clean and zoneless-ready.
*   **Centralized State**: The Service owns the data source of truth.
