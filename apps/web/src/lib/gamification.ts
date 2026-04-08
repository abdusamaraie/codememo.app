import { getClientAppDataSource } from '@/lib/data-source';
export type DailyMetric = 'reviews' | 'practice' | 'quiz';

export type DailyStats = {
  reviews: number;
  practice: number;
  quiz: number;
};

export const DAILY_STATS_KEY = 'codememo-daily-stats';
export const ACTIVITY_MAP_KEY = 'codememo-activity-map';
export const FREEZE_KEY = 'codememo-streak-freezes';
export const MOCK_STREAK = { current: 7, best: 14, freezes: 2 };
export const MOCK_DAILY_STATS: DailyStats = { reviews: 18, practice: 2, quiz: 1 };

function buildMockActivityMap(days = 112): Record<string, number> {
  const map: Record<string, number> = {};
  const today = new Date();
  const intensities = [3, 4, 2, 5, 3, 4, 2];
  const longestRunIntensities = [2, 3, 4, 2, 1, 3, 4, 2, 3, 1, 2, 4, 3, 2];
  const scatteredDays = new Set([9, 11, 14, 18, 38, 42, 47, 51, 55, 60, 68, 75]);
  const scatteredIntensities = [1, 2, 3, 2, 1, 2, 1, 3, 2, 1, 2, 1];
  let scatterIdx = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (i < 7) {
      map[key] = intensities[i]; // last 7 days = current streak
    } else if (i >= 21 && i < 35) {
      map[key] = longestRunIntensities[i - 21]; // 14-day run ~3 weeks ago = longestStreak
    } else if (scatteredDays.has(i)) {
      map[key] = scatteredIntensities[scatterIdx++ % scatteredIntensities.length];
    }
  }
  return map;
}
export const MOCK_ACTIVITY_MAP = buildMockActivityMap();

export function todayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readDailyStats(now: Date = new Date()): DailyStats {
  if (typeof window === 'undefined') return { reviews: 0, practice: 0, quiz: 0 };
  if (getClientAppDataSource() === 'mock') return MOCK_DAILY_STATS;
  const all = parseJson<Record<string, DailyStats>>(localStorage.getItem(DAILY_STATS_KEY), {});
  return all[todayKey(now)] ?? { reviews: 0, practice: 0, quiz: 0 };
}

export function incrementDailyMetric(metric: DailyMetric, amount = 1, now: Date = new Date()): void {
  if (typeof window === 'undefined') return;
  if (getClientAppDataSource() === 'mock') {
    window.dispatchEvent(new Event('codememo:stats-updated'));
    return;
  }
  const key = todayKey(now);

  const allStats = parseJson<Record<string, DailyStats>>(localStorage.getItem(DAILY_STATS_KEY), {});
  const next = allStats[key] ?? { reviews: 0, practice: 0, quiz: 0 };
  next[metric] += amount;
  allStats[key] = next;
  localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(allStats));

  const activity = parseJson<Record<string, number>>(localStorage.getItem(ACTIVITY_MAP_KEY), {});
  activity[key] = (activity[key] ?? 0) + amount;
  localStorage.setItem(ACTIVITY_MAP_KEY, JSON.stringify(activity));

  window.dispatchEvent(new Event('codememo:stats-updated'));
}

export function readActivityMap(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  if (getClientAppDataSource() === 'mock') return MOCK_ACTIVITY_MAP;
  return parseJson<Record<string, number>>(localStorage.getItem(ACTIVITY_MAP_KEY), {});
}

export function calculateDailyXP(daily: DailyStats): number {
  return daily.reviews * 10 + daily.practice * 20 + daily.quiz * 50;
}

export function readStreak(): { current: number; best: number; freezes: number } {
  if (typeof window !== 'undefined' && getClientAppDataSource() === 'mock') {
    return MOCK_STREAK;
  }
  const map = readActivityMap();
  const freezes =
    typeof window === 'undefined'
      ? 1
      : Number(localStorage.getItem(FREEZE_KEY) ?? '1') || 1;

  const dates = Object.keys(map).sort();
  if (dates.length === 0) return { current: 0, best: 0, freezes };

  let best = 0;
  let current = 0;
  let rolling = 0;
  let prev: Date | null = null;

  for (const d of dates) {
    const cur = new Date(`${d}T00:00:00.000Z`);
    if (!prev) {
      rolling = 1;
    } else {
      const diff = Math.round((cur.getTime() - prev.getTime()) / 86_400_000);
      rolling = diff <= 1 ? rolling + 1 : 1;
    }
    prev = cur;
    best = Math.max(best, rolling);
  }

  const today = new Date(`${todayKey()}T00:00:00.000Z`);
  let cursor = today;
  while (current < 366) {
    const key = todayKey(cursor);
    if (map[key] && map[key] > 0) {
      current += 1;
      cursor = new Date(cursor.getTime() - 86_400_000);
    } else {
      break;
    }
  }

  return { current, best, freezes };
}
