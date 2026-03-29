import { calculateStreak, incrementStreak } from '../logic/streak';

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
