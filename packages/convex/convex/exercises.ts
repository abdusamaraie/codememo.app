import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { requireAuth } from './auth';

export const recordExerciseAttempt = mutation({
  args: {
    exerciseId:  v.id('exercises'),
    answer:      v.any(),
    isCorrect:   v.boolean(),
    timeTakenMs: v.optional(v.number()),
  },
  handler: async (ctx, { exerciseId, answer, isCorrect, timeTakenMs }) => {
    const user = await requireAuth(ctx);
    const userId = user._id;

    // Verify exercise exists
    const exercise = await ctx.db.get(exerciseId);
    if (!exercise) throw new Error('Exercise not found');

    // Update section progress counters if applicable
    if (isCorrect) {
      const progress = await ctx.db
        .query('sectionProgress')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .withIndex('by_user_section', (q: any) =>
          q.eq('userId', userId).eq('sectionId', exercise.sectionId),
        )
        .first();

      if (progress) {
        await ctx.db.patch(progress._id, { lastStudiedAt: Date.now() });
      }
    }

    const attemptedAt = Date.now();
    await ctx.db.insert('exerciseAttempts', {
      userId, exerciseId, answer, isCorrect, timeTakenMs, attemptedAt,
    });
    return { userId, exerciseId, answer, isCorrect, timeTakenMs, attemptedAt };
  },
});
