import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { calculateNextReview } from '@repo/domain';
import { NEW_CARD_SM2 } from '@repo/domain';
import { requireAuth } from './auth';

const NEW_CARDS_PER_SESSION = 10;

/** Returns cards due for review + new cards for a study session */
export const getStudySession = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    const user = await requireAuth(ctx);
    const now = Date.now();

    // All flashcards in section
    const allCards = await ctx.db
      .query('flashcards')
      .withIndex('by_section_order', (q) => q.eq('sectionId', sectionId))
      .collect();

    // Cards with existing progress for this user
    const progressRecords = await ctx.db
      .query('cardProgress')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    const progressByCardId = new Map(progressRecords.map((p) => [p.flashcardId, p]));

    const dueCards = [];
    const newCards = [];

    for (const card of allCards) {
      const progress = progressByCardId.get(card._id);
      if (!progress) {
        newCards.push(card);
      } else if (progress.nextReviewAt <= now) {
        dueCards.push({ card, progress });
      }
    }

    return {
      dueCards,
      newCards: newCards.slice(0, NEW_CARDS_PER_SESSION),
      totalDue: dueCards.length,
      totalNew: newCards.length,
    };
  },
});

/** Record a card review with quality rating, updates SM-2 */
export const recordReview = mutation({
  args: {
    flashcardId: v.id('flashcards'),
    quality:     v.union(v.literal(1), v.literal(3), v.literal(4), v.literal(5)),
    sessionId:   v.optional(v.id('studySessions')),
  },
  handler: async (ctx, { flashcardId, quality }) => {
    const user = await requireAuth(ctx);
    const userId = user._id;

    const existing = await ctx.db
      .query('cardProgress')
      .withIndex('by_user_card', (q) =>
        q.eq('userId', userId).eq('flashcardId', flashcardId),
      )
      .first();

    const currentParams = existing
      ? {
          interval:     existing.interval,
          repetitions:  existing.repetitions,
          easeFactor:   existing.easeFactor,
          nextReviewAt: existing.nextReviewAt,
        }
      : NEW_CARD_SM2;

    const next = calculateNextReview(quality, currentParams);
    const isSuccess = quality >= 3;

    if (existing) {
      await ctx.db.patch(existing._id, {
        interval:          next.interval,
        repetitions:       next.repetitions,
        easeFactor:        next.easeFactor,
        nextReviewAt:      next.nextReviewAt,
        lastReviewedAt:    Date.now(),
        totalReviews:      existing.totalReviews + 1,
        successfulReviews: existing.successfulReviews + (isSuccess ? 1 : 0),
      });
    } else {
      await ctx.db.insert('cardProgress', {
        userId,
        flashcardId,
        interval:          next.interval,
        repetitions:       next.repetitions,
        easeFactor:        next.easeFactor,
        nextReviewAt:      next.nextReviewAt,
        lastReviewedAt:    Date.now(),
        totalReviews:      1,
        successfulReviews: isSuccess ? 1 : 0,
      });
    }

    return next;
  },
});

/** Get all card progress for a user in a section */
export const getCardProgressForSection = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    const user = await requireAuth(ctx);
    const cards = await ctx.db
      .query('flashcards')
      .withIndex('by_section', (q) => q.eq('sectionId', sectionId))
      .collect();

    const cardIds = new Set(cards.map((c) => c._id));

    const progress = await ctx.db
      .query('cardProgress')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();

    return progress.filter((p) => cardIds.has(p.flashcardId));
  },
});
