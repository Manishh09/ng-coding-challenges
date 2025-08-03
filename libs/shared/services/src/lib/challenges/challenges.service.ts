import { Injectable } from '@angular/core';
import { Challenge } from '@ng-coding-challenges/shared/models';
@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  private challenges: Challenge[] = [
    {
      id: 1,
      title: "Challenge 01: Fetch Products",
      description: "Fetch Products data from a fake API and display data in a Table using RxJS and Angular's HttpClient.",
      link: "/challenges/fetch-products",
      requirement: 'https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-01-product-list%2Fdocs%2FCH-01-REQUIREMENT.md',
      gitHub: 'https://github.com/Manishh09/ng-coding-challenges/tree/develop/projects/coding-challenges/src/app/challenges/challenge-01-product-list'
    },
    {
      id: 2,
      title: "Challenge 02: Parallel APIs: Independent API Requests",
      description: "Learn how to handle parallel API calls in Angular using RxJS's forkJoin. You'll fetch data from multiple endpoints and display the combined results after receiving all responses in the UI.",
      link: "/challenges/handle-parallel-apis",
      requirement: 'https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-02-parallel-apis%2Fdocs%2FCH-02-REQUIREMENT.md',
      gitHub: 'https://github.com/Manishh09/ng-coding-challenges/tree/develop/projects/coding-challenges/src/app/challenges/challenge-02-parallel-apis'
    },
    // {
    //   id: 3,
    //   title: "Challenge 03: Form Validation",
    //   description: "Create complex forms with dynamic validation using Angular's Reactive Forms.",
    //   link: "/forms",
    //   requirement: 'https://github.com/Manishh09/ng-coding-challenges',
    //   gitHub: 'https://github.com/Manishh09/ng-coding-challenges'
    // },
    // {
    //   id: 4,
    //   title: "Challenge 04: Component Communication",
    //   description: "Implement parent-child and sibling component communication using various Angular patterns.",
    //   link: "/components",
    //   requirement: 'https://github.com/Manishh09/ng-coding-challenges',
    //   gitHub: 'https://github.com/Manishh09/ng-coding-challenges'
    // },
    // {
    //   id: 5,
    //   title: "Challenge 05: Routing & Navigation",
    //   description: "Build a multi-level navigation system with route guards and lazy loading.",
    //   link: "/routing",
    //   requirement: 'https://github.com/Manishh09/ng-coding-challenges',
    //   gitHub: 'https://github.com/Manishh09/ng-coding-challenges'
    // }
  ];

  getChallenges(): Challenge[] {
    return this.challenges;
  }

  getChallengeById(id: number): Challenge | undefined {
    return this.challenges.find(challenge => challenge.id === id);
  }
}
