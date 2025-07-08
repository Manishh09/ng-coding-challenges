import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-coding-challenges-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Input() title: string = 'Welcome to the Angular Challenges';
  @Input() description: string[] = [
    'Get ready to enhance your skills with hands-on coding challenges.',
    'Practice async data fetching with RxJS, signals, and modern Angular patterns.'
  ];
  @Input() buttonText: string = 'Explore Challenges';
  @Input() hideButtonText: string = 'Hide Challenges';
  @Input() isExpanded: boolean = false;
  
  @Output() toggleExpand = new EventEmitter<boolean>();
  
  onToggle(): void {
    this.isExpanded = !this.isExpanded;
    this.toggleExpand.emit(this.isExpanded);
  }
}
