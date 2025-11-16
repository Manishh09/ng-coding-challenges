# ngQuest Design System - Color Tokens

## Overview

This document describes the comprehensive color token system used throughout the ngQuest Angular coding challenges platform. The system is built on **OKLCH color space** for perceptual uniformity and includes alpha channel variants for layering and transparency effects.

## Theme Architecture

### Active Theme System

- **File**: `theme.scss` (main entry point)
- **Color Space**: OKLCH for brand colors, with RGBA for alpha variants
- **Palette**: Electric Violet (#8b5cf6) & Vivid Pink (#ec4899)
- **Material Design**: M3 integration with violet/rose palettes

### Light & Dark Modes

- **Light Theme**: `_light-theme.scss` - Uses OKLCH colors with violet/pink palette
- **Dark Theme**: `_dark-theme.scss` - Adjusted colors with increased contrast
- **Switching**: Managed by `ThemeService` with `dark-mode` class on body

---

## Brand Colors (Base Tokens)

### Primary Brand Colors (OKLCH)

```scss
--bright-blue: oklch(51.01% 0.274 263.83);     // #0ea5e9
--electric-violet: oklch(53.18% 0.28 296.97);  // #8b5cf6 (Primary)
--vivid-pink: oklch(65.71% 0.277 342.55);      // #ec4899 (Secondary)
--hot-pink: oklch(58.11% 0.238 342.55);
--hot-red: oklch(58.11% 0.238 15.55);
--orange-red: oklch(58.11% 0.238 25.55);
--super-green: oklch(58.11% 0.238 142.55);
--ruby-red: #E0115F;
--dark-pink: #C11C84;
```

### Gray Scale (OKLCH)

```scss
--gray-50: oklch(98.5% 0.003 240);   // Lightest
--gray-100: oklch(96.5% 0.003 240);
--gray-200: oklch(92.5% 0.003 240);
--gray-300: oklch(87.5% 0.003 240);
--gray-400: oklch(80.5% 0.003 240);
--gray-500: oklch(70.5% 0.003 240);  // Mid-tone
--gray-600: oklch(60.5% 0.003 240);
--gray-700: oklch(45.5% 0.003 240);
--gray-800: oklch(30.5% 0.003 240);
--gray-900: oklch(15.5% 0.003 240);
--gray-950: oklch(8.5% 0.003 240);   // Darkest
```

---

## Alpha Channel Tokens

### Primary Color (Electric Violet) Alpha Variants

```scss
--color-primary-alpha-5: rgba(139, 92, 246, 0.05);   // 5% opacity
--color-primary-alpha-10: rgba(139, 92, 246, 0.1);   // 10% opacity
--color-primary-alpha-20: rgba(139, 92, 246, 0.2);   // 20% opacity
--color-primary-alpha-30: rgba(139, 92, 246, 0.3);   // 30% opacity
--color-primary-alpha-40: rgba(139, 92, 246, 0.4);   // 40% opacity
--color-primary-alpha-50: rgba(139, 92, 246, 0.5);   // 50% opacity
--color-primary-alpha-60: rgba(139, 92, 246, 0.6);   // 60% opacity
--color-primary-alpha-70: rgba(139, 92, 246, 0.7);   // 70% opacity
--color-primary-alpha-80: rgba(139, 92, 246, 0.8);   // 80% opacity
--color-primary-alpha-90: rgba(139, 92, 246, 0.9);   // 90% opacity
```

**Use Cases:**

- `alpha-5`: Subtle background tints, section backgrounds
- `alpha-10`: Light hover states, skeleton loaders
- `alpha-20`: Card borders, active backgrounds
- `alpha-30`: Focus rings, strong hover states
- `alpha-40+`: Overlays, semi-transparent surfaces

### Secondary Color (Vivid Pink) Alpha Variants

```scss
--color-secondary-alpha-5: rgba(236, 72, 153, 0.05);   // 5% opacity
--color-secondary-alpha-10: rgba(236, 72, 153, 0.1);   // 10% opacity
// ... up to alpha-90
--color-secondary-alpha-90: rgba(236, 72, 153, 0.9);   // 90% opacity
```

**Use Cases:**

- Badge backgrounds
- Accent highlights
- Gradient overlays with primary color

### Gray/Slate Alpha Variants

```scss
--color-gray-alpha-5: rgba(148, 163, 184, 0.05);
--color-gray-alpha-10: rgba(148, 163, 184, 0.1);
// ... up to alpha-90
--color-gray-alpha-90: rgba(148, 163, 184, 0.9);
```

**Use Cases:**

- Borders and dividers
- Disabled states
- Text muting
- Skeleton loaders

### Black Alpha Variants

```scss
--color-black-alpha-5: rgba(0, 0, 0, 0.05);
--color-black-alpha-10: rgba(0, 0, 0, 0.1);
// ... up to alpha-90
--color-black-alpha-90: rgba(0, 0, 0, 0.9);
```

**Use Cases:**

- Shadows and overlays
- Modal backgrounds
- Dark hero card backgrounds

### White Alpha Variants

```scss
--color-white-alpha-5: rgba(255, 255, 255, 0.05);
--color-white-alpha-10: rgba(255, 255, 255, 0.1);
// ... up to alpha-90
--color-white-alpha-90: rgba(255, 255, 255, 0.9);
```

**Use Cases:**

- Light overlays on dark backgrounds
- Hero section elements
- Glass morphism effects

---

## Status & Semantic Colors

### Success (Green)

```scss
--status-success: #22c55e;              // Base green
--status-success-light: #86efac;        // Light variant
--status-success-dark: #16a34a;         // Dark variant
--status-success-alpha-10: rgba(34, 197, 94, 0.1);
--status-success-alpha-20: rgba(34, 197, 94, 0.2);
```

**Usage:** Success messages, completed states, positive indicators

### Warning (Yellow/Amber)

```scss
--status-warning: #eab308;              // Base yellow
--status-warning-light: #fde047;        // Light variant
--status-warning-dark: #ca8a04;         // Dark variant
--status-warning-alpha-10: rgba(234, 179, 8, 0.1);
--status-warning-alpha-20: rgba(234, 179, 8, 0.2);
```

**Usage:** Warning messages, caution states, attention indicators

### Error (Red)

```scss
--status-error: #ef4444;                // Base red
--status-error-light: #fca5a5;          // Light variant
--status-error-dark: #dc2626;           // Dark variant
--status-error-alpha-10: rgba(239, 68, 68, 0.1);
--status-error-alpha-20: rgba(239, 68, 68, 0.2);
```

**Usage:** Error messages, failed states, destructive actions

### Info (Blue)

```scss
--status-info: #3b82f6;                 // Base blue
--status-info-light: #93c5fd;           // Light variant
--status-info-dark: #2563eb;            // Dark variant
--status-info-alpha-10: rgba(59, 130, 246, 0.1);
--status-info-alpha-20: rgba(59, 130, 246, 0.2);
```

**Usage:** Informational messages, tips, neutral notifications

---

## State Colors

### Disabled State

```scss
--state-disabled-bg: var(--gray-100);           // Background for disabled elements
--state-disabled-text: var(--gray-400);         // Text color for disabled elements
--state-disabled-border: var(--gray-200);       // Border for disabled elements
--state-disabled-alpha: rgba(148, 163, 184, 0.4); // General disabled overlay
```

### Selected/Active State

```scss
--state-selected-bg: var(--color-primary-alpha-10);    // Background for selected items
--state-selected-border: var(--electric-violet);        // Border for selected items
--state-selected-text: var(--electric-violet);          // Text color for selected items
```

### Hover State

```scss
--state-hover-bg: var(--color-gray-alpha-5);    // Background on hover
--state-hover-border: var(--gray-300);          // Border on hover
```

### Focus State

```scss
--state-focus-ring: var(--electric-violet);               // Focus outline color
--state-focus-ring-alpha: var(--color-primary-alpha-30);  // Focus ring with transparency
```

---

## Semantic Aliases (Light Theme)

### Surface Colors

```scss
--surface-primary: var(--gray-50);       // Main background
--surface-secondary: #ffffff;             // Card backgrounds
--surface-tertiary: var(--gray-100);     // Alternate surfaces
```

### Text Colors

```scss
--text-primary: var(--gray-900);         // Main text
--text-secondary: var(--gray-700);       // Secondary text
--text-tertiary: var(--gray-500);        // Tertiary/muted text
```

### Border Colors

```scss
--border-primary: var(--gray-200);       // Primary borders
--border-secondary: var(--gray-300);     // Secondary borders
```

### Background Colors

```scss
--background-primary: #ffffff;           // Main background
--background-secondary: var(--gray-50);  // Alternate background
```

### Interactive Colors

```scss
--interactive-primary: var(--electric-violet);    // Primary interactive elements
--interactive-primary-hover: #7c3aed;             // Hover state (violet-600)
--interactive-secondary: var(--gray-100);         // Secondary interactive
--interactive-secondary-hover: var(--gray-200);   // Secondary hover
```

---

## Design System Tokens

### Spacing (8px Grid System)

```scss
--spacing-xs: 4px;    // 0.5× base
--spacing-sm: 8px;    // 1× base
--spacing-md: 16px;   // 2× base
--spacing-lg: 24px;   // 3× base
--spacing-xl: 32px;   // 4× base
--spacing-2xl: 48px;  // 6× base
--spacing-3xl: 64px;  // 8× base
--spacing-4xl: 96px;  // 12× base
```

### Border Radius

```scss
--border-radius-sm: 4px;      // Small elements
--border-radius-md: 8px;      // Standard elements
--border-radius-lg: 12px;     // Large cards
--border-radius-xl: 16px;     // Extra large surfaces
--border-radius-pill: 999px;  // Pill-shaped buttons
```

### Shadows

```scss
--shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.06);        // Subtle
--shadow-sm: 0 2px 6px rgba(15, 23, 42, 0.08);        // Small
--shadow-md: 0 8px 18px rgba(15, 23, 42, 0.12);       // Medium
--shadow-lg: 0 20px 32px rgba(15, 23, 42, 0.16);      // Large
--shadow-xl: 0 38px 60px -15px rgba(15, 23, 42, 0.24); // Extra large
```

### Animations

```scss
--animation-duration-fast: 150ms;         // Quick transitions
--animation-duration-standard: 250ms;     // Standard transitions
--animation-duration-slow: 450ms;         // Slow transitions
--animation-duration-expressive: 600ms;   // Expressive animations
--animation-easing: cubic-bezier(0.4, 0, 0.2, 1);           // Standard easing
--animation-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);  // Emphasized easing
```

---

## Usage Guidelines

### ✅ DO

- Use semantic tokens (`--text-primary`, `--surface-secondary`) for component styling
- Use alpha variants for overlays, hover states, and layering effects
- Use status colors consistently for semantic meaning
- Leverage state tokens for interactive elements
- Test color contrast for WCAG AA compliance

### ❌ DON'T

- Hardcode RGBA or HEX values in component styles
- Use brand colors directly without semantic aliases
- Mix different opacity values arbitrarily
- Override status colors for decorative purposes
- Ignore dark mode considerations

### Migration from Hardcoded Colors

**Before:**

```scss
.card {
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: rgba(148, 163, 184, 0.9);
}
```

**After:**

```scss
.card {
  background: var(--color-primary-alpha-10);
  border: 1px solid var(--color-gray-alpha-20);
  color: var(--color-gray-alpha-90);
}
```

---

## Accessibility

### Contrast Ratios (WCAG AA)

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text (18px+)**: Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast against background

### Testing Tools

- Chrome DevTools Lighthouse
- axe DevTools
- WAVE Browser Extension

### Color Blindness

- OKLCH color space provides better perceptual uniformity
- Test with Color Oracle or browser extensions
- Avoid relying solely on color for information

---

## Theme Customization

To customize the theme colors:

1. **Edit base tokens** in `theme.scss` (`:root` selector)
2. **Update alpha variants** to match new base colors
3. **Adjust light/dark theme** semantic aliases in `_light-theme.scss` and `_dark-theme.scss`
4. **Test contrast ratios** for accessibility compliance
5. **Update Material 3 palettes** if changing primary/secondary colors

---

## Related Files

- `theme.scss` - Base tokens and shared variables
- `_light-theme.scss` - Light theme semantic aliases
- `_dark-theme.scss` - Dark theme semantic aliases
- `_typography.scss` - Typography system
- `ThemeService` - Runtime theme switching

---

## Version History

- **v2.0** (Current) - Comprehensive alpha channel system, status colors, state tokens
- **v1.0** - Initial OKLCH-based theme with basic tokens

---

## Support

For questions or issues with the color system, please refer to:

- [Angular Best Practices](../../../docs/ANGULAR_BEST_PRACTICES.md)
- [Architecture Guide](../../../docs/ARCHITECTURE.md)
- [Contributing Guidelines](../../../docs/CONTRIBUTING.md)
