import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { LoginCredentials, LoginResponse } from '../../models/login-credentials';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit {
  private fb = inject(FormBuilder);

  loginForm!: FormGroup;

  // UI state using signals
  submitted = signal(false);
  loginSuccess = signal(false);
  loginResponse = signal<LoginResponse | null>(null);

  ngOnInit(): void {
    this.initForm();
  }

  /* ================= FORM SETUP ================= */

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /* ================= CONTROLS GETTER ================= */

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  /* ================= ERROR VISIBILITY ================= */
  // Optional helper — keeps template clean

  showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty || this.submitted());
  }

  /* ================= SUBMIT ================= */

  onSubmit(): void {
    this.submitted.set(true);
    this.loginSuccess.set(false);
    this.loginResponse.set(null);

    // Mark all controls as touched
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const credentials: LoginCredentials = this.loginForm.value;

    this.mockLogin(credentials);
  }

  /* ================= MOCK API ================= */

  private mockLogin(credentials: LoginCredentials): void {
    setTimeout(() => {
      this.loginSuccess.set(true);
      this.loginResponse.set({
        success: true,
        message: 'Login successful! Welcome back.',
        user: {
          email: credentials.email,
          name: 'Demo User'
        }
      });

      console.log('Login credentials:', credentials);
    }, 500);
  }

  /* ================= RESET ================= */

  resetForm(): void {
    this.loginForm.reset();
    this.submitted.set(false);
    this.loginSuccess.set(false);
    this.loginResponse.set(null);
  }
}
