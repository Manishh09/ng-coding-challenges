# Changelog

All notable changes to **ngQuest** will be documented in this file.

This project follows:

- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

## [Unreleased]

### Added

- Latest card component for showcasing featured challenges on landing page
- Challenge card redesign with improved visual hierarchy and UX
- Consistent card component sizing and spacing standards

### Changed

- **Card Component Redesign**:
  - Latest card: Removed challenge ID, moved title to header with difficulty badge
  - Optimized card sizing (200px min-height, 280-340px width constraints)
  - Improved visual hierarchy with title, difficulty, description, and category pill placement
  - Consistent `var(--spacing-md)` padding across header, body, and actions
  - Simplified HTML structure by removing redundant wrapper elements
- **Challenge Card Improvements**:
  - Enhanced border visibility in both light and dark modes
  - Better responsive behavior with proper mobile stacking
- Landing page grid layout changed from CSS Grid to Flexbox for better card control
- Updated "Author" to "Created By" label in challenge details for community challenges

### Fixed

- Fixed syntax errors and malformed CSS in latest-card component
- Removed duplicate responsive rules and dead CSS code
- Fixed category pill stretching to full width (now uses `align-self: flex-start`)
- Improved consistent alignment - header and body content start at same line
- Removed unnecessary `position: relative` and `z-index` declarations
- Fixed Material button color conflicts (removed `color="primary"` attribute)

### Removed

- Challenge ID display from latest card for cleaner, more focused design
- Redundant hover transforms and duplicate media queries
- ~60-70 lines of unused/dead CSS code from landing page component

> **Note**: Challenge-only updates may appear under **Unreleased** and are continuously delivered.
> Versioned releases focus on platform, UX, and architectural changes.

---

## [v0.2.0](https://github.com/Manishh09/ng-coding-challenges/releases/tag/v0.2.0) – 2026-01-01

### Added

- New challenges under Angular Forms category
- New category for Community Contributions
- Updated challenge instructions for clarity
- New redesigned layout with improved visual hierarchy
- Sidebar navigation for easier access to challenge categories
- Dark mode support
- Intentional empty states for categories with no challenges
- UX foundation for upcoming Angular Signals challenges

### Changed

- Improved navigation across challenge categories
- Better spacing, alignment, and readability across the app
- Enhanced responsive behavior for smaller screens

### Fixed

- Minor UI inconsistencies and alignment issues across different challenges

---

## [v0.1.0] – 2025-08-01

### Added

- Initial public release of ngQuest
- Category-based Angular coding challenges
- Core sections including:
  - Angular Core
  - RxJS-APIs
  - Routing
- Deployed live on Vercel

---

## Versioning Strategy

- **MAJOR** version increments for breaking platform changes
- **MINOR** version increments for new features, layouts, or learning flows
- **PATCH** version increments for bug fixes
- **Challenge-only contributions** do not always trigger a version bump

---

## Contribution Notes

- Community contributors typically add or improve challenges
- Platform releases are curated and tagged by maintainers
- See [CONTRIBUTING.md](/CONTRIBUTING.md) for contribution guidelines
