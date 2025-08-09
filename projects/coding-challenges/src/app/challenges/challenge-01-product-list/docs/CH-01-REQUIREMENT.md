# Challenge 01: Fetch and Display Products

**Task:**  
Build a simple Angular feature to fetch and display a list of products from a fake REST API using Angular’s HttpClient and RxJS.

## Requirements

### 1. API Endpoint
- Use this endpoint to fetch all products:  
  `https://fakestoreapi.com/products`

### 2. Service Layer (`ProductService`)
- Create an Angular service (`ProductService`) with a method `getProducts()`.
- `getProducts()` must call the above API using `HttpClient` and return `Observable<Product[]>`.
- Define a `Product` interface representing the structure of product data (`id`, `title`, `price`, `category`, `rating`, etc.).

### 3. Component (`ProductListComponent`)
- Create a component to show the products list.
- Inject `ProductService` and fetch products in `ngOnInit()`.
- In the template, use the `async` pipe to subscribe and display the products cleanly (avoid manual subscription in `.ts`).

### 4. Data Display
- Above the table, show the total product count (e.g., “Total Products: 20”).
- Use an HTML `<table>` to display:
    - Product Title
    - Category
    - Price (with currency formatting)
    - Rating (show both rate and count)

---
## Concepts Covered

This challenge helps reinforce and assess several key Angular and web development concepts:

- **Consuming REST APIs with HttpClient**  
  Learn to perform HTTP GET requests and handle external data sources in Angular.

- **Observables & RxJS**  
  Work with asynchronous data streams using Observables and manage them using Angular’s reactive programming paradigms.

- **Service-Oriented Architecture**  
  Organize API logic in reusable Angular services to promote maintainability and separation of concerns.

- **Component Lifecycle (`ngOnInit`)**  
  Understand when and how to fetch data within Angular’s component initialization lifecycle.

- **Using the Async Pipe**  
  Implement the `async` pipe in templates to auto-subscribe to Observables, simplifying component code and preventing memory leaks.

- **Interface Usage for Type Safety**  
  Define TypeScript interfaces to provide structure and type safety when handling complex API data.

- **Angular Templates and Data Binding**  
  Use Angular’s template syntax to display dynamic lists of data and computed values, such as the total count.

- **Basic HTML Table Rendering**  
  Practice rendering data in an organized, accessible `<table>` format.
  
___

## Summary Table

| Layer                  | Requirement                                                     |
|------------------------|-----------------------------------------------------------------|
| ProductService         | Fetch data from API, return Observable<Product[]>               |
| ProductListComponent   | Fetch products on init, use async pipe                          |
| Template               | Show total count above table, display Title, Category, Price, Rating |

**Additional Hints:**  
- Use Angular’s best practices: services for API logic, Observables for async work, and `async` pipe in templates.
- Focus on clean, idiomatic Angular code.

