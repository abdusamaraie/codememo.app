import { action, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';

const AI_DAILY_LIMIT = 20;

export const getAIRequestsRemaining = query({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return 0;
    const today = new Date().toISOString().slice(0, 10);
    const used  = user.aiRequestsDate === today ? user.aiRequestsToday : 0;
    return Math.max(0, AI_DAILY_LIMIT - used);
  },
});

/** Internal: increment AI request counter — call from all AI actions */
export const incrementAIRequests = internalMutation({
  args: { userId: v.id('users') },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error('User not found');

    const today         = new Date().toISOString().slice(0, 10);
    const requestsToday = user.aiRequestsDate === today ? user.aiRequestsToday : 0;

    if (requestsToday >= AI_DAILY_LIMIT) {
      throw new Error(`Daily AI limit of ${AI_DAILY_LIMIT} requests reached`);
    }

    await ctx.db.patch(userId, {
      aiRequestsToday: requestsToday + 1,
      aiRequestsDate:  today,
    });
  },
});

/** Get a progressive hint for a flashcard */
export const getHint = action({
  args: {
    userId:      v.id('users'),
    flashcardId: v.id('flashcards'),
    question:    v.string(),
    hint:        v.optional(v.string()),
  },
  handler: async (ctx, { userId, flashcardId: _flashcardId, question, hint }) => {
    await ctx.runMutation(internal.ai.incrementAIRequests, { userId });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [{
          role:    'user',
          content: hint
            ? `The developer already has this hint: "${hint}". Provide a more specific follow-up hint (don't give away the answer) for: ${question}`
            : `Give a brief, helpful hint (no more than 2 sentences, don't give the answer) for this programming question: ${question}`,
        }],
      }),
    });

    const data = await response.json() as { content: Array<{ text: string }> };
    return data.content[0]?.text ?? '';
  },
});

/** Explain a concept in further depth after the card flip */
export const explainFurther = action({
  args: {
    userId:   v.id('users'),
    question: v.string(),
    answer:   v.string(),
    language: v.string(),
  },
  handler: async (ctx, { userId, question, answer, language }) => {
    await ctx.runMutation(internal.ai.incrementAIRequests, { userId });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-3-haiku-20240307',
        max_tokens: 400,
        messages: [{
          role:    'user',
          content: `For an experienced developer learning ${language} syntax: explain why "${answer}" is the answer to "${question}". Compare to similar patterns in other languages if helpful. Be concise (3-4 sentences max).`,
        }],
      }),
    });

    const data = await response.json() as { content: Array<{ text: string }> };
    return data.content[0]?.text ?? '';
  },
});

/** Analyse why the user's fix for a spot-the-error exercise was wrong */
export const analyzeError = action({
  args: {
    userId:      v.id('users'),
    buggyCode:   v.string(),
    userFix:     v.string(),
    correctFix:  v.string(),
    language:    v.string(),
  },
  handler: async (ctx, { userId, buggyCode, userFix, correctFix, language }) => {
    await ctx.runMutation(internal.ai.incrementAIRequests, { userId });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY ?? '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [{
          role:    'user',
          content: `In ${language}: The buggy code was:\n${buggyCode}\n\nThe correct fix is:\n${correctFix}\n\nThe developer wrote:\n${userFix}\n\nBriefly explain why the developer's fix is incorrect and what they misunderstood (2-3 sentences).`,
        }],
      }),
    });

    const data = await response.json() as { content: Array<{ text: string }> };
    return data.content[0]?.text ?? '';
  },
});
