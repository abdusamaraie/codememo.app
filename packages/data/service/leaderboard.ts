import type { LeaderboardEntry } from '../seed/leaderboard';
import { MOCK_LEADERBOARD } from '../seed/leaderboard';

export type { LeaderboardEntry };

/**
 * Returns leaderboard data for the given source.
 * - 'mock': returns hardcoded seed data (used in admin demo mode)
 * - 'real': calls the real API (stub — returns empty until Convex leaderboard is implemented)
 */
export function getLeaderboard(source: 'mock' | 'real'): LeaderboardEntry[] {
  if (source === 'mock') return MOCK_LEADERBOARD;
  return [];
}
