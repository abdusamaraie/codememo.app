export type DailyGoal = {
  cardsTarget: number;
  perfectRecallsTarget: number;
  minutesTarget: number;
  cardsCompleted: number;
  perfectRecallsCompleted: number;
  minutesCompleted: number;
};

export type StreakData = {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  todayCompleted: boolean;
  freezesAvailable: number;
  freezesUsed: number;
};
