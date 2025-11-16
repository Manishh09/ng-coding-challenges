import { Component, inject, signal, OnInit, OnDestroy, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  NavigationEnd,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import {

  FooterComponent,
  HeaderComponent,
  LandingPageComponent,
  FooterLink
} from '@ng-coding-challenges/shared/ui';
import { Subject, timer } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { ChallengesService } from '@ng-coding-challenges/shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatIconModule,
    HeaderComponent,
    LandingPageComponent,
    FooterComponent
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ngQuest';
  logo = '/application-logo.webp';  // Path to the favicon in the public folder
  githubLogo = 'github-logo.png';
  #router = inject(Router);
  #challengesService = inject(ChallengesService);



  // Signal to control the visibility of the challenges list
  protected showChallenges = signal(false);

  // Signals to control visibility of specific layout components
  protected showHeader = signal(true);
  protected showLandingPage = signal(true);
  protected showFooter = signal(true);
  protected showFooterLinks = signal(true);





  // Get challenges from the service
  protected readonly challenges = this.#challengesService.getChallenges();

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

  }


  // Update layout based on route changes
  #updateLayoutOnRouteChange() {
    // Set initial state based on current URL
    this.#handleRouteChange(this.#router.url);
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

  // Handle route changes to update layout visibility
  #handleRouteChange(url: string) {
    const isRoot = url === "/" || url === "";
    const isChallengesRoot = url === "/challenges";
    const isDeepChallenge = url.startsWith("/challenges/") && !isChallengesRoot;

    // Landing page only on root
    this.showLandingPage.set(isRoot);

    // Footer always visible; optionally hide links on deep challenge routes
    this.showFooter.set(true);
    this.showFooterLinks.set(true);

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


  // clear subscriptions on destroy
  ngOnDestroy(): void {

    // Called once, before the instance is destroyed.
    this.#destroy$.next();
    this.#destroy$.complete();
    console.log('AppComponent destroyed');
  }
}
