/**
 * Models for challenge configuration loaded from JSON files
 * Optimized structure with category-keyed and slug-keyed nested objects for O(1) lookups
 */

import type { ChallengeCategoryId } from './challenge.model';

/**
 * Difficulty level of a challenge
 */
export type ChallengeDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

/**
 * Category identifier for challenges (JSON config version)
 * Uses the same type as ChallengeCategoryId for consistency
 * CategorySlug and ChallengeCategoryId are intentionally the same
 */
export type CategorySlug = ChallengeCategoryId;

/**
 * Author information for challenges
 */
export interface ChallengeAuthor {
  name: string;
  avatar: string;
  profileUrl: string;
}

/**
 * Links to challenge documentation and resources
 */
export interface ChallengeLinks {
  requirement: string;
  solution: string;
  github: string;
}

/**
 * Workspace component information
 */
export interface ChallengeWorkspace {
  componentPath: string;
  componentName: string;
}

/**
 * Individual challenge details from JSON configuration
 */
export interface ChallengeData {
  id: number;
  slug: string;
  title: string;
  categoryId: CategorySlug;
  difficulty: ChallengeDifficulty;
  enabled: boolean;
  order: number;
  description: string;
  longDescription: string;
  tags: string[];
  estimatedTime: string;
  prerequisites: string[];
  learningOutcomes: string[];
  requirementList: string[];
  links: ChallengeLinks;
  workspace: ChallengeWorkspace;
  isNew?: boolean;
}

/**
 * Challenges organized by category, then by slug
 * Structure: { "rxjs-api": { "fetch-products": {...}, ... }, ... }
 * Enables O(1) lookups: challenges[categoryId][slug]
 */
export type ChallengesByCategory = Record<CategorySlug, Record<string, ChallengeData>>;

/**
 * Root challenge configuration structure
 */
export interface ChallengeConfig {
  version: string;
  lastUpdated: string;
  baseRepository: string;
  defaultAuthor: ChallengeAuthor;
  challenges: ChallengesByCategory;
}
