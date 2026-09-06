import { calculateStreak, incrementStreak, getWeekStart, computeStreakUpdate } from '../logic/streak';
import type { StreakCounters } from '../types/streak';

describe('calculateStreak', () => {
  describe('no prior activity', () => {
    it('returns { current: 0, isActive: false } when lastActiveDate is null', () => {
      const result = calculateStreak(null, '2024-01-10', 5);
      expect(result).toEqual({ current: 0, isActive: false });
    });
  });

  describe('active today', () => {
    it('returns isActive=true when last active date is today', () => {
      const result = calculateStreak('2024-01-10', '2024-01-10', 7);
      expect(result).toEqual({ current: 7, isActive: true });
    });
  });

  describe('active yesterday', () => {
    it('returns isActive=false but keeps streak alive', () => {
      const result = calculateStreak('2024-01-09', '2024-01-10', 7);
      expect(result).toEqual({ current: 7, isActive: false });
    });
  });

  describe('streak broken', () => {
    it('returns { current: 0, isActive: false } when gap > 1 day', () => {
      const result = calculateStreak('2024-01-07', '2024-01-10', 7);
      expect(result).toEqual({ current: 0, isActive: false });
    });

    it('2 day gap breaks streak', () => {
      const result = calculateStreak('2024-01-08', '2024-01-10', 5);
      expect(result).toEqual({ current: 0, isActive: false });
    });
  });
});

describe('incrementStreak', () => {
  describe('first ever activity', () => {
    it('returns 1 when no prior activity', () => {
      expect(incrementStreak(null, '2024-01-10', 0)).toBe(1);
    });
  });

  describe('consecutive day', () => {
    it('increments streak by 1 when studying the day after', () => {
      expect(incrementStreak('2024-01-09', '2024-01-10', 5)).toBe(6);
    });
  });

  describe('already active today', () => {
    it('does not double-count — keeps streak unchanged', () => {
      expect(incrementStreak('2024-01-10', '2024-01-10', 5)).toBe(5);
    });
  });

  describe('gap > 1 day', () => {
    it('resets to 1 after missing 2+ days', () => {
      expect(incrementStreak('2024-01-07', '2024-01-10', 10)).toBe(1);
    });
  });

  describe('first study after no prior activity', () => {
    it('starts streak at 1', () => {
      expect(incrementStreak(null, '2024-01-10', 0)).toBe(1);
    });
  });
});

describe('getWeekStart', () => {
  it('returns the same date when given a Monday', () => {
    expect(getWeekStart('2024-01-08')).toBe('2024-01-08'); // a Monday
  });

  it('returns the prior Monday for a mid-week date', () => {
    expect(getWeekStart('2024-01-10')).toBe('2024-01-08'); // Wednesday
  });

  it('returns the prior Monday for a Sunday (end of week)', () => {
    expect(getWeekStart('2024-01-14')).toBe('2024-01-08'); // Sunday
  });

  it('handles a month boundary', () => {
    expect(getWeekStart('2024-02-01')).toBe('2024-01-29'); // Thursday
  });
});

describe('computeStreakUpdate', () => {
  const baseStreak: StreakCounters = {
    currentStreak: 3,
    longestStreak: 5,
    lastActiveDate: '2024-01-10',
    cardsCompletedToday: 4,
    perfectRecallsToday: 1,
    minutesStudiedToday: 6,
    weekStartDate: '2024-01-08',
    weeklyCardsCompleted: 10,
    studyDaysThisWeek: 2,
  };

  it('increments daily counters on a same-day review', () => {
    const result = computeStreakUpdate(baseStreak, { today: '2024-01-10', isPerfectRecall: false });
    expect(result.cardsCompletedToday).toBe(5);
    expect(result.perfectRecallsToday).toBe(1);
    expect(result.minutesStudiedToday).toBe(6);
  });

  it('adds a perfect recall when flagged', () => {
    const result = computeStreakUpdate(baseStreak, { today: '2024-01-10', isPerfectRecall: true });
    expect(result.perfectRecallsToday).toBe(2);
  });

  it('adds studied minutes when provided', () => {
    const result = computeStreakUpdate(baseStreak, {
      today: '2024-01-10',
      isPerfectRecall: false,
      additionalMinutes: 4,
    });
    expect(result.minutesStudiedToday).toBe(10);
  });

  it('resets daily counters to a fresh day on a new day', () => {
    const result = computeStreakUpdate(baseStreak, { today: '2024-01-11', isPerfectRecall: true });
    expect(result.cardsCompletedToday).toBe(1);
    expect(result.perfectRecallsToday).toBe(1);
    expect(result.minutesStudiedToday).toBe(0);
    expect(result.currentStreak).toBe(4); // consecutive day
  });

  it('advances weekly counters within the same week', () => {
    const result = computeStreakUpdate(baseStreak, { today: '2024-01-10', isPerfectRecall: false });
    expect(result.weekStartDate).toBe('2024-01-08');
    expect(result.weeklyCardsCompleted).toBe(11);
    expect(result.studyDaysThisWeek).toBe(2); // same day already counted
  });

  it('counts a new day within the same week toward studyDaysThisWeek', () => {
    const result = computeStreakUpdate(baseStreak, { today: '2024-01-11', isPerfectRecall: false });
    expect(result.weekStartDate).toBe('2024-01-08'); // still the same week
    expect(result.weeklyCardsCompleted).toBe(11);
    expect(result.studyDaysThisWeek).toBe(3);
  });

  it('resets weekly counters to 1 when crossing into a new week', () => {
    const result = computeStreakUpdate(baseStreak, { today: '2024-01-15', isPerfectRecall: false });
    expect(result.weekStartDate).toBe('2024-01-15'); // new Monday
    expect(result.weeklyCardsCompleted).toBe(1);
    expect(result.studyDaysThisWeek).toBe(1);
  });

  it('treats a missing weekStartDate (older documents) as a new week', () => {
    const legacyStreak: StreakCounters = {
      currentStreak: baseStreak.currentStreak,
      longestStreak: baseStreak.longestStreak,
      lastActiveDate: baseStreak.lastActiveDate,
      cardsCompletedToday: baseStreak.cardsCompletedToday,
      perfectRecallsToday: baseStreak.perfectRecallsToday,
      minutesStudiedToday: baseStreak.minutesStudiedToday,
    };
    const result = computeStreakUpdate(legacyStreak, { today: '2024-01-10', isPerfectRecall: false });
    expect(result.weeklyCardsCompleted).toBe(1);
    expect(result.studyDaysThisWeek).toBe(1);
  });
});
