# Release Process (ngQuest)

This document describes how releases are planned, prepared, and published for the **ngQuest** monorepo.

The goal of this process is to:

- Keep production stable
- Allow continuous community contributions
- Make releases predictable and easy to audit

---

## 1. Release Philosophy

ngQuest is a **community-driven** repository with continuous contributions (especially challenge content).

Therefore:

- **Not every merge creates a release**
- Releases represent **platform-level changes**, not content-only updates

### What requires a release

- UI / layout changes
- UX or navigation changes
- New platform features
- New categories (e.g. Angular Signals)
- Architectural or configuration changes

### What does NOT require a release

- Adding or updating challenges
- Documentation-only changes
- Minor content fixes

---

## 2. Branch Strategy (Release-Focused)

```
main        → Production (Vercel)
develop     → Integration / community contributions
release/*   → Release stabilization
hotfix/*    → Emergency production fixes
```

- `main` is always production-ready
- `develop` may be unstable
- Releases are promoted through a `release/*` branch

---

## 3. Versioning Strategy

ngQuest follows **Semantic Versioning**:

```
MAJOR.MINOR.PATCH
```

### Version meanings

- **MAJOR** – Breaking platform changes
- **MINOR** – New features, layouts, learning flows
- **PATCH** – Bug fixes

Examples:

- `v0.2.0` – UI & layout refresh
- `v0.3.0` – Angular Signals introduction
- `v1.0.0` – Stable, production-ready platform

> During early development, versions may remain in `0.x.x`.

---

## 4. Preparing a Release

### Step 1: Stabilize `develop`

```bash
git checkout develop
git pull origin develop
```

Ensure:

- Features are complete
- UX is validated
- No experimental code remains

---

### Step 2: Create a Release Branch

```bash
git checkout develop
git checkout -b release/vX.Y.Z
git push origin release/vX.Y.Z
```

Rules for `release/*` branches:

- No new features
- Only bug fixes, polish, and documentation
- Update `CHANGELOG.md`

---

### Step 3: Update CHANGELOG

- Move items from `[Unreleased]` to the new version section
- Add release date

```md
## [vX.Y.Z] – YYYY-MM-DD
```

Commit:

```bash
git commit -m "docs: update changelog for vX.Y.Z"
```

---

## 5. Releasing to Production

### Step 4: Merge to `main`

```bash
git checkout main
git pull origin main
git merge release/vX.Y.Z
git push origin main
```

This triggers:

- Production deployment on Vercel

---

### Step 5: Sync Back to `develop`

```bash
git checkout develop
git merge main
git push origin develop
```

This prevents divergence.

---

## 6. Tagging the Release

Create an annotated tag:

```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

Tags represent **exact production code**.

---

## 7. GitHub Release

1. Go to **GitHub → Releases**
2. Click **Draft a new release**
3. Select tag `vX.Y.Z`
4. Target branch: `main`
5. Add release notes (usually copied from `CHANGELOG.md`)

For `0.x.x` versions, mark as **Pre-release**.

---

## 8. Hotfix Process

Used for urgent production issues.

```bash
git checkout main
git checkout -b hotfix/<issue>
# apply fix
git commit -m "fix: <description>"
git push origin hotfix/<issue>
```

Merge hotfix into:

- `main`
- `develop`

Tag with a PATCH version (e.g. `v0.2.1`).

---

## 9. Post-Release Cleanup

After successful release:

```bash
git branch -d release/vX.Y.Z
git push origin --delete release/vX.Y.Z
```

---

## 10. Responsibilities

- Maintainers control releases
- Community contributors do not create releases
- CODEOWNERS + branch protection enforce safety

---

## 11. Release Checklist

Before releasing:

- [ ] `develop` is stable
- [ ] CHANGELOG updated
- [ ] Release branch created
- [ ] UI verified
- [ ] Vercel deployment successful
- [ ] Tag pushed
- [ ] GitHub Release published

---

This process ensures **ngQuest** remains stable, scalable, and community-friendly.
