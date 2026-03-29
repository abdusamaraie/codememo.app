// Server-only — uses next/headers. Do NOT import from Client Components.
import { cookies } from 'next/headers';
import {
  ACCENT_COOKIE,
  THEME_COOKIE,
  DEFAULT_ACCENT,
  DEFAULT_THEME,
  type AccentName,
  type ThemeMode,
} from './theme-constants';

const VALID_ACCENTS = new Set<string>([
  'purple','sky','blue','indigo','teal','green','yellow','orange','red','rose','gray',
]);

/**
 * Reads accent + theme from cookies for SSR hydration.
 * Called only in Server Components (uses next/headers).
 */
export async function getThemeFromCookie(): Promise<{
  accent: AccentName;
  theme: ThemeMode;
}> {
  const jar = await cookies();
  const accent = jar.get(ACCENT_COOKIE)?.value;
  const theme  = jar.get(THEME_COOKIE)?.value;

  return {
    accent: VALID_ACCENTS.has(accent ?? '') ? (accent as AccentName) : DEFAULT_ACCENT,
    theme:  theme === 'light' ? 'light' : DEFAULT_THEME,
  };
}
