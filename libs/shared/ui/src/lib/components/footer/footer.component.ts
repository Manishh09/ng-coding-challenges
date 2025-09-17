import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, output, signal, VERSION, Version, ViewEncapsulation, type Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface FooterLink {
  // Optional properties for external links and CSS classes
  text: string;
  url?: string;
  icon?: string;
  external?: boolean;
  cssClass?: string;
  section?: string; // Section to scroll to on click
}

@Component({
  selector: 'ng-coding-challenges-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatIconModule, MatButtonModule]
})
export class FooterComponent {
  appName = input<string>('');

  showFooterLinks = input<boolean>(true);

  linkClicked = output<FooterLink>();

  description = 'Practice. Learn. Succeed';
  angularVersion = `Angular ${VERSION.major}.`;

  protected readonly currentYear = computed(() => new Date().getFullYear());

  // Signals for footer links
  protected readonly quickLinks = signal<FooterLink[]>([
    // { text: 'Home', icon: 'home', url: '/challenges', external: false, section: 'home' },
    // { text: 'Challenges', icon: 'code', url: '/challenges', external: false, section: 'challenges' },
    { text: 'GitHub', icon: 'code_off', url: 'https://github.com/Manishh09/ng-coding-challenges', external: true, section: 'github' },
    { text: 'Contribute', icon: 'volunteer_activism', url: 'https://github.com/Manishh09/ng-coding-challenges/blob/develop/docs/CONTRIBUTING.md', external: true, section: 'contribute' }
  ]);

  protected readonly socialLinks = signal<FooterLink[]>([
    { text: 'Follow on LinkedIn', icon: 'person', url: 'https://www.linkedin.com/in/manishboge', external: true, cssClass: 'linkedin' },
    { text: 'Star on GitHub', icon: 'star', url: 'https://github.com/Manishh09/ng-coding-challenges', external: true, cssClass: 'github' }
  ]);

  protected readonly legalLinks = signal<FooterLink[]>([
    { text: 'Terms', url: '#' },
    { text: 'Privacy', url: '#' },
    { text: 'Cookie Policy', url: '#' }
  ]);



  onLinkClick(link: FooterLink) {
    this.linkClicked.emit(link);
  }
}
