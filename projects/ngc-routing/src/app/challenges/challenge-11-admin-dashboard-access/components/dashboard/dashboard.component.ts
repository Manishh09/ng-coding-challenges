import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ChallengeHeaderComponent } from 'projects/ngc-shell/src/app/shared/components/challenge-header/challenge-header.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, RouterModule, ChallengeHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  auth = inject(AuthService);
}
