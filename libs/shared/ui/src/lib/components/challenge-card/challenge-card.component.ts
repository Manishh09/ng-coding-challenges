import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

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

export interface Challenge {
  
  id: number;
  title: string;
  description: string;

  link: string;

  requirement: string;

  gitHub: string;
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
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    RouterLink
  ],
 templateUrl: './challenge-card.component.html',
 styleUrl: './challenge-card.component.scss'
})
export class ChallengeCardComponent {
  @Input({ required: true }) challenge!: Challenge;
}