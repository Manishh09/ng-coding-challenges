import { Injectable } from '@angular/core';
import { Challenge } from '@ng-coding-challenges/shared/models';
@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  private readonly repoUrl = 'https://github.com/Manishh09/ng-coding-challenges';
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
      title: "Challenge 04: Server-Side User Search (AutoComplete)",
      description: "Implement a server-side search for users using Angular's Reactive Forms and RxJS with dummy API data",
      link: "/challenges/server-side-search",
      requirement: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-04-server-side-search%2Fdocs%2FCH-04-REQUIREMENT.md`,
      solutionGuide: `${this.repoUrl}/blob/develop/projects%2Fcoding-challenges%2Fsrc%2Fapp%2Fchallenges%2Fchallenge-04-server-side-search%2Fdocs%2FCH-04-SOLUTION_GUIDE.md`,
      gitHub: `${this.repoUrl}/tree/develop/projects/coding-challenges/src/app/challenges/challenge-04-server-side-search`
    },
    {
      id: 5,
      title: "Challenge 05: Product Category Management System - shareReplay",
      description: "Build a product category management system where multiple Angular components share a list of product categories efficiently using Signals and RxJS shareReplay.",
      link: "/challenges/product-category-management",
      requirement: "https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects/coding-challenges/src/app/challenges/challenge-05-product-category-management-system/docs/CH-05-REQUIREMENT.md",
      solutionGuide: "https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects/coding-challenges/src/app/challenges/challenge-05-product-category-management-system/docs/CH-05-SOLUTION_GUIDE.md",
      gitHub: "https://github.com/Manishh09/ng-coding-challenges/src/app/challenges/challenge-05-product-category-management-system"
    },
    {
      id: 6,
      title: "Challenge 06: User Todos with Status Filter - combineLatest",
      description: "Build an Angular component that fetches todos and users from a Fake API, merges them using RxJS combineLatest, and displays a table enriched with user names. Implement a status filter (All / Completed / Pending) and display the filtered results.",
      link: "/challenges/user-todos-filter",
      requirement: "https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects/coding-challenges/src/app/challenges/challenge-06-user-todos-filter/docs/CH-06-REQUIREMENT.md",
      solutionGuide: "https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects/coding-challenges/src/app/challenges/challenge-06-user-todos-filter/docs/CH-06-SOLUTION_GUIDE.md",
      gitHub: "https://github.com/Manishh09/ng-coding-challenges/src/app/challenges/challenge-06-user-todos-filter"
    },
    {
      id: 7,
      title: "Challenge 07: User Posts Dashboard - Dependent API Calls",
      description: "Build an Angular component that fetches users and their posts from the DummyJSON API using RxJS mergeMap for dependent API calls. Display the the combined results in a simple HTML table (User → Post Titles) with loading and error states.",
      link: "/challenges/user-posts-dashboard",
      requirement: "https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects/coding-challenges/src/app/challenges/challenge-07-dependent-apis/docs/CH-07-REQUIREMENT.md",
      solutionGuide: "https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects/coding-challenges/src/app/challenges/challenge-07-dependent-apis/docs/CH-07-SOLUTION_GUIDE.md",
      gitHub: "https://github.com/Manishh09/ng-coding-challenges/src/app/challenges/challenge-07-dependent-apis-mergemap"
    },
    {
      id: 8,
      title: "Challenge 08: E-Commerce Checkout Process - Sequential API Calls",
      description: "Implement a simplified e-commerce checkout process in Angular using RxJS. The challenge involves fetching products from a fake API, allowing users to select products, placing an order, updating product inventory, and processing payment. You'll use RxJS operators like concatMap to handle sequential API calls and manage loading and error states effectively.",
      link: "/challenges/ecommerce-checkout",
      requirement: "https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects/coding-challenges/src/app/challenges/challenge-08-ecommerce-checkout/docs/CH-08-REQUIREMENT.md",
      solutionGuide: "https://github.com/Manishh09/ng-coding-challenges/blob/develop/projects/coding-challenges/src/app/challenges/challenge-08-ecommerce-checkout/docs/CH-08-SOLUTION_GUIDE.md",
      gitHub: "https://github.com/Manishh09/ng-coding-challenges/src/app/challenges/challenge-08-ecommerce-checkout"
    },
    // Add future challenges here..
  ];

  getChallenges(): Challenge[] {
    return this.challenges;
  }

  getChallengeById(id: number): Challenge | undefined {
    return this.challenges.find(challenge => challenge.id === id);
  }
}
