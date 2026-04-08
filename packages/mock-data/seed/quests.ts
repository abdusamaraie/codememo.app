export type MockQuest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  total: number;
  done: boolean;
  type: 'daily' | 'weekly';
};

export const mockQuests: MockQuest[] = [
  // Daily
  { id: 'q1', type: 'daily',  title: 'First Review',      description: 'Review at least 1 flashcard',             xp: 10,  progress: 12, total: 1,   done: true  },
  { id: 'q2', type: 'daily',  title: 'Study Session',      description: 'Review 20 flashcards today',             xp: 25,  progress: 12, total: 20,  done: false },
  { id: 'q3', type: 'daily',  title: 'Perfect Recall',     description: 'Nail 5 cards in a row',                  xp: 30,  progress: 3,  total: 5,   done: false },
  { id: 'q4', type: 'daily',  title: 'Keep the Streak',    description: 'Study on 2 consecutive days',            xp: 20,  progress: 2,  total: 2,   done: true  },
  // Weekly
  { id: 'q5', type: 'weekly', title: 'Dedicated Learner',  description: 'Study 5 days this week',                 xp: 100, progress: 3,  total: 5,   done: false },
  { id: 'q6', type: 'weekly', title: 'Section Master',     description: 'Complete an entire section',             xp: 150, progress: 0,  total: 1,   done: false },
  { id: 'q7', type: 'weekly', title: 'Century Club',       description: 'Review 100 cards in a week',             xp: 200, progress: 42, total: 100, done: false },
  { id: 'q8', type: 'weekly', title: 'Accuracy King',      description: 'Achieve 80% accuracy across 30 reviews', xp: 120, progress: 30, total: 30,  done: true  },
];
