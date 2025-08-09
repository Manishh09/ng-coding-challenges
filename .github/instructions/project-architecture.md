# Copilot Instructions for ng-coding-challenges Monorepo

## Project Architecture
- **Monorepo**: Contains multiple Angular apps (challenges) and shared libraries.
- **Key Directories**:
  - `projects/`: Individual challenge applications (e.g., `coding-challenges`, `ngc-rxjs`).
  - `libs/shared/`: Common code split into `models`, `services`, and `ui`.
  - `docs/`: Architecture, theming, migration, and challenge templates.

## Developer Workflows
- **Install**: `npm install` from the repo root.
- **Build All**: `ng build` (builds all projects and libraries).
- **Serve Main App**: `ng serve coding-challenges` (or other app name).
- **Test**: `ng test <project>` (e.g., `ng test coding-challenges`).
- **Lint**: `ng lint <project>`.
- **Generate Library/Component**: Use Angular CLI with `ng generate`.

## Challenge Patterns
- Each challenge is a standalone Angular app under `projects/`.
- Challenge requirements are documented in `CH-XX-REQUIREMENT.md` inside each challenge folder.
- Starter code and automated tests are provided for each challenge.
- Shared UI, models, and services are imported from `libs/shared/*`.

## Conventions & Patterns
- **Reactive Programming**: RxJS is used for async flows and state management.
- **Angular Material**: Used for UI components and theming.
- **Light/Dark Theme**: Theme switching is supported via shared theming service.
- **Component Structure**: Prefer smart/container components for data logic, dumb/presentational for UI.
- **Service Boundaries**: Shared services (e.g., `notification`, `theme`, `navigation`) are in `libs/shared/services`.
- **Models**: Shared data models are in `libs/shared/models`.
- **UI Components**: Reusable UI elements are in `libs/shared/ui`.

## Integration Points
- **API Communication**: Use Angular's `HttpClient` and RxJS operators (e.g., `forkJoin` for parallel calls).
- **Cross-App Sharing**: Import from shared libraries using relative paths (e.g., `@ng-coding-challenges/shared/models`).
- **Testing**: Each challenge and shared library has its own test config and specs.

## Examples
- To add a new challenge: Copy the template from `docs/CHALLENGE_TEMPLATE_NEXT.md` and place in `projects/<new-challenge>/`.
- To add a shared service: Implement in `libs/shared/services/src/lib/` and export via `public-api.ts`.
- To update theming: Edit `libs/shared/services/src/lib/theme/theme.service.ts` and related SCSS files.

## References
- See `README.md` in repo root and main app folders for more details.
- Architecture and migration guides are in `docs/`.

---
_If any section is unclear or missing, please provide feedback for further refinement._
