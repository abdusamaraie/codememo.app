import { internalMutation, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { calculateStreak, computeStreakUpdate, getWeekStart } from '@repo/domain';
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

    const patch = computeStreakUpdate(streak, {
      today,
      isPerfectRecall,
      additionalMinutes: Math.round((durationMs ?? 0) / 60000),
    });

    const goalMet =
      patch.cardsCompletedToday >= streak.cardsTarget &&
      patch.perfectRecallsToday >= streak.perfectRecallsTarget &&
      patch.minutesStudiedToday >= streak.minutesTarget;

    await ctx.db.patch(streak._id, { ...patch, todayCompleted: goalMet });
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

/** Resets streak data to zero for a given Clerk user — used by admin after switching back to real mode */
export const resetProgressForUser = internalMutation({
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

    const zeroPatch = {
      currentStreak:        0,
      longestStreak:        0,
      lastActiveDate:       new Date().toISOString().slice(0, 10),
      todayCompleted:       false,
      freezesAvailable:     1,
      freezesUsed:          0,
      cardsCompletedToday:  0,
      perfectRecallsToday:  0,
      minutesStudiedToday:  0,
      weeklyCardsCompleted: 0,
      studyDaysThisWeek:    0,
      weekStartDate:        getWeekStart(new Date().toISOString().slice(0, 10)),
    };

    if (streak) {
      await ctx.db.patch(streak._id, zeroPatch);
    } else {
      await ctx.db.insert('streaks', {
        userId:               user._id,
        cardsTarget:          20,
        perfectRecallsTarget: 5,
        minutesTarget:        10,
        ...zeroPatch,
      });
    }
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
