export type AuthProvider = 'anonymous' | 'email' | 'github';

export type ThemePreference = 'dark' | 'light' | 'system';

export type User = {
  id: string;
  authProvider: AuthProvider;
  email?: string;
  githubId?: string;
  displayName?: string;
  avatarUrl?: string;
  themePreference: ThemePreference;
  accentPreference: string;
  createdAt: number;
  updatedAt: number;
};
