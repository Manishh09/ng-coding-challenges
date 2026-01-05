import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<string | null>(null);
  readonly user = this._user;
  readonly isLoggedIn = computed(() => !!this._user());


  constructor(private router: Router) { }


  login(username: string, password: string): boolean {
    // Mock auth: user/user is valid
    if (username === password) {
      this._user.set(username);
      return true;
    }
    return false;
  }

  // NOTE: Navigate to proper route in PRODUCTION code
  logout(redirect = '/challenges/angular-routing/authorized-resource-access/login') {
    this._user.set(null);
    this.router.navigate([redirect]);
  }
}
