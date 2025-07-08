# Challenge 01: Async Data Fetching - Detailed Requirements

## Title: Async Data Fetching

## Description
Fetch Product List from a fake API and display data asynchronously using RxJS and Angular's HttpClient.

## 1. Goal
The primary goal of this challenge is to demonstrate the ability to fetch data from a remote API endpoint asynchronously and display it in an Angular component, leveraging best practices for reactive programming with RxJS and Angular's HttpClient.

## 2. Core Features / Requirements

### Data Source:
- Fetch a list of "products" from a publicly available fake REST API. A good example is JSONPlaceholder or FakeStoreAPI.
- Recommended API: FakeStoreAPI for products.
    - Get all products: `https://fakestoreapi.com/products`

### Angular Service (ProductService):
- Create a dedicated Angular service (e.g., `ProductService`) to handle all API interactions related to products.
- This service should contain a method (e.g., `getProducts()`) that makes the HTTP GET request to the fake API.
- The `getProducts()` method must return an `Observable<Product[]>` where `Product` is an interface defining the structure of your product data (e.g., id, title, price, description, category, image, rating).

### Angular Component (ProductListComponent):
- Create a component (e.g., `ProductListComponent`) that will display the fetched product data.

### Data Fetching:
- Inject the `ProductService` into this component.
- Call the `getProducts()` method from the `ProductService` when the component initializes (e.g., in `ngOnInit`).
- Asynchronous Handling (RxJS): The component should subscribe to the Observable returned by `getProducts()` to receive the data.
- Recommended approach: Use the async pipe in the component's template to handle the subscription and unsubscription automatically, making the component's TypeScript logic cleaner and preventing memory leaks.

### Data Display:
- Render the fetched list of products in the component's template.
- Use a standard HTML <table> with <thead> (header row) and <tbody> (data rows) for view.
- Display the dynamic count of all products above the table (e.g., "Total Products: [Count]").
- For each product row, include columns for Title, Category, Price (with currency formatting), and Rating (showing both rate and count).