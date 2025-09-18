import { Component, inject, signal, OnInit, OnDestroy, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import {
  ChallengeListComponent,
  FooterComponent,
  HeaderComponent,
  LandingPageComponent,
  FooterLink
} from '@ng-coding-challenges/shared/ui';
import { Subject, timer } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    MatIconModule
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ngQuest';
  logo = '/application-logo.webp';  // Path to the favicon in the public folder
  githubLogo = 'github-logo.png';
  #router = inject(Router);
  #challengesService = inject(ChallengesService);

  // Signal that controls the visibility of the layout.
  protected showLayout = signal(false);

  // Signal to control the visibility of the challenges list
  protected showChallenges = signal(false);

  // Signals to control visibility of specific layout components
  protected showHeader = signal(true);
  protected showLandingPage = signal(true);
  protected showFooter = signal(true);
  protected showFooterLinks = signal(true);
  // Hero section description paragraphs
  protected heroParagraphs = [
    'Sharpen your skills and get ready with practical Angular challenges focused on real-world interview scenarios.',
    // 'Master the concepts: RxJS, Signals, Performance, and modern Angular patterns.'
  ];

  // Hero section texts
  protected heroTitle = 'Learn Angular. Solve Challenges. Ace Interviews.';
  protected startButtonText = 'Start Practicing Now';
  protected hideButtonText = 'Hide Challenges';

  // Footer texts
  protected footerDescription = 'Practice. Learn. Succeed.';
  protected angularVersion = VERSION.major;

  // Get challenges from the service
  protected challenges: Challenge[] = this.#challengesService.getChallenges();

  // clear subscriptions on destroy
  #destroy$ = new Subject<void>();

  /**
   * Angular lifecycle hook that is called after component initialization.
   * This method is invoked after Angular has initialized all data-bound properties
   * and input bindings of the component.
   *
   * @requires The component class must implement OnInit interface
   */


  ngOnInit(): void {
    this.#updateLayoutOnRouteChange();
    // Listen for custom events to show challenges
    window.addEventListener('showChallenges', this.#showChallengesHandler);
  }

  // Event handler for showChallenges custom event
  #showChallengesHandler = ((e: CustomEvent) => {
    this.showChallenges.set(e.detail);
    if (e.detail) {
      setTimeout(() => this.scrollToSection('challenges-section'), 200);
    }
  }) as EventListener;

  #updateLayoutOnRouteChange() {
    this.showLandingPage.set(false);
    this.#router.events
      .pipe(takeUntil(this.#destroy$), filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          if (event) {
            this.#handleRouteChange(event.urlAfterRedirects);
          }
        }
      });
  }

  #handleRouteChange(url: string) {
    // Routes where we show individual challenge components only
    const challengeRoutes = [
      '/challenges/fetch-products',
      '/challenges/handle-parallel-apis',
      '/challenges/client-side-search',
      '/challenges/server-side-search',
      '/challenges/product-category-management',
      '/theme-demo',
      '/getting-started'
    ];
    // Check if current route is a specific challenge page
    const isChallengePage = challengeRoutes.includes(url);
    if (isChallengePage) {
      this.showLandingPage.set(false);
      this.showFooterLinks.set(false);
      this.showFooter.set(false);
      return;

    }
    // Check if current route is the challenges list page
    if (url === '/challenges') {
      this.showLandingPage.set(false);
      this.showFooterLinks.set(false);
      this.showFooter.set(true);
      return;

    }
    // For all other routes, show full layout
    this.showLandingPage.set(true);
    this.showFooter.set(true);
    this.showFooterLinks.set(true);
    this.showChallenges.set(false);
  }

  /**
   * Toggles the visibility of challenges
   */
  toggleChallenges(isExpanded?: boolean) {
    if (isExpanded !== undefined) {
      this.showChallenges.set(isExpanded);

      // If challenges are being shown, scroll to the challenges section
      if (isExpanded) {
        this.scrollToSection('challenges-section');
      }
      this.scrollToTop()
    } else {
      this.showChallenges.update(current => !current);
    }
  }

  /**
   * Scrolls to the top of the page
   */
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Scrolls to the home section
   */
  scrollToHome() {
    this.scrollToTop();
  }

  /**
   * Scrolls to the challenges section
   */
  scrollToSection(sectionName: string) {

    timer(100).pipe(takeUntil(this.#destroy$)).subscribe(() => {
      const section = document.getElementById(sectionName);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /**
   * Navigates to a route using the router
   */
  navigateToRoute(route: string) {
    this.#router.navigateByUrl(route);
  }

  // Handle footer link clicks
  onFooterLinkClick(link: FooterLink) {
    if (link.section) {
      if (link.section === 'challenges') {
        this.navigateToRoute('/challenges');
        return;
      }

      this.scrollToSection(link.section === 'home' ? 'header-section' : 'home-section');
      return;
    }
    if (link.url) {
      this.navigateToRoute(link.url);
    }
  }

  // Handle landing page events
  onGetStarted(): void {
    this.navigateToRoute('/getting-started');
  }

  onExploreChallenges(): void {
    this.navigateToRoute('/challenges');
  }

  onTryLatestChallenge(): void {
    // Navigate to the latest challenge - for now, navigate to the first challenge
    const latestChallenge = this.challenges.at(-1);
    if (latestChallenge?.link) {
      this.navigateToRoute(latestChallenge.link);
    }
  }

  // clear subscriptions on destroy
  ngOnDestroy(): void {
    // Remove event listener using the same handler reference
    window.removeEventListener('showChallenges', this.#showChallengesHandler);

    // Called once, before the instance is destroyed.
    this.#destroy$.next();
    this.#destroy$.complete();
    console.log('AppComponent destroyed');
  }
}
