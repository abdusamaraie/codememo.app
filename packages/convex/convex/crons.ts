import { cronJobs } from 'convex/server';
import { internalMutation } from './_generated/server';
import { internal } from './_generated/api';

const crons = cronJobs();

/** Every day at midnight UTC — reset daily counters and check streaks */
crons.daily(
  'reset-daily-counters',
  { hourUTC: 0, minuteUTC: 0 },
  internal.crons.resetDailyCounters,
);

/** Every week on Sunday — grant streak freeze */
crons.weekly(
  'grant-weekly-freeze',
  { dayOfWeek: 'sunday', hourUTC: 0, minuteUTC: 0 },
  internal.crons.grantWeeklyFreeze,
);

export default crons;

const CRON_BATCH_SIZE = 500;

export const resetDailyCounters = internalMutation({
  args: {},
  handler: async (ctx) => {
    const today      = new Date().toISOString().slice(0, 10);
    const allStreaks  = await ctx.db.query('streaks').take(CRON_BATCH_SIZE);

    for (const streak of allStreaks) {
      const last     = new Date(streak.lastActiveDate);
      const now      = new Date(today);
      const diffDays = Math.round((now.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
      const frozeUsed = diffDays > 1 && streak.freezesAvailable > 0;
      const broken   = diffDays > 1 && streak.freezesAvailable === 0;

      await ctx.db.patch(streak._id, {
        cardsCompletedToday:  0,
        perfectRecallsToday:  0,
        minutesStudiedToday:  0,
        todayCompleted:       false,
        currentStreak:        broken ? 0 : streak.currentStreak,
        freezesAvailable:     frozeUsed ? streak.freezesAvailable - 1 : streak.freezesAvailable,
        freezesUsed:          frozeUsed ? streak.freezesUsed + 1 : streak.freezesUsed,
      });
    }
  },
});

export const grantWeeklyFreeze = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allStreaks = await ctx.db.query('streaks').take(CRON_BATCH_SIZE);
    for (const streak of allStreaks) {
      if (streak.freezesAvailable < 2) {
        await ctx.db.patch(streak._id, {
          freezesAvailable: streak.freezesAvailable + 1,
        });
      }
    }
  },
});
