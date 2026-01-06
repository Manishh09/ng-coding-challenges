# ngc-routing

Angular Routing Challenges - covering route guards (CanActivate, CanDeactivate, CanMatch), route resolvers, lazy loading, route parameters, navigation guards, role-based access control, and unsaved changes protection.

## Project Structure

```
src/app/
├── challenges/                    # All challenge implementations
│   ├── challenge-XX-[name]/       # Individual challenge folder
│   │   ├── components/            # Challenge workspace components
│   │   ├── services/              # Optional services
│   │   ├── guards/                # Route guards
│   │   ├── models/                # Optional TypeScript interfaces
│   │   └── docs/                  # Challenge documentation
│   │       ├── CH-XX-REQUIREMENT.md
│   │       └── CH-XX-SOLUTION_GUIDE.md
├── app.component.ts               # Root component
├── app.config.ts                  # Application configuration
└── app.routes.ts                  # Routing configuration
```

## Challenge List

| ID | Name | Link |
|---|---|---|
| CH-10 | Authorized Route Guard | [View](src/app/challenges/challenge-10-authorized-resource-access/docs/CH-10-REQUIREMENT.md) |
| CH-11 | Admin Role-Based Access | [View](src/app/challenges/challenge-11-admin-dashboard-access/docs/CH-11-REQUIREMENT.md) |
| CH-19 | Unsaved Changes Guard | [View](src/app/challenges/challenge-19-unsaved-form-changes/docs/CH-19-REQUIREMENT.md) |

---

## Category Metadata

**Route:** `/challenges/angular-routing`  
**Import Alias:** `@ngc-routing`  
**Exported Routes:** `NGC_ROUTING_ROUTES`  
**Category ID:** `angular-routing`  
**Category Order:** `3`
