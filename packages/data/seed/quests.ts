/** Canonical shape — matches what the Quests API will return. */
export type Quest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  total: number;
  completed: boolean;
  type: 'daily' | 'weekly';
};

/** Base definitions — no progress. Used to generate both real (zeroed) and mock (fake progress) quests. */
const QUEST_DEFINITIONS: Omit<Quest, 'progress' | 'completed'>[] = [
  // Daily
  { id: 'q1', type: 'daily',  title: 'First Review',      description: 'Review at least 1 flashcard',             xp: 10,  total: 1   },
  { id: 'q2', type: 'daily',  title: 'Study Session',      description: 'Review 20 flashcards today',             xp: 25,  total: 20  },
  { id: 'q3', type: 'daily',  title: 'Perfect Recall',     description: 'Nail 5 cards in a row',                  xp: 30,  total: 5   },
  { id: 'q4', type: 'daily',  title: 'Keep the Streak',    description: 'Study on 2 consecutive days',            xp: 20,  total: 2   },
  // Weekly
  { id: 'q5', type: 'weekly', title: 'Dedicated Learner',  description: 'Study 5 days this week',                 xp: 100, total: 5   },
  { id: 'q6', type: 'weekly', title: 'Section Master',     description: 'Complete an entire section',             xp: 150, total: 1   },
  { id: 'q7', type: 'weekly', title: 'Century Club',       description: 'Review 100 cards in a week',             xp: 200, total: 100 },
  { id: 'q8', type: 'weekly', title: 'Accuracy King',      description: 'Achieve 80% accuracy across 30 reviews', xp: 120, total: 30  },
];

/** Fake progress values overlaid on definitions for demo/mock mode. */
const MOCK_PROGRESS: Record<string, number> = {
  q1: 12, q2: 12, q3: 3, q4: 2,
  q5: 3,  q6: 0,  q7: 42, q8: 30,
};

/** Quest definitions with all progress reset to 0. Used as the baseline for real (prod) data. */
export const ZEROED_QUESTS: Quest[] = QUEST_DEFINITIONS.map((def) => ({
  ...def,
  progress: 0,
  completed: false,
}));

/** Quest definitions with fake progress for demo/mock mode. */
export const MOCK_QUESTS: Quest[] = QUEST_DEFINITIONS.map((def) => {
  const progress = MOCK_PROGRESS[def.id] ?? 0;
  return { ...def, progress, completed: progress >= def.total };
});
