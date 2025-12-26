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

---

## 📦 Monorepo Architecture

This project is structured as a monorepo with:

- **Coding Challenges**: as a main standalone Angular application
- **Shared libraries**: Common components, services, and models used across multiple challenges

```
ng-coding-challenges/
├── projects/                 # Individual challenge applications
│   └── coding-challenges/    # Main application (challenge browser)
│       └── src/
│           └── app/
│               └── challenges/
│                   ├── challenge-01/   # Individual challenge folder
│                   ├── challenge-02/   # Individual challenge folder
│                   └── ...
├── libs/                     # Shared libraries
│   └── shared/
│       ├── ui/               # Shared UI components
│       ├── models/           # Shared data models
│       └── services/         # Shared services
└── docs/                     # Documentation
    ├── CREATE_CHALLENGE.md   # Template for creating new challenges
    └── CONTRIBUTION.md       # Guide for contribution

```

See the Architecture Guide [ARCHITECTURE.md](docs/ARCHITECTURE.md) for more details.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)
- Angular CLI (v19.2.12 or compatible)

### Installation

```bash
# Clone the repository (if not already done)
git clone https://github.com/Manishh09/ng-coding-challenges.git

# navigate to project directory
cd ng-coding-challenges

# checkout develop
git checkout develop

# pull changes
git pull

# Install dependencies
npm install

# if any issues, remove package-lock.json file and run `npm install`
```

---

## Development Workflow

### 🚀 Running the Application

To start the main application development server:

```bash
npm run start:main
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building the Project

To build the entire project:

```bash
npm run build:all
```

To build only the shared libraries:

```bash
npm run build:libs
```

## 🚀 Creating a New Challenge

To create a new challenge application:

```bash
npm run create:challenge
```

See [CREATE CHALLENGE TEMPLATE](docs/CREATE_CHALLENGE.md) for more details on challenge structure.

---

## 📚 Documentation

- Setup and run the application: [SETUP_AND_RUN_APP_GUIDE.md](docs/SETUP_AND_RUN_APP_GUIDE.md)
- Contributing guidelines: [CONTRIBUTING.md](docs/CONTRIBUTING.md)
- Branch naming conventions: [BRANCH_NAMING_GUIDE.md](docs/BRANCH_NAMING_GUIDE.md)
- Angular best practices: [ANGULAR_BEST_PRACTICES.md](docs/ANGULAR_BEST_PRACTICES.md)
- Git commit message guidelines: [GIT_COMMIT_MESSAGES.md](docs/GIT_COMMIT_MESSAGES.md)
- Create Challenge Guide: [CREATE_CHALLENGE.md](docs/CREATE_CHALLENGE.md)
- Pull Request Process: [PULL_REQUEST_TEMPLATE.md](docs/PULL_REQUEST_TEMPLATE.md)

## 🤝 Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](docs/CONTRIBUTING.md) file for guidelines.
