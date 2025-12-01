/**
 * Search configuration constants
 * Centralized search-related constants for consistency across components
 */
export const SEARCH_CONFIG = {
  /** Initial number of search results to display before "Show More" */
  INITIAL_RESULTS_COUNT: 3,

  /** Minimum search term length to trigger search */
  MIN_SEARCH_LENGTH: 2,

  /** Debounce time in milliseconds for search input */
  DEBOUNCE_TIME: 150,

  /** Maximum number of search results to return from API */
  MAX_RESULTS: 20
} as const;

/**
 * Dialog configuration for global search modal
 */
export const SEARCH_DIALOG_CONFIG = {
  width: '90vw',
  maxWidth: '700px',
  maxHeight: '85vh',
  panelClass: 'global-search-dialog',
  autoFocus: 'input' as const,
  restoreFocus: true,
  hasBackdrop: true,
  disableClose: false
} as const;
