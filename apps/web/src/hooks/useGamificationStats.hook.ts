'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@repo/convex';

const ZERO_DAILY = { reviews: 0, practice: 0, quiz: 0 };
const ZERO_STREAK = { current: 0, best: 0, freezes: 0 };

export function useGamificationStats() {
  const { isSignedIn } = useAuth();
  const convexStreak = useQuery(api.streaks.getStreakData, isSignedIn ? {} : 'skip');

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

  // Anonymous users or loading: always show zeros — never show mock seed data
  return { daily: ZERO_DAILY, activityMap: {}, streak: ZERO_STREAK };
}
