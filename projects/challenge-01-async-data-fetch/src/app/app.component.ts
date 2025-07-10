import { Component, inject, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { 
  Challenge, 
  ChallengeListComponent, 
  FooterComponent, 
  HeaderComponent, 
  HeroSectionComponent,
  ChallengesService 
} from '@ng-coding-challenges/shared/ui';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

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
  title = 'ngular coding challenges';
  logo = 'favicon.ico';  // Path relative to the public folder defined in assets
  #router = inject(Router);
  #challengesService = inject(ChallengesService);

  // Signal that controls the visibility of the layout.
  protected showLayout = signal(false);

  // Signal to control the visibility of the challenges list
  protected showChallenges = signal(false);

  // Hero section description paragraphs
  protected heroParagraphs = [
    'Sharpen your skills and get job-ready with practical Angular challenges focused on real-world interview scenarios.',
    'Master the concepts that employers look for: RxJS, Signals, State Management, Performance, and modern Angular patterns.'
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
        this.scrollToChallenges();
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
   * Scrolls to the challenges section
   */
  scrollToChallenges() {
    setTimeout(() => {
      const challengesSection = document.getElementById('challenges-section');
      if (challengesSection) {
        challengesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Small delay to ensure DOM is updated
  }

  // clear subscriptions on destroy
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.#destroy$.next();
    this.#destroy$.complete();
    console.log('AppComponent destroyed');
  }
}
