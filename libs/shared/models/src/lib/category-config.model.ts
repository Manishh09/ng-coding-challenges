/**
 * Models for category configuration loaded from JSON files
 */

/**
 * Author metadata for the application
 */
export interface CategoryAuthor {
  name: string;
  avatar: string;
  profileUrl: string;
}

/**
 * Application metadata
 */
export interface CategoryMetadata {
  author: CategoryAuthor;
  repository: string;
}

/**
 * Route configuration for a category
 */
export interface CategoryRoute {
  path: string;
  moduleName: string;
  exportName: string;
}

/**
 * Visual metadata for category display
 */
export interface CategoryDisplayMetadata {
  color: string;
  gradient: string;
}

/**
 * Individual category details
 */
export interface Category {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  enabled: boolean;
  route: CategoryRoute;
  techStack: string[];
  metadata: CategoryDisplayMetadata;
}

/**
 * Root category configuration structure
 */
export interface CategoryConfig {
  version: string;
  lastUpdated: string;
  metadata: CategoryMetadata;
  categories: Category[];
}
