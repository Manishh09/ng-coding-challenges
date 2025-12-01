import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import {
  Challenge,
  ChallengeDetails,
  SearchResult,
  DifficultyLevel,
  ChallengeCategoryId
} from '@ng-coding-challenges/shared/models';
import { ChallengeCategoryService } from './challenge-category.service';
import { ConfigLoaderService } from '../config/config-loader.service';
import { ChallengeTypeMapper } from '../mappers/challenge-type-mapper';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  private readonly configLoader = inject(ConfigLoaderService);
  private readonly categoryService = inject(ChallengeCategoryService);

  /**
   * Cached challenges loaded from JSON, mapped to legacy Challenge interface.
   * ShareReplay ensures single load and cache for all subscribers.
   */
  private readonly challenges$: Observable<Challenge[]> = this.configLoader
    .getAllChallenges()
    .pipe(
      map(challengeDataArray => ChallengeTypeMapper.toChallengeListArray(challengeDataArray)),
      shareReplay(1) // Cache the result
    );

  /**
   * Returns all challenges (lightweight data).
   * Now returns Observable instead of synchronous array.
   */
  getChallenges(): Observable<readonly Challenge[]> {
    return this.challenges$;
  }

  /**
   * Finds a challenge by its unique ID (lightweight data).
   * @param id - Challenge ID
   * @returns Observable of the matching challenge, or undefined if not found
   */
  getChallengeById(id: number): Observable<Challenge | undefined> {
    return this.challenges$.pipe(
      map(challenges => challenges.find(challenge => challenge.id === id))
    );
  }

  /**
   * Finds detailed challenge information by ID (for detail pages).
   * Includes extended properties like longDescription, learningOutcomes, etc.
   * @param id - Challenge ID (numeric) or slug (string)
   * @returns Observable of the detailed challenge data, or undefined if not found
   * @deprecated Use getChallengeDetailsBySlug for slug-based routing
   */
  getChallengeDetailsById(id: string | number): Observable<ChallengeDetails | undefined> {
    if (typeof id === 'number') {
      // Find by numeric ID, then get details by slug
      return this.getChallengeById(id).pipe(
        switchMap(challenge => {
          if (!challenge) return of(undefined);
          // Use getChallengeDetailsBySlug to load from JSON
          return this.getChallengeDetailsBySlug(challenge.link, challenge.category);
        })
      );
    }
    // If string provided, assume it's a slug
    return this.getChallengeDetailsBySlug(id);
  }

  /**
   * Finds detailed challenge information by slug/link (preferred for slug-based routing).
   * Includes extended properties like longDescription, learningOutcomes, etc.
   * Now loads from JSON with O(1) lookup.
   * @param slug - Challenge slug (e.g., 'fetch-products')
   * @param categoryId - Optional category ID for O(1) lookup optimization
   * @returns Observable of the detailed challenge data, or undefined if not found
   */
  getChallengeDetailsBySlug(slug: string, categoryId?: ChallengeCategoryId): Observable<ChallengeDetails | undefined> {
    // If categoryId provided, use O(1) lookup
    if (categoryId) {
      const categorySlug = ChallengeTypeMapper.toCategorySlug(categoryId);
      return this.configLoader.getChallengeBySlug(categorySlug, slug).pipe(
        map(challengeData => challengeData ? ChallengeTypeMapper.toChallengeDetails(challengeData) : undefined)
      );
    }

    // Otherwise, search all challenges (O(n) but still efficient)
    return this.configLoader.getAllChallenges().pipe(
      map(challenges => {
        const challenge = challenges.find(c => c.slug === slug);
        return challenge ? ChallengeTypeMapper.toChallengeDetails(challenge) : undefined;
      })
    );
  }

  /**
   * Retrieves all challenges belonging to a specific category.
   * Now uses JSON configuration with O(1) category lookup.
   * @param category - Category name
   * @returns Observable of challenges array under the given category
   */
  getChallengesByCategory(category: string): Observable<readonly Challenge[]> {
    if (!category) return of([]);

    const categorySlug = ChallengeTypeMapper.toCategorySlug(category as ChallengeCategoryId);
    return this.configLoader.getChallengesByCategory(categorySlug).pipe(
      map(challengeDataArray => ChallengeTypeMapper.toChallengeListArray(challengeDataArray))
    );
  }

  /**
   * Retrieves challenges by difficulty level.
   * @param difficulty - Difficulty level
   * @returns Observable of challenges array with the given difficulty
   */
  getChallengesByDifficulty(difficulty: DifficultyLevel): Observable<readonly Challenge[]> {
    return this.challenges$.pipe(
      map(challenges => challenges.filter(challenge => challenge.difficulty === difficulty))
    );
  }

  /**
   * Retrieves challenges that have a specific tag.
   * @param tag - Tag to filter by
   * @returns Observable of challenges array with the given tag
   */
  getChallengesByTag(tag: string): Observable<readonly Challenge[]> {
    if (!tag) return of([]);
    return this.configLoader.getChallengesByTag(tag).pipe(
      map(challengeDataArray => ChallengeTypeMapper.toChallengeListArray(challengeDataArray))
    );
  }

  /**
   * Retrieves the most recent challenge from the collection.
   * @returns Observable of the latest challenge, or undefined if the collection is empty
   */
  getLatestChallenge(): Observable<Challenge | undefined> {
    return this.challenges$.pipe(
      map(challenges => challenges.at(-1))
    );
  }

  /**
   * Finds a challenge based on a provided URL.
   * Extracts the last segment and matches it with the challenge link.
   *
   * @param url - The full URL string
   * @returns Observable of the matching challenge, or undefined if not found
   */
  getChallengeFromURL(url: string): Observable<Challenge | undefined> {
    if (!url) return of(undefined);
    const lastSegment = url.split('/').at(-1);
    if (!lastSegment) return of(undefined);

    return this.challenges$.pipe(
      map(challenges => challenges.find(c => c.link.includes(lastSegment)))
    );
  }

  /**
   * Returns grouped challenge data by category.
   * @returns Observable of Map with category name to challenge array
   */
  getChallengesGroupedByCategory(): Observable<Map<string, Challenge[]>> {
    return this.challenges$.pipe(
      map(challenges => {
        return challenges.reduce((map, challenge) => {
          if (!map.has(challenge.category)) {
            map.set(challenge.category, []);
          }
          map.get(challenge.category)!.push(challenge);
          return map;
        }, new Map<string, Challenge[]>());
      })
    );
  }

  /**
   * Get the next challenge in the sequence.
   * @param currentId - Current challenge ID
   * @returns Observable of the next challenge, or undefined if at the end
   */
  getNextChallenge(currentId: number): Observable<Challenge | undefined> {
    return this.challenges$.pipe(
      map(challenges => {
        const currentIndex = challenges.findIndex(c => c.id === currentId);
        if (currentIndex === -1 || currentIndex === challenges.length - 1) {
          return undefined;
        }
        return challenges[currentIndex + 1];
      })
    );
  }

  /**
   * Get the previous challenge in the sequence.
   * @param currentId - Current challenge ID
   * @returns Observable of the previous challenge, or undefined if at the beginning
   */
  getPreviousChallenge(currentId: number): Observable<Challenge | undefined> {
    return this.challenges$.pipe(
      map(challenges => {
        const currentIndex = challenges.findIndex(c => c.id === currentId);
        if (currentIndex <= 0) {
          return undefined;
        }
        return challenges[currentIndex - 1];
      })
    );
  }

  /**
   * Get all unique tags across all challenges.
   * @returns Observable of unique tags array, sorted alphabetically
   */
  getAllTags(): Observable<string[]> {
    return this.challenges$.pipe(
      map(challenges => {
        const tags = new Set<string>();
        challenges.forEach(c => c.tags?.forEach(tag => tags.add(tag)));
        return Array.from(tags).sort();
      })
    );
  }

  /**
   * Get all unique difficulty levels used in challenges.
   * @returns Observable of difficulty levels array
   */
  getAllDifficulties(): Observable<DifficultyLevel[]> {
    return this.challenges$.pipe(
      map(challenges => {
        const difficulties = new Set<DifficultyLevel>();
        challenges.forEach(c => difficulties.add(c.difficulty));
        return Array.from(difficulties);
      })
    );
  }

  /**
   * Get challenge count by category.
   * @returns Observable of Map with category to count
   */
  getChallengeCountByCategory(): Observable<Map<string, number>> {
    return this.challenges$.pipe(
      map(challenges => {
        const countMap = new Map<string, number>();
        challenges.forEach(challenge => {
          const count = countMap.get(challenge.category) || 0;
          countMap.set(challenge.category, count + 1);
        });
        return countMap;
      })
    );
  }

  /**
   * Get challenge count by difficulty.
   * @returns Observable of Map with difficulty to count
   */
  getChallengeCountByDifficulty(): Observable<Map<DifficultyLevel, number>> {
    return this.challenges$.pipe(
      map(challenges => {
        const countMap = new Map<DifficultyLevel, number>();
        challenges.forEach(challenge => {
          const count = countMap.get(challenge.difficulty) || 0;
          countMap.set(challenge.difficulty, count + 1);
        });
        return countMap;
      })
    );
  }

  /**
   * Searches all challenges across categories with relevance scoring.
   * Returns results sorted by relevance (title matches first, then description).
   *
   * @param searchTerm - The search query string
   * @param maxResults - Maximum number of results to return (default: 20)
   * @returns Observable of search results array with highlighted matches
   */
  searchAllChallenges(searchTerm: string, maxResults: number = 20): Observable<SearchResult[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return of([]);
    }

    const normalizedTerm = searchTerm.toLowerCase().trim();
    const searchTerms = normalizedTerm.split(/\s+/);

    return this.challenges$.pipe(
      map(challenges => {
        return challenges
          .map((challenge) => {
            const score = this.calculateRelevanceScore(challenge, searchTerms);

            if (score === 0) {
              return null; // No match
            }

            return {
              id: challenge.id,
              title: challenge.title,
              description: this.truncateDescription(challenge.description, 100),
              category: challenge.category,
              categoryName: this.categoryService.getCategoryNameById(challenge.category) || challenge.category,
              link: challenge.link,
              score
            } as SearchResult;
          })
          .filter((result): result is SearchResult => result !== null)
          .sort((a, b) => b.score - a.score)
          .slice(0, maxResults);
      })
    );
  }

  /**
   * Calculates relevance score based on where and how many times the search terms appear.
   * Scoring:
   * - Exact title match: 200 points
   * - Title contains term: 100 points per term
   * - Description contains term: 50 points per term
   * - Category contains term: 25 points per term
   * - Tags contain term: 30 points per term
   */
  private calculateRelevanceScore(challenge: Challenge, searchTerms: string[]): number {
    let score = 0;
    const lowerTitle = challenge.title.toLowerCase();
    const lowerDescription = challenge.description.toLowerCase();
    const lowerCategory = challenge.category.toLowerCase();
    const lowerTags = challenge.tags?.map(tag => tag.toLowerCase());

    searchTerms.forEach((term) => {
      // Exact title match bonus
      if (lowerTitle === term) {
        score += 200;
      }

      // Title contains term
      if (lowerTitle.includes(term)) {
        score += 100;

        // Bonus for term at start of title
        if (lowerTitle.startsWith(term)) {
          score += 50;
        }
      }

      // Description contains term
      if (lowerDescription.includes(term)) {
        score += 50;
      }

      // Category contains term
      if (lowerCategory.includes(term)) {
        score += 25;
      }

      // Tags contain term
      if (lowerTags?.some(tag => tag.includes(term))) {
        score += 30;
      }
    });

    return score;
  }

  /**
   * Truncates description to specified length with ellipsis.
   */
  private truncateDescription(description: string, maxLength: number): string {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength).trim() + '...';
  }
}
