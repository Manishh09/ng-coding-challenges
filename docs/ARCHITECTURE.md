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

```
ng-coding-challenges/
├── projects/
│   ├── coding-challenges/    # Main application (challenge browser)
│   ├── challenge-1/          # Individual challenge app
│   ├── challenge-2/          # Individual challenge app
│   └── ...                   # More challenges
├── libs/
│   └── shared/
│       ├── ui/               # Shared UI components
│       ├── models/           # Shared data models
│       └── services/         # Shared services
```

### Shared Libraries

- **shared/ui:** Common UI elements (headers, footers, challenge cards, etc.)
- **shared/models:** Shared interfaces and data models
- **shared/services:** Reusable services (API clients, utilities, etc.)

### Challenge Applications

Each challenge resides in its own Angular application, featuring:

- Dedicated routing
- Challenge-specific components, services, and models
- A `REQUIREMENT.md` file outlining the challenge details

### Main Application

The `coding-challenges` app serves as the central hub, providing:

- A dashboard listing all challenges
- Navigation to individual challenge apps
- Shared UI (header, footer, theme toggle)

## Tooling & Workflow

- CLI scripts for scaffolding new challenges
- Build/test scripts for individual apps and the entire monorepo
- Contributor documentation for onboarding and challenge creation

## Alternatives Considered

- **Single app with feature modules:** Simpler, but less isolation and higher risk of code conflicts
- **Separate repositories:** Maximum isolation, but harder to maintain consistency and share code
- **Nx workspace:** Advanced tooling, but adds complexity and a steeper learning curve

Our chosen monorepo approach provides a balanced solution for scalability, maintainability, and developer productivity.
