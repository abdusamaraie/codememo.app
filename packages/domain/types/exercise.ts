export type ExerciseType = 'fill_blank' | 'multiple_choice' | 'spot_error' | 'arrange_code' | 'translate';

export type Exercise = {
  id: string;
  payloadId: string;
  sectionId: string;
  type: ExerciseType;
  prompt: string;
  codeTemplate?: string;
  options?: unknown;
  correctAnswer: unknown;
  explanation?: string;
  order: number;
};

export type ExerciseAttempt = {
  id: string;
  userId: string;
  exerciseId: string;
  answer: unknown;
  isCorrect: boolean;
  attemptedAt: number;
  timeTakenMs?: number;
};
