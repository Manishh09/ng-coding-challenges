import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeType } from '@ng-coding-challenges/shared/models';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = 'ng-coding-challenges-theme';
  private readonly platformId = inject(PLATFORM_ID);

  // Signal-based reactive state
  private readonly _currentTheme = signal<ThemeType>(this.getInitialTheme());
  private readonly _systemPreference = signal<ThemeType>(this.getSystemPreference());

  // Public readonly signals
  readonly currentTheme = this._currentTheme.asReadonly();
  readonly systemPreference = this._systemPreference.asReadonly();
  readonly isDarkMode = () => this._currentTheme() === 'dark';

  constructor() {
    // Listen to system theme changes
    if (isPlatformBrowser(this.platformId)) {
      this.setupSystemThemeListener();
    }

    // Effect to apply theme changes
    effect(() => {
      this.applyTheme(this._currentTheme());
    });

    // Effect to persist theme preference
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.THEME_STORAGE_KEY, this._currentTheme());
      }
    });
  }

  toggleTheme(): void {
    const newTheme: ThemeType = this._currentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: ThemeType): void {
    this._currentTheme.set(theme);
  }

  useSystemTheme(): void {
    this.setTheme(this._systemPreference());
  }

  private getInitialTheme(): ThemeType {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }

    const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY) as ThemeType;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return this.getSystemPreference();
  }

  private getSystemPreference(): ThemeType {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      this._systemPreference.set(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
  }

  private applyTheme(theme: ThemeType): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const body = document.body;
    // Remove any existing theme classes (legacy and current)
    body.classList.remove('light-theme', 'dark-theme', 'docs-light-mode', 'docs-dark-mode', 'dark-mode');

    // Add the single class our styles target
    if (theme === 'dark') {
      body.classList.add('dark-mode');
    }

    this.updateMetaThemeColor(theme);
  }

  private updateMetaThemeColor(theme: ThemeType): void {
    const themeColor = theme === 'dark' ? '#0a0a0a' : '#8b5cf6';

    let metaThemeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;
  }
}
