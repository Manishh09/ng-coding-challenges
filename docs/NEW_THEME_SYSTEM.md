# angular.dev Theme System

This document describes the comprehensive theming system that replicates angular.dev's visual design using CSS variables and Angular Material theming.

## Overview

The theme system is built around extracted color tokens from angular.dev, providing a consistent design language across the entire application. It supports both light and dark modes with smooth transitions and accessibility features.

## Color Tokens

### Primary Brand Colors
- **Bright Blue**: `oklch(51.01% 0.274 263.83)` - Primary brand color
- **Electric Violet**: `oklch(53.18% 0.28 296.97)` - Secondary brand color
- **Vivid Pink**: `oklch(65.71% 0.277 342.55)` - Accent color
- **Hot Pink**: `oklch(58.11% 0.238 342.55)` - Secondary accent
- **Hot Red**: `oklch(58.11% 0.238 15.55)` - Warning/error color
- **Orange Red**: `oklch(58.11% 0.238 25.55)` - Warning color
- **Super Green**: `oklch(58.11% 0.238 142.55)` - Success color

### Gray Scale
- **Gray-50**: `oklch(98.5% 0.003 240)` - Lightest gray
- **Gray-100**: `oklch(96.5% 0.003 240)` - Very light gray
- **Gray-200**: `oklch(92.5% 0.003 240)` - Light gray
- **Gray-300**: `oklch(87.5% 0.003 240)` - Medium light gray
- **Gray-400**: `oklch(80.5% 0.003 240)` - Medium gray
- **Gray-500**: `oklch(70.5% 0.003 240)` - True gray
- **Gray-600**: `oklch(60.5% 0.003 240)` - Medium dark gray
- **Gray-700**: `oklch(45.5% 0.003 240)` - Dark gray
- **Gray-800**: `oklch(30.5% 0.003 240)` - Very dark gray
- **Gray-900**: `oklch(15.5% 0.003 240)` - Almost black
- **Gray-950**: `oklch(8.5% 0.003 240)` - Darkest gray

## CSS Variables

### Base Variables
All color tokens are available as CSS variables in the `:root` selector:

```scss
:root {
  --bright-blue: oklch(51.01% 0.274 263.83);
  --electric-violet: oklch(53.18% 0.28 296.97);
  --vivid-pink: oklch(65.71% 0.277 342.55);
  // ... other colors
}
```

### Theme-Specific Variables

#### Light Mode (`.dark-mode`)
```scss
.dark-mode {
  --surface-primary: var(--gray-50);
  --surface-secondary: white;
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-700);
  --border-primary: var(--gray-200);
  --background-primary: white;
  --interactive-primary: var(--bright-blue);
  --gradient-primary: linear-gradient(135deg, var(--bright-blue), var(--electric-violet));
}
```

#### Dark Mode (`dark-mode`)
```scss
dark-mode {
  --surface-primary: var(--gray-950);
  --surface-secondary: var(--gray-900);
  --text-primary: var(--gray-50);
  --text-secondary: var(--gray-300);
  --border-primary: var(--gray-700);
  --background-primary: var(--gray-950);
  --interactive-primary: var(--bright-blue);
  --gradient-primary: linear-gradient(135deg, oklch(60% 0.274 263.83), oklch(60% 0.28 296.97));
}
```

## Angular Material Integration

### Palette Definitions
The theme system includes custom Material Design palettes based on the extracted colors:

- **Primary Palette**: Based on Bright Blue
- **Accent Palette**: Based on Vivid Pink
- **Warn Palette**: Based on Hot Red

### Theme Configuration
```scss
$angular-dev-light-theme: mat.m2-define-light-theme((
  color: (
    primary: $angular-dev-primary,
    accent: $angular-dev-accent,
    warn: $angular-dev-warn,
  ),
  typography: mat.m2-define-typography-config(
    $font-family: var(--font-family-primary)
  ),
  density: 0,
));
```

## Usage

### Basic Theme Application
The theme is automatically applied based on the CSS class on the `body` element:

- `.dark-mode` - Light theme
- `dark-mode` - Dark theme

### Theme Service
Use the `ThemeService` to programmatically control themes:

```typescript
import { ThemeService } from '@ng-coding-challenges/shared/services';

export class MyComponent {
  constructor(private themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  setLightTheme() {
    this.themeService.setTheme('light');
  }

  setDarkTheme() {
    this.themeService.setTheme('dark');
  }
}
```

### Theme Toggle Component
Use the pre-built theme toggle component:

```html
<ng-coding-challenges-theme-toggle></ng-coding-challenges-theme-toggle>
```

### CSS Classes
Use the provided utility classes for consistent styling:

```html
<!-- Text utilities -->
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-accent">Accent text</p>

<!-- Background utilities -->
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-surface">Surface background</div>

<!-- Shadow utilities -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>

<!-- Animation utilities -->
<div class="transition-fast">Fast transition</div>
<div class="transition-standard">Standard transition</div>
<div class="transition-slow">Slow transition</div>
```

### Custom Component Styling
Use the angular.dev inspired component classes:

```html
<!-- Card styling -->
<div class="angular-dev-card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

<!-- Button styling -->
<button class="angular-dev-button">Primary Button</button>
<button class="angular-dev-button secondary">Secondary Button</button>

<!-- Surface styling -->
<div class="angular-dev-surface">
  <h4>Surface Title</h4>
  <p>Surface content</p>
</div>

<!-- Code block styling -->
<div class="angular-dev-code">
  <div class="code-line">
    <span class="keyword">const</span> 
    <span class="function">message</span> = 
    <span class="string">'Hello World'</span>;
  </div>
</div>
```

## Animation System

### Duration Variables
- `--animation-duration-fast`: 150ms
- `--animation-duration-standard`: 250ms
- `--animation-duration-slow`: 350ms

### Easing Variables
- `--animation-easing`: `cubic-bezier(0.4, 0, 0.2, 1)`
- `--animation-easing-emphasized`: `cubic-bezier(0.2, 0, 0, 1)`

### Animation Classes
```html
<div class="fade-in">Fade in animation</div>
<div class="slide-in-up">Slide up animation</div>
<div class="pulse">Pulse animation</div>
```

## Spacing System

### Spacing Variables
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 16px
- `--spacing-lg`: 24px
- `--spacing-xl`: 32px
- `--spacing-2xl`: 48px
- `--spacing-3xl`: 64px

### Border Radius Variables
- `--border-radius-sm`: 4px
- `--border-radius-md`: 8px
- `--border-radius-lg`: 12px
- `--border-radius-xl`: 16px
- `--border-radius-2xl`: 24px

## Typography

### Font Families
- `--font-family-primary`: 'Inter', system fonts
- `--font-family-mono`: 'JetBrains Mono', monospace fonts

### Typography Classes
```html
<h1 class="text-primary">Primary heading</h1>
<h2 class="text-secondary">Secondary heading</h2>
<p class="text-tertiary">Tertiary text</p>
```

## Accessibility Features

### High Contrast Mode
The theme system automatically adapts to high contrast mode preferences:

```scss
@media (prefers-contrast: high) {
  :root {
    --border-primary: var(--text-primary);
    --shadow-sm: 0 1px 2px 0 var(--text-primary);
  }
}
```

### Reduced Motion
Respects user preferences for reduced motion:

```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Styles
Consistent focus indicators for keyboard navigation:

```scss
*:focus {
  outline: 2px solid var(--interactive-primary);
  outline-offset: 2px;
}
```

## Responsive Design

### Breakpoints
- `xs`: 0px
- `sm`: 576px
- `md`: 768px
- `lg`: 992px
- `xl`: 1200px
- `xxl`: 1400px

### Responsive Mixin
```scss
@mixin respond-to($breakpoint) {
  @media (min-width: map.get($breakpoints, $breakpoint)) {
    @content;
  }
}

// Usage
@include respond-to(md) {
  .my-component {
    font-size: 1.2rem;
  }
}
```

## Demo Component

A comprehensive demo component is available at `/theme-demo` that showcases:

- Color token display
- Interactive elements
- Surface variations
- Code syntax highlighting
- Typography examples
- Animation demonstrations

## File Structure

```
libs/shared/ui/src/lib/styles/
├── theme.scss              # Main theme file
└── themes.scss             # Legacy theme file (deprecated)

projects/coding-challenges/src/
├── styles.scss             # Main application styles
└── app/components/theme-demo/
    ├── theme-demo.component.ts
    ├── theme-demo.component.html
    └── theme-demo.component.scss
```

## Migration Guide

### From Legacy Theme System
1. Replace `light-theme`/`dark-theme` classes with `dark-mode`/`docs-dark-mode`
2. Update CSS variable references to use new naming convention
3. Replace old color values with new CSS variables
4. Update Material Design component overrides

### Example Migration
```scss
// Old
.light-theme {
  --surface-color: #ffffff;
  --on-surface-color: #212121;
}

// New
.dark-mode {
  --surface-secondary: white;
  --text-primary: var(--gray-900);
}
```

## Best Practices

1. **Always use CSS variables** instead of hardcoded colors
2. **Test in both light and dark modes** for all components
3. **Use semantic variable names** (e.g., `--text-primary` instead of `--color-black`)
4. **Respect user preferences** for reduced motion and high contrast
5. **Maintain consistent spacing** using the spacing system
6. **Use the animation system** for smooth transitions
7. **Test accessibility** with keyboard navigation and screen readers

## Browser Support

The theme system uses modern CSS features:
- CSS Custom Properties (CSS Variables)
- OKLCH color space
- CSS Grid and Flexbox
- Modern CSS animations

For older browsers, consider providing fallbacks or using a polyfill for CSS variables.
