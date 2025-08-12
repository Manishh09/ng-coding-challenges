import { Component, input, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChallengeCardComponent } from '../challenge-card/challenge-card.component';
import { ChallengesService, NavigationService, NotificationService } from '@ng-coding-challenges/shared/services';
import { Challenge } from '@ng-coding-challenges/shared/models';

@Component({
  selector: 'ng-coding-challenges-challenge-list',
  templateUrl: './challenge-list.component.html',
  styleUrl: './challenge-list.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ChallengeCardComponent
  ]
})
export class ChallengeListComponent implements OnInit {
  // Input signals
  challenges = input<Challenge[]>([]);
  title = input<string>('Available Challenges');
  showFilters = input<boolean>(true);
  showSearch = input<boolean>(true);

  // Private services
  private challengesService = inject(ChallengesService);
  private navigationService = inject(NavigationService);
  private notificationService = inject(NotificationService);

  // State signals
  protected searchQuery = signal<string>('');
  protected selectedDifficulty = signal<string>('all');
  protected selectedCategory = signal<string>('all');
  protected selectedTags = signal<string[]>([]);
  protected sortBy = signal<'title' | 'difficulty' | 'estimatedTime' | 'id'>('title');
  protected sortOrder = signal<'asc' | 'desc'>('asc');
  protected viewMode = signal<'cards' | 'list' | 'grid' | 'timeline'>('cards');
  protected showCompleted = signal<boolean>(false);
  protected showProgress = signal<boolean>(true);

  // Computed signals
  protected availableDifficulties = computed(() => {
    const challenges = this.challenges().length > 0
      ? this.challenges()
      : this.challengesService.getChallenges();
    const difficulties = challenges.map(c => c.difficulty);
    return ['all', ...Array.from(new Set(difficulties))];
  });

  protected availableCategories = computed(() => {
    const challenges = this.challenges().length > 0
      ? this.challenges()
      : this.challengesService.getChallenges();
    const categories = challenges.map(c => c.category);
    return ['all', ...Array.from(new Set(categories))];
  });

  protected availableTags = computed(() => {
    const challenges = this.challenges().length > 0
      ? this.challenges()
      : this.challengesService.getChallenges();
    const allTags = challenges.flatMap(c => c.tags || []);
    return Array.from(new Set(allTags));
  });

  protected filteredChallenges = computed(() => {
    // Get challenges from input or fallback to service
    const challenges = this.challenges().length > 0
      ? this.challenges()
      : this.challengesService.getChallenges();

    let filtered = challenges;

    // Filter by search query
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        (challenge.tags || []).some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by difficulty
    if (this.selectedDifficulty() !== 'all') {
      filtered = filtered.filter(challenge => challenge.difficulty === this.selectedDifficulty());
    }

    // Filter by category
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(challenge => challenge.category === this.selectedCategory());
    }

    // Filter by tags
    if (this.selectedTags().length > 0) {
      filtered = filtered.filter(challenge =>
        this.selectedTags().every(tag => (challenge.tags || []).includes(tag))
      );
    }

    // Sort challenges
    filtered = this.sortChallenges(filtered);

    return filtered;
  });

  protected totalChallenges = computed(() => {
    const challenges = this.challenges().length > 0
      ? this.challenges()
      : this.challengesService.getChallenges();
    return challenges.length;
  });
  protected filteredCount = computed(() => this.filteredChallenges().length);
  protected hasActiveFilters = computed(() =>
    this.searchQuery() !== '' ||
    this.selectedDifficulty() !== 'all' ||
    this.selectedCategory() !== 'all' ||
    this.selectedTags().length > 0
  );

  ngOnInit(): void {
    // If no challenges are provided as input, get them from the service
    if (this.challenges().length === 0) {
      // Note: We can't modify input signals directly, so we'll handle this in the computed signal
      // The service will be used as fallback in the filteredChallenges computed
    }
  }

  // Event handlers
  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  protected onDifficultyChange(difficulty: string): void {
    this.selectedDifficulty.set(difficulty);
  }

  protected onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
  }

  protected onTagToggle(tag: string): void {
    const currentTags = this.selectedTags();
    const isSelected = currentTags.includes(tag);

    if (isSelected) {
      this.selectedTags.set(currentTags.filter(t => t !== tag));
    } else {
      this.selectedTags.set([...currentTags, tag]);
    }
  }

  protected onSortChange(sortBy: 'title' | 'difficulty' | 'estimatedTime' | 'id'): void {
    if (this.sortBy() === sortBy) {
      this.sortOrder.update(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(sortBy);
      this.sortOrder.set('asc');
    }
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedDifficulty.set('all');
    this.selectedCategory.set('all');
    this.selectedTags.set([]);
  }

  protected onViewModeChange(mode: 'cards' | 'list' | 'grid' | 'timeline'): void {
    this.viewMode.set(mode);
  }

  protected toggleShowCompleted(): void {
    this.showCompleted.update(current => !current);
  }

  protected toggleShowProgress(): void {
    this.showProgress.update(current => !current);
  }

  protected getCompletedCount(): number {
    const challenges = this.challenges().length > 0
      ? this.challenges()
      : this.challengesService.getChallenges();
    return challenges.filter(c => c.isCompleted).length;
  }

  protected getProgressPercentage(): number {
    const total = this.totalChallenges();
    const completed = this.getCompletedCount();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  protected openURL(url: string, type: "github" | "requirement" | "solution"): void {
    const errorMessage = type === "github"
      ? 'Unable to open GitHub repository. Please check if popups are blocked.'
      : type === "requirement"
      ? 'Unable to open challenge requirement doc. Please check if popups are blocked.'
      : 'Unable to open solution guide. Please check if popups are blocked.';

    if (!url) {
      this.notificationService.error('No URL provided to open.');
      return;
    }

    const success = this.navigationService.openExternalLink(url);

    if (!success) {
      this.notificationService.error(errorMessage);
    }
  }

  private sortChallenges(challenges: Challenge[]): Challenge[] {
    return [...challenges].sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy()) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
        case 'estimatedTime':
          comparison = (a.estimatedTime || 0) - (b.estimatedTime || 0);
          break;
      }

      return this.sortOrder() === 'asc' ? comparison : -comparison;
    });
  }
}
