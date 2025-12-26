/**
 * Loading configuration constants
 * Centralized loading-related constants for consistency
 */
export const LOADING_CONFIG = {
  /** Default loading delay in milliseconds for simulated operations */
  DEFAULT_DELAY_MS: 500,

  /** Short delay for quick transitions */
  SHORT_DELAY_MS: 300,

  /** Long delay for extended operations */
  LONG_DELAY_MS: 1000,

  /** Focus delay after dialog animations */
  FOCUS_DELAY_MS: 150
} as const;
