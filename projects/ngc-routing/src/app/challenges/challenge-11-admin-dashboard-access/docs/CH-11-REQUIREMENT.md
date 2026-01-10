# Challenge 11: Admin Role-Based Access

**Estimated Time:** 30-45 minutes
**Difficulty:** Intermediate

## 1. Challenge 🎯
**Scenario:**
You are adding an "Admin" section to your app. Only users with the `ADMIN` role can access it. Regular users (even if logged in) should be blocked.

**Task:**
Implement a `CanMatch` (or `CanActivate`) guard that checks for specific roles.

## 2. Requirements 📋
*   [ ] **Guard**: `RoleGuard` specific to 'ADMIN'.
*   [ ] **Service**: `AuthService` with `currentUserSignal` containing `{ name: string, role: 'ADMIN' | 'USER' }`.
*   [ ] **Routing**: Protect `/admin` route.
*   **Redirect**: Unauthorized users go to `/forbidden` or home.

## 3. Expected Output 🖼️
*   **Login**: Dropdown to select User Role (Admin vs User) and logging in.
*   **Admin Page**: Only accessible if 'Admin' was selected.
*   **Forbidden Page**: Shown if 'User' tries to access Admin.

## 4. Edge Cases / Constraints ⚠️
*   **Scalability**: The guard should be reusable for other roles if possible (e.g., passing data to the route).

## 5. Success Criteria ✅
*   [ ] Admin can access Admin Page.
*   [ ] User cannot access Admin Page.
*   [ ] Guard checks the role correctly.
