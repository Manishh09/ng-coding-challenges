# Monorepo Architecture Decision

## Context

The NgCodingChallenges project is designed to contain multiple Angular coding challenges of varying complexity. As the number of challenges grows, we need a scalable architecture that supports independent development, testing, and deployment of each challenge while maintaining a cohesive developer experience.

## Decision

We've decided to structure this project as a monorepo with:

1. Individual, standalone Angular applications for each coding challenge
2. Shared libraries for common components, services, and models
3. A main application that serves as a challenge browser

## Benefits

This architecture provides several benefits:

- **Isolation**: Each challenge can have its own dependencies and configuration
- **Independent deployment**: Challenges can be built and deployed separately
- **Clear boundaries**: Prevents unintended code sharing between challenges
- **Better organization**: Makes it easier to find and work on specific challenges
- **Parallel development**: Multiple developers can work on different challenges with fewer conflicts
- **Simplified testing**: Easier to write and run tests for each challenge in isolation
- **Code sharing**: Common code can be shared through libraries
- **Consistent UX**: Shared UI components ensure a consistent user experience

## Implementation

The monorepo is structured as follows:

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
```

### Shared Libraries

- **shared-ui**: Common UI components like headers, footers, challenge cards, etc.
- **shared-models**: Common data models and interfaces
- **shared-services**: Common services for API clients, utilities, etc.

### Challenge Applications

Each challenge is a standalone Angular application with:

- Its own routing configuration
- Challenge-specific components, services, and models
- A REQUIREMENT.md file describing the challenge

### Main Application

The coding-challenges application serves as a hub/browser for all available challenges, with:

- A home page listing all challenges
- Navigation to individual challenges
- Shared UI elements (header, footer, theme toggle)

## Tooling

To support this architecture, we've added:

- Scripts for creating new challenges
- Build and test scripts for individual challenges and the entire monorepo
- Documentation on how to create and contribute challenges

## Alternative Considerations

We considered alternative approaches:

1. **Single application with feature modules**: Less overhead but less isolation and more potential for conflicts
2. **Completely separate repositories**: Better isolation but more difficult to maintain consistency and share code
3. **Nx workspace**: More powerful but introduces additional complexity and learning curve

The current approach balances isolation with ease of development and maintenance.
