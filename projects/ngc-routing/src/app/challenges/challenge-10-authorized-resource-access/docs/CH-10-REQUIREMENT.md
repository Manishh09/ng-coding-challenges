# Challenge 10: Authorized Route Guard

**Estimated Time:** 30-45 minutes
**Difficulty:** Intermediate

## 1. Challenge 🎯
**Scenario:**
You have a "Products" page that should only be accessible to logged-in users. If an unauthenticated user tries to visit it, they must be redirected to the "Login" page. Conversely, a logged-in user should not be able to visit the "Login" page again.

**Task:**
Implement Access Control using functional **CanActivate** guards.

## 2. Requirements 📋
*   [ ] **Guards**: `authGuard` (protects /products) and `guestGuard` (protects /login).
*   [ ] **Service**: `AuthService` with a Signal `isLoggedIn`.
*   [ ] **Routing**: Configure routes with these guards.
*   **Routes**:
    *   `/login` (Public, but protected from logged-in users)
    *   `/products` (Private)

## 3. Expected Output 🖼️
*   **Login Page**: Button "Login".
*   **Products Page**: Button "Logout".
*   **Behavior**:
    1.  Start at `/login`.
    2.  Click "Login" -> Redirects to `/products`.
    3.  Try manually typing `/login` in URL -> Redirects back to `/products`.
    4.  Click "Logout" -> Redirects to `/login`.
    5.  Try manually typing `/products` -> Redirects back to `/login`.

## 4. Edge Cases / Constraints ⚠️
*   **Functional Guards**: Do not use Class-based guards (deprecated).
*   **Redirects**: Guards must return `UrlTree` for redirects, not just `false`.

## 5. Success Criteria ✅
*   [ ] Guards correctly block access.
*   [ ] Guards correctly redirect.
*   [ ] `AuthService` uses Signals.
