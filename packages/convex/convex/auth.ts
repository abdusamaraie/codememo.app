import { mutation } from './_generated/server';
import { v } from 'convex/values';

/** Create a new anonymous user (called on first app load) */
export const createAnonymousUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.db.insert('users', {
      authProvider:     'anonymous',
      themePreference:  'dark',
      accentPreference: 'purple',
      aiRequestsToday:  0,
      aiRequestsDate:   new Date().toISOString().slice(0, 10),
    });

    await ctx.db.insert('streaks', {
      userId,
      currentStreak:          0,
      longestStreak:          0,
      lastActiveDate:         new Date().toISOString().slice(0, 10),
      todayCompleted:         false,
      freezesAvailable:       1,
      freezesUsed:            0,
      cardsTarget:            20,
      perfectRecallsTarget:   5,
      minutesTarget:          10,
      cardsCompletedToday:    0,
      perfectRecallsToday:    0,
      minutesStudiedToday:    0,
    });

    return userId;
  },
});

/** Upgrade anonymous user to email auth */
export const upgradeToEmail = mutation({
  args: {
    userId:      v.id('users'),
    email:       v.string(),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, { userId, email, displayName }) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing) throw new Error('Email already in use');

    await ctx.db.patch(userId, {
      authProvider: 'email',
      email,
      displayName,
    });
  },
});

/** Upgrade anonymous user to GitHub auth */
export const upgradeToGitHub = mutation({
  args: {
    userId:      v.id('users'),
    githubId:    v.string(),
    email:       v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl:   v.optional(v.string()),
  },
  handler: async (ctx, { userId, githubId, email, displayName, avatarUrl }) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('by_github_id', (q) => q.eq('githubId', githubId))
      .first();

    if (existing) throw new Error('GitHub account already linked');

    await ctx.db.patch(userId, {
      authProvider: 'github',
      githubId,
      email,
      displayName,
      avatarUrl,
    });
  },
});
