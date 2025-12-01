/*
 * Public API Surface of shared-models
 */

// Add exports for other shared models here
export * from './lib/theme.model';
export * from './lib/challenge.model';
export * from './lib/challenge-category.model';
export * from './lib/search-result.interface';

// Export configuration models for JSON-based config loading
export * from './lib/challenge-config.model';
export * from './lib/category-config.model';

// Export specific types from challenge.model for better tree-shaking
export type { DifficultyLevel, ChallengeCategoryId, Author, Challenge, ChallengeDetails } from './lib/challenge.model';

