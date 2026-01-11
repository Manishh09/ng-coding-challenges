# ngc-shell

Main shell application for Angular Coding Challenges. This application serves as the host for various challenge categories, each implemented as separate Angular projects within the workspace. It provides the overall layout, routing, navigation, and lazy-loads all category applications.

## Project Structure

```
src/app/
├── components/
│   ├── get-started/           # Getting started guide component
│   └── ...                    # Other shell components
├── shared/                    # Shell-specific shared utilities
├── challenges/                # Empty - challenges are in category apps
├── app.component.ts           # Root shell component
├── app.config.ts              # Application configuration
└── app.routes.ts              # Main routing with lazy-loaded categories
```

## Hosted Category Applications

| Order | Category ID | Route | Description |
|---|---|---|---|
| 1 | rxjs-api | `/challenges/rxjs-api` | RxJS & API Challenges |
| 2 | angular-core | `/challenges/angular-core` | Angular Core Concepts |
| 3 | angular-routing | `/challenges/angular-routing` | Routing & Guards |
| 4 | angular-forms | `/challenges/angular-forms` | Forms & Validation |
| 5 | angular-signals | `/challenges/angular-signals` | Signals API |

## Features

- **Lazy Loading**: All category apps are lazy-loaded for optimal performance
- **Three-Level Routing**: Category list → Challenge details → Workspace
- **Route Resolvers**: Pre-fetch data before navigation
- **Responsive Layout**: Mobile-friendly design with navigation
- **Landing Page**: Introduction and category overview
- **Getting Started**: Setup and usage guide

---

## Application Metadata

**Main Route:** `/`  
**Categories Base:** `/challenges`  
**Application Type:** Shell/Host Application  
**Architecture:** Monorepo with lazy-loaded category app routes
