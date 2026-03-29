// Shared constants and types — safe to import from Client OR Server Components.
// No 'next/headers' here.

export const ACCENT_COOKIE = 'codememo-accent';
export const THEME_COOKIE  = 'codememo-theme';

export const DEFAULT_ACCENT = 'purple';
export const DEFAULT_THEME  = 'dark';

export type AccentName =
  | 'purple' | 'sky' | 'blue' | 'indigo' | 'teal'
  | 'green'  | 'yellow' | 'orange' | 'red' | 'rose' | 'gray';

export type ThemeMode = 'dark' | 'light';
