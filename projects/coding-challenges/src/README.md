# ngQuest: Angular Coding Challenges

<div align="center">

![Angular](https://img.shields.io/badge/Angular-19.2.0-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8.0-B7178C?style=flat-square&logo=reactivex&logoColor=white)
![Material](https://img.shields.io/badge/Material-UI-0081CB?style=flat-square&logo=material-ui&logoColor=white)

</div>

## 📋 Overview

**ngQuest** is a collection of practical coding challenges designed to help you master Angular fundamentals and advanced concepts. Each challenge focuses on specific skills that are commonly tested in technical interviews and required in real-world development.

This application serves as the main platform for navigating and completing these challenges.

## 🎯 Challenge Structure

Each challenge is self-contained within its own directory and includes:

- **Requirements Documentation**: Detailed specifications in a `CH-XX-REQUIREMENT.md` file
- **Starter Code**: Basic scaffolding to get you started
- **Test Scenarios**: Automated tests to validate your solution
- **Solution Guidelines**: Hints and best practices (accessible separately)

## 💻 Available Challenges

### Challenge 01: Async Data Fetching
**Skills Tested**: HTTP Requests, RxJS, Observable Management

This challenge focuses on fetching product data from a REST API and displaying it in a responsive table using Angular's HttpClient and RxJS operators.

[View Challenge Requirements](./app/challenge-01-product-list/CH-01-REQUIREMENT.md)

### Challenge 02: Parallel API Calls
**Skills Tested**: Advanced RxJS, Error Handling, Loading States

Build a dashboard that loads multiple independent datasets using parallel API calls with RxJS's forkJoin operator, while properly handling loading and error states.

[View Challenge Requirements](./app/challenge-02-parallel-apis/CH-02-REQUIREMENT.md)

### More Challenges Coming Soon!
- **Challenge 03**: Form Validation & Dynamic Forms
- **Challenge 04**: Advanced Component Communication
- **Challenge 05**: State Management with Signals

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Angular CLI (v19.2+)

### Running the Project

1. **Navigate to the project root**
   ```bash
   cd ng-coding-challenges
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   # Run the main app
   npm run start:main
   
   # Or use the Angular CLI directly
   ng serve coding-challenges
   ```

4. **Open your browser** and navigate to `http://localhost:4200`

## 🧪 Testing Your Solutions

Each challenge comes with its own set of tests to verify your solution:

```bash
# Run tests for all projects
npm run test:all

# Run tests for specific challenge
ng test coding-challenges --include=*/challenge-01-product-list/*
```

## 📚 Project Structure

```
coding-challenges/
├── src/
│   ├── app/
│   │   ├── challenge-01-product-list/
│   │   │   ├── CH-01-REQUIREMENT.md
│   │   │   └── ... challenge files
│   │   ├── challenge-02-parallel-apis/
│   │   │   ├── CH-02-REQUIREMENT.md
│   │   │   └── ... challenge files
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   └── product-list/
│   │   ├── services/
│   │   └── shared/
│   │       └── models/
│   ├── assets/
│   └── styles/
└── public/
    └── ... static files
```

## 🔧 Development Workflow

1. **Read the Challenge Requirements**: Each challenge has a detailed requirements file
2. **Explore the Starter Code**: Understand the existing structure
3. **Implement Your Solution**: Following Angular best practices
4. **Run Tests**: Verify your implementation meets requirements
5. **Refactor**: Improve your solution for readability and performance

## 🌟 Best Practices

While completing challenges, focus on these key areas:

- **Reactive Programming**: Prefer the reactive approach using RxJS
- **Memory Management**: Properly manage subscriptions to prevent memory leaks
- **Component Design**: Follow the Single Responsibility Principle
- **TypeScript**: Use strong typing and leverage TypeScript features
- **Performance**: Implement OnPush change detection where appropriate
- **Testing**: Write comprehensive tests for your code

## 🛠️ Libraries & Tools

This project leverages several libraries to enhance development:

- **Angular Material**: UI component library
- **RxJS**: Reactive extensions library for async operations
- **NgRx** (optional): State management for more complex challenges
- **Jasmine & Karma**: Testing framework

## 🤝 Contributing

Interested in adding new challenges or improving existing ones? Check our [Contributing Guide](../../../docs/CONTRIBUTING.md).

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">

**Happy Coding!** 🚀

</div>