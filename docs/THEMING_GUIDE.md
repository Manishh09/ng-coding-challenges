# Theme System

The application supports dynamic theming with CSS custom properties:

**Theme Service**: `libs/shared/services/theme.service.ts` 

```scss
// Light theme variables
:root {
  --primary-color: #dd0031;
  --surface-color: #ffffff;
  --on-surface-color: #333333;
  --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}

// Dark theme variables
[data-theme="dark"] {
  --primary-color: #ff6b6b;
  --surface-color: #1a1a1a;
  --on-surface-color: #ffffff;
}
```
