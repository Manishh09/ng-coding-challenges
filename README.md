# Angular Coding Challenges

**ngQuest** is an interactive platform designed to help Angular developers master key concepts through practical, hands-on coding challenges. Each challenge focuses on real-world scenarios that you'll encounter in professional Angular development, from basic component communication to advanced state management patterns.

## 🚀 Project Overview

**ngQuest** provides a collection of practical Angular coding challenges with increasing complexity. Each challenge focuses on specific Angular concepts and features, allowing developers to:

- Practice real-world Angular development scenarios
- Learn modern Angular best practices
- Understand reactive programming with RxJS
- Master Angular's component architecture
- Build responsive and accessible UIs

The platform includes a clean, modern UI with light/dark theme support, responsive design, and Angular Material integration.

## 📦 Monorepo Architecture

This project is structured as a monorepo with:

- **Individual challenge apps**: Each coding challenge is a standalone Angular application
- **Shared libraries**: Common components, services, and models used across multiple challenges

```
ng-coding-challenges/
├── projects/                 # Individual challenge applications
│   ├── coding-challenges/    # Main application (challenge browser)
│   ├── challenge-1/          # Individual challenge application
│   ├── challenge-2/          # Individual challenge application
│   └── ...
├── libs/                     # Shared libraries
│   └── shared/
│       ├── ui/               # Shared UI components
│       ├── models/           # Shared data models
│       └── services/         # Shared services
└── docs/                     # Documentation
    ├── CHALLENGE_TEMPLATE.md # Template for creating new challenges
    └── MIGRATION_GUIDE.md    # Guide for migrating existing challenges
```

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

# checkout develop
git checkout develop

# pull changes
git pull

# Install dependencies
npm install

# if any issues, remove package-lock.json file and run `npm install`
```
## Development Workflow

### 🚀 Running the Application


To start the main application development server:

```bash
npm run start:main
# or
ng serve
```

To run a specific challenge application:
```bash
npm run start:challenge-name
# For example:
npm run start:challenge-1


Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
```
### Building the Project

To build the entire project:

```bash
npm run build:all
```

To build only the shared libraries:

```bash
npm run build:libs
```

To build a specific challenge application:

```bash
npm run build:challenge-name
# For example:
npm run build:challenge-01
```

Build artifacts will be stored in the `dist/` directory.

## 🧪 Running Tests

To execute unit tests for all projects:

```bash
npm run test:all
```

To test a specific challenge application:

```bash
npm run test:challenge-name
# For example:
npm run test:challenge-01
```

## 🚀 Creating a New Challenge

To create a new challenge application:

```bash
npm run create:challenge challenge-name "Challenge Title"
# For example:
npm run create:challenge data-binding "Two-way Data Binding"
```

This will:
1. Generate a new Angular application in the projects directory
2. Add necessary configuration files
3. Create a REQUIREMENT.md template
4. Add npm scripts for the new challenge

See `docs/CHALLENGE_TEMPLATE.md` for more details on challenge structure.

## 📚 Documentation

- `docs/CHALLENGE_TEMPLATE.md` - Template and guidelines for creating new challenges
- `docs/MIGRATION_GUIDE.md` - Guide for migrating existing challenges to standalone apps

## 🤝 Contributing

Contributions are welcome! Please see the `CONTRIBUTING.md` file for guidelines.
