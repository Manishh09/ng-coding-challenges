import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';


export type Role = 'admin' | 'user';
export interface User { username: string; role: Role }


@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  readonly user = this._user;
  readonly isLoggedIn = computed(() => !!this._user());


  constructor(private router: Router) { }


  login(username: string, password: string): boolean {
    // Mock users: admin/admin and user/user
    if (username === 'admin' && password === 'admin') {
      this._user.set({ username, role: 'admin' });
      return true;
    }
    if (username === 'user' && password === 'user') {
      this._user.set({ username, role: 'user' });
      return true;
    }
    return false;
  }


  hasRole(role: Role) {
    return this._user()?.role === role;
  }


  logout(redirect = '/challenges/angular-routing/login') {
    this._user.set(null);
    this.router.navigate([redirect]);
  }
}
