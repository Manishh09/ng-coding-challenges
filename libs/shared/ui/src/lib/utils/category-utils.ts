/**
 * Utility functions for working with challenge categories
 * Centralizes category-related mappings and logic
 */

/**
 * Maps category IDs to Material Icons
 * @param categoryId - The category identifier
 * @returns The Material Icon name for the category
 */
export function getCategoryIcon(categoryId: string): string {
  const iconMap: Record<string, string> = {
    'rxjs-api': 'api',
    'http': 'http',
    'angular-core': 'settings',
    'angular-routing': 'route',
    'angular-forms': 'assignment',
    'angular-signals': 'signal_cellular_alt',
  };
  return iconMap[categoryId] || 'folder';
}

/**
 * Maps category IDs to CSS badge classes
 * @param categoryId - The category identifier
 * @returns The CSS class name for category badges
 */
export function getCategoryBadgeClass(categoryId: string): string {
  const badgeMap: Record<string, string> = {
    'rxjs-api': 'badge-rxjs',
    'http': 'badge-http',
    'angular-core': 'badge-core',
    'angular-routing': 'badge-routing',
    'angular-forms': 'badge-forms',
    'angular-signals': 'badge-signals',
  };
  return badgeMap[categoryId] || 'badge-default';
}

/**
 * Maps category IDs to route paths
 * @param categoryId - The category identifier
 * @returns The route path for the category
 */
export function getCategoryRoute(categoryId: string): string {
  // Category ID is the route path by convention
  return categoryId;
}

/**
 * Checks if a category ID is valid
 * @param categoryId - The category identifier to check
 * @returns True if the category exists in our mappings
 */
export function isCategoryValid(categoryId: string): boolean {
  const validCategories = [
    'rxjs-api',
    'http',
    'angular-core',
    'angular-routing',
    'angular-forms',
    'angular-signals',
  ];
  return validCategories.includes(categoryId);
}
