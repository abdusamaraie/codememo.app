import type { QuizAnswer } from '../types/quiz';

const PASS_THRESHOLD = 0.8;

export type ScoreBreakdown = {
  correct: number;
  total: number;
  byExerciseId: Record<string, boolean>;
};

export type QuizScoreResult = {
  score: number;        // 0–1 (e.g. 0.85)
  scorePercent: number; // 0–100
  passed: boolean;
  breakdown: ScoreBreakdown;
};

/**
 * Calculates the quiz score from an array of answers.
 */
export function calculateQuizScore(answers: QuizAnswer[]): QuizScoreResult {
  if (answers.length === 0) {
    return {
      score: 0,
      scorePercent: 0,
      passed: false,
      breakdown: { correct: 0, total: 0, byExerciseId: {} },
    };
  }

  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const score = correct / total;

  const byExerciseId: Record<string, boolean> = {};
  for (const answer of answers) {
    byExerciseId[answer.exerciseId] = answer.isCorrect;
  }

  return {
    score,
    scorePercent: Math.round(score * 100),
    passed: score >= PASS_THRESHOLD,
    breakdown: { correct, total, byExerciseId },
  };
}
