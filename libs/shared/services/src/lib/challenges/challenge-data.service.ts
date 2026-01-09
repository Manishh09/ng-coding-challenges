import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, catchError, retry } from 'rxjs/operators';
import {
  Challenge,
  ChallengeDetails,
  DifficultyLevel,
  ChallengeCategoryId
} from '@ng-coding-challenges/shared/models';
import { ConfigLoaderService } from '../config/config-loader.service';
import { ChallengeAdapter } from '../adapters/challenge.adapter';

/**
 * Service responsible for core challenge data retrieval operations.
 * Handles CRUD operations and basic filtering (category, difficulty, tag).
 * Part of the refactored challenge service architecture following SRP.
 */
@Injectable({
  providedIn: 'root',
})
export class ChallengeDataService {
  private readonly configLoader = inject(ConfigLoaderService);
  private readonly challengeAdapter = inject(ChallengeAdapter);

  /**
   * Cached challenges loaded from JSON, mapped to legacy Challenge interface.
   * ShareReplay ensures single load and cache for all subscribers.
   */
  private readonly challenges$: Observable<Challenge[]> = this.configLoader
    .getAllChallenges()
    .pipe(
      retry({ count: 2, delay: 1000 }),
      map(challengeDataArray => this.challengeAdapter.adaptToChallengeList(challengeDataArray)),
      catchError(error => {
        console.error('[ChallengeDataService] Failed to load challenges:', error);
        return of([]); // Return empty array as fallback
      }),
      shareReplay(1) // Cache the result
    );

  /**
   * Returns all challenges (lightweight data).
   * @returns Observable of all challenges
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
      map(challenges => challenges.find(challenge => challenge.id === id)),
      catchError(error => {
        console.error(`[ChallengeDataService] Error fetching challenge ${id}:`, error);
        return of(undefined);
      })
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
      const categorySlug = this.challengeAdapter.adaptCategoryIdToSlug(categoryId);
      return this.configLoader.getChallengeBySlug(categorySlug, slug).pipe(
        map(challengeData => challengeData ? this.challengeAdapter.adaptToChallengeDetails(challengeData) : undefined),
        catchError(error => {
          console.error(`[ChallengeDataService] Error loading challenge details for ${slug}:`, error);
          return of(undefined);
        })
      );
    }

    // Otherwise, search all challenges (O(n) but still efficient)
    return this.configLoader.getAllChallenges().pipe(
      map(challenges => {
        const challenge = challenges.find(c => c.slug === slug);
        return challenge ? this.challengeAdapter.adaptToChallengeDetails(challenge) : undefined;
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

    const categorySlug = this.challengeAdapter.adaptCategoryIdToSlug(category as ChallengeCategoryId);
    return this.configLoader.getChallengesByCategory(categorySlug).pipe(
      map(challengeDataArray => this.challengeAdapter.adaptToChallengeList(challengeDataArray)),
      catchError(error => {
        console.error(`[ChallengeDataService] Error loading category ${category}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Retrieves challenges by difficulty level.
   * @param difficulty - Difficulty level
   * @returns Observable of challenges array with the given difficulty
   */
  getChallengesByDifficulty(difficulty: DifficultyLevel): Observable<readonly Challenge[]> {
    return this.challenges$.pipe(
      map(challenges => challenges.filter(challenge => challenge.difficulty === difficulty)),
      catchError(error => {
        console.error(`[ChallengeDataService] Error filtering by difficulty ${difficulty}:`, error);
        return of([]);
      })
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
      map(challengeDataArray => this.challengeAdapter.adaptToChallengeList(challengeDataArray)),
      catchError(error => {
        console.error(`[ChallengeDataService] Error loading challenges by tag ${tag}:`, error);
        return of([]);
      })
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
}
