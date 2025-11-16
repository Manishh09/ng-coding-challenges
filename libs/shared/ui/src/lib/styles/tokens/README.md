# Design Token Architecture

## 🏗️ Token-Based Design System

This directory contains all design tokens organized by category following the **Atomic Design Token** pattern. Each file represents a single concern and can be imported independently.

## 📁 File Structure

```
tokens/
├── _tokens.scss          ⭐ Main registry - import this!
├── _colors.scss          🎨 Color system & alpha variants
├── _typography.scss      📝 Typography scale & fonts
├── _spacing.scss         📏 Spacing & border radii
├── _icons.scss           🎯 Icon size scale
├── _elevation.scss       🌓 Shadow system
├── _motion.scss          ⚡ Animation tokens
└── _breakpoints.scss     📱 Responsive breakpoints
```

## 🚀 Quick Start

### Import All Tokens (Recommended)

```scss
@use '../path/to/tokens/tokens' as tokens;

:root {
  @include tokens.all-css-vars();
}

body {
  @include tokens.apply-typography();
}
```

### Import Specific Categories

```scss
@use '../path/to/tokens/colors' as colors;
@use '../path/to/tokens/typography' as typography;

.my-component {
  color: colors.$gray-900;
  font-size: typography.$font-size-lg;
}
```

## 📚 Token Categories

### 🎨 Colors (_colors.scss)

- **90 tokens** across 4 alpha variants
- OKLCH color space for brand colors
- Primary (violet), Accent (rose), Black, White alphas
- 10 opacity levels (5%-90%) per color

### 📝 Typography (_typography.scss)

- **40+ tokens** for complete typography system
- Font families (Inter, JetBrains Mono)
- 9-level size scale (xs → 5xl)
- 6 font weights
- 10 semantic tokens (page titles, card titles, etc.)

### 📏 Spacing (_spacing.scss)

- **13 tokens** for spacing and borders
- 8-level spacing scale (4px → 96px)
- 5 border radius levels (sm → pill)

### 🎯 Icons (_icons.scss)

- **7 tokens** for icon sizing
- Standardized scale (16px → 64px)
- Consistent visual hierarchy

### 🌓 Elevation (_elevation.scss)

- **5 tokens** for shadow system
- Progressive depth (xs → xl)
- Consistent elevation perception

### ⚡ Motion (_motion.scss)

- **6 tokens** for animation
- 4 duration levels (150ms → 600ms)
- 2 easing functions (Material Design)

### 📱 Breakpoints (_breakpoints.scss)

- **4 tokens** for responsive design
- Material Design standard (600px → 1920px)

## 💡 Usage Examples

### Using Color Tokens

```scss
.card {
  background: var(--color-primary-alpha-10);    // Light violet tint
  border: 1px solid var(--color-gray-alpha-20); // Subtle border
  color: var(--gray-900);                       // Dark text
  
  &:hover {
    background: var(--color-primary-alpha-20);  // Darker on hover
  }
}
```

### Using Typography Tokens

```scss
.title {
  font-size: var(--font-size-card-title);      // 1.25rem
  font-weight: var(--font-weight-semibold);    // 600
  
  @media (max-width: 960px) {
    font-size: var(--font-size-card-title-mobile); // 1.125rem
  }
}
```

### Using Spacing & Elevation

```scss
.button {
  padding: var(--spacing-sm) var(--spacing-lg); // 8px 24px
  border-radius: var(--border-radius-md);       // 8px
  box-shadow: var(--shadow-sm);                 // Subtle shadow
  
  &:hover {
    box-shadow: var(--shadow-md);               // Elevated shadow
  }
}
```

### Using Motion Tokens

```scss
.animated {
  transition: all var(--animation-duration-standard) var(--animation-easing);
  // 250ms cubic-bezier(0.4, 0, 0.2, 1)
}
```

## ✨ Benefits

1. **Single Responsibility**: Each file handles one concern
2. **Tree Shaking**: Import only what you need
3. **IntelliSense**: Better autocomplete in IDEs
4. **Maintainability**: Easy to find and update tokens
5. **Scalability**: Add new tokens without file bloat
6. **Type Safety**: SCSS variables provide compile-time checks

## 🔄 Migration Path

### Old Pattern (Monolithic)

```scss
// theme.scss - 431 lines mixing everything
:root {
  --bright-blue: oklch(...);
  --font-size-xs: 0.75rem;
  --spacing-xs: 4px;
  // ... 400+ more lines
}
```

### New Pattern (Modular)

```scss
// tokens/_colors.scss - Just colors
$bright-blue: oklch(...);
@mixin color-css-vars() { ... }

// tokens/_typography.scss - Just typography
$font-size-xs: 0.75rem;
@mixin typography-css-vars() { ... }

// tokens/_tokens.scss - Registry
@use './colors';
@use './typography';
@mixin all-css-vars() {
  @include colors.color-css-vars();
  @include typography.typography-css-vars();
}
```

## 📊 Token Count by Category

| Category | Token Count | Purpose |
|----------|-------------|---------|
| Colors | 90 | Brand colors + alpha variants |
| Typography | 40 | Font system |
| Spacing | 13 | Layout rhythm |
| Icons | 7 | Icon sizing |
| Elevation | 5 | Depth/shadows |
| Motion | 6 | Animations |
| Breakpoints | 4 | Responsive design |
| **Total** | **165** | Complete design system |

## 🎯 Design Principles

1. **Atomic**: Each token is independently meaningful
2. **Composable**: Tokens combine to create components
3. **Semantic**: Names describe purpose, not value
4. **Scalable**: Easy to add without breaking existing
5. **Accessible**: WCAG AA compliant color combinations

## 🔗 Related Documentation

- [Main README](../README.md) - Complete design system overview
- [Material Design 3](https://m3.material.io/)
- [OKLCH Color Space](https://oklch.com/)
- [Design Tokens W3C](https://design-tokens.github.io/community-group/format/)

---

**Maintained By**: UI/UX Architecture Team  
**Last Updated**: Phase 7 - Architecture Refactoring
