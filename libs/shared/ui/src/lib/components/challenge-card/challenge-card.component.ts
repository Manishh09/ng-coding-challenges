import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

export interface ChallengeCardData {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  tags: string[];
  estimatedTime: number;
  isCompleted?: boolean;
  isFeatured?: boolean;
}

@Component({
  selector: 'ng-coding-challenges-challenge-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule
  ],
  template: `
    <mat-card class="challenge-card" [class.featured]="challenge.isFeatured" [class.completed]="challenge.isCompleted">
      <mat-card-header>
        <mat-card-title>{{ challenge.title }}</mat-card-title>
        <mat-card-subtitle>
          <div class="card-meta">
            <span class="category">{{ challenge.category }}</span>
            <span class="difficulty" [class]="'difficulty-' + challenge.difficulty">
              {{ challenge.difficulty | titlecase }}
            </span>
          </div>
        </mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <p class="description">{{ challenge.description }}</p>
        
        <div class="tags-container" *ngIf="challenge.tags.length > 0">
          <mat-chip-set>
            <mat-chip *ngFor="let tag of challenge.tags.slice(0, 3)">{{ tag }}</mat-chip>
            <mat-chip *ngIf="challenge.tags.length > 3" class="more-tags">
              +{{ challenge.tags.length - 3 }} more
            </mat-chip>
          </mat-chip-set>
        </div>
        
        <div class="card-footer">
          <div class="time-estimate">
            <mat-icon>schedule</mat-icon>
            <span>{{ challenge.estimatedTime }}min</span>
          </div>
          
          <div class="status-indicator" *ngIf="challenge.isCompleted">
            <mat-icon class="completed-icon">check_circle</mat-icon>
            <span>Completed</span>
          </div>
        </div>
      </mat-card-content>
      
      <mat-card-actions align="end">
        <button mat-button color="primary" [routerLink]="['/challenges', challenge.id]">
          <mat-icon>play_arrow</mat-icon>
          {{ challenge.isCompleted ? 'Review' : 'Start Challenge' }}
        </button>
        
        <button mat-icon-button [attr.aria-label]="'Bookmark ' + challenge.title">
          <mat-icon>bookmark_border</mat-icon>
        </button>
      </mat-card-actions>
      
      <!-- Featured Badge -->
      <div class="featured-badge" *ngIf="challenge.isFeatured">
        <mat-icon>star</mat-icon>
        <span>Featured</span>
      </div>
    </mat-card>
  `,
  styles: [`
    .challenge-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid var(--outline-color);
    }
    
    .challenge-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px var(--shadow-color);
    }
    
    .challenge-card.featured {
      border-color: #ffd54f;
      background: linear-gradient(135deg, rgba(255, 213, 79, 0.05) 0%, rgba(255, 138, 101, 0.05) 100%);
    }
    
    .challenge-card.completed {
      opacity: 0.8;
    }
    
    .challenge-card.completed::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
      pointer-events: none;
    }
    
    mat-card-header {
      padding-bottom: var(--spacing-sm);
    }
    
    mat-card-title {
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1.3;
      margin-bottom: var(--spacing-xs);
      color: var(--on-surface-color);
    }
    
    .card-meta {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
    }
    
    .category {
      font-size: 0.875rem;
      color: var(--on-surface-variant-color);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
    
    .difficulty {
      padding: 2px 8px;
      border-radius: var(--border-radius-sm);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .difficulty-beginner {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    
    .difficulty-intermediate {
      background-color: #fff3e0;
      color: #f57c00;
    }
    
    .difficulty-advanced {
      background-color: #fce4ec;
      color: #c2185b;
    }
    
    .difficulty-expert {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }
    
    .dark-theme .difficulty-beginner {
      background-color: rgba(46, 125, 50, 0.2);
      color: #81c784;
    }
    
    .dark-theme .difficulty-intermediate {
      background-color: rgba(245, 124, 0, 0.2);
      color: #ffb74d;
    }
    
    .dark-theme .difficulty-advanced {
      background-color: rgba(194, 24, 91, 0.2);
      color: #f48fb1;
    }
    
    .dark-theme .difficulty-expert {
      background-color: rgba(123, 31, 162, 0.2);
      color: #ce93d8;
    }
    
    mat-card-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }
    
    .description {
      color: var(--on-surface-variant-color);
      line-height: 1.5;
      margin: 0;
      flex-grow: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .tags-container {
      margin-top: auto;
    }
    
    .tags-container mat-chip {
      font-size: 0.75rem;
      height: 24px;
    }
    
    .more-tags {
      background-color: var(--surface-variant-color) !important;
      color: var(--on-surface-variant-color) !important;
    }
    
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: var(--spacing-sm);
    }
    
    .time-estimate {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--on-surface-variant-color);
      font-size: 0.875rem;
    }
    
    .time-estimate mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .status-indicator {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: #4caf50;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .completed-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    mat-card-actions {
      padding: var(--spacing-md) var(--spacing-lg);
      border-top: 1px solid var(--outline-color);
      margin: 0;
    }
    
    .featured-badge {
      position: absolute;
      top: var(--spacing-md);
      right: var(--spacing-md);
      background: linear-gradient(135deg, #ffd54f, #ff8a65);
      color: white;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--border-radius-lg);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 8px rgba(255, 213, 79, 0.3);
    }
    
    .featured-badge mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .card-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xs);
      }
      
      .featured-badge {
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        padding: var(--spacing-xs);
      }
      
      .featured-badge span {
        display: none;
      }
    }
  `]
})
export class ChallengeCardComponent {
  @Input({ required: true }) challenge!: ChallengeCardData;
}