import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ng-challenges-empty-state',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="empty-state-container" [class]="containerClass">
      <div class="empty-state-icon" *ngIf="icon">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      
      <div class="empty-state-content">
        <h3 class="empty-state-title" *ngIf="title">{{ title }}</h3>
        <p class="empty-state-message" *ngIf="message">{{ message }}</p>
        
        <ng-content></ng-content>
        
        <div class="empty-state-actions" *ngIf="actionText && actionHandler">
          <button 
            mat-raised-button 
            [color]="actionColor"
            (click)="actionHandler()">
            <mat-icon *ngIf="actionIcon">{{ actionIcon }}</mat-icon>
            {{ actionText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .empty-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--spacing-xxl);
      min-height: 300px;
    }
    
    .empty-state-container.compact {
      padding: var(--spacing-xl);
      min-height: 200px;
    }
    
    .empty-state-container.fullscreen {
      min-height: 50vh;
      padding: var(--spacing-xxl) var(--spacing-md);
    }
    
    .empty-state-icon {
      margin-bottom: var(--spacing-lg);
      opacity: 0.6;
    }
    
    .empty-state-icon mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--on-surface-variant-color);
    }
    
    .empty-state-content {
      max-width: 400px;
    }
    
    .empty-state-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 var(--spacing-md) 0;
      color: var(--on-surface-color);
    }
    
    .empty-state-message {
      font-size: 1rem;
      line-height: 1.6;
      margin: 0 0 var(--spacing-lg) 0;
      color: var(--on-surface-variant-color);
    }
    
    .empty-state-actions {
      margin-top: var(--spacing-lg);
    }
    
    .empty-state-actions button {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    
    /* Animation */
    .empty-state-container {
      animation: fadeInUp 0.5s ease-out;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .empty-state-container {
        padding: var(--spacing-xl) var(--spacing-md);
      }
      
      .empty-state-icon mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
      }
      
      .empty-state-title {
        font-size: 1.25rem;
      }
      
      .empty-state-message {
        font-size: 0.9rem;
      }
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() actionText: string = '';
  @Input() actionIcon: string = '';
  @Input() actionColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() actionHandler?: () => void;
  @Input() containerClass: string = '';
}