# NgCodingChallenges

An interactive platform for Angular coding challenges designed to help developers improve their Angular skills through practical exercises. This project features a modern UI inspired by angular.dev, with responsive design and theming capabilities.

## 🚀 Project Overview

NgCodingChallenges provides a collection of practical Angular coding challenges with increasing complexity. Each challenge focuses on specific Angular concepts and features, allowing developers to:

- Practice real-world Angular development scenarios
- Learn modern Angular best practices
- Understand reactive programming with RxJS
- Master Angular's component architecture
- Build responsive and accessible UIs

The platform includes a clean, modern UI with light/dark theme support, responsive design, and Angular Material integration.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)
- Angular CLI (v19.2.12 or compatible)

### Installation

```bash
# Clone the repository (if not already done)
git clone https://your-repository-url/ng-coding-challenges.git
cd ng-coding-challenges

#checkout develop
git checkout develop

#pull changes
git pull

# Install dependencies
npm install

# if any issues, remove package-lock.json file and run `npm install`
```

## 🚀 Running the Application

### Development Server

To start the main application development server:

```bash
npm start
# or
ng serve
```

To specifically run the coding challenges application:

```bash
npm run start:challenges
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building the Project

To build the entire project:

```bash
npm run build
```

To build only the coding challenges application:

```bash
npm run build:challenges
```

To build the shared libraries:

```bash
npm run build:libs
```

Build artifacts will be stored in the `dist/` directory.

## 🧪 Running Tests

To execute unit tests with Karma:

```bash
npm test
```

## 🧭 Navigating the Application

Once the application is running, you can:

1. View the homepage with the challenge list
2. Click on any challenge card to navigate to that specific challenge
3. Read the challenge requirements and instructions
4. Implement your solution in the designated component
5. Test your implementation against the provided requirements
6. Toggle between light and dark themes using the theme toggle button in the header

## 📂 Project Structure

The project follows a modular architecture:

- `projects/coding-challenges/` - The main application
- `projects/challenge-01-async-data-fetch/` - Example challenge implementation
- `libs/shared/ui/` - Shared UI components, services, and styles
- `libs/shared/models/` - Shared data models and interfaces
- `libs/shared/services/` - Shared services for data access and business logic

## 🤝 Contributing

We welcome contributions to NgCodingChallenges! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines on how to contribute.

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Material](https://material.angular.io/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
