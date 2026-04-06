export type QuizAnswer = {
  exerciseId: string;
  answer: unknown;
  isCorrect: boolean;
  timeTakenMs?: number;
};

export type QuizResult = {
  id: string;
  userId: string;
  sectionId: string;
  answers: QuizAnswer[];
  score: number;
  passed: boolean;
  startedAt: number;
  completedAt: number;
};
