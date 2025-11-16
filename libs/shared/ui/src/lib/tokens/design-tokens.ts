/**
 * Design system spacing tokens
 * Based on 8px grid system for consistent spacing throughout the application
 *
 * @example
 * ```typescript
 * import { SPACING } from '@ng-coding-challenges/shared/ui/tokens';
 *
 * const padding = SPACING.lg; // '24px'
 * ```
 */
export const SPACING = {
  /** 2px - Minimal spacing for tight layouts */
  xxs: '2px',

  /** 4px - Extra small spacing */
  xs: '4px',

  /** 8px - Small spacing */
  sm: '8px',

  /** 16px - Medium spacing (base unit) */
  md: '16px',

  /** 24px - Large spacing */
  lg: '24px',

  /** 32px - Extra large spacing */
  xl: '32px',

  /** 48px - 2XL spacing */
  '2xl': '48px',

  /** 64px - 3XL spacing */
  '3xl': '64px',

  /** 96px - 4XL spacing */
  '4xl': '96px',

  /** 128px - 5XL spacing */
  '5xl': '128px',
} as const;

/**
 * Design system animation durations
 */
export const ANIMATION_DURATION = {
  /** 150ms - Fast transitions */
  fast: '150ms',

  /** 300ms - Standard transitions */
  standard: '300ms',

  /** 500ms - Slow transitions */
  slow: '500ms',

  /** 1000ms - Extra slow transitions */
  xslow: '1000ms',
} as const;

/**
 * Design system animation easing functions
 */
export const ANIMATION_EASING = {
  /** Standard ease-in-out */
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',

  /** Emphasized ease (Angular Material style) */
  emphasized: 'cubic-bezier(0.4, 0.0, 0.6, 1)',

  /** Deceleration curve */
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',

  /** Acceleration curve */
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',

  /** Sharp curve */
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
} as const;

/**
 * Design system border radius values
 */
export const BORDER_RADIUS = {
  /** No radius */
  none: '0',

  /** 4px - Small radius */
  sm: '4px',

  /** 8px - Medium radius */
  md: '8px',

  /** 12px - Large radius */
  lg: '12px',

  /** 16px - Extra large radius */
  xl: '16px',

  /** 24px - 2XL radius */
  '2xl': '24px',

  /** 32px - 3XL radius */
  '3xl': '32px',

  /** 9999px - Pill shape */
  pill: '9999px',

  /** 50% - Circle */
  circle: '50%',
} as const;

/**
 * Design system z-index layers
 */
export const Z_INDEX = {
  /** -1 - Behind content */
  behind: -1,

  /** 0 - Base layer */
  base: 0,

  /** 10 - Raised elements */
  raised: 10,

  /** 100 - Dropdown menus */
  dropdown: 100,

  /** 500 - Sticky headers */
  sticky: 500,

  /** 1000 - Fixed elements */
  fixed: 1000,

  /** 1100 - Overlay backdrop */
  overlay: 1100,

  /** 1200 - Modal dialogs */
  modal: 1200,

  /** 1300 - Popover/Tooltip */
  popover: 1300,

  /** 9999 - Toast notifications */
  toast: 9999,
} as const;

/**
 * Design system shadow tokens
 */
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

/**
 * Design system font sizes
 */
export const FONT_SIZE = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
} as const;

/**
 * Design system font weights
 */
export const FONT_WEIGHT = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/**
 * Design system icon sizes
 * Standardized icon sizes for consistent visual hierarchy
 *
 * @example
 * ```typescript
 * import { ICON_SIZE } from '@ng-coding-challenges/shared/ui/tokens';
 *
 * const iconSize = ICON_SIZE.md; // '1.5rem' (24px)
 * ```
 */
export const ICON_SIZE = {
  /** 1rem (16px) - Extra small icons, inline with text */
  xs: '1rem',

  /** 1.25rem (20px) - Small icons, badges */
  sm: '1.25rem',

  /** 1.5rem (24px) - Standard icons, most UI elements */
  md: '1.5rem',

  /** 2rem (32px) - Large icons, prominent UI elements */
  lg: '2rem',

  /** 2.5rem (40px) - Extra large icons */
  xl: '2.5rem',

  /** 3rem (48px) - Feature icons, category cards */
  '2xl': '3rem',

  /** 4rem (64px) - Hero icons */
  '3xl': '4rem',
} as const;

/**
 * Type-safe design token types
 */
export type SpacingToken = keyof typeof SPACING;
export type AnimationDurationToken = keyof typeof ANIMATION_DURATION;
export type AnimationEasingToken = keyof typeof ANIMATION_EASING;
export type BorderRadiusToken = keyof typeof BORDER_RADIUS;
export type ZIndexToken = keyof typeof Z_INDEX;
export type ShadowToken = keyof typeof SHADOWS;
export type FontSizeToken = keyof typeof FONT_SIZE;
export type FontWeightToken = keyof typeof FONT_WEIGHT;
export type IconSizeToken = keyof typeof ICON_SIZE;
