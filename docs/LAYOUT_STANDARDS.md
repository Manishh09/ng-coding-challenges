# Layout Standards - Container Max-Width Guidelines

## 📐 Container Max-Width Standards

### Design System Variables

```scss
:root {
  // Content max-widths
  --max-width-reading: 800px;      // Text-heavy pages (optimal reading)
  --max-width-content: 1200px;     // Standard app content
  --max-width-wide: 1440px;        // Wide layouts (grids, lists)
  --max-width-section: 1280px;     // Landing page sections
  
  // Character-based constraints
  --max-width-text-narrow: 65ch;   // ~60-70 characters per line
  --max-width-text-normal: 75ch;   // ~70-80 characters per line
}
```

### Page-Level Container Standards

| Page Type | Max-Width | Horizontal Padding | Use Case |
|-----------|-----------|-------------------|----------|
| **Marketing/Landing** | `1280px` | 48px (2xl) desktop | Hero sections, feature grids |
| **List/Browser Views** | `1440px` | 48px (2xl) desktop | Challenge browser, category lists |
| **Detail/Reading Views** | `1200px` | 48px (2xl) desktop | Challenge details, articles |
| **Instructional Content** | `1200px` | 48px (2xl) desktop | Getting started, documentation |

### Responsive Padding Standards

```scss
.page-container {
  max-width: var(--max-width-content);
  margin: 0 auto;
  
  // Responsive horizontal padding
  padding-inline: var(--spacing-md);     // 16px mobile (≤768px)
  
  @media (min-width: 769px) {
    padding-inline: var(--spacing-xl);   // 32px tablet (769-1023px)
  }
  
  @media (min-width: 1024px) {
    padding-inline: var(--spacing-2xl);  // 48px desktop (≥1024px)
  }
}
```

## 🎯 UX Rationale

### Reading Comfort (WCAG Guidelines)
- **45-75 characters per line** = Optimal reading speed and comprehension
- **75-90 characters** = Acceptable but not ideal
- **>90 characters** = Uncomfortable, increased cognitive load

### Grid Layouts
- **1440px** allows 3-4 cards (340-400px each) with proper gaps
- **1280px** standard for Material Design grid systems
- Prevents cards from being too wide and losing visual hierarchy

### Vertical Rhythm
- Consistent max-width creates visual alignment across pages
- Helps users predict content location during navigation
- Reduces eye strain on ultra-wide monitors (>1920px)

## 📱 Mobile-First Approach

All containers should be 100% width on mobile with appropriate padding:

```scss
.container {
  width: 100%;
  max-width: var(--max-width-content);
  margin-inline: auto;
  padding-inline: var(--spacing-md); // Always 16px mobile
}
```

## ✅ Implementation Checklist

- [ ] Add CSS custom properties to design system
- [ ] Update landing page sections (1280px)
- [ ] Add max-width to challenge browser (1440px)
- [ ] Optimize challenge details (1200px or 900px for reading)
- [ ] Verify getting started is using 1200px ✅
- [ ] Test on ultra-wide monitors (2560px+)
- [ ] Ensure consistent centering with `margin: 0 auto`

## 🔍 Testing Breakpoints

Test at these viewport widths:
- **320px** - Small mobile
- **375px** - iPhone SE
- **768px** - iPad portrait
- **1024px** - iPad landscape / small laptop
- **1440px** - Standard desktop
- **1920px** - Full HD
- **2560px** - 2K/QHD (where max-width is crucial)

---

**Last Updated:** November 27, 2025
**Version:** 1.0
