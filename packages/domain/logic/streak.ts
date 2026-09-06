import type { StreakCounters, StreakUpdateInput, StreakUpdateResult } from '../types/streak';

export type StreakResult = {
  current: number;
  isActive: boolean;
};

/**
 * Calculates the current streak given the last active date string and today.
 *
 * @param lastActiveDate - ISO date string of last active day (YYYY-MM-DD) or null
 * @param today - ISO date string of today (YYYY-MM-DD)
 * @param currentStreak - the stored streak count
 */
export function calculateStreak(
  lastActiveDate: string | null,
  today: string,
  currentStreak: number,
): StreakResult {
  if (!lastActiveDate) {
    return { current: 0, isActive: false };
  }

  const last = new Date(lastActiveDate);
  const now = new Date(today);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    // Already active today
    return { current: currentStreak, isActive: true };
  }

  if (diffDays === 1) {
    // Active yesterday — streak still valid (not yet completed today)
    return { current: currentStreak, isActive: false };
  }

  // More than 1 day gap — streak broken
  return { current: 0, isActive: false };
}

/**
 * Returns the next streak count when a user completes their daily goal.
 */
export function incrementStreak(
  lastActiveDate: string | null,
  today: string,
  currentStreak: number,
): number {
  const { isActive } = calculateStreak(lastActiveDate, today, currentStreak);

  // Already counted today
  if (isActive) return currentStreak;

  const last = lastActiveDate ? new Date(lastActiveDate) : null;
  const now = new Date(today);
  const diffDays = last
    ? Math.round((now.getTime() - last.getTime()) / (24 * 60 * 60 * 1000))
    : 999;

  // Consecutive day
  if (diffDays === 1) return currentStreak + 1;

  // First ever activity or gap > 1 day
  return 1;
}

/** Returns the ISO date string (YYYY-MM-DD) of the Monday of the given date's week. */
export function getWeekStart(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  const day = d.getUTCDay(); // 0=Sun, 1=Mon, …
  const diff = day === 0 ? -6 : 1 - day; // offset to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

/**
 * Pure computation of the next streak/daily/weekly counters after one
 * review or study event. Shared by every call site that records progress
 * (Convex `streaks.updateStreak`, `flashcards.recordReview`, …) so the
 * daily-goal and weekly-quest math can never drift out of sync between them.
 *
 * Does NOT decide `todayCompleted` — callers compare the returned daily
 * counters against their own goal targets, since not every call site tracks
 * every dimension (e.g. card reviews don't track studied minutes).
 */
export function computeStreakUpdate(
  streak: StreakCounters,
  input: StreakUpdateInput,
): StreakUpdateResult {
  const { today, isPerfectRecall, additionalMinutes = 0 } = input;
  const isNewDay = streak.lastActiveDate !== today;

  const cardsCompletedToday = isNewDay ? 1 : streak.cardsCompletedToday + 1;
  const perfectRecallsToday = (isNewDay ? 0 : streak.perfectRecallsToday) + (isPerfectRecall ? 1 : 0);
  const minutesStudiedToday = (isNewDay ? 0 : streak.minutesStudiedToday) + additionalMinutes;

  const currentStreak = incrementStreak(streak.lastActiveDate, today, streak.currentStreak);
  const longestStreak = Math.max(currentStreak, streak.longestStreak);

  // ── Weekly tracking ────────────────────────────────────────────────────
  const weekStartDate = getWeekStart(today);
  const isSameWeek = (streak.weekStartDate ?? '') === weekStartDate;

  const weeklyCardsCompleted = isSameWeek ? (streak.weeklyCardsCompleted ?? 0) + 1 : 1;

  // Increment study-days-this-week only when today is a new day within the same week.
  const studyDaysThisWeek = isSameWeek
    ? (streak.studyDaysThisWeek ?? 1) + (isNewDay ? 1 : 0)
    : 1; // reset to 1 (today) for a new week

  return {
    cardsCompletedToday,
    perfectRecallsToday,
    minutesStudiedToday,
    currentStreak,
    longestStreak,
    lastActiveDate: today,
    weekStartDate,
    weeklyCardsCompleted,
    studyDaysThisWeek,
  };
}
