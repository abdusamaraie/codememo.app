/**
 * Typed environment variable accessor.
 * Each app provides its own .env, this package provides the typed accessor.
 */
export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}
