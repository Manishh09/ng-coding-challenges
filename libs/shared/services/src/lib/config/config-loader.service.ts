import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, retry } from 'rxjs/operators';
import {
  ChallengeConfig,
  CategoryConfig,
  ChallengeData,
  Category,
  CategorySlug
} from '@ng-coding-challenges/shared/models';

/**
 * Service for loading and caching configuration files (JSON-based)
 * Provides O(1) lookups for challenges using category-keyed structure
 *
 * Features:
 * - Loads categories.json and challenges.json from /config/
 * - Caches configurations with shareReplay(1) to prevent multiple HTTP calls
 * - Provides helper methods for common lookup operations
 * - Fallback to TypeScript data in development mode (future enhancement)
 *
 * @example
 * ```typescript
 * // Get all challenges for a category
 * configLoader.getChallengesByCategory('rxjs-api').subscribe(challenges => {
 *   console.log(challenges);
 * });
 *
 * // Get specific challenge with O(1) lookup
 * configLoader.getChallengeBySlug('rxjs-api', 'fetch-products').subscribe(challenge => {
 *   console.log(challenge);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigLoaderService {
  private readonly http = inject(HttpClient);

  /**
   * Base path for configuration files
   * In production, served from /config/
   * Angular resolves relative to the application root
   */
  private readonly configBasePath = '/config';

  /**
   * Cached categories configuration observable
   * shareReplay(1) ensures single HTTP call, cached result for all subscribers
   * Includes retry logic for transient network failures
   */
  private readonly categoriesConfig$: Observable<CategoryConfig> = this.http
    .get<CategoryConfig>(`${this.configBasePath}/categories.json`)
    .pipe(
      retry({ count: 2, delay: 1000 }), // Retry up to 2 times with 1s delay
      catchError((error) => {
        console.error('[ConfigLoaderService] Failed to load categories.json:', error);
        return throwError(() => new Error('Failed to load categories configuration. Please check your network connection.'));
      }),
      shareReplay(1) // Cache the result for all subscribers
    );

  /**
   * Cached challenges configuration observable
   * shareReplay(1) ensures single HTTP call, cached result for all subscribers
   * Includes retry logic for transient network failures
   */
  private readonly challengesConfig$: Observable<ChallengeConfig> = this.http
    .get<ChallengeConfig>(`${this.configBasePath}/challenges.json`)
    .pipe(
      retry({ count: 2, delay: 1000 }), // Retry up to 2 times with 1s delay
      catchError((error) => {
        console.error('[ConfigLoaderService] Failed to load challenges.json:', error);
        return throwError(() => new Error('Failed to load challenges configuration. Please check your network connection.'));
      }),
      shareReplay(1) // Cache the result for all subscribers
    );

  /**
   * Get the complete categories configuration
   * @returns Observable of CategoryConfig
   */
  getCategoriesConfig(): Observable<CategoryConfig> {
    return this.categoriesConfig$;
  }

  /**
   * Get the complete challenges configuration
   * @returns Observable of ChallengeConfig
   */
  getChallengesConfig(): Observable<ChallengeConfig> {
    return this.challengesConfig$;
  }

  /**
   * Get all categories as an array
   * @returns Observable of Category array
   */
  getCategories(): Observable<Category[]> {
    return this.categoriesConfig$.pipe(
      map(config => config.categories.filter((cat: Category) => cat.enabled))
    );
  }

  /**
   * Get a specific category by slug
   * @param slug - Category slug (e.g., 'rxjs-api')
   * @returns Observable of Category or undefined
   */
  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.categoriesConfig$.pipe(
      map(config => config.categories.find((cat: Category) => cat.slug === slug))
    );
  }

  /**
   * Get all challenges for a specific category
   * O(1) lookup using category-keyed structure
   *
   * @param categoryId - Category identifier (e.g., 'rxjs-api')
   * @returns Observable of ChallengeData array (sorted by order)
   */
  getChallengesByCategory(categoryId: CategorySlug): Observable<ChallengeData[]> {
    return this.challengesConfig$.pipe(
      map(config => {
        const categoryData = config.challenges[categoryId as keyof typeof config.challenges];

        if (!categoryData) {
          console.warn(`No challenges found for category: ${categoryId}`);
          return [];
        }

        // Convert Record<slug, ChallengeData> to Array and sort by order
        return (Object.values(categoryData) as ChallengeData[])
          .filter((challenge: ChallengeData) => challenge.enabled) // Only return enabled challenges
          .sort((a: ChallengeData, b: ChallengeData) => a.order - b.order);
      })
    );
  }

  /**
   * Get a specific challenge by category and slug
   * O(1) lookup using nested structure: challenges[categoryId][slug]
   *
   * @param categoryId - Category identifier (e.g., 'rxjs-api')
   * @param slug - Challenge slug (e.g., 'fetch-products')
   * @returns Observable of ChallengeData or undefined
   */
  getChallengeBySlug(categoryId: CategorySlug, slug: string): Observable<ChallengeData | undefined> {
    return this.challengesConfig$.pipe(
      map(config => {
        const categoryData = config.challenges[categoryId as keyof typeof config.challenges];

        if (!categoryData) {
          console.warn(`Category not found: ${categoryId}`);
          return undefined;
        }

        const challenge = categoryData[slug];

        if (!challenge) {
          console.warn(`Challenge not found: ${slug} in category ${categoryId}`);
          return undefined;
        }

        return challenge;
      })
    );
  }

  /**
   * Get all challenges across all categories (flattened array)
   * Useful for search functionality
   *
   * @returns Observable of ChallengeData array
   */
  getAllChallenges(): Observable<ChallengeData[]> {
    return this.challengesConfig$.pipe(
      map(config => {
        const allChallenges: ChallengeData[] = [];

        // Iterate through all categories
        Object.values(config.challenges).forEach((categoryData: Record<string, ChallengeData>) => {
          // Add all challenges from this category
          (Object.values(categoryData) as ChallengeData[]).forEach((challenge: ChallengeData) => {
            if (challenge.enabled) {
              allChallenges.push(challenge);
            }
          });
        });

        // Sort by category order, then by challenge order within category
        return allChallenges.sort((a: ChallengeData, b: ChallengeData) => {
          // First compare by order property (which includes category context)
          return a.id - b.id;
        });
      })
    );
  }

  /**
   * Get the default author information from challenges config
   * @returns Observable of ChallengeAuthor
   */
  getDefaultAuthor(): Observable<{ name: string; avatar: string; profileUrl: string }> {
    return this.challengesConfig$.pipe(
      map(config => config.defaultAuthor)
    );
  }

  /**
   * Check if a challenge exists
   * @param categoryId - Category identifier
   * @param slug - Challenge slug
   * @returns Observable of boolean
   */
  challengeExists(categoryId: CategorySlug, slug: string): Observable<boolean> {
    return this.getChallengeBySlug(categoryId, slug).pipe(
      map(challenge => !!challenge)
    );
  }

  /**
   * Get challenges filtered by difficulty level
   * @param difficulty - Difficulty level to filter by
   * @returns Observable of ChallengeData array
   */
  getChallengesByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): Observable<ChallengeData[]> {
    return this.getAllChallenges().pipe(
      map(challenges => challenges.filter(c => c.difficulty === difficulty))
    );
  }

  /**
   * Get challenges filtered by tag
   * @param tag - Tag to filter by (e.g., 'HttpClient', 'RxJS')
   * @returns Observable of ChallengeData array
   */
  getChallengesByTag(tag: string): Observable<ChallengeData[]> {
    return this.getAllChallenges().pipe(
      map(challenges =>
        challenges.filter(c =>
          c.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase())
        )
      )
    );
  }
}
