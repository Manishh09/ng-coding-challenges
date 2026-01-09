import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  VERSION,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// ============================
// Footer Link Model
// ============================
export interface FooterLink {
  text: string;
  url?: string;
  icon?: string;
  external?: boolean;
  cssClass?: string;
  section?: string;
}

// ============================
// Static Link Data
// ============================
const QUICK_LINKS: FooterLink[] = [
  {
    text: 'GitHub',
    icon: 'code_off',
    url: 'https://github.com/Manishh09/ng-coding-challenges',
    external: true,
    section: 'github',
  },
  {
    text: 'Contribute',
    icon: 'volunteer_activism',
    url: 'https://github.com/Manishh09/ng-coding-challenges/blob/develop/CONTRIBUTING.md',
    external: true,
    section: 'contribute',
  },
];

const SOCIAL_LINKS: FooterLink[] = [
  {
    text: 'Follow on LinkedIn',
    icon: 'person',
    url: 'https://www.linkedin.com/in/manishboge',
    external: true,
    cssClass: 'linkedin',
  },
  {
    text: 'Star on GitHub',
    icon: 'star',
    url: 'https://github.com/Manishh09/ng-coding-challenges',
    external: true,
    cssClass: 'github',
  },
];

// ============================
// Footer Component
// ============================
@Component({
  selector: 'ngc-ui-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  // Inputs
  readonly appName = input<string>('');
  readonly showFooterLinks = input<boolean>(true);

  // Outputs
  readonly linkClicked = output<FooterLink>();

  // Static content
  readonly description = 'Practice. Learn. Succeed.';
  readonly angularVersion = `Angular ${VERSION.major}.`;

  // Computed signal for current year
  readonly currentYear = computed(() => new Date().getFullYear());

  // Signals (initialized from constants to avoid reallocation)
  readonly quickLinks = signal<FooterLink[]>(QUICK_LINKS);
  readonly socialLinks = signal<FooterLink[]>(SOCIAL_LINKS);

  // Emit link click event
  onLinkClick(link: FooterLink): void {
    this.linkClicked.emit(link);
  }
}
