import { Injectable } from '@angular/core';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { CHALLENGE_DATA } from './challenge-data';
@Injectable({
  providedIn: 'root'
})
export class ChallengesService {


  private challenges: Challenge[] = CHALLENGE_DATA;


  getChallenges(): Challenge[] {
    return this.challenges;
  }

  getChallengeById(id: number): Challenge | undefined {
    return this.challenges.find(challenge => challenge.id === id);
  }

  getChallengesByCategory(category: string): Challenge[] {
    return this.challenges.filter(challenge => challenge.category === category);
  }

  /**
   * Retrieves the most recent challenge from the collection.
   *
   * @returns The latest challenge in the collection, or `undefined` if the collection is empty
   */
  getLatestChallenge(): Challenge | undefined {
    if (this.challenges.length === 0) {
      return undefined;
    }
    return this.challenges.at(-1); // Assuming challenges are ordered by ID
  }

  /**
   * Extracts the current challenge from a given URL by parsing the last URL segment
   * and matching it against available challenges.
   *
   * @param url - The URL string to extract the challenge ID from
   * @returns The matching Challenge object if found, otherwise null
   */
  getCurrentChallengeIdFromURL(url: string): Challenge | null {
    const segments = url.split('/');
    const lastSegment = segments.at(-1);
    if (lastSegment) {
      const challenge = this.challenges.find(c => c.link.includes(lastSegment));
      return challenge ? challenge : null;
    } else {
      return null;
    }
  }

}




