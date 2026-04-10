import type { Quest } from '../seed/quests';
import { MOCK_QUESTS, ZEROED_QUESTS } from '../seed/quests';

export type { Quest };

/**
 * Returns quest data for the given source.
 * - 'mock': quest definitions with fake demo progress (for admin preview mode)
 * - 'real': quest definitions with progress reset to 0 (baseline before Convex enriches them)
 *
 * Note: in the web app, real-mode quests are enriched with live per-user progress
 * from Convex via `api.quests.getUserQuests`. This function provides the zero-state
 * template — e.g. for SSR skeleton or unauthenticated fallback.
 */
export function getQuests(source: 'mock' | 'real'): Quest[] {
  if (source === 'mock') return MOCK_QUESTS;
  return ZEROED_QUESTS;
}
