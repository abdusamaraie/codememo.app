'use client';

import { useSyncExternalStore } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@repo/convex';
import { getClientAppDataSource } from '@/lib/data-source';
import { MOCK_STREAK, MOCK_DAILY_STATS, readActivityMap } from '@/lib/gamification';

const ZERO_DAILY = { reviews: 0, practice: 0, quiz: 0 };
const ZERO_STREAK = { current: 0, best: 0, freezes: 0 };

const subscribeNoop = () => () => {};
const getServerMockSnapshot = () => false;
const getClientMockSnapshot = () => getClientAppDataSource() === 'mock';

export function useGamificationStats() {
  const { isSignedIn } = useAuth();
  // Keep the first client render identical to SSR to avoid hydration mismatches.
  const isMock = useSyncExternalStore(
    subscribeNoop,
    getClientMockSnapshot,
    getServerMockSnapshot,
  );

  // Skip Convex query in mock mode OR when not signed in
  const convexStreak = useQuery(
    api.streaks.getStreakData,
    isSignedIn && !isMock ? {} : 'skip',
  );

  if (isMock) {
    return {
      streak: MOCK_STREAK,
      daily: MOCK_DAILY_STATS,
      activityMap: readActivityMap(),
    };
  }

  if (isSignedIn && convexStreak) {
    return {
      streak: {
        current: convexStreak.currentStreak,
        best:    convexStreak.longestStreak,
        freezes: convexStreak.freezesAvailable,
      },
      daily: {
        reviews:  convexStreak.cardsCompletedToday,
        practice: convexStreak.perfectRecallsToday,
        quiz:     0,
      },
      activityMap: {} as Record<string, number>,
    };
  }

  return { daily: ZERO_DAILY, activityMap: {}, streak: ZERO_STREAK };
}
