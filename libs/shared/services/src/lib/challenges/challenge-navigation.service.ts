import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { ChallengeDataService } from './challenge-data.service';

/**
 * Service responsible for challenge navigation operations.
 * Handles next/previous navigation and URL-based challenge lookup.
 * Part of the refactored challenge service architecture following SRP.
 */
@Injectable({
  providedIn: 'root',
})
export class ChallengeNavigationService {
  private readonly challengeData = inject(ChallengeDataService);

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

    return this.challengeData.getChallenges().pipe(
      map(challenges => challenges.find(c => c.link.includes(lastSegment)))
    );
  }

  /**
   * Get the next challenge in the sequence.
   * @param currentId - Current challenge ID
   * @returns Observable of the next challenge, or undefined if at the end
   */
  getNextChallenge(currentId: number): Observable<Challenge | undefined> {
    return this.challengeData.getChallenges().pipe(
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
    return this.challengeData.getChallenges().pipe(
      map(challenges => {
        const currentIndex = challenges.findIndex(c => c.id === currentId);
        if (currentIndex <= 0) {
          return undefined;
        }
        return challenges[currentIndex - 1];
      })
    );
  }
}
