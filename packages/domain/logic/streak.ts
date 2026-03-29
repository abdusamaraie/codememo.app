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
