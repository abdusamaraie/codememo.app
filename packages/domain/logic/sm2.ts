import type { QualityRating, SM2Params } from '../types/progress';
import { SM2_DEFAULTS } from '../constants/sm2-defaults';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Pure SM-2 algorithm.
 *
 * Quality ratings map to:
 *   1 = Forgot      (complete blackout / wrong)
 *   3 = Hard        (correct with significant difficulty)
 *   4 = Good        (correct after hesitation)
 *   5 = Nailed      (perfect recall)
 *
 * Returns updated SM2Params with the next review timestamp.
 */
export function calculateNextReview(
  quality: QualityRating,
  params: SM2Params,
  now: number = Date.now(),
): SM2Params {
  const { interval, repetitions, easeFactor } = params;

  // Failed review — reset repetitions and interval
  if (quality < 3) {
    return {
      interval: 1,
      repetitions: 0,
      easeFactor: Math.max(SM2_DEFAULTS.MIN_EASE_FACTOR, easeFactor - 0.2),
      nextReviewAt: now + MS_PER_DAY,
    };
  }

  // Successful review — advance interval
  let nextInterval: number;
  if (repetitions === 0) {
    nextInterval = SM2_DEFAULTS.FIRST_INTERVAL;
  } else if (repetitions === 1) {
    nextInterval = SM2_DEFAULTS.SECOND_INTERVAL;
  } else {
    nextInterval = Math.round(interval * easeFactor);
  }

  // Update ease factor based on quality (SM-2 formula)
  const nextEaseFactor = Math.max(
    SM2_DEFAULTS.MIN_EASE_FACTOR,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  return {
    interval: nextInterval,
    repetitions: repetitions + 1,
    easeFactor: nextEaseFactor,
    nextReviewAt: now + nextInterval * MS_PER_DAY,
  };
}
