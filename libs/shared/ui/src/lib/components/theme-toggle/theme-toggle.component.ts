import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../../../services/src/lib/theme/theme.service';

@Component({
  selector: 'ng-coding-challenges-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule]
})
export class ThemeToggleComponent {
  readonly themeService = inject(ThemeService);

  protected readonly themeIcon = () =>
    this.themeService.isDarkMode() ? 'light_mode' : 'dark_mode';

  protected readonly tooltipText = () =>
    `Switch to ${this.themeService.isDarkMode() ? 'light' : 'dark'} theme`;
}
