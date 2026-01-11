import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Challenge, SearchResult } from '@ng-coding-challenges/shared/models';
import { ChallengeCategoryService } from './challenge-category.service';
import { ChallengeDataService } from './challenge-data.service';
import { SEARCH_SCORING, SEARCH_LIMITS } from '../constants/search-scoring.constants';

/**
 * Service responsible for challenge search functionality with relevance scoring.
 * Handles full-text search across challenges with configurable result limits.
 * Part of the refactored challenge service architecture following SRP.
 */
@Injectable({
  providedIn: 'root',
})
export class ChallengeSearchService {
  private readonly challengeData = inject(ChallengeDataService);
  private readonly categoryService = inject(ChallengeCategoryService);

  /**
   * Searches all challenges across categories with relevance scoring.
   * Returns results sorted by relevance (title matches first, then description).
   *
   * @param searchTerm - The search query string
   * @param maxResults - Maximum number of results to return (default: 20, max: 100)
   * @returns Observable of search results array with highlighted matches
   */
  searchAllChallenges(searchTerm: string, maxResults: number = SEARCH_LIMITS.DEFAULT_RESULTS): Observable<SearchResult[]> {
    // Validate search term
    if (!searchTerm || searchTerm.trim().length < SEARCH_LIMITS.MIN_SEARCH_LENGTH) {
      return of([]);
    }

    // Sanitize search term (remove potentially dangerous characters)
    const sanitizedTerm = searchTerm.replace(/[<>"']/g, '');

    // Validate and bound maxResults
    const validMaxResults = Math.max(1, Math.min(maxResults, SEARCH_LIMITS.MAX_RESULTS));

    const normalizedTerm = sanitizedTerm.toLowerCase().trim();
    const searchTerms = normalizedTerm.split(/\s+/);

    return this.challengeData.getChallenges().pipe(
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
          .slice(0, validMaxResults);
      })
    );
  }

  /**
   * Calculates relevance score based on where and how many times the search terms appear.
   * Uses constants from SEARCH_SCORING for consistent scoring weights.
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
        score += SEARCH_SCORING.EXACT_TITLE_MATCH;
      }

      // Title contains term
      if (lowerTitle.includes(term)) {
        score += SEARCH_SCORING.TITLE_CONTAINS;

        // Bonus for term at start of title
        if (lowerTitle.startsWith(term)) {
          score += SEARCH_SCORING.TITLE_STARTS_WITH_BONUS;
        }
      }

      // Description contains term
      if (lowerDescription.includes(term)) {
        score += SEARCH_SCORING.DESCRIPTION_CONTAINS;
      }

      // Category contains term
      if (lowerCategory.includes(term)) {
        score += SEARCH_SCORING.CATEGORY_CONTAINS;
      }

      // Tags contain term
      if (lowerTags?.some(tag => tag.includes(term))) {
        score += SEARCH_SCORING.TAG_CONTAINS;
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
