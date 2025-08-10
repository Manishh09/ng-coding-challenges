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
      gitHub: `${this.repoUrl}/tree/develop/projects/coding-challenges/src/app/challenges/challenge-01-product-list`
    },
    {
      id: 2,
      title: "Challenge-02: Dashboard Data - Parallel API Calls",
      description: "Learn how to perform parallel API calls in Angular using RxJS's forkJoin. In this challenge, you'll fetch data from multiple independent endpoints and render the results in the UI only after all responses are received.",
      link: "/challenges/handle-parallel-apis",
      requirement: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-02-parallel-apis%2Fdocs%2FCH-02-REQUIREMENT.md`,
      solutionGuide: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-02-parallel-apis%2Fdocs%2FCH-02-SOLUTION_GUIDE.md`,
      gitHub: `${this.repoUrl}/tree/develop/projects/coding-challenges/src/app/challenges/challenge-02-parallel-apis`
    },
    {
      id: 3,
      title: "Challenge 03: Client-Side User Search",
      description: "Implement a client-side search for users using Angular's Reactive Forms and RxJS with dummy API data",
      link: "/challenges/client-side-search",
      requirement: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-03-client-side-search%2Fdocs%2FCH-03-REQUIREMENT.md`,
      solutionGuide: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-03-client-side-search%2Fdocs%2FCH-03-SOLUTION_GUIDE.md`,
      gitHub: `${this.repoUrl}/tree/develop/projects/coding-challenges/src/app/challenges/challenge-03-client-side-search`
    },
    {
      id: 4,
      title: "Challenge 04: Server-Side User Search",
      description: "Implement a server-side search for users using Angular's Reactive Forms and RxJS with dummy API data",
      link: "/challenges/server-side-search",
      requirement: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-04-server-side-search%2Fdocs%2FCH-04-REQUIREMENT.md`,
      solutionGuide: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-04-server-side-search%2Fdocs%2FCH-04-SOLUTION_GUIDE.md`,
      gitHub: `${this.repoUrl}/tree/develop/projects/coding-challenges/src/app/challenges/challenge-04-server-side-search`
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
