# Challenge 10 - Solution Guide

## Overview
This guide demonstrates how to implement a secure authentication flow in Angular 19 using standalone components, signals, CanActivate guards, and Angular Material. The app redirects unauthenticated users to `/login` and prevents logged-in users from accessing login pages again.

## Flow Description

### 1. Application Entry Point
- Angular routing determines which route to show on app load.
- Guards intervene before route activation to check if the user is allowed.

### 2. Authentication State Management
- `AuthService` maintains a `signal` representing login state.
- Signal can be hydrated from localStorage for persistence.
- Login/logout actions update the signal and trigger navigation.

### 3. LoginGuard (Public Route Guard)
- Applied on `/login` and `/register`.
- Checks if the user is logged in.
  - If logged in: redirect to `/dashboard`.
  - If not logged in: allow navigation.

### 4. AuthGuard (Private Route Guard)
- Applied on `/dashboard` or other private routes.
- Checks if the user is logged in.
  - If authenticated: allow access.
  - If not authenticated: redirect to `/login`.

### 5. Routing Configuration
- Public routes: guarded by `LoginGuard`.
- Private routes: guarded by `AuthGuard`.
- Standalone components with lazy-loaded `loadComponent`.

### 6. UI and User Experience
- **Login Page:** Angular Material card with username/password fields and login button. Successful login updates the signal and navigates to `/products`.
- **Products Page:** Displays a welcome message and logout button. Uses signal to dynamically show user info.

### 7. Logout Flow
- Logout resets the signal to `false`.
- Clears persisted login state.
- Navigates user back to `/login`.
- Guards ensure protected routes redirect after logout.

## Key Flow Steps
| Step | Action | Guard | Behavior |
|------|--------|-------|----------|
| 1 | User opens `/products` | AuthGuard | Redirects to `/login` if unauthenticated |
| 2 | User logs in | — | Updates signal → redirects to `/products` |
| 3 | User refreshes page | — | Signal rehydrated from localStorage |
| 4 | User tries `/login` | LoginGuard | Redirects to `/products` |
| 5 | User logs out | — | Clears signal → redirects to `/login` |

## Best Practices Demonstrated
- Single Responsibility Principle for guards.
- Signal-based reactive state management.
- Declarative routing with UrlTree for redirections.
- Lazy loading standalone components.
- Separation of concerns: service handles auth logic, components handle UI.
- Consistent Material UI usage.
- Control flow syntax (`@if/@else`) for reactive templates.
- Maintainable and extensible architecture for future enhancements.

