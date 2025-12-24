# Monorepo Architecture Overview

## Context

The `ng-coding-challenges` project is a scalable platform for hosting multiple Angular coding challenges. As the project expands, it requires an architecture that enables independent development, testing, and deployment for each challenge, while promoting code reuse and a unified developer experience.

## Architectural Decision

We have adopted a monorepo structure, leveraging Angular's workspace capabilities to organize:

1. **Standalone Angular applications** for each coding challenge
2. **Shared libraries** for reusable components, services, and models
3. **A main application** that acts as a challenge browser and entry point

## Key Benefits

- **Challenge Isolation:** Each challenge is self-contained, with its own dependencies and configuration.
- **Independent Deployment:** Challenges can be built, tested, and deployed separately.
- **Clear Separation:** Prevents accidental code coupling between challenges.
- **Improved Organization:** Facilitates navigation and maintenance of individual challenges.
- **Parallel Development:** Multiple contributors can work concurrently with minimal merge conflicts.
- **Targeted Testing:** Enables focused testing for each challenge.
- **Code Reuse:** Shared libraries promote reuse of common logic and UI.
- **Consistent User Experience:** Shared UI components ensure uniformity across challenges.

## Directory Structure

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

## Shared Libraries

| Library | Purpose |
|----------|----------|
| **shared/ui** | Common UI elements like headers, footers, and challenge cards |
| **shared/models** | Shared interfaces and type definitions |
| **shared/services** | Cross-app services such as API clients, logging, and utility helpers |

## Challenge Applications

Each **category app** (e.g., `ngc-core`, `ngc-routing`, `ngc-rxjs-api`) contains one or more **challenges**, each structured as below:

ngc-category-app/
└── src/
    └── app/
        ├── challenges/
        │   ├── challenge-01/
        │   ├── challenge-02/
        │   └── ...
        ├── app.component.*
        ├── app.routes.ts
        ├── app.config.ts
        ├── main.ts
        ├── index.html
        └── styles.scss

## Main Application

The **`ngc-shell`** app serves as the **central hub** for all challenge categories.  
It provides:

- A **dashboard** listing all categories and challenges  
- **Routing and navigation** between challenge apps  
- **Global UI elements** such as header, sidebar, and theme toggle  
- Integration with **shared libraries** for a consistent experience.

## Tooling & Workflow

- **Scaffold Scripts:** Automate creation of new challenges and categories  
- **Individual Build/Test Pipelines:** Build, test, and serve each challenge app separately  
- **Monorepo Management:** Simplifies dependency management and CI/CD integration  
- **Contributor Docs:** Onboarding guide for new developers to create and contribute challenges

## Alternatives Considered

- **Single app with feature modules:** Simpler, but less isolation and higher risk of code conflicts
- **Separate repositories:** Maximum isolation, but harder to maintain consistency and share code
- **Nx workspace:** Advanced tooling, but adds complexity and a steeper learning curve

## Conclusion

This monorepo architecture provides the **right balance** between modularity, scalability, and simplicity.

It enables **independent challenge development**, **efficient reuse of shared resources**, and a **cohesive user experience** — ensuring the `ng-coding-challenges` platform remains maintainable and extensible as it grows.
