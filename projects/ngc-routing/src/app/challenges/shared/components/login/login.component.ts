import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../challenge-10-authorized-resource-access/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';


  private auth = inject(AuthService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  onSubmit() {
    const ok = this.auth.login(this.username.trim(), this.password.trim());
    if (!ok) {
      this.snack.open('Invalid username or password', 'Close', { duration: 3000, panelClass: ['snack-error'] });
      return;
    }
    // Navigate to returnUrl from query params, or default to challenge workspace
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/challenges/angular-routing/authorized-resource-access/workspace';
    this.router.navigateByUrl(returnUrl);
  }
}
