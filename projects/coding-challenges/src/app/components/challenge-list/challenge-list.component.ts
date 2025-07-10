import { Component } from '@angular/core';
import { Challenge, ChallengeCardComponent } from '@ng-coding-challenges/shared/ui';

@Component({
  selector: 'app-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
  standalone: true,
  imports: [ChallengeCardComponent]
})
export class ChallengeListComponent {
  protected challenges: Challenge[] = [
    {
      id: 1,
      title: "Challenge 01: Async Data Fetching",
      description: "Fetch Products data from a fake API and display data in a Table using RxJS and Angular's HttpClient.",
      link: "/products",
      requirement: 'https://github.com/Manishh09/ng-coding-challenges/tree/develop/projects/coding-challenges/src/README.md',
      gitHub: 'https://github.com/Manishh09/ng-coding-challenges/tree/develop/projects/coding-challenges'
    },
    {
      id: 2,
      title: "Challenge 02: State Management",
      description: "Implement state management using NgRx or Signals to manage application state across components.",
      link: "/state",
      requirement: 'https://github.com/Manishh09/ng-coding-challenges',
      gitHub: 'https://github.com/Manishh09/ng-coding-challenges'
    },
    {
      id: 3,
      title: "Challenge 03: Form Validation",
      description: "Create complex forms with dynamic validation using Angular's Reactive Forms.",
      link: "/forms",
      requirement: 'https://github.com/Manishh09/ng-coding-challenges',
      gitHub: 'https://github.com/Manishh09/ng-coding-challenges'
    },
    {
      id: 4,
      title: "Challenge 04: Component Communication",
      description: "Implement parent-child and sibling component communication using various Angular patterns.",
      link: "/components",
      requirement: 'https://github.com/Manishh09/ng-coding-challenges',
      gitHub: 'https://github.com/Manishh09/ng-coding-challenges'
    },
    {
      id: 5,
      title: "Challenge 05: Routing & Navigation",
      description: "Build a multi-level navigation system with route guards and lazy loading.",
      link: "/routing",
      requirement: 'https://github.com/Manishh09/ng-coding-challenges',
      gitHub: 'https://github.com/Manishh09/ng-coding-challenges'
    }
  ];
}
