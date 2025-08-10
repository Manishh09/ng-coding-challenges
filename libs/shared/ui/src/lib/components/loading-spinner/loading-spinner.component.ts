import { ChangeDetectionStrategy, Component, computed, contentChild, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Configurable loading spinner component 
 * Supports customizing size, color, message and layout
 */
@Component({
  selector: 'ng-coding-challenges-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  /** Spinner diameter in pixels */
  diameter = input<number>(40);
  
  /** Spinner stroke width in pixels */
  strokeWidth = input<number>(4);
  
  /** Material theme color for the spinner */
  color = input<'primary' | 'accent' | 'warn'>('primary');
  
  /** Optional loading message to display */
  message = input<string>('');
  
  /** Optional CSS class(es) for container styling */
  containerClass = input<string>('');
  
  /** Check if there's projected content */
  hasContent = contentChild('*');
}