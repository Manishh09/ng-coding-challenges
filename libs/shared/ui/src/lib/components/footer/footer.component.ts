import { ChangeDetectionStrategy, Component, computed, input, type Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface FooterLink {
  text: string;
  url?: string;
  icon?: string;
  action?: () => void;
  external?: boolean;
  cssClass?: string;
}

@Component({
  selector: 'ng-coding-challenges-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule]
})
export class FooterComponent {
  appName = input<string>('angular-coding-challenges');
  description = input<string>('Practice. Learn. Succeed');
  angularVersion = input<string>('19');
  showNewsletter = input<boolean>(false);
  
  readonly currentYear = computed(() => new Date().getFullYear());
}