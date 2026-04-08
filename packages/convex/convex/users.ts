import { internalMutation, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { getAuthedUser, requireAuth } from './auth';

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    return getAuthedUser(ctx);
  },
});

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
  },
});

export const updateSettings = mutation({
  args: {
    themePreference:  v.optional(v.union(v.literal('dark'), v.literal('light'), v.literal('system'))),
    accentPreference: v.optional(v.string()),
    displayName:      v.optional(v.string()),
  },
  handler: async (ctx, patch) => {
    const user = await requireAuth(ctx);
    const update = Object.fromEntries(
      Object.entries(patch).filter(([, val]) => val !== undefined),
    );
    if (Object.keys(update).length > 0) {
      await ctx.db.patch(user._id, update);
    }
  },
});

export const createFromWebhook = internalMutation({
  args: {
    clerkId:   v.string(),
    email:     v.string(),
    name:      v.string(),
    avatarUrl: v.string(),
  },
  handler: async (ctx, { clerkId, email, name, avatarUrl }) => {
    // Idempotent: return early if user already provisioned
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (existing) return existing._id;

    const userId = await ctx.db.insert('users', {
      authProvider:     'email',
      clerkId,
      email,
      displayName:      name,
      avatarUrl:        avatarUrl || undefined,
      themePreference:  'dark',
      accentPreference: 'purple',
      aiRequestsToday:  0,
      aiRequestsDate:   new Date().toISOString().slice(0, 10),
    });

    await ctx.db.insert('streaks', {
      userId,
      currentStreak:        0,
      longestStreak:        0,
      lastActiveDate:       new Date().toISOString().slice(0, 10),
      todayCompleted:       false,
      freezesAvailable:     1,
      freezesUsed:          0,
      cardsTarget:          20,
      perfectRecallsTarget: 5,
      minutesTarget:        10,
      cardsCompletedToday:  0,
      perfectRecallsToday:  0,
      minutesStudiedToday:  0,
    });

    return userId;
  },
});

export const updateFromWebhook = internalMutation({
  args: {
    clerkId:   v.string(),
    email:     v.string(),
    name:      v.string(),
    avatarUrl: v.string(),
  },
  handler: async (ctx, { clerkId, email, name, avatarUrl }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!user) return;
    await ctx.db.patch(user._id, {
      email,
      displayName: name,
      avatarUrl: avatarUrl || undefined,
    });
  },
});

export const deleteFromWebhook = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', clerkId))
      .first();
    if (!user) return;
    // Hard-delete: remove streak record then user (GDPR right to erasure)
    const streak = await ctx.db
      .query('streaks')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();
    if (streak) await ctx.db.delete(streak._id);
    await ctx.db.delete(user._id);
  },
});
