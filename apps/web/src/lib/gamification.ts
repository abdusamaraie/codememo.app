export type DailyMetric = 'reviews' | 'practice' | 'quiz';

export type DailyStats = {
  reviews: number;
  practice: number;
  quiz: number;
};

const DAILY_STATS_KEY = 'codememo-daily-stats';
const ACTIVITY_MAP_KEY = 'codememo-activity-map';
const FREEZE_KEY = 'codememo-streak-freezes';

function todayKey(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readDailyStats(now: Date = new Date()): DailyStats {
  if (typeof window === 'undefined') return { reviews: 0, practice: 0, quiz: 0 };
  const all = parseJson<Record<string, DailyStats>>(localStorage.getItem(DAILY_STATS_KEY), {});
  return all[todayKey(now)] ?? { reviews: 0, practice: 0, quiz: 0 };
}

export function incrementDailyMetric(metric: DailyMetric, amount = 1, now: Date = new Date()): void {
  if (typeof window === 'undefined') return;
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
  return parseJson<Record<string, number>>(localStorage.getItem(ACTIVITY_MAP_KEY), {});
}

export function readStreak(): { current: number; best: number; freezes: number } {
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
  while (true) {
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

