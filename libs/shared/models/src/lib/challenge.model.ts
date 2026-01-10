/**
 * Available challenge category identifiers
 * SINGLE SOURCE OF TRUTH for all category IDs
 * Add new categories here - the ChallengeCategoryId type will update automatically
 */
export const CHALLENGE_CATEGORY_IDS = [
  'rxjs-api',
  'angular-core',
  'angular-routing',
  'angular-forms',
  'angular-signals',
  'community',
] as const;

/**
 * Represents the difficulty level of a challenge
 */
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

/**
 * Challenge category identifier type
 * Automatically derived from CHALLENGE_CATEGORY_IDS constant above
 * To add new categories, update the CHALLENGE_CATEGORY_IDS array
 *
 * @example 'rxjs-api' | 'angular-core' | 'angular-routing' | 'angular-forms' | 'angular-signals' | 'community'
 */
export type ChallengeCategoryId = (typeof CHALLENGE_CATEGORY_IDS)[number];

/**
 * Represents the author information for a challenge
 */
export interface Author {
  name: string;
  avatar?: string;
  profileUrl?: string;
}

/**
 * Base challenge interface for lists and previews.
 * Contains essential information needed for displaying challenges in cards or lists.
 */
export interface Challenge {
  id: number;
  title: string;
  description: string;
  link: string;
  category: ChallengeCategoryId;
  difficulty: DifficultyLevel;
  tags?: string[];
  estimatedTime?: string;
  // Optional properties used by some services
  gitHub?: string;
  requirement?: string;
  solutionGuide?: string;
  isNew?: boolean;
}

/**
 * Extended challenge details interface.
 * Contains comprehensive information for individual challenge detail pages.
 * Extends the base Challenge interface with additional properties.
 */
export interface ChallengeDetails extends Challenge {
  longDescription: string;
  learningOutcomes: string[];
  techStack: string[];
  requirementDoc: string;
  solutionGuide: string;
  gitHub: string;
  author: Author;
  estimatedTime?: string;
  prerequisites?: string[];
  requirementList?: string[];
}
