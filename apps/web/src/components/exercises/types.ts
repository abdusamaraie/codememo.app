export type PracticeExerciseType = 'fill_blank' | 'multiple_choice' | 'spot_error' | 'arrange_code';

export type PracticeExercise = {
  id: string;
  type: PracticeExerciseType;
  prompt: string;
  explanation: string;
  language?: string;
  codeTemplate?: string;
  options?: string[];
  correctAnswer: string | string[];
};

