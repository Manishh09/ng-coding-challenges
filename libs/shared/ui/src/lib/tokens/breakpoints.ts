/**
 * Breakpoint constants for responsive design
 * Use with Angular CDK BreakpointObserver for consistent breakpoint handling
 *
 * @example
 * ```typescript
 * import { BREAKPOINTS } from '@ng-coding-challenges/shared/ui/tokens';
 *
 * const isMobile = breakpointObserver.isMatched(BREAKPOINTS.mobile);
 * ```
 */

export const BREAKPOINTS = {
  /** Mobile devices (up to 768px) */
  mobile: '(max-width: 768px)',

  /** Tablet devices (769px to 1024px) */
  tablet: '(min-width: 769px) and (max-width: 1024px)',

  /** Desktop devices (1025px and above) */
  desktop: '(min-width: 1025px)',

  /** Small mobile devices (up to 576px) */
  mobileSmall: '(max-width: 576px)',

  /** Large desktop devices (1440px and above) */
  desktopLarge: '(min-width: 1440px)',

  /** Extra large desktop devices (1920px and above) */
  desktopXLarge: '(min-width: 1920px)',
} as const;

/**
 * Numeric breakpoint values in pixels
 * Use for calculations or CSS-in-JS
 */
export const BREAKPOINT_VALUES = {
  mobileSmall: 576,
  mobile: 768,
  tablet: 1024,
  desktop: 1025,
  desktopLarge: 1440,
  desktopXLarge: 1920,
} as const;

/**
 * Type-safe breakpoint keys
 */
export type BreakpointKey = keyof typeof BREAKPOINTS;
