# Challenge App Template

This document outlines the standard structure and steps to create a new **challenge** under the `ngc-rxjs` application in the monorepo.

---

## 🗂 Directory Structure

All RXJS-related challenges are organized inside the `ngc-rxjs` app under `src/app/challenges/`. Each challenge has its own folder with feature components, services, and models.

```
projects/
  ngc-rxjs/
    src/
      app/
        challenges/
          01-async-data-fetch/
            components/
            services/
            models/
            challenge.component.ts
            challenge.component.html
            challenge.component.scss
            REQUIREMENT.md ← Challenge-specific requirements
```

---

## ✅ Steps to Create a New Challenge

> 💡 Make sure `ngc-rxjs` Angular app already exists.

### 1. Navigate to the `ngc-rxjs` app

```bash
cd projects/ngc-rxjs/src/app/challenges
```

Create a new folder for the challenge:
```bash
mkdir 01-async-data-fetch
cd 01-async-data-fetch
```

---

### 2. Generate standalone component

Use the standalone API for each challenge’s entry component:

```bash
ng generate component challenges/01-async-data-fetch/challenge --project=ngc-rxjs --standalone
```

This creates a `challenge.component.ts` as the entry point of the challenge.

---

### 3. Add child components/services (if needed)

```bash

# Generate a component for displaying data
ng generate component challenges/01-async-data-fetch/components/data-table --project=ngc-rxjs --standalone

# Generate a service for data fetching
ng generate service challenges/01-async-data-fetch/services/data --project=ngc-rxjs
```

---

### 4. Add `REQUIREMENT.md`

Create and customize a requirement file for the challenge:
```
projects/ngc-rxjs/src/app/challenges/01-async-data-fetch/REQUIREMENT.md
```

---

### 5. Register challenge route (if routing is used)

Edit `app.routes.ts` or wherever you're managing routing to lazy-load the challenge:

```ts
{
  path: 'rxjs/01-async-data-fetch',
  loadComponent: () =>
    import('./challenges/01-async-data-fetch/challenge.component').then(m => m.ChallengeComponent)
}
```

---

## 📦 Shared Libraries

Use existing shared libraries to avoid code duplication:

| Library           | Purpose                             |
|------------------|-------------------------------------|
| `shared-ui`       | Common UI components                |
| `shared-models`   | Shared interfaces and types         |
| `shared-services` | Common API services/utilities       |

You can import them via aliases defined in `tsconfig.base.json`.

---

## 🚀 Naming Conventions

| Entity             | Convention Example              |
|--------------------|----------------------------------|
| Challenge Folder   | `01-async-data-fetch`           |
| Entry Component    | `challenge.component.ts`        |
| Route Path         | `rxjs/01-async-data-fetch`      |

This keeps all challenges well-organized under a single Angular app.

---
