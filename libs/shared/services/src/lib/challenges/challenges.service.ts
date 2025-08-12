import { Injectable } from '@angular/core';
import { Challenge } from '@ng-coding-challenges/shared/models';
@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  private repoUrl = 'https://github.com/Manishh09/ng-coding-challenges';
  private challenges: Challenge[] = [
    {
      id: 1,
      title: "Challenge-01: Fetch Products",
      description: "Fetch Products data from a fake API and display data in a Table using RxJS and Angular's HttpClient.",
      link: "/challenges/fetch-products",
      requirement: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-01-product-list%2Fdocs%2FCH-01-REQUIREMENT.md`,
      solutionGuide: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-01-product-list%2Fdocs%2FCH-01-SOLUTION_GUIDE.md`,
      gitHub: `${this.repoUrl}/tree/develop/projects/coding-challenges/src/app/challenges/challenge-01-product-list`,
      difficulty: 'beginner',
      category: 'http',
      estimatedTime: 30,
      tags: ['HttpClient', 'RxJS', 'Observables', 'Async Pipe'],
      isCompleted: false,
      isFeatured: true,
      lastUpdated: new Date('2024-01-15'),
      prerequisites: ['Basic Angular knowledge', 'TypeScript fundamentals']
    },
    {
      id: 2,
      title: "Challenge-02: Dashboard Data - Parallel API Calls",
      description: "Learn how to perform parallel API calls in Angular using RxJS's forkJoin. In this challenge, you'll fetch data from multiple independent endpoints and render the results in the UI only after all responses are received.",
      link: "/challenges/handle-parallel-apis",
      requirement: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-02-parallel-apis%2Fdocs%2FCH-02-REQUIREMENT.md`,
      solutionGuide: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-02-parallel-apis%2Fdocs%2FCH-02-SOLUTION_GUIDE.md`,
      gitHub: `${this.repoUrl}/tree/develop/projects/coding-challenges/src/app/challenges/challenge-02-parallel-apis`,
      difficulty: 'intermediate',
      category: 'http',
      estimatedTime: 45,
      tags: ['forkJoin', 'Parallel APIs', 'Dashboard', 'Error Handling'],
      isCompleted: false,
      isFeatured: true,
      lastUpdated: new Date('2024-01-20'),
      prerequisites: ['Challenge-01 completion', 'RxJS basics', 'Promise handling']
    },
    {
      id: 3,
      title: "Challenge 03: Client-Side User Search",
      description: "Implement a client-side search for users using Angular's Reactive Forms and RxJS with dummy API data",
      link: "/challenges/client-side-search",
      requirement: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-03-client-side-search%2Fdocs%2FCH-03-REQUIREMENT.md`,
      solutionGuide: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-03-client-side-search%2Fdocs%2FCH-03-SOLUTION_GUIDE.md`,
      gitHub: `${this.repoUrl}/tree/develop/projects/coding-challenges/src/app/challenges/challenge-03-client-side-search`,
      difficulty: 'intermediate',
      category: 'forms',
      estimatedTime: 40,
      tags: ['Reactive Forms', 'Search', 'Filtering', 'Client-side'],
      isCompleted: false,
      isFeatured: false,
      lastUpdated: new Date('2024-01-25'),
      prerequisites: ['Reactive Forms basics', 'RxJS operators', 'Array methods']
    },
    {
      id: 4,
      title: "Challenge 04: Server-Side User Search",
      description: "Implement a server-side search for users using Angular's Reactive Forms and RxJS with dummy API data",
      link: "/challenges/server-side-search",
      requirement: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-04-server-side-search%2Fdocs%2FCH-04-REQUIREMENT.md`,
      solutionGuide: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-04-server-side-search%2Fdocs%2FCH-04-SOLUTION_GUIDE.md`,
      gitHub: `${this.repoUrl}/tree/develop/projects/coding-challenges/src/app/challenges/challenge-04-server-side-search`,
      difficulty: 'advanced',
      category: 'http',
      estimatedTime: 60,
      tags: ['Server-side Search', 'Debouncing', 'API Integration', 'Performance'],
      isCompleted: false,
      isFeatured: false,
      lastUpdated: new Date('2024-01-30'),
      prerequisites: ['Challenge-03 completion', 'HTTP interceptors', 'Performance optimization']
    }
  ];

  getChallenges(): Challenge[] {
    return this.challenges;
  }

  getChallengeById(id: number): Challenge | undefined {
    return this.challenges.find(challenge => challenge.id === id);
  }
}
