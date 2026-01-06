# ngc-forms

Angular Forms Challenges - covering template-driven forms, reactive forms, form validation, custom validators (sync & async), dynamic forms, form arrays, cross-field validation, and ControlValueAccessor patterns.

## Project Structure

```
src/app/
├── challenges/                    # All challenge implementations
│   ├── challenge-XX-[name]/       # Individual challenge folder
│   │   ├── components/            # Challenge workspace components
│   │   ├── services/              # Optional services
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
| CH-12 | Reactive Login Form | [View](src/app/challenges/challenge-12-reactive-login-form/docs/CH-12-REQUIREMENT.md) |
| CH-13 | Unique Name Validator | [View](src/app/challenges/challenge-13-duplicate-project-name-validator/docs/CH-13-REQUIREMENT.md) |
| CH-14 | Async Email Validator | [View](src/app/challenges/challenge-14-email-availability-check/docs/CH-14-REQUIREMENT.md) |
| CH-15 | Cross-Field Validation (Date Range) | [View](src/app/challenges/challenge-15-date-range-validation/docs/CH-15-REQUIREMENT.md) |
| CH-16 | Dynamic FormArray | [View](src/app/challenges/challenge-16-dynamic-form-array/docs/CH-16-REQUIREMENTS.md) |
| CH-17 | Custom Input (ControlValueAccessor) | [View](src/app/challenges/challenge-17-custom-input-cva/docs/CH-17-REQUIREMENT.md) |
| CH-18 | Server Driven Dynamic Forms | [View](src/app/challenges/challenge-18-server-driven-dynamic-form/docs/CH-18-REQUIREMENT.md) |

---

## Category Metadata

**Route:** `/challenges/angular-forms`  
**Import Alias:** `@ngc-forms`  
**Exported Routes:** `NGC_FORMS_ROUTES`  
**Category ID:** `angular-forms`  
**Category Order:** `4`
