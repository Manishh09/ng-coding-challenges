import { Injectable } from '@angular/core';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { CHALLENGE_DATA } from './challenge-data';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  /**
   * Immutable collection of available challenges.
   */
  private readonly challenges: readonly Challenge[] = CHALLENGE_DATA;

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
}
