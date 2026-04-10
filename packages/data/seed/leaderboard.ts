/** Canonical shape — matches what the Leaderboard API will return. */
export type LeaderboardEntry = {
  rank: number;
  displayName: string;
  xp: number;
  streak: number;
  isCurrentUser: boolean;
};

// NOTE: "you" row xp=2200 and streak=7 must stay in sync with
// MOCK_STREAK.current and the XP value in apps/web/src/lib/gamification.ts
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1,  displayName: 'alex_codes',    xp: 2840, streak: 34, isCurrentUser: false },
  { rank: 2,  displayName: 'devninja99',    xp: 2615, streak: 21, isCurrentUser: false },
  { rank: 3,  displayName: 'typescript_ts', xp: 2410, streak: 18, isCurrentUser: false },
  { rank: 4,  displayName: 'you',           xp: 2200, streak: 7,  isCurrentUser: true  },
  { rank: 5,  displayName: 'rustacean',     xp: 1985, streak: 12, isCurrentUser: false },
  { rank: 6,  displayName: 'go_gopher',     xp: 1740, streak: 9,  isCurrentUser: false },
  { rank: 7,  displayName: 'pymaster',      xp: 1520, streak: 5,  isCurrentUser: false },
  { rank: 8,  displayName: 'sql_wizard',    xp: 1310, streak: 3,  isCurrentUser: false },
  { rank: 9,  displayName: 'bashscripter',  xp: 1100, streak: 6,  isCurrentUser: false },
  { rank: 10, displayName: 'javabeans',     xp: 920,  streak: 2,  isCurrentUser: false },
];
