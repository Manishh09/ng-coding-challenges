export type ThemeType = 'light' | 'dark';

export interface ThemeConfig {
  name: string;
  type: ThemeType;
  primary: string;
  accent: string;
  warn: string;
  background: string;
  surface: string;
  onSurface: string;
}

export interface ThemeState {
  currentTheme: ThemeType;
  availableThemes: ThemeConfig[];
  systemPreference: ThemeType;
}