import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'ng-coding-challenges-loading-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent {
  diameter = input(40);
  strokeWidth = input(4);
  color = input<'primary' | 'accent' | 'warn'>('primary');
  message = input('');
  containerClass = input('');
  
  hasContent = computed(() => true); // This will be true if there's any projected content
}