'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@repo/convex';
import { getClientAppDataSource } from '@/lib/data-source';
import { MOCK_STREAK, MOCK_DAILY_STATS, readActivityMap, readDailyStats, readStreak } from '@/lib/gamification';

const ZERO_DAILY = { reviews: 0, practice: 0, quiz: 0 };
const ZERO_STREAK = { current: 0, best: 0, freezes: 1 };

type LocalSnapshot = { daily: ReturnType<typeof readDailyStats>; streak: ReturnType<typeof readStreak>; activityMap: Record<string, number> };

function readLocalSnapshot(): LocalSnapshot {
  return { daily: readDailyStats(), streak: readStreak(), activityMap: readActivityMap() };
}

function subscribeToStats(callback: () => void) {
  function handler() { callback(); }
  window.addEventListener('codememo:stats-updated', handler);
  return () => window.removeEventListener('codememo:stats-updated', handler);
}

const SERVER_LOCAL_SNAPSHOT: LocalSnapshot = { daily: ZERO_DAILY, streak: ZERO_STREAK, activityMap: {} };

export function useGamificationStats() {
  const { isSignedIn } = useAuth();
  const [isMock, setIsMock] = useState(false);

  const [localStats, setLocalStats] = useState<LocalSnapshot>(SERVER_LOCAL_SNAPSHOT);

  useEffect(() => {
    function updateLocalStats() {
      setIsMock(getClientAppDataSource() === 'mock');
      setLocalStats(readLocalSnapshot());
    }

    // Populate from browser state as soon as we're on the client.
    updateLocalStats();

    return subscribeToStats(updateLocalStats);
  }, []);

  // Skip Convex query in mock mode OR when not signed in
  const convexStreak = useQuery(
    api.streaks.getStreakData,
    isSignedIn && !isMock ? {} : 'skip',
  );

  if (isMock) {
    return {
      streak: MOCK_STREAK,
      daily: MOCK_DAILY_STATS,
      activityMap: localStats.activityMap,
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

  return localStats;
}
