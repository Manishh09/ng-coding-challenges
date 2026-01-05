import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatExpansionModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  hidePassword = true;

  private auth = inject(AuthService);
  private snack = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    const ok = this.auth.login(this.username.trim(), this.password.trim());

    if (!ok) {
      this.snack.open('Invalid username or password', 'Close', { duration: 3000, panelClass: ['snack-error'] });
      return;
    }

    // NOTE: Navigate to proper route in PRODUCTION code
    // Navigate to returnUrl or default to products workspace
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/challenges/angular-routing/authorized-resource-access/workspace';
    this.router.navigateByUrl(returnUrl);
  }
}
