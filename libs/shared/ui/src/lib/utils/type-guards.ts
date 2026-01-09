import { ChallengeCategoryId, DifficultyLevel } from '@ng-coding-challenges/shared/models';

/**
 * Type guard to check if a string is a valid ChallengeCategoryId
 * @param value - The value to check
 * @returns True if the value is a valid ChallengeCategoryId
 */
export function isValidCategory(value: string): value is ChallengeCategoryId {
  const validCategories: ChallengeCategoryId[] = [
    'rxjs-api',
    'angular-core',
    'angular-routing',
    'angular-forms',
    'angular-signals',
    'http',
  ];
  return validCategories.includes(value as ChallengeCategoryId);
}

/**
 * Type guard to check if a string is a valid DifficultyLevel
 * @param value - The value to check
 * @returns True if the value is a valid DifficultyLevel
 */
export function isValidDifficulty(value: string): value is DifficultyLevel {
  const validDifficulties: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  return validDifficulties.includes(value as DifficultyLevel);
}

/**
 * Safely converts a string to ChallengeCategoryId with fallback
 * @param value - The value to convert
 * @param fallback - The fallback value if validation fails
 * @returns A valid ChallengeCategoryId
 */
export function toChallengeCategoryId(
  value: string | undefined,
  fallback: ChallengeCategoryId = 'rxjs-api'
): ChallengeCategoryId {
  if (!value) return fallback;
  return isValidCategory(value) ? value : fallback;
}

/**
 * Safely converts a string to DifficultyLevel with fallback
 * @param value - The value to convert
 * @param fallback - The fallback value if validation fails
 * @returns A valid DifficultyLevel
 */
export function toDifficultyLevel(
  value: string | undefined,
  fallback: DifficultyLevel = 'Beginner'
): DifficultyLevel {
  if (!value) return fallback;
  return isValidDifficulty(value) ? value : fallback;
}
