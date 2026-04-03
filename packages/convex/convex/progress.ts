import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { requireAuth } from './auth';

export const getUserProgress = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query('sectionProgress')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();
  },
});

export const getSectionProgress = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query('sectionProgress')
      .withIndex('by_user_section', (q) =>
        q.eq('userId', user._id).eq('sectionId', sectionId),
      )
      .first();
  },
});

export const updateSectionProgress = mutation({
  args: {
    sectionId:     v.id('sections'),
    status:        v.optional(v.union(
      v.literal('locked'),
      v.literal('available'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('mastered'),
    )),
    cardsDue:      v.optional(v.number()),
    cardsNew:      v.optional(v.number()),
    cardsMastered: v.optional(v.number()),
  },
  handler: async (ctx, { sectionId, ...patch }) => {
    const user = await requireAuth(ctx);
    const userId = user._id;

    const existing = await ctx.db
      .query('sectionProgress')
      .withIndex('by_user_section', (q) =>
        q.eq('userId', userId).eq('sectionId', sectionId),
      )
      .first();

    const update = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined),
    );

    if (existing) {
      await ctx.db.patch(existing._id, { ...update, lastStudiedAt: Date.now() });
    } else {
      await ctx.db.insert('sectionProgress', {
        userId,
        sectionId,
        status:        'in_progress',
        cardsDue:      0,
        cardsNew:      0,
        cardsMastered: 0,
        lastStudiedAt: Date.now(),
        ...update,
      });
    }
  },
});
