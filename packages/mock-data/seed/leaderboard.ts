export type LeaderboardUser = {
  rank: number;
  name: string;
  xp: number;
  streak: number;
  isYou: boolean;
};

// NOTE: "you" row xp=2200 and streak=7 must stay in sync with
// MOCK_STREAK.current and the XP value in apps/web/src/lib/gamification.ts
export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1,  name: 'alex_codes',    xp: 2840, streak: 34, isYou: false },
  { rank: 2,  name: 'devninja99',    xp: 2615, streak: 21, isYou: false },
  { rank: 3,  name: 'typescript_ts', xp: 2410, streak: 18, isYou: false },
  { rank: 4,  name: 'you',           xp: 2200, streak: 7,  isYou: true  },
  { rank: 5,  name: 'rustacean',     xp: 1985, streak: 12, isYou: false },
  { rank: 6,  name: 'go_gopher',     xp: 1740, streak: 9,  isYou: false },
  { rank: 7,  name: 'pymaster',      xp: 1520, streak: 5,  isYou: false },
  { rank: 8,  name: 'sql_wizard',    xp: 1310, streak: 3,  isYou: false },
  { rank: 9,  name: 'bashscripter',  xp: 1100, streak: 6,  isYou: false },
  { rank: 10, name: 'javabeans',     xp: 920,  streak: 2,  isYou: false },
];
