import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Challenge, DifficultyLevel } from '@ng-coding-challenges/shared/models';
import { ChallengeDataService } from './challenge-data.service';

/**
 * Service responsible for challenge aggregation and statistics operations.
 * Handles grouping, counting, and metadata extraction across challenges.
 * Part of the refactored challenge service architecture following SRP.
 */
@Injectable({
  providedIn: 'root',
})
export class ChallengeAggregationService {
  private readonly challengeData = inject(ChallengeDataService);

  /**
   * Returns grouped challenge data by category.
   * @returns Observable of Map with category name to challenge array
   */
  getChallengesGroupedByCategory(): Observable<Map<string, Challenge[]>> {
    return this.challengeData.getChallenges().pipe(
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
   * Get all unique tags across all challenges.
   * @returns Observable of unique tags array, sorted alphabetically
   */
  getAllTags(): Observable<string[]> {
    return this.challengeData.getChallenges().pipe(
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
    return this.challengeData.getChallenges().pipe(
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
    return this.challengeData.getChallenges().pipe(
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
    return this.challengeData.getChallenges().pipe(
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
}
