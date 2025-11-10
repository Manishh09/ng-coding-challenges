# Branch Naming Guide

This guide defines a **consistent and scalable branch naming convention** for our repository to keep history organized, searchable, and collaboration-friendly.

---

## Overview

We follow a **GitFlow-inspired branching model**, where:

| Branch | Purpose |
|--------|----------|
| `main` | Stable, production-ready code |
| `develop` | Ongoing active development base |
| Feature/bugfix/hotfix branches | Temporary branches for new work that merge into `develop` |

---

## General Rules

1. **Use lowercase** letters only.  
2. **Use kebab-case** — separate words with `-`.  
3. **Avoid spaces or special characters.**  
4. Always branch off from the latest `develop`.  
5. Use a **prefix** to indicate the purpose of the branch.  
6. Keep branch names **short, descriptive, and meaningful** (ideally ≤ 6 words).  

---

## Branch Types

| Prefix | Purpose | Example |
|--------|----------|----------|
| `feature/` | For new features or major additions. | `feature/user-profile-page` |
| `bugfix/` | For fixing reported bugs. | `bugfix/login-error-handling` |
| `hotfix/` | For urgent production fixes. | `hotfix/payment-api-crash` |
| `docs/` | For documentation updates or improvements. | `docs/update-readme` |
| `chore/` | For routine maintenance (deps update, cleanup, config). | `chore/update-dependencies` |
| `experiment/` | For experimental or prototype work. | `experiment/new-ui-layout` |
| `task/` *(optional)* | For internal refactors or improvement tasks. | `task/refactor-shared-ui` |

---

## Challenge Branches

When adding a new challenge, follow this format:
`feature/add/<category>/challenge-<number>-<short-description>`

### Rules

- `<category>` → Category app name (e.g., `core`, `routing`, `rxjs-api`).  
- `<number>` → Two-digit challenge number (e.g., `01`, `02`, `10`).  
- `<short-description>` → Concise kebab-case summary of the challenge.  

### Examples

- `feature/add/core/challenge-01-fetch-product-list`
- `feature/add/rxjs-api/challenge-03-api-retry-mechanism`
- `feature/add/routing/challenge-04-dynamic-navigation`

---

## Example Workflow

```bash
# 1️⃣ Switch to develop and pull latest changes
git checkout develop
git pull origin develop

# 2️⃣ Create a new challenge branch
git checkout -b feature/add/core/challenge-04-server-side-search

# 3️⃣ Push branch to remote
git push -u origin feature/add/core/challenge-04-server-side-search
