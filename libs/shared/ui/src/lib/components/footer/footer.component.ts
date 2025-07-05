import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ng-coding-challenges-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatIconModule, MatButtonModule]
})
export class FooterComponent {
  appName = input('ng-coding-challenges');
  description = input('Master Angular development through hands-on coding challenges.');
  angularVersion = input('19');
  
  readonly currentYear = computed(() => new Date().getFullYear());
}