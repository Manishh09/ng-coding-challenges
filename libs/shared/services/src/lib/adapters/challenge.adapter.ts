import { Injectable } from '@angular/core';
import {
  Challenge,
  ChallengeDetails,
  ChallengeCategoryId,
  Author
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

  /**
   * Maps CategorySlug (JSON format) to ChallengeCategoryId (legacy format)
   * Provides fallback for deprecated categories
   *
   * @param categorySlug - Category identifier from JSON config
   * @returns Corresponding ChallengeCategoryId
   */
  private adaptCategorySlug(categorySlug: CategorySlug): ChallengeCategoryId {
    // Direct mapping for compatible categories
    const categoryMap: Record<CategorySlug, ChallengeCategoryId> = {
      'rxjs-api': 'rxjs-api',
      'angular-core': 'angular-core',
      'angular-routing': 'angular-routing',
      'angular-forms': 'angular-forms',
      'angular-signals': 'angular-signals',
    };

    const mappedCategory = categoryMap[categorySlug];

    if (!mappedCategory) {
      console.warn(`[ChallengeAdapter] Unknown category slug: ${categorySlug}, defaulting to 'rxjs-api'`);
      return 'rxjs-api';
    }

    return mappedCategory;
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
   * Utility method to adapt category ID in reverse direction
   * Used when legacy code needs to query JSON config
   *
   * @param categoryId - Legacy ChallengeCategoryId
   * @returns Corresponding CategorySlug
   */
  adaptCategoryIdToSlug(categoryId: ChallengeCategoryId): CategorySlug {
    // Handle deprecated 'http' category
    if (categoryId === 'http') {
      console.warn('[ChallengeAdapter] Category "http" is deprecated, using "rxjs-api" instead');
      return 'rxjs-api';
    }

    // Direct mapping for compatible categories
    return categoryId as CategorySlug;
  }
}
