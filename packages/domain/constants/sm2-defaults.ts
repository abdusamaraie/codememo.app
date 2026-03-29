import type { SM2Params } from '../types/progress';

export const SM2_DEFAULTS = {
  /** Starting ease factor for a new card */
  INITIAL_EASE_FACTOR: 2.5,
  /** Minimum ease factor — cards cannot get easier to forget than this */
  MIN_EASE_FACTOR: 1.3,
  /** Initial interval (days) for the first successful review */
  FIRST_INTERVAL: 1,
  /** Interval after second successful review */
  SECOND_INTERVAL: 6,
} as const;

/** SM-2 params for a brand-new card that has never been reviewed */
export const NEW_CARD_SM2: SM2Params = {
  interval: 0,
  repetitions: 0,
  easeFactor: SM2_DEFAULTS.INITIAL_EASE_FACTOR,
  nextReviewAt: 0,
};
