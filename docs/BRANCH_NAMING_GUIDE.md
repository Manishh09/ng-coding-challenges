# Branch Naming Convention Guide

To keep our repository organized and make collaboration easier, please follow the branch naming conventions outlined below.


## General Format

`<type>/<category>/<challenge-id>-<short-description>`


### Example

`feature/rxjs/01-fetch-products`


---

## Branch Name Components

| Component       | Description                                                 | Examples                   |
|-----------------|-------------------------------------------------------------|----------------------------|
| `<type>`        | The type of work being done (see supported types below)     | `feat`, `fix`, `docs`      |
| `<category>`    | The challenge category or project area                       | `rxjs`, `forms`, `routing` |
| `<challenge-id>`| A two-digit identifier for the challenge or task number     | `01`, `02`, `03`           |
| `<short-description>` | A concise kebab-case description of the branch purpose | `fetch-products`, `form-validation` |

---

## Supported `<type>` Prefixes

| Prefix    | Use Case                                               |
|-----------|--------------------------------------------------------|
| `feat`    | New feature or challenge implementation                |
| `fix`     | Bug fixes or corrections                                |
| `refactor`| Code refactoring without changing external behavior    |
| `test`    | Adding or modifying tests                               |
| `docs`    | Documentation updates (e.g., README, REQUIREMENT.md)   |
| `chore`   | Maintenance tasks, build scripts, tooling updates       |

---

## Examples

| Purpose                      | Branch Name                          |
|------------------------------|--------------------------------------|
| New RxJS challenge           | `feat/rxjs/01-fetch-products`        |
| Fix form validation bug      | `fix/forms/02-reactive-form-valid`  |
| Update routing docs          | `docs/routing/03-nested-routes`     |
| Add tests for challenge 01   | `test/rxjs/01-fetch-products`       |

---

## Guidelines

- Use **lowercase** letters and hyphens (`-`) only — no spaces or underscores.
- Use **two-digit numbers** to keep challenges in order.
- Keep branch names **concise but descriptive**.
- Avoid redundant words like “challenge” or “task” in the branch name.
- Make sure the branch name reflects the **category and purpose**.

---

## Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/<category>/<challenge-id>-<short-description>
