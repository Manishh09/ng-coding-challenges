import { CHALLENGE_CATEGORY_IDS } from '@ng-coding-challenges/shared/models';

/**
 * Available challenge category identifiers are imported from @ng-coding-challenges/shared/models
 * This avoids circular dependencies between libraries
 * To add new categories, update the CHALLENGE_CATEGORY_IDS array in libs/shared/models/src/lib/challenge.model.ts
 */

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
  'community': 'people',
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
