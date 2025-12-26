# 🏷️ Branch Naming Guide

This guide defines a **consistent branch naming convention** for our repository to keep history organized and easily searchable.

---

## 📌 General Rules
1. **Use lowercase** letters.
2. **Use kebab-case** (words separated by `-`).
3. **No spaces** or special characters.
4. Always branch off from the latest `develop`.
5. Prefix branches with their **type** to indicate purpose.

---

## 🔹 Branch Types

| Prefix            | Purpose                                                                 | Example                                      |
|-------------------|-------------------------------------------------------------------------|----------------------------------------------|
| `feature/`        | For new features or major additions.                                   | `feature/user-profile-page`                  |
| `bugfix/`         | For fixing reported bugs.                                              | `bugfix/login-error-handling`                |
| `hotfix/`         | For urgent production fixes.                                           | `hotfix/payment-api-crash`                   |
| `docs/`           | For documentation updates or improvements.                            | `docs/update-readme`                         |
| `chore/`          | For routine maintenance (deps updates, cleanup, config changes).      | `chore/update-dependencies`                  |
| `experiment/`     | For experimental or prototype work.                                   | `experiment/new-ui-layout`                   |

---

## 🏆 Challenge Branches

When adding a new challenge, follow this pattern:

`feature/add/challenge-<number>-<name>
`

**Rules:**
- `<number>` → Two-digit challenge number (e.g., `01`, `02`, `10`).
- `<short-description>` → Brief description in **kebab-case**.
- Keep description concise but meaningful.

**Examples:**
- feature/add/challenge-01-fetch-product-list
- feature/add/challenge-02-user-authentication
- feature/add/challenge-03-client-side-search
- feature/add/challenge-04-server-side-search

---

## 📂 Workflow Example

```bash
# 1️⃣ Switch to main and pull latest
git checkout develop
git pull origin develop

# 2️⃣ Create a new challenge branch
git checkout -b feature/add/challenge-04-server-side-search

# 3️⃣ Push branch to remote
git push -u origin feature/add/challenge-04-server-side-search

