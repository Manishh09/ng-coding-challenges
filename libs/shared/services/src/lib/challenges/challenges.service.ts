import { Injectable, inject } from '@angular/core';
import { Challenge, SearchResult } from '@ng-coding-challenges/shared/models';
import { CHALLENGE_DATA } from './challenge-data';
import { ChallengeCategoryService } from './challenge-category.service';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  /**
   * Immutable collection of available challenges.
   */
  private readonly challenges: readonly Challenge[] = CHALLENGE_DATA;
  private readonly categoryService = inject(ChallengeCategoryService);

  /**
   * Returns all challenges.
   */
  getChallenges(): readonly Challenge[] {
    return this.challenges;
  }

  /**
   * Finds a challenge by its unique ID.
   * @param id - Challenge ID
   * @returns The matching challenge, or undefined if not found
   */
  getChallengeById(id: number): Challenge | undefined {
    return this.challenges.find((challenge) => challenge.id === id);
  }

  /**
   * Retrieves all challenges belonging to a specific category.
   * @param category - Category name
   * @returns An array of challenges under the given category
   */
  getChallengesByCategory(category: string): readonly Challenge[] {
    if (!category) return [];
    return this.challenges.filter(
      (challenge) => challenge.category === category
    );
  }

  /**
   * Retrieves the most recent challenge from the collection.
   * @returns The latest challenge, or undefined if the collection is empty
   */
  getLatestChallenge(): Challenge | undefined {
    return this.challenges.at(-1);
  }

  /**
   * Finds a challenge based on a provided URL.
   * Extracts the last segment and matches it with the challenge link.
   *
   * @param url - The full URL string
   * @returns The matching challenge, or undefined if not found
   */
  getChallengeFromURL(url: string): Challenge | undefined {
    if (!url) return undefined;
    const lastSegment = url.split('/').at(-1);
    return lastSegment
      ? this.challenges.find((c) => c.link.includes(lastSegment))
      : undefined;
  }

  /**
   * Returns grouped challenge data by category.
   * @returns A Map of category name to challenge array
   */
  getChallengesGroupedByCategory(): Map<string, Challenge[]> {
    return this.challenges.reduce((map, challenge) => {
      if (!map.has(challenge.category)) {
        map.set(challenge.category, []);
      }
      map.get(challenge.category)!.push(challenge);
      return map;
    }, new Map<string, Challenge[]>());
  }

  /**
   * Searches all challenges across categories with relevance scoring.
   * Returns results sorted by relevance (title matches first, then description).
   *
   * @param searchTerm - The search query string
   * @param maxResults - Maximum number of results to return (default: 20)
   * @returns Array of search results with highlighted matches
   */
  searchAllChallenges(searchTerm: string, maxResults: number = 20): SearchResult[] {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    const normalizedTerm = searchTerm.toLowerCase().trim();
    const searchTerms = normalizedTerm.split(/\s+/);

    return this.challenges
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
  }

  /**
   * Calculates relevance score based on where and how many times the search terms appear.
   * Scoring:
   * - Exact title match: 200 points
   * - Title contains term: 100 points per term
   * - Description contains term: 50 points per term
   * - Category contains term: 25 points per term
   */
  private calculateRelevanceScore(challenge: Challenge, searchTerms: string[]): number {
    let score = 0;
    const lowerTitle = challenge.title.toLowerCase();
    const lowerDescription = challenge.description.toLowerCase();
    const lowerCategory = challenge.category.toLowerCase();

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
