import {
  Component,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';

/**
 * Stat item interface for HeroStats component
 */
export interface StatItem {
  /** The main value to display (e.g., "11+", "3") */
  value: string;
  /** The label describing the stat (e.g., "Hands-on challenges") */
  label: string;
}

/**
 * HeroStats Component
 * 
 * A compact, pill-styled stats display component for hero sections.
 * Displays multiple key metrics in a horizontal, responsive layout.
 * 
 * Perfect for:
 * - Hero section statistics
 * - Quick metrics overview
 * - Dashboard summary widgets
 * - Feature highlights with numbers
 * 
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Responsive layout that wraps on mobile
 * - Accessible with proper ARIA roles
 * - Optimized for hero/banner sections
 * 
 * @example
 * ```html
 * <ng-coding-challenges-hero-stats
 *   [stats]="[
 *     { value: '11+', label: 'Hands-on challenges' },
 *     { value: '3', label: 'Learning paths' }
 *   ]"
 *   ariaLabel="Platform statistics"
 * />
 * ```
 * 
 * @ux Provides quick, scannable metrics with clear visual separation
 * @accessibility Uses proper list semantics and configurable ARIA labels
 */
@Component({
  selector: 'ng-coding-challenges-hero-stats',
  standalone: true,
  imports: [],
  templateUrl: './hero-stats.component.html',
  styleUrls: ['./hero-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroStatsComponent {
  // ========== Inputs ==========
  
  /** Array of stat items to display */
  readonly stats = input.required<readonly StatItem[]>();
  
  /** Optional ARIA label for the stats container */
  readonly ariaLabel = input<string>('Statistics');
  
  /** Optional custom styling variant */
  readonly variant = input<'default' | 'compact' | 'prominent'>('default');
}
