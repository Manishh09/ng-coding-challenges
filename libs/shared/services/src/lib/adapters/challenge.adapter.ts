import { Injectable } from '@angular/core';
import {
  Challenge,
  ChallengeDetails,
  ChallengeCategoryId,
  Author,
  CHALLENGE_CATEGORY_IDS
} from '@ng-coding-challenges/shared/models';
import {
  ChallengeData,
  CategorySlug
} from '@ng-coding-challenges/shared/models';
import { IChallengeAdapter } from './challenge.adapter.interface';

/**
 * Adapter Pattern - Concrete Implementation
 *
 * Adapts ChallengeData (JSON config format) to Challenge/ChallengeDetails interfaces
 * (legacy format expected by components).
 *
 * Purpose:
 * - Provides clean separation between data source format and application format
 * - Enables backward compatibility during migration to JSON-based config
 * - Centralizes all data transformation logic
 * - Injectable service for better testability and DI support
 *
 * Design Pattern: Adapter (Structural Pattern)
 * - Target: Challenge, ChallengeDetails
 * - Adaptee: ChallengeData
 * - Adapter: This class
 *
 * @example
 * ```typescript
 * constructor(private adapter: IChallengeAdapter) {}
 *
 * const challenge = this.adapter.adaptToChallenge(jsonData);
 * const details = this.adapter.adaptToChallengeDetails(jsonData);
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ChallengeAdapter implements IChallengeAdapter {

  /**
   * Adapts ChallengeData to Challenge interface
   * Maps JSON config structure to legacy component interface
   */
  adaptToChallenge(data: ChallengeData): Challenge {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      link: data.slug, // Map slug to link for backward compatibility
      category: this.adaptCategorySlug(data.categoryId),
      difficulty: data.difficulty,
      tags: data.tags || [],
      gitHub: data.links.github,
      requirement: data.links.requirement,
      solutionGuide: data.links.solution,
      estimatedTime: data.estimatedTime,
      isNew: data.isNew ?? false
    };
  }

  /**
   * Adapts ChallengeData to ChallengeDetails interface
   * Includes all Challenge properties plus extended detail information
   */
  adaptToChallengeDetails(data: ChallengeData): ChallengeDetails {
    // First adapt to base Challenge interface
    const baseChallenge = this.adaptToChallenge(data);

    // Then extend with detail-specific properties
    return {
      ...baseChallenge,
      longDescription: data.longDescription,
      learningOutcomes: data.learningOutcomes || [],
      techStack: data.tags || [], // Use tags as tech stack
      requirementDoc: data.links.requirement,
      requirementList: data.requirementList || [],
      solutionGuide: data.links.solution,
      gitHub: data.links.github,
      author: this.getDefaultAuthor(),
      estimatedTime: data.estimatedTime,
      prerequisites: data.prerequisites || []
    };
  }

  /**
   * Adapts array of ChallengeData to array of Challenge
   * Optimized for bulk operations with map
   */
  adaptToChallengeList(dataArray: ChallengeData[]): Challenge[] {
    return dataArray.map(data => this.adaptToChallenge(data));
  }

  /**\n   * Adapts category slug from JSON config to ChallengeCategoryId
   * Since CategorySlug and ChallengeCategoryId are now the same type,
   * this method validates the category exists in CHALLENGE_CATEGORY_IDS
   *
   * @param categorySlug - Category identifier from JSON config
   * @returns Corresponding ChallengeCategoryId
   */
  private adaptCategorySlug(categorySlug: CategorySlug): ChallengeCategoryId {
    // Validate category exists in the constant array
    const isValid = (CHALLENGE_CATEGORY_IDS as readonly string[]).includes(categorySlug);

    if (!isValid) {
      console.warn(`[ChallengeAdapter] Unknown category slug: ${categorySlug}, defaulting to 'rxjs-api'`);
      return 'rxjs-api';
    }

    return categorySlug as ChallengeCategoryId;
  }

  /**
   * Returns default author information
   * Can be extended to inject from configuration service
   *
   * @returns Default Author object
   */
  private getDefaultAuthor(): Author {
    return {
      name: 'Manish Boge',
      avatar: 'https://avatars.githubusercontent.com/u/46419064?v=4',
      profileUrl: 'https://github.com/Manishh09'
    };
  }

  /**
   * Utility method to adapt category ID to slug
   * Since CategorySlug and ChallengeCategoryId are now the same type,
   * this method simply validates and returns the value
   *
   * @param categoryId - ChallengeCategoryId to convert
   * @returns Corresponding CategorySlug
   */
  adaptCategoryIdToSlug(categoryId: ChallengeCategoryId): CategorySlug {
    // Since both types are identical now, just validate
    const isValid = (CHALLENGE_CATEGORY_IDS as readonly string[]).includes(categoryId);

    if (!isValid) {
      console.warn(`[ChallengeAdapter] Invalid category ID: ${categoryId}, using "rxjs-api" instead`);
      return 'rxjs-api';
    }

    return categoryId as CategorySlug;
  }
}
