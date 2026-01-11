import { DifficultyLevel, ChallengeCategoryId, CHALLENGE_CATEGORY_IDS } from '@ng-coding-challenges/shared/models';

/**
 * Type guard to check if a string is a valid ChallengeCategoryId
 * Uses the centralized CHALLENGE_CATEGORY_IDS constant for validation
 * @param value - The value to check
 * @returns True if the value is a valid ChallengeCategoryId
 */
export function isValidCategory(value: string): value is ChallengeCategoryId {
  return (CHALLENGE_CATEGORY_IDS as readonly string[]).includes(value);
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
