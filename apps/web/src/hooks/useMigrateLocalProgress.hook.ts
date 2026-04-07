'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@repo/convex';
import {
  ACTIVITY_MAP_KEY,
  DAILY_STATS_KEY,
  FREEZE_KEY,
  todayKey,
  parseJson,
} from '@/lib/gamification';

/** Read streak directly from localStorage, bypassing mock-mode checks. */
function readLocalStreakRaw() {
  if (typeof window === 'undefined') return { current: 0, best: 0, freezes: 1 };

  const map = parseJson<Record<string, number>>(localStorage.getItem(ACTIVITY_MAP_KEY), {});
  const freezes = Number(localStorage.getItem(FREEZE_KEY) ?? '1') || 1;
  const dates = Object.keys(map).sort();
  if (dates.length === 0) return { current: 0, best: 0, freezes };

  let best = 0, rolling = 0;
  let prev: Date | null = null;
  for (const d of dates) {
    const cur = new Date(`${d}T00:00:00.000Z`);
    rolling = prev && Math.round((cur.getTime() - prev.getTime()) / 86_400_000) <= 1 ? rolling + 1 : 1;
    prev = cur;
    best = Math.max(best, rolling);
  }

  let current = 0;
  let cursor = new Date(`${todayKey()}T00:00:00.000Z`);
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!map[key] || map[key] <= 0) break;
    current++;
    cursor = new Date(cursor.getTime() - 86_400_000);
  }

  return { current, best, freezes };
}

function readLocalDailyReviewsRaw(): number {
  if (typeof window === 'undefined') return 0;
  const all = parseJson<Record<string, { reviews: number }>>(localStorage.getItem(DAILY_STATS_KEY), {});
  return all[todayKey()]?.reviews ?? 0;
}

export function useMigrateLocalProgress() {
  const { isSignedIn } = useAuth();
  const migrate = useMutation(api.streaks.migrateLocalProgress);
  const hasMigrated = useRef(false);

  useEffect(() => {
    if (!isSignedIn || hasMigrated.current) return;
    hasMigrated.current = true;

    const streak = readLocalStreakRaw();
    const reviews = readLocalDailyReviewsRaw();

    if (streak.current === 0 && reviews === 0) return;

    migrate({
      currentStreak:       streak.current,
      longestStreak:       streak.best,
      lastActiveDate:      todayKey(),
      cardsCompletedToday: reviews,
      freezesAvailable:    streak.freezes,
    })
      .then(() => {
        localStorage.removeItem(ACTIVITY_MAP_KEY);
        localStorage.removeItem(DAILY_STATS_KEY);
      })
      .catch(() => {
        hasMigrated.current = false;
      });
  }, [isSignedIn, migrate]);
}
