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

/** Subset of a stored streak document needed to compute the next update. */
export type StreakCounters = {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date string YYYY-MM-DD
  cardsCompletedToday: number;
  perfectRecallsToday: number;
  minutesStudiedToday: number;
  // Weekly tracking — optional so older/partial documents default cleanly.
  weekStartDate?: string; // YYYY-MM-DD of the week's Monday
  weeklyCardsCompleted?: number;
  studyDaysThisWeek?: number;
};

export type StreakUpdateInput = {
  today: string; // ISO date string YYYY-MM-DD
  isPerfectRecall: boolean;
  additionalMinutes?: number;
};

/** Result of applying one review/study event to a stored streak document. */
export type StreakUpdateResult = {
  cardsCompletedToday: number;
  perfectRecallsToday: number;
  minutesStudiedToday: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  weekStartDate: string;
  weeklyCardsCompleted: number;
  studyDaysThisWeek: number;
};
