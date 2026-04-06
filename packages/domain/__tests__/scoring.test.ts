import { calculateQuizScore } from '../logic/scoring';
import type { QuizAnswer } from '../types/quiz';

const answer = (exerciseId: string, isCorrect: boolean): QuizAnswer => ({
  exerciseId,
  answer:    isCorrect ? 'correct' : 'wrong',
  isCorrect,
});

describe('calculateQuizScore', () => {
  describe('empty answers', () => {
    it('returns score=0, passed=false for empty array', () => {
      const result = calculateQuizScore([]);
      expect(result.score).toBe(0);
      expect(result.scorePercent).toBe(0);
      expect(result.passed).toBe(false);
      expect(result.breakdown.correct).toBe(0);
      expect(result.breakdown.total).toBe(0);
    });
  });

  describe('all correct', () => {
    it('returns score=1, passed=true for 10/10', () => {
      const answers = Array.from({ length: 10 }, (_, i) => answer(`ex-${i}`, true));
      const result  = calculateQuizScore(answers);
      expect(result.score).toBe(1);
      expect(result.scorePercent).toBe(100);
      expect(result.passed).toBe(true);
      expect(result.breakdown.correct).toBe(10);
    });
  });

  describe('80% threshold', () => {
    it('passes at exactly 80% (8/10)', () => {
      const answers = [
        ...Array.from({ length: 8 }, (_, i) => answer(`ex-${i}`, true)),
        ...Array.from({ length: 2 }, (_, i) => answer(`ex-${8 + i}`, false)),
      ];
      const result = calculateQuizScore(answers);
      expect(result.passed).toBe(true);
      expect(result.scorePercent).toBe(80);
    });

    it('fails just below 80% (7/10 = 70%)', () => {
      const answers = [
        ...Array.from({ length: 7 }, (_, i) => answer(`ex-${i}`, true)),
        ...Array.from({ length: 3 }, (_, i) => answer(`ex-${7 + i}`, false)),
      ];
      const result = calculateQuizScore(answers);
      expect(result.passed).toBe(false);
      expect(result.scorePercent).toBe(70);
    });
  });

  describe('all wrong', () => {
    it('returns score=0, passed=false for 0/5', () => {
      const answers = Array.from({ length: 5 }, (_, i) => answer(`ex-${i}`, false));
      const result  = calculateQuizScore(answers);
      expect(result.score).toBe(0);
      expect(result.passed).toBe(false);
      expect(result.breakdown.correct).toBe(0);
    });
  });

  describe('breakdown', () => {
    it('byExerciseId maps each exerciseId to its correctness', () => {
      const answers = [
        answer('ex-1', true),
        answer('ex-2', false),
        answer('ex-3', true),
      ];
      const result = calculateQuizScore(answers);
      expect(result.breakdown.byExerciseId).toEqual({
        'ex-1': true,
        'ex-2': false,
        'ex-3': true,
      });
    });

    it('total matches answer count', () => {
      const answers = Array.from({ length: 15 }, (_, i) => answer(`ex-${i}`, i % 2 === 0));
      const result  = calculateQuizScore(answers);
      expect(result.breakdown.total).toBe(15);
    });
  });

  describe('scorePercent rounding', () => {
    it('rounds to nearest integer (1/3 → 33%)', () => {
      const answers = [answer('ex-1', true), answer('ex-2', false), answer('ex-3', false)];
      const result  = calculateQuizScore(answers);
      expect(result.scorePercent).toBe(33);
    });
  });
});
