import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getUser = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    return ctx.db.get(userId);
  },
});

export const updateSettings = mutation({
  args: {
    userId:           v.id('users'),
    themePreference:  v.optional(v.union(v.literal('dark'), v.literal('light'), v.literal('system'))),
    accentPreference: v.optional(v.string()),
    displayName:      v.optional(v.string()),
  },
  handler: async (ctx, { userId, ...patch }) => {
    const update = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined),
    );
    if (Object.keys(update).length > 0) {
      await ctx.db.patch(userId, update);
    }
  },
});
