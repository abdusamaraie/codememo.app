import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { calculateQuizScore } from '@repo/domain';

export const startQuiz = mutation({
  args: { userId: v.id('users'), sectionId: v.id('sections') },
  handler: async (ctx, { userId, sectionId }) => {
    const quizId = await ctx.db.insert('quizAttempts', {
      userId,
      sectionId,
      answers:     [],
      score:       0,
      passed:      false,
      startedAt:   Date.now(),
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
    const quiz = await ctx.db.get(quizId);
    if (!quiz) throw new Error('Quiz not found');
    if (quiz.completedAt) throw new Error('Quiz already completed');

    await ctx.db.patch(quizId, {
      answers: [...quiz.answers, { exerciseId, answer, isCorrect, timeTakenMs }],
    });
  },
});

export const completeQuiz = mutation({
  args: { quizId: v.id('quizAttempts') },
  handler: async (ctx, { quizId }) => {
    const quiz = await ctx.db.get(quizId);
    if (!quiz) throw new Error('Quiz not found');

    const { score, passed, breakdown } = calculateQuizScore(
      quiz.answers.map((a) => ({
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
  args: { userId: v.id('users'), sectionId: v.id('sections') },
  handler: async (ctx, { userId, sectionId }) => {
    return ctx.db
      .query('quizAttempts')
      .withIndex('by_user_section', (q) =>
        q.eq('userId', userId).eq('sectionId', sectionId),
      )
      .collect();
  },
});
