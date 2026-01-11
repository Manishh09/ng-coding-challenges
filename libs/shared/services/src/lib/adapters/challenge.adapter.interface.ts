import { Challenge, ChallengeDetails, ChallengeCategoryId } from '@ng-coding-challenges/shared/models';
import { ChallengeData, CategorySlug } from '@ng-coding-challenges/shared/models';

/**
 * Adapter Pattern - Target Interface
 *
 * Defines the contract for adapting ChallengeData (from JSON config)
 * to Challenge/ChallengeDetails interfaces (expected by components).
 *
 * Benefits:
 * - Provides abstraction for testing (can mock implementations)
 * - Allows multiple adapter implementations (e.g., cached, enhanced)
 * - Follows Dependency Inversion Principle
 * - Makes the adaptation layer explicit and maintainable
 */
export abstract class IChallengeAdapter {
  /**
   * Adapts ChallengeData to lightweight Challenge interface
   * Used for list views, cards, and search results
   *
   * @param data - Source data from JSON configuration
   * @returns Adapted Challenge object
   */
  abstract adaptToChallenge(data: ChallengeData): Challenge;

  /**
   * Adapts ChallengeData to comprehensive ChallengeDetails interface
   * Used for detail pages with full challenge information
   *
   * @param data - Source data from JSON configuration
   * @returns Adapted ChallengeDetails object
   */
  abstract adaptToChallengeDetails(data: ChallengeData): ChallengeDetails;

  /**
   * Adapts an array of ChallengeData to Challenge array
   * Optimized for bulk operations
   *
   * @param dataArray - Array of source data
   * @returns Array of adapted Challenge objects
   */
  abstract adaptToChallengeList(dataArray: ChallengeData[]): Challenge[];

  /**
   * Adapts ChallengeCategoryId (legacy format) to CategorySlug (JSON format)
   * Used when legacy code needs to query JSON configuration
   *
   * @param categoryId - Legacy category identifier
   * @returns Corresponding CategorySlug for JSON config
   */
  abstract adaptCategoryIdToSlug(categoryId: ChallengeCategoryId): CategorySlug;
}
