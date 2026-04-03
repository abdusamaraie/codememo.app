import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { calculateQuizScore } from '@repo/domain';
import { requireAuth } from './auth';

export const startQuiz = mutation({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    const user = await requireAuth(ctx);

    const quizId = await ctx.db.insert('quizAttempts', {
      userId:    user._id,
      sectionId,
      answers:   [],
      score:     0,
      passed:    false,
      startedAt: Date.now(),
    });
    return quizId;
  },
});

export const submitQuizAnswer = mutation({
  args: {
    quizId:      v.id('quizAttempts'),
    exerciseId:  v.id('exercises'),
    answer:      v.any(),
    isCorrect:   v.boolean(),
    timeTakenMs: v.optional(v.number()),
  },
  handler: async (ctx, { quizId, exerciseId, answer, isCorrect, timeTakenMs }) => {
    const user = await requireAuth(ctx);

    const quiz = await ctx.db.get(quizId);
    if (!quiz) throw new Error('Quiz not found');
    if (quiz.completedAt) throw new Error('Quiz already completed');

    // Ownership check: the quiz must belong to the authenticated user
    if (quiz.userId !== user._id) throw new Error('Forbidden');

    await ctx.db.patch(quizId, {
      answers: [...quiz.answers, { exerciseId, answer, isCorrect, timeTakenMs }],
    });
  },
});

export const completeQuiz = mutation({
  args: { quizId: v.id('quizAttempts') },
  handler: async (ctx, { quizId }) => {
    const user = await requireAuth(ctx);

    const quiz = await ctx.db.get(quizId);
    if (!quiz) throw new Error('Quiz not found');
    if (quiz.userId !== user._id) throw new Error('Forbidden');
    if (quiz.completedAt) throw new Error('Quiz already completed');

    const { score, passed, breakdown } = calculateQuizScore(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      quiz.answers.map((a: any) => ({
        exerciseId: a.exerciseId,
        answer:     a.answer,
        isCorrect:  a.isCorrect,
        timeTakenMs: a.timeTakenMs,
      })),
    );

    await ctx.db.patch(quizId, {
      score,
      passed,
      completedAt: Date.now(),
    });

    return { score, passed, breakdown };
  },
});

export const getQuizHistory = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query('quizAttempts')
      .withIndex('by_user_section', (q) =>
        q.eq('userId', user._id).eq('sectionId', sectionId),
      )
      .collect();
  },
});
