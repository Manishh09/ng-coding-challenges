import { Component, signal, computed, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

type PostStrength = 'too short' | 'good' | 'long';

@Component({
  selector: 'app-post-composer',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './post-composer.component.html',
  styleUrl: './post-composer.component.scss'
})
export class PostComposerComponent {
  private readonly MAX_CHARS = 280;

  /** Source signal — bound to textarea input */
  content = signal<string>('');

  /** Derived signals — all chained from `content` */
  charsUsed = computed(() => this.content().length);
  charsRemaining = computed(() => this.MAX_CHARS - this.charsUsed());
  percentageUsed = computed(() => Math.round((this.charsUsed() / this.MAX_CHARS) * 100));
  isNearLimit = computed(() => this.percentageUsed() > 80);
  isOverLimit = computed(() => this.percentageUsed() > 100);

  /** Post strength label */
  postStrength = computed<PostStrength>(() => {
    const len = this.charsUsed();
    if (len < 10) return 'too short';
    if (len <= 200) return 'good';
    return 'long';
  });

  /** Progress ring color driven by percentage bands */
  ringColor = computed(() => {
    const pct = this.percentageUsed();
    if (pct >= 100) return '#ef4444';
    if (pct >= 80) return '#f59e0b';
    return '#14b8a6';
  });

  /** SVG progress ring calculations (radius 18, circumference ~113.1) */
  private readonly RADIUS = 18;
  private readonly CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;

  strokeDashoffset = computed(() => {
    const pct = Math.min(this.percentageUsed(), 100);
    return this.CIRCUMFERENCE - (pct / 100) * this.CIRCUMFERENCE;
  });

  circumference = this.CIRCUMFERENCE;
  radius = this.RADIUS;

  /** Can the user post? */
  canPost = computed(() => this.charsUsed() >= 1 && !this.isOverLimit());

  constructor() {
    /** Telemetry effect — warn when crossing 90% threshold */
    effect(() => {
      if (this.percentageUsed() >= 90) {
        console.warn('⚠️ [Telemetry] Composer near limit:', {
          percentageUsed: this.percentageUsed(),
          charsRemaining: this.charsRemaining(),
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.content.set(value);
  }

  clearPost(): void {
    this.content.set('');
  }
}
