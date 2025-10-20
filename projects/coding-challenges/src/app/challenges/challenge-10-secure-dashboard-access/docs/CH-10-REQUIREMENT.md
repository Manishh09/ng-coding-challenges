# Challenge 10 - Secure Dashboard Page Access (CanActivate Guards)

##  Description
Build a real-world authentication flow in Angular 19 where authenticated users can access `/dashboard` while unauthenticated users are redirected to `/login`. Logged-in users cannot access `/login` or `/register` again. Use standalone components, signals, Angular Material, and the new Angular control flow syntax.

## Requirements

### Technical Requirements
- Angular 19 standalone components.
- Route guards (`CanActivate`) for:
  - `AuthGuard`: Protect private routes.
  - `LoginGuard`: Prevent logged-in users from accessing login/register routes.
- Signals (`signal`, `computed`) for reactive authentication state.
- Lazy loading routes via `loadComponent`.
- Angular Material components for UI.
- Control flow syntax (`@if`, `@else`) in templates.
- Redirection logic:
  - If not logged in → `/login`
  - If already logged in → `/dashboard`

### UI Requirements
- **Login Page:** `mat-card` with username/password fields and a login button.
- **Dashboard Page:** Welcome message and logout button.
- Optional: Responsive design and clean spacing.

## Architecture

### Service Layer
- `AuthService`: Maintains auth state, provides login/logout methods, handles navigation.

### Guard Layer
- `AuthGuard`: Checks authentication state, protects private routes.
- `LoginGuard`: Redirects logged-in users from public routes.

### Component Layer
- `LoginComponent`: Handles login UI and logic.
- `DashboardComponent`: Displays secure content and logout.
- Routing configuration: Private and public routes with guards.

##  Constraints and Expectations
| Category | Constraint / Expectation |
|-----------|--------------------------|
| Authentication Logic | Mock authentication only (e.g., username: admin, password: admin). |
| Persistence | Signals only (no NgRx). |
| Routing | Use Angular 19 standalone routing (`loadComponent`). |
| Guards | Return boolean or UrlTree. |
| UI Library | Angular Material only. |
| Error Handling | Alert or Material Snackbar for invalid login. |
| Redirection | Guards redirect correctly for both auth states. |
| Performance | Guards and signals should be lightweight. |
| File Structure | Clean separation: `auth`, `dashboard`, `guards`. |

##  Best Practices
- Single Responsibility Principle for guards.
- Signal-based reactive state.
- Declarative routing with `UrlTree`.
- Lazy loading for standalone components.
- Clear separation of concerns.
- Consistent Material UI usage.
- New control flow syntax in templates.
- Descriptive naming conventions.
- Secure and predictable navigation.
- Extensible for future enhancements.
