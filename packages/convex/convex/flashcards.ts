import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { calculateNextReview, computeSectionMastery, computeStreakUpdate, NEW_CARD_SM2 } from '@repo/domain';
import { getAuthedUser, requireAuth } from './auth';

const NEW_CARDS_PER_SESSION = 10;

/** Returns cards due for review + new cards for a study session */
export const getStudySession = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    const user = await getAuthedUser(ctx);
    if (!user) return null;
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

/**
 * Record a card review: updates SM-2 cardProgress, sectionProgress, and streak.
 * Accepts Payload CMS IDs so the web client doesn't need Convex internal IDs.
 */
export const recordReview = mutation({
  args: {
    flashcardPayloadId: v.string(),
    sectionPayloadId:   v.string(),
    quality:            v.union(v.literal(1), v.literal(3), v.literal(4), v.literal(5)),
  },
  handler: async (ctx, { flashcardPayloadId, sectionPayloadId, quality }) => {
    const user = await requireAuth(ctx);
    const userId = user._id;

    // ── 1. Resolve Payload IDs → Convex IDs ──────────────────────────────────
    const flashcard = await ctx.db
      .query('flashcards')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', flashcardPayloadId))
      .first();
    if (!flashcard) return null;

    const section = await ctx.db
      .query('sections')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', sectionPayloadId))
      .first();

    const flashcardId = flashcard._id;

    // ── 2. SM-2: update cardProgress ─────────────────────────────────────────
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

    // ── 3. Update sectionProgress ─────────────────────────────────────────────
    if (section) {
      const sectionId = section._id;
      const sectionCards = await ctx.db
        .query('flashcards')
        .withIndex('by_section', (q) => q.eq('sectionId', sectionId))
        .collect();

      // Bounded by section size (typically tens of cards) rather than the
      // user's entire review history — one point lookup per card via the
      // by_user_card index, in parallel. Reflects the write from step 2
      // above, since mutations see their own prior writes.
      const cardProgressRows = await Promise.all(
        sectionCards.map((card) =>
          ctx.db
            .query('cardProgress')
            .withIndex('by_user_card', (q) => q.eq('userId', userId).eq('flashcardId', card._id))
            .first(),
        ),
      );

      const cardStates = cardProgressRows.map((progress) => ({
        reviewed: progress !== null && progress.totalReviews > 0,
        mastered: progress !== null && progress.repetitions >= 3,
      }));

      const { masteredCards, status: computedStatus } = computeSectionMastery(
        cardStates,
        sectionCards.length,
      );

      const existingSP = await ctx.db
        .query('sectionProgress')
        .withIndex('by_user_section', (q) =>
          q.eq('userId', userId).eq('sectionId', sectionId),
        )
        .first();

      if (existingSP) {
        const newStatus =
          existingSP.status === 'mastered'
            ? 'mastered'
            : existingSP.status === 'completed' && computedStatus !== 'mastered'
              ? 'completed'
              : computedStatus;

        await ctx.db.patch(existingSP._id, {
          status:        newStatus,
          cardsMastered: masteredCards,
          lastStudiedAt: Date.now(),
        });
      } else {
        await ctx.db.insert('sectionProgress', {
          userId,
          sectionId,
          status:        computedStatus,
          cardsDue:      0,
          cardsNew:      0,
          cardsMastered: masteredCards,
          lastStudiedAt: Date.now(),
        });
      }
    }

    // ── 4. Update streak ──────────────────────────────────────────────────────
    const streak = await ctx.db
      .query('streaks')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();

    if (streak) {
      const today = new Date().toISOString().slice(0, 10);

      // Avoid double-counting a perfect recall when the SAME card is
      // reviewed again later the same day.
      const reviewedTodayAlready =
        existing !== null &&
        streak.lastActiveDate === today &&
        new Date(existing.lastReviewedAt).toISOString().slice(0, 10) === today;

      const patch = computeStreakUpdate(streak, {
        today,
        isPerfectRecall: quality === 5 && !reviewedTodayAlready,
      });

      const goalMet =
        patch.cardsCompletedToday >= streak.cardsTarget &&
        patch.perfectRecallsToday >= streak.perfectRecallsTarget;

      await ctx.db.patch(streak._id, { ...patch, todayCompleted: goalMet });
    }

    return next;
  },
});

/** Get all card progress for a user in a section */
export const getCardProgressForSection = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    const user = await getAuthedUser(ctx);
    if (!user) return null;
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
