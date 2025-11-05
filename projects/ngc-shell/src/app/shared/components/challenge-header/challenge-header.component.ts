import { Component, input } from '@angular/core';
import { ChallengeNavComponent } from '../challenge-nav/challenge-nav.component'; // adjust path

@Component({
  selector: 'app-challenge-header',
  standalone: true,
  imports: [ChallengeNavComponent],
  templateUrl: './challenge-header.component.html',
  styleUrl: './challenge-header.component.scss'
})
export class ChallengeHeaderComponent {
  // Signal-based inputs
  title = input.required<string>();
  subtitle = input<string>(); // optional
}
