/**
 * Available challenge category identifiers
 */
export const CHALLENGE_CATEGORY_IDS = [
  'rxjs-api',
  'angular-core',
  'angular-routing',
  'angular-forms',
  'angular-signals',
] as const;

/**
 * Maps category IDs to Material Icon names
 * Used for displaying category icons in navigation and cards
 */
export const CATEGORY_ICON_MAP: Record<string, string> = {
  'rxjs-api': 'api',
  'http': 'http',
  'angular-core': 'settings',
  'angular-routing': 'route',
  'angular-forms': 'assignment',
  'angular-signals': 'signal_cellular_alt',
};

/**
 * Maps category IDs to CSS badge class names
 * Used for category badge styling in search results and lists
 */
export const CATEGORY_BADGE_CLASS_MAP: Record<string, string> = {
  'rxjs-api': 'badge-rxjs',
  'http': 'badge-http',
  'angular-core': 'badge-core',
  'angular-routing': 'badge-routing',
  'angular-forms': 'badge-forms',
  'angular-signals': 'badge-signals',
};

/**
 * Default icon for unknown categories
 */
export const DEFAULT_CATEGORY_ICON = 'folder';

/**
 * Default badge class for unknown categories
 */
export const DEFAULT_CATEGORY_BADGE = 'badge-default';
