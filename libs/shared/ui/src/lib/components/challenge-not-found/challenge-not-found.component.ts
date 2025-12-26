import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-challenge-not-found',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './challenge-not-found.component.html',
  styleUrls: ['./challenge-not-found.component.scss'],
})
export class ChallengeNotFoundComponent {
  constructor(private router: Router) {}

  /**
   * Navigate back to challenges browser
   */
  goToChallenges(): void {
    this.router.navigate(['/challenges']);
  }

  /**
   * Navigate to home page
   */
  goHome(): void {
    this.router.navigate(['/']);
  }
}
