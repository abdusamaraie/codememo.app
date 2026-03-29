import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const recordExerciseAttempt = mutation({
  args: {
    userId:      v.id('users'),
    exerciseId:  v.id('exercises'),
    answer:      v.any(),
    isCorrect:   v.boolean(),
    timeTakenMs: v.optional(v.number()),
  },
  handler: async (ctx, { userId, exerciseId, answer, isCorrect, timeTakenMs }) => {
    // Verify exercise exists
    const exercise = await ctx.db.get(exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    // Update section progress counters if applicable
    if (isCorrect) {
      const progress = await ctx.db
        .query('sectionProgress')
        .withIndex('by_user_section', (q) =>
          q.eq('userId', userId).eq('sectionId', exercise.sectionId),
        )
        .first();

      if (progress) {
        await ctx.db.patch(progress._id, { lastStudiedAt: Date.now() });
      }
    }

    return { userId, exerciseId, answer, isCorrect, timeTakenMs, attemptedAt: Date.now() };
  },
});
