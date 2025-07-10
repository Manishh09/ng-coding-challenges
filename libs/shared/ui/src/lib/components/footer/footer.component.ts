import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ng-coding-challenges-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule]
})
export class FooterComponent {
  appName = input('angular-coding-challenges');
  description = input('Practice. Learn. Succeed');
  angularVersion = input('19');
  showNewsletter = input(false);
  
  readonly currentYear = computed(() => new Date().getFullYear());
}