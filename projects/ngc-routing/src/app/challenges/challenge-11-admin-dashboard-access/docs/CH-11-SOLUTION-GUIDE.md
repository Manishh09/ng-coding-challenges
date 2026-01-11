# Solution: Role-Based Access Control

## 🧠 Approach
We need to check *not just* if the user is logged in, but *who* they are.
We use Route Data to make the guard reusable.
*   **Route Config**: `{ path: 'admin', data: { roles: ['ADMIN'] } }`
*   **Guard**: Reads `route.data['roles']` and compares with `currentUser.role`.

## 🚀 Step-by-Step Implementation

### Step 1: User Model & Service
```typescript
export interface User { name: string; role: 'ADMIN' | 'USER'; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);

  login(role: 'ADMIN' | 'USER') {
    this.currentUser.set({ name: 'Test User', role });
  }
}
```

### Step 2: The Reusable Role Guard
```typescript
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  // 1. Check if logged in
  if (!user) return router.createUrlTree(['/login']);

  // 2. Check if role matches expected roles from Route Data
  const expectedRoles = route.data['roles'] as Array<string>;
  if (expectedRoles && expectedRoles.includes(user.role)) {
    return true;
  }

  // 3. Fallback for unauthorized
  return router.createUrlTree(['/forbidden']);
};
```

### Step 3: Route Config
```typescript
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] } // Pass data to the guard
  }
];
```

## 🌟 Best Practices Used
*   **Data-Driven Guards**: Instead of writing `AdminGuard`, `ManagerGuard`, etc., we write one `RoleGuard` that reads configuration from the route definition.
*   **Signals**: Instant synchronous access to the current user state makes checking roles easy.
