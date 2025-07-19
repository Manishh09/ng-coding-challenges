# Challenge App Template

This document provides the structure and steps for creating a new challenge app in the monorepo.

## Directory Structure

For each new challenge, create the following structure:

```
projects/
  challenge-name/
    public/
      favicon.ico
      assets/
    src/
      app/
        components/
        services/
        models/
      index.html
      main.ts
      styles.scss
      REQUIREMENT.md  (Challenge-specific requirements)
    tsconfig.app.json
    tsconfig.spec.json
```

## Steps to Create a New Challenge

1. Use Angular CLI to generate a new application:
   ```
   ng generate application challenge-name --project-root=projects/challenge-name
   ```

2. Update angular.json to include the new project configuration

3. Add routing if needed:
   ```
   ng generate module app-routing --flat --project=challenge-name
   ```

4. Create component(s) for the challenge:
   ```
   ng generate component components/feature-name --project=challenge-name
   ```

5. Create service(s) if needed:
   ```
   ng generate service services/service-name --project=challenge-name
   ```

6. Update the package.json scripts to include commands for the new challenge:
   ```json
   "start:challenge-name": "ng serve challenge-name",
   "build:challenge-name": "ng build challenge-name"
   ```

7. Copy the REQUIREMENT.md template and customize it for the specific challenge

## Shared Libraries

Leverage the shared libraries for common functionality:

- `shared-ui`: For common UI components
- `shared-models`: For common data models
- `shared-services`: For common services (API clients, utilities, etc.)
