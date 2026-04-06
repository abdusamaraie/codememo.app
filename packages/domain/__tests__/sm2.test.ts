import { calculateNextReview } from '../logic/sm2';
import { SM2_DEFAULTS, NEW_CARD_SM2 } from '../constants/sm2-defaults';
import type { SM2Params } from '../types/progress';

const NOW = 1_700_000_000_000; // fixed timestamp for deterministic tests
const DAY = 24 * 60 * 60 * 1000;

describe('calculateNextReview', () => {
  // ── First review ────────────────────────────────────────────────────────────

  describe('first review (repetitions=0)', () => {
    it('Nailed (5) → interval=1, repetitions=1, ease increases', () => {
      const result = calculateNextReview(5, NEW_CARD_SM2, NOW);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
      expect(result.easeFactor).toBeGreaterThan(SM2_DEFAULTS.INITIAL_EASE_FACTOR);
      expect(result.nextReviewAt).toBe(NOW + DAY);
    });

    it('Good (4) → interval=1, repetitions=1, ease unchanged (slight decrease)', () => {
      const result = calculateNextReview(4, NEW_CARD_SM2, NOW);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
      expect(result.nextReviewAt).toBe(NOW + DAY);
    });

    it('Hard (3) → interval=1, repetitions=1, ease decreases', () => {
      const result = calculateNextReview(3, NEW_CARD_SM2, NOW);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(1);
      expect(result.easeFactor).toBeLessThan(SM2_DEFAULTS.INITIAL_EASE_FACTOR);
    });

    it('Forgot (1) → interval=1, repetitions=0 (reset), ease decreases', () => {
      const result = calculateNextReview(1, NEW_CARD_SM2, NOW);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0);
      expect(result.easeFactor).toBeLessThan(SM2_DEFAULTS.INITIAL_EASE_FACTOR);
      expect(result.nextReviewAt).toBe(NOW + DAY);
    });
  });

  // ── Second review (repetitions=1) ──────────────────────────────────────────

  describe('second review (repetitions=1)', () => {
    const afterFirst: SM2Params = {
      interval:     1,
      repetitions:  1,
      easeFactor:   2.5,
      nextReviewAt: NOW,
    };

    it('Nailed (5) → interval=6 (second interval)', () => {
      const result = calculateNextReview(5, afterFirst, NOW);
      expect(result.interval).toBe(SM2_DEFAULTS.SECOND_INTERVAL);
      expect(result.repetitions).toBe(2);
    });

    it('Forgot (1) → resets to interval=1, repetitions=0', () => {
      const result = calculateNextReview(1, afterFirst, NOW);
      expect(result.interval).toBe(1);
      expect(result.repetitions).toBe(0);
    });
  });

  // ── Third+ review (repetitions≥2) ──────────────────────────────────────────

  describe('third+ review (repetitions≥2)', () => {
    const afterSecond: SM2Params = {
      interval:     6,
      repetitions:  2,
      easeFactor:   2.5,
      nextReviewAt: NOW,
    };

    it('interval grows by easeFactor: round(6 * 2.5) = 15', () => {
      const result = calculateNextReview(5, afterSecond, NOW);
      expect(result.interval).toBe(15);
      expect(result.repetitions).toBe(3);
    });

    it('nextReviewAt is interval days from now', () => {
      const result = calculateNextReview(4, afterSecond, NOW);
      expect(result.nextReviewAt).toBe(NOW + result.interval * DAY);
    });
  });

  // ── Ease factor floor ───────────────────────────────────────────────────────

  describe('ease factor floor (min 1.3)', () => {
    it('ease factor never drops below MIN_EASE_FACTOR after many failures', () => {
      let params = NEW_CARD_SM2;
      for (let i = 0; i < 20; i++) {
        params = calculateNextReview(1, params, NOW);
      }
      expect(params.easeFactor).toBeGreaterThanOrEqual(SM2_DEFAULTS.MIN_EASE_FACTOR);
    });

    it('ease factor keeps growing after consistent Nailed reviews (no SM-2 upper cap)', () => {
      let params = NEW_CARD_SM2;
      for (let i = 0; i < 20; i++) {
        params = calculateNextReview(5, params, NOW + i * DAY * params.interval);
      }
      expect(params.easeFactor).toBeGreaterThan(SM2_DEFAULTS.INITIAL_EASE_FACTOR);
    });
  });

  // ── SM-2 formula correctness ────────────────────────────────────────────────

  describe('ease factor formula', () => {
    it('Nailed (5) increases easeFactor by +0.1', () => {
      const initial = 2.5;
      const result  = calculateNextReview(5, { ...NEW_CARD_SM2, easeFactor: initial, repetitions: 2, interval: 6 }, NOW);
      const expected = initial + (0.1 - (5 - 5) * (0.08 + (5 - 5) * 0.02));
      expect(result.easeFactor).toBeCloseTo(expected, 5);
    });

    it('Good (4) leaves easeFactor nearly unchanged (−0.02)', () => {
      const initial = 2.5;
      const result  = calculateNextReview(4, { ...NEW_CARD_SM2, easeFactor: initial, repetitions: 2, interval: 6 }, NOW);
      const expected = Math.max(1.3, initial + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02)));
      expect(result.easeFactor).toBeCloseTo(expected, 5);
    });

    it('Hard (3) decreases easeFactor by ~0.14', () => {
      const initial = 2.5;
      const result  = calculateNextReview(3, { ...NEW_CARD_SM2, easeFactor: initial, repetitions: 2, interval: 6 }, NOW);
      const expected = Math.max(1.3, initial + (0.1 - (5 - 3) * (0.08 + (5 - 3) * 0.02)));
      expect(result.easeFactor).toBeCloseTo(expected, 5);
    });
  });
});
