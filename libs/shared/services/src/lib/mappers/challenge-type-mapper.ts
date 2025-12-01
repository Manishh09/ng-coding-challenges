import {
  Challenge,
  ChallengeDetails,
  ChallengeCategoryId
} from '@ng-coding-challenges/shared/models';
import {
  ChallengeData,
  CategorySlug
} from '@ng-coding-challenges/shared/models';

/**
 * Utility service for mapping between JSON configuration types and legacy types
 * Provides backward compatibility while transitioning to JSON-based configuration
 */
export class ChallengeTypeMapper {

  /**
   * Maps ChallengeData (from JSON) to Challenge (legacy interface)
   * Used for components that still expect the old Challenge interface
   */
  static toChallengeList(data: ChallengeData): Challenge {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      link: data.slug, // Map slug to link for backward compatibility
      category: data.categoryId as ChallengeCategoryId,
      difficulty: data.difficulty,
      tags: data.tags,
      gitHub: data.links.github,
      requirement: data.links.requirement,
      solutionGuide: data.links.solution,
    };
  }

  /**
   * Maps ChallengeData (from JSON) to ChallengeDetails (legacy interface)
   * Used for detail pages that expect extended challenge information
   */
  static toChallengeDetails(data: ChallengeData): ChallengeDetails {
    return {
      // Base Challenge properties
      id: data.id,
      title: data.title,
      description: data.description,
      link: data.slug,
      category: data.categoryId as ChallengeCategoryId,
      difficulty: data.difficulty,
      tags: data.tags,

      // Extended ChallengeDetails properties
      longDescription: data.longDescription,
      learningOutcomes: data.learningOutcomes,
      techStack: data.tags, // Use tags as tech stack
      requirementDoc: data.links.requirement,
      requirementList: data.requirementList,
      solutionGuide: data.links.solution,
      gitHub: data.links.github,

      // Author info - will be populated from config or default
      author: {
        name: 'Manish Kumar', // Default, can be overridden
        avatar: '/assets/avatars/manish.jpg',
        profileUrl: 'https://github.com/Manishh09'
      }
    };
  }

  /**
   * Maps array of ChallengeData to array of Challenge
   */
  static toChallengeListArray(dataArray: ChallengeData[]): Challenge[] {
    return dataArray.map(data => this.toChallengeList(data));
  }

  /**
   * Maps CategorySlug to ChallengeCategoryId for backward compatibility
   */
  static toCategoryId(slug: CategorySlug): ChallengeCategoryId {
    return slug as ChallengeCategoryId;
  }

  /**
   * Maps ChallengeCategoryId to CategorySlug
   */
  static toCategorySlug(categoryId: ChallengeCategoryId): CategorySlug {
    // Filter out 'http' which was removed from the new config
    if (categoryId === 'http') {
      console.warn('Category "http" is deprecated and not available in JSON config');
      return 'rxjs-api' as CategorySlug; // Default fallback
    }
    return categoryId as CategorySlug;
  }
}
