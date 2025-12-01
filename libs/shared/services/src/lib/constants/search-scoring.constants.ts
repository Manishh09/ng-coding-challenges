/**
 * Search scoring constants for relevance calculation
 * Used by ChallengesService.searchAllChallenges()
 */
export const SEARCH_SCORING = {
  /** Exact match with entire title */
  EXACT_TITLE_MATCH: 200,

  /** Title contains search term */
  TITLE_CONTAINS: 100,

  /** Bonus for search term at start of title */
  TITLE_STARTS_WITH_BONUS: 50,

  /** Description contains search term */
  DESCRIPTION_CONTAINS: 50,

  /** Category name contains search term */
  CATEGORY_CONTAINS: 25,

  /** One or more tags contain search term */
  TAG_CONTAINS: 30
} as const;

/**
 * Search configuration limits
 */
export const SEARCH_LIMITS = {
  /** Minimum search term length */
  MIN_SEARCH_LENGTH: 2,

  /** Maximum number of search results */
  MAX_RESULTS: 100,

  /** Default number of results */
  DEFAULT_RESULTS: 20,

  /** Maximum description length for search results */
  MAX_DESCRIPTION_LENGTH: 100
} as const;
