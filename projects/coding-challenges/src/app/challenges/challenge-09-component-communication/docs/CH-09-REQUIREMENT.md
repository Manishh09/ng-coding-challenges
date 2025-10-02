# Challenge 09 - Component Communication - Signal Based

## Description
- A company is building a **Product Management Dashboard**.  
- The **Product Selector (Provider Component)** fetches categories from an API (`https://fakestoreapi.com/products/categories`) through a dedicated **ProductService**.  
- The **Dashboard (Dashboard Component)** acts as the parent, storing and managing the latest selection in a signal.  
- The **Product Receiver (Receiver Component)** displays the chosen or entered product.  

This ensures seamless communication between child components while demonstrating **unidirectional data flow**:  
**Provider → Parent → Receiver**  

---

## Requirements
1. Use **Angular 19** with **standalone components** (no NgModules).  
2. Fetch **product categories** dynamically from [Fake Store API](https://fakestoreapi.com/products/categories).  
3. The **ProductService** must:  
   - Contain a method (`getCategories()`) to fetch categories from API.  
   - Provide fallback static categories if API fails.  
4. The **Value Provider Component** must:  
   - Get categories via the `ProductService`.  
   - Show categories in a `mat-select` dropdown.  
   - Provide an input box for entering a custom product.  
   - Emit values via `@Output` whenever user selects or submits.  
5. The **Dashboard Component (Parent)** must:  
   - Capture emitted values from the provider.  
   - Store them using **Angular signals**.  
   - Pass the signal’s value to the receiver via `@Input`.  
6. The **Value Receiver Component** must:  
   - Display the most recent product value it receives.  

---

## UI Requirements

### Value Provider Component
- Dropdown (`mat-select`) or simple `<select>` listing product categories fetched through `ProductService`.  
- Input field with a **“Send Input”** button for custom product.  
- Emits values when:  
  - A category is selected.  
  - The submit button is clicked after entering a custom product.  

### Dashboard Component (Parent)
- Hosts provider and receiver components.  
- Stores emitted values in a signal.  
- Reflects the latest chosen or entered product.  

### Value Receiver Component
- Displays:  
  - `"Received Product: <value>"` when a value exists.  
  - `"No product received yet."` by default.  

---

## Architecture

### Service Layer
- **ProductService**  
  - Handles API call to fetch categories.  
  - Returns categories as an `Observable` or `Promise`.  
  - Provides static fallback categories on API failure.  

### Component Layer
- **ProductSelectorComponent (Child-1)**  
  - Injects and calls `ProductService` to get categories.  
  - Displays fetched categories in dropdown.  
  - Allows custom product input.  
  - Emits selected or entered product upward via `EventEmitter`.  

- **Dashboard Component (Parent)**  
  - Hosts provider and receiver.  
  - Stores latest product in a **signal**.  
  - Passes signal value down to receiver.  

- **ProductDisplayComponent (Child-2)**  
  - Accepts product via `@Input`.  
  - Displays product or defaults to “No product received yet.”  

---

## Constraints and Expectations
- You could also use `@Output`+ `EventEmiiter` , `@Input` decorators for component communication but better to use Signal Input , Output APIs
- Better to use **Signals** for state management in the parent.  
- Use **new Angular control flow syntax** (`@if`, `@for`) in templates.  
- Enforce **strict parent mediation**: no direct provider → receiver communication.  
- Keep styling minimal but structured (**SCSS preferred**).  
- Handle API **loading state** and provide static fallback categories.  

---

## Best Practices
- Respect **Angular’s unidirectional data flow principle**.  
- Use  `output`signal API for child → parent communication.  
- Use `input` signal API for parent → child binding.  
- Use Angular Material (`mat-select`, `mat-input`, `mat-button`) consistently.  
- Reset input field after emitting custom values.  
- Use **ProductService** for API calls to keep components clean.  
- Keep components **isolated and focused**:  
  - Provider → consume service + emit values.  
  - Parent → manage state via signals.  
  - Receiver → display values.  

---


 