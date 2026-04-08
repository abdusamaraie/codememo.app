import { internalMutation, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { incrementStreak, calculateStreak } from '@repo/domain';
import { getAuthedUser, requireAuth } from './auth';

export const getStreakData = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthedUser(ctx);
    if (!user) return null;
    return ctx.db
      .query('streaks')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();
  },
});

/** Called after each card review — updates streak + daily goal counters */
export const updateStreak = mutation({
  args: {
    isPerfectRecall: v.boolean(),
    durationMs:      v.optional(v.number()),
  },
  handler: async (ctx, { isPerfectRecall, durationMs }) => {
    const user = await requireAuth(ctx);
    const userId = user._id;

    const streak = await ctx.db
      .query('streaks')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    if (!streak) return;

    const today = new Date().toISOString().slice(0, 10);

    const newCards     = streak.cardsCompletedToday + 1;
    const newPerfect   = streak.perfectRecallsToday + (isPerfectRecall ? 1 : 0);
    const newMinutes   = streak.minutesStudiedToday + Math.round((durationMs ?? 0) / 60000);

    const goalMet =
      newCards   >= streak.cardsTarget &&
      newPerfect >= streak.perfectRecallsTarget &&
      newMinutes >= streak.minutesTarget;

    const newStreak = incrementStreak(streak.lastActiveDate, today, streak.currentStreak);
    const longest   = Math.max(newStreak, streak.longestStreak);

    await ctx.db.patch(streak._id, {
      cardsCompletedToday:   newCards,
      perfectRecallsToday:   newPerfect,
      minutesStudiedToday:   newMinutes,
      todayCompleted:        goalMet,
      currentStreak:         newStreak,
      longestStreak:         longest,
      lastActiveDate:        today,
    });
  },
});

/** Check if a streak is still active (called on app open) */
export const checkDailyGoal = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthedUser(ctx);
    if (!user) return null;
    const streak = await ctx.db
      .query('streaks')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    if (!streak) return null;

    const today = new Date().toISOString().slice(0, 10);
    const { isActive } = calculateStreak(streak.lastActiveDate, today, streak.currentStreak);

    return {
      currentStreak:         isActive ? streak.currentStreak : 0,
      todayCompleted:        streak.todayCompleted,
      cardsCompleted:        streak.cardsCompletedToday,
      cardsTarget:           streak.cardsTarget,
      perfectRecallsCompleted: streak.perfectRecallsToday,
      perfectRecallsTarget:  streak.perfectRecallsTarget,
      minutesStudied:        streak.minutesStudiedToday,
      minutesTarget:         streak.minutesTarget,
      freezesAvailable:      streak.freezesAvailable,
    };
  },
});

/** Migrate anonymous localStorage activity to Convex on first sign-in */
export const migrateLocalProgress = mutation({
  args: {
    currentStreak:       v.number(),
    longestStreak:       v.number(),
    lastActiveDate:      v.string(),
    cardsCompletedToday: v.number(),
    freezesAvailable:    v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    const streak = await ctx.db
      .query('streaks')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();
    if (!streak) return;
    // Skip if Convex already has real activity — don't overwrite
    if (streak.currentStreak > 0 || streak.cardsCompletedToday > 0) return;
    await ctx.db.patch(streak._id, {
      currentStreak:       args.currentStreak,
      longestStreak:       args.longestStreak,
      lastActiveDate:      args.lastActiveDate,
      cardsCompletedToday: args.cardsCompletedToday,
      freezesAvailable:    args.freezesAvailable,
      todayCompleted:      args.cardsCompletedToday >= streak.cardsTarget,
    });
  },
});

/** Use a streak freeze when user misses a day */
export const useStreakFreeze = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);

    const streak = await ctx.db
      .query('streaks')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    if (!streak || streak.freezesAvailable <= 0) {
      throw new Error('No streak freezes available');
    }

    await ctx.db.patch(streak._id, {
      freezesAvailable: streak.freezesAvailable - 1,
      freezesUsed:      streak.freezesUsed + 1,
      lastActiveDate:   new Date().toISOString().slice(0, 10),
    });
  },
});

/** Seeds mock streak data for a given Clerk user — local dev / admin use only */
export const seedMockDataForUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!user) throw new Error(`No user found for clerkId: ${clerkId}`);

    const streak = await ctx.db
      .query('streaks')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    const today = new Date().toISOString().slice(0, 10);
    const mockPatch = {
      currentStreak:        7,
      longestStreak:        14,
      lastActiveDate:       today,
      todayCompleted:       true,
      freezesAvailable:     2,
      freezesUsed:          1,
      cardsCompletedToday:  18,
      perfectRecallsToday:  2,
      minutesStudiedToday:  12,
    };

    if (streak) {
      await ctx.db.patch(streak._id, mockPatch);
    } else {
      await ctx.db.insert('streaks', {
        userId:               user._id,
        cardsTarget:          20,
        perfectRecallsTarget: 5,
        minutesTarget:        10,
        ...mockPatch,
      });
    }
  },
});
