import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Challenge,
  ChallengeDetails,
  SearchResult,
  DifficultyLevel,
  ChallengeCategoryId
} from '@ng-coding-challenges/shared/models';
import { ChallengeDataService } from './challenge-data.service';
import { ChallengeSearchService } from './challenge-search.service';
import { ChallengeNavigationService } from './challenge-navigation.service';
import { ChallengeAggregationService } from './challenge-aggregation.service';

/**
 * Facade service that provides a unified interface for all challenge-related operations.
 * Delegates to specialized services following the Facade Pattern for better maintainability.
 * 
 * Architecture:
 * - ChallengeDataService: Core CRUD operations and filtering
 * - ChallengeSearchService: Full-text search with relevance scoring
 * - ChallengeNavigationService: Navigation (next/prev/URL lookup)
 * - ChallengeAggregationService: Statistics and grouping operations
 * 
 * This facade maintains backward compatibility while improving code organization.
 */
@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  private readonly dataService = inject(ChallengeDataService);
  private readonly searchService = inject(ChallengeSearchService);
  private readonly navigationService = inject(ChallengeNavigationService);
  private readonly aggregationService = inject(ChallengeAggregationService);

  // ========================================================================
  // CRUD Operations (delegated to ChallengeDataService)
  // ========================================================================

  /**
   * Returns all challenges (lightweight data).
   */
  getChallenges(): Observable<readonly Challenge[]> {
    return this.dataService.getChallenges();
  }

  /**
   * Finds a challenge by its unique ID (lightweight data).
   * @param id - Challenge ID
   */
  getChallengeById(id: number): Observable<Challenge | undefined> {
    return this.dataService.getChallengeById(id);
  }

  /**
   * Finds detailed challenge information by ID (for detail pages).
   * @param id - Challenge ID (numeric) or slug (string)
   * @deprecated Use getChallengeDetailsBySlug for slug-based routing
   */
  getChallengeDetailsById(id: string | number): Observable<ChallengeDetails | undefined> {
    return this.dataService.getChallengeDetailsById(id);
  }

  /**
   * Finds detailed challenge information by slug/link (preferred for slug-based routing).
   * @param slug - Challenge slug (e.g., 'fetch-products')
   * @param categoryId - Optional category ID for O(1) lookup optimization
   */
  getChallengeDetailsBySlug(slug: string, categoryId?: ChallengeCategoryId): Observable<ChallengeDetails | undefined> {
    return this.dataService.getChallengeDetailsBySlug(slug, categoryId);
  }

  /**
   * Retrieves all challenges belonging to a specific category.
   * @param category - Category name
   */
  getChallengesByCategory(category: string): Observable<readonly Challenge[]> {
    return this.dataService.getChallengesByCategory(category);
  }

  /**
   * Retrieves challenges by difficulty level.
   * @param difficulty - Difficulty level
   */
  getChallengesByDifficulty(difficulty: DifficultyLevel): Observable<readonly Challenge[]> {
    return this.dataService.getChallengesByDifficulty(difficulty);
  }

  /**
   * Retrieves challenges that have a specific tag.
   * @param tag - Tag to filter by
   */
  getChallengesByTag(tag: string): Observable<readonly Challenge[]> {
    return this.dataService.getChallengesByTag(tag);
  }

  /**
   * Retrieves the most recent challenge from the collection.
   */
  getLatestChallenge(): Observable<Challenge | undefined> {
    return this.dataService.getLatestChallenge();
  }

  // ========================================================================
  // Search Operations (delegated to ChallengeSearchService)
  // ========================================================================

  /**
   * Searches all challenges across categories with relevance scoring.
   * @param searchTerm - The search query string
   * @param maxResults - Maximum number of results to return
   */
  searchAllChallenges(searchTerm: string, maxResults?: number): Observable<SearchResult[]> {
    return this.searchService.searchAllChallenges(searchTerm, maxResults);
  }

  // ========================================================================
  // Navigation Operations (delegated to ChallengeNavigationService)
  // ========================================================================

  /**
   * Finds a challenge based on a provided URL.
   * @param url - The full URL string
   */
  getChallengeFromURL(url: string): Observable<Challenge | undefined> {
    return this.navigationService.getChallengeFromURL(url);
  }

  /**
   * Get the next challenge in the sequence.
   * @param currentId - Current challenge ID
   */
  getNextChallenge(currentId: number): Observable<Challenge | undefined> {
    return this.navigationService.getNextChallenge(currentId);
  }

  /**
   * Get the previous challenge in the sequence.
   * @param currentId - Current challenge ID
   */
  getPreviousChallenge(currentId: number): Observable<Challenge | undefined> {
    return this.navigationService.getPreviousChallenge(currentId);
  }

  // ========================================================================
  // Aggregation Operations (delegated to ChallengeAggregationService)
  // ========================================================================

  /**
   * Returns grouped challenge data by category.
   */
  getChallengesGroupedByCategory(): Observable<Map<string, Challenge[]>> {
    return this.aggregationService.getChallengesGroupedByCategory();
  }

  /**
   * Get all unique tags across all challenges.
   */
  getAllTags(): Observable<string[]> {
    return this.aggregationService.getAllTags();
  }

  /**
   * Get all unique difficulty levels used in challenges.
   */
  getAllDifficulties(): Observable<DifficultyLevel[]> {
    return this.aggregationService.getAllDifficulties();
  }

  /**
   * Get challenge count by category.
   */
  getChallengeCountByCategory(): Observable<Map<string, number>> {
    return this.aggregationService.getChallengeCountByCategory();
  }

  /**
   * Get challenge count by difficulty.
   */
  getChallengeCountByDifficulty(): Observable<Map<DifficultyLevel, number>> {
    return this.aggregationService.getChallengeCountByDifficulty();
  }
}
