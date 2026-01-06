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

## 🎨 Visual Design System

To keep upcoming UI refresh work consistent, the shell now follows a documented design language:

- **Palette:** Primary gradient blends ruby-red → dark-pink → electric-violet (`--gradient-primary`), backed by a neutral gray ramp (`--gray-50` – `--gray-950`). Status tokens surface success/warning/error accents for chips and badges.
- **Typography:** Primary font family is Inter (700/600/500/400 weights) with JetBrains Mono for code, exposed via CSS variables (`--font-family-primary`, `--font-family-mono`). Headings lean on 1.2 line height for strong hierarchy.
- **Spacing & Radii:** Modular scale from `--spacing-xs` (4px) up to `--spacing-4xl` (96px) and radii tokens (`--border-radius-sm`, `--border-radius-pill`) keep layout rhythm predictable.
- **Elevation & Glass:** Shadow tokens (`--shadow-xs` → `--shadow-xl`) and glassmorphism helpers (`--glass-surface`, `--glass-border`) enable layered hero sections and cards without ad-hoc values.
- **Motion:** Timing tokens (`--animation-duration-fast`, `--animation-duration-expressive`) plus easing curves (`--animation-easing`, `--animation-easing-emphasized`) guide hover, focus, and entrance animations.

See `libs/shared/ui/src/lib/styles/theme.scss` for the authoritative token list used across landing, cards, and layout components.

---

## 📦 Monorepo Architecture

This project is structured as a monorepo with:

- **Coding Challenges**: as a main standalone Angular application
- **Shared libraries**: Common components, services, and models used across multiple challenges

```

ng-coding-challenges/
├── projects/
│   ├── ngc-shell/           # 🧩 Main Application Shell
│   │                        # - Hosts the main layout, routing, and navigation
│   │                        # - Entry point for all challenge category apps
│   │                        # - Responsible for global UI (header, sidebar, etc.)
│   │
│   ├── ngc-core/            # ⚙️ Core Challenges Category
│   │                        # - Contains core Angular challenges
│   │                        # - Each challenge lives inside this category folder
│   │
│   ├── ngc-routing/         # 🧭 Routing Challenges Category
│   │                        # - Focused on Angular Router-related challenges
│   │
│   ├── ngc-rxjs-api/        # 🔄 RxJS & API Challenges Category
│   │                        # - Deals with RxJS patterns, API handling, observables
│   │
│   └── ...                  # Additional challenge categories can be added here
│
├── libs/
│   └── shared/
│       ├── models/          # 🧱 Shared TypeScript models & interfaces
│       ├── services/        # 🔧 Common Angular services (e.g., API, storage, logging)
│       └── ui/              # 🎨 Shared UI components (buttons, cards, layouts, etc.)
│
└── node_modules/
```

See the Architecture Guide [ARCHITECTURE.md](docs/ARCHITECTURE.md) for more details.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)
- Angular CLI (v19.2.17 or compatible)

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
