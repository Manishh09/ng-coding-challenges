import { Component, inject, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-challenge-nav',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './challenge-nav.component.html',
  styleUrls: ['./challenge-nav.component.scss']
})
export class ChallengeNavComponent {
  private router = inject(Router);
  
  
  /**
   * Navigate to the home page
   */
  navigateToHome(): void {
    this.router.navigate(['/']);
  }
  
  /**
   * Navigate to challenges and show the challenges list
   * Uses a custom event to communicate with the app component
   */
  navigateToChallenges(): void {
    // Navigate to home first
    this.router.navigate(['/']);
    
    // Then trigger showing challenges list with a slight delay to ensure navigation completes
    setTimeout(() => {
      // Dispatch a custom event to communicate with app component
      window.dispatchEvent(new CustomEvent('showChallenges', { detail: true }));
    }, 100);
  }
}
