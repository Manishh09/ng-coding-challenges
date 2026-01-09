/**
 * Represents the difficulty level of a challenge
 */
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

/**
 * Represents the category ID of a challenge
 */
export type ChallengeCategoryId = 'rxjs-api' | 'angular-core' | 'angular-routing' | 'angular-forms' | 'angular-signals' | 'http';

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
