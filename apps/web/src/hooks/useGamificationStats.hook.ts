'use client';

import { useEffect, useState } from 'react';
import { readActivityMap, readDailyStats, readStreak, type DailyStats } from '@/lib/gamification';

export function useGamificationStats() {
  const [daily, setDaily] = useState<DailyStats>({ reviews: 0, practice: 0, quiz: 0 });
  const [activityMap, setActivityMap] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState({ current: 0, best: 0, freezes: 1 });

  useEffect(() => {
    const refresh = () => {
      setDaily(readDailyStats());
      setActivityMap(readActivityMap());
      setStreak(readStreak());
    };

    refresh();
    window.addEventListener('codememo:stats-updated', refresh);
    return () => window.removeEventListener('codememo:stats-updated', refresh);
  }, []);

  return { daily, activityMap, streak };
}

