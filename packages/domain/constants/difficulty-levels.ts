export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const satisfies DifficultyLevel[];

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  advanced:     'Advanced',
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner:     '#34D399', // green
  intermediate: '#FBBF24', // yellow
  advanced:     '#F87171', // red
};
