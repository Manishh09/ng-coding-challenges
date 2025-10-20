import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengeCardComponent } from '../challenge-card/challenge-card.component';
import { ChallengesService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChallengeCategoryService } from '@ng-coding-challenges/shared/services';

@Component({
  selector: 'ng-coding-challenges-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatButtonModule, RouterLink, MatIconModule, ChallengeCardComponent],
})
export class ChallengeListComponent implements OnInit {
  challenges: Challenge[] = [];
  protected title = 'Available Challenges';
  protected newBadgeChallengeIds: number[] = [];

  private readonly challengeCategoryService = inject(ChallengeCategoryService);
  private readonly challengesService = inject(ChallengesService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);


  ngOnInit(): void {

    this.activatedRoute.parent?.url.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(segments => {
      const categoryId = segments.length > 0 ? segments[0].path : '';

      // Pass categoryId to service for reactive updates
      this.challengeCategoryService.setSelectedCategory(categoryId);

      // Fetch challenges based on selected category
      this.challenges = this.challengesService.getChallengesByCategory(categoryId);

      // Update title based on category
      const categoryName = this.challengeCategoryService.getCategoryNameById(categoryId);
      this.title = categoryName ? `${categoryName} - Challenges` : 'Available Challenges';
    });




    // Determine which challenges should have the "New" badge
    this.setNewBadgeChallenges();
  }

  /**
   * Sets the challenges that should display the "New" badge
   * This can use different strategies like:
   * 1. Most recent challenges (e.g., latest 2 challenges)
   * 2. Challenges added within the last month
   * 3. Explicitly specified challenges by ID
   */
  private setNewBadgeChallenges(): void {
    // Get all challenges and sort by ID (assuming higher ID means newer challenge)
    const sortedChallenges = [...this.challenges].sort((a, b) => b.id - a.id);

    // Strategy 1: Mark the two most recent challenges as "new"
    if (sortedChallenges.length >= 2) {
      this.newBadgeChallengeIds = [
        sortedChallenges[0].id,  // Latest challenge
        sortedChallenges[1].id   // Second latest challenge
      ];
    } else if (sortedChallenges.length === 1) {
      this.newBadgeChallengeIds = [sortedChallenges[0].id];
    }

    // Alternative strategy (commented out): Explicitly specify which challenges get the badge
    // this.newBadgeChallengeIds = [3, 4]; // Specific challenge IDs that should show the "New" badge
  }

  hasActiveChildRoute(): boolean {
    return this.activatedRoute.children.some(child => child.outlet === 'primary');
  }
}
