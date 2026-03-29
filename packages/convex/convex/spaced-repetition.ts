import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { calculateNextReview } from '@repo/domain';

/**
 * Directly apply SM-2 to a card. Use recordReview in flashcards.ts instead
 * unless you need to batch-update multiple cards (e.g., import migration).
 */
export const applySpacedRepetition = mutation({
  args: {
    userId:      v.id('users'),
    flashcardId: v.id('flashcards'),
    quality:     v.union(v.literal(1), v.literal(3), v.literal(4), v.literal(5)),
  },
  handler: async (ctx, { userId, flashcardId, quality }) => {
    const existing = await ctx.db
      .query('cardProgress')
      .withIndex('by_user_card', (q) =>
        q.eq('userId', userId).eq('flashcardId', flashcardId),
      )
      .first();

    if (!existing) return null;

    const next = calculateNextReview(quality, {
      interval:     existing.interval,
      repetitions:  existing.repetitions,
      easeFactor:   existing.easeFactor,
      nextReviewAt: existing.nextReviewAt,
    });

    await ctx.db.patch(existing._id, {
      interval:     next.interval,
      repetitions:  next.repetitions,
      easeFactor:   next.easeFactor,
      nextReviewAt: next.nextReviewAt,
    });

    return next;
  },
});
