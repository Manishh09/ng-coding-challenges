import { Component, inject, signal, type Signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import {
  Challenge,
  ChallengeListComponent,
  FooterComponent,
  HeaderComponent,
  HeroSectionComponent,
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
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ChallengeListComponent,
    HeroSectionComponent,
    MatIconModule
  ],
})
export class AppComponent {
  title = 'ngular Quest';
  logo = 'favicon.ico';  // Path to the favicon in the public folder
  #router = inject(Router);
  #challengesService = inject(ChallengesService);

  // Signal that controls the visibility of the layout.
  protected showLayout = signal(false);

  // Signal to control the visibility of the challenges list
  protected showChallenges = signal(false);

  // Hero section description paragraphs
  protected heroParagraphs = [
    'Sharpen your skills and get ready with practical Angular challenges focused on real-world interview scenarios.',
    // 'Master the concepts: RxJS, Signals, Performance, and modern Angular patterns.'
  ];

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
  }

  #updateLayoutOnRouteChange() {
    this.#router.events
      .pipe(takeUntil(this.#destroy$), filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe({
        next: (event: NavigationEnd) => {
          if (event) {
            const simpleRoutes = ['/products'];
            this.showLayout.set(!simpleRoutes.includes(event.urlAfterRedirects));
          }
        }
      });
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

  // Signals for footer links
  protected readonly quickLinks = signal<FooterLink[]>([
    { text: 'Home', icon: 'home', action: () => this.scrollToSection('header-section') },
    { text: 'Challenges', icon: 'code', action: () => { this.showChallenges.set(true); this.scrollToSection('challenges-section'); } },
    { text: 'Roadmap', icon: 'map', url: '/roadmap' },
    { text: 'GitHub', icon: 'code_off', url: 'https://github.com/Manishh09/ng-coding-challenges', external: true },
    { text: 'Contribute', icon: 'volunteer_activism', url: 'https://github.com/Manishh09/ng-coding-challenges/blob/develop/CONTRIBUTING.md', external: true }
  ]);

  protected readonly socialLinks = signal<FooterLink[]>([
    { text: 'Follow on LinkedIn', icon: 'person', url: 'https://www.linkedin.com/in/manishboge', external: true, cssClass: 'linkedin' },
    { text: 'Star on GitHub', icon: 'star', url: 'https://github.com/Manishh09/ng-coding-challenges', external: true, cssClass: 'github' }
  ]);

  protected readonly legalLinks = signal<FooterLink[]>([
    { text: 'Terms', url: '#' },
    { text: 'Privacy', url: '#' },
    { text: 'Cookie Policy', url: '#' }
  ]);

  // clear subscriptions on destroy
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.#destroy$.next();
    this.#destroy$.complete();
    console.log('AppComponent destroyed');
  }
}
