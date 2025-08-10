import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

/**
 * Header component with responsive design
 * Includes logo, navigation, theme toggle and mobile menu
 */
@Component({
  selector: 'ng-coding-challenges-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    ThemeToggleComponent
  ],
  standalone: true
})
export class HeaderComponent {
  /** Application name for accessibility and branding */
  appName = input<string>('');
  
  /** Control visibility of mobile menu button */
  showMobileMenu = input<boolean>(false);
  
  /** Logo image URL */
  logoUrl = input<string>('');
}