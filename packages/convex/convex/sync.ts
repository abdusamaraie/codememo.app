import { httpAction } from './_generated/server';
import { api } from './_generated/api';

/** Receives PayloadCMS webhook and upserts content into Convex */
export const syncFromPayload = httpAction(async (ctx, request) => {
  // Verify shared secret
  const secret = request.headers.get('x-sync-secret');
  if (secret !== process.env.CONVEX_SYNC_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json() as SyncPayload;

  switch (body.collection) {
    case 'languages':
      await ctx.runMutation(api.sync.upsertLanguage, { data: body.data });
      break;
    case 'sections':
      await ctx.runMutation(api.sync.upsertSection, { data: body.data });
      break;
    case 'flashcards':
      await ctx.runMutation(api.sync.upsertFlashcard, { data: body.data });
      break;
    case 'exercises':
      await ctx.runMutation(api.sync.upsertExercise, { data: body.data });
      break;
    default:
      return new Response(`Unknown collection: ${body.collection}`, { status: 400 });
  }

  return new Response('OK', { status: 200 });
});

type SyncPayload = {
  collection: 'languages' | 'sections' | 'flashcards' | 'exercises';
  operation:  'create' | 'update' | 'delete';
  data:       Record<string, unknown>;
};

import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const upsertLanguage = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const d = data as Record<string, unknown>;
    const existing = await ctx.db
      .query('languages')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', d.id as string))
      .first();

    const record = {
      payloadId:   d.id as string,
      slug:        d.slug as string,
      name:        d.name as string,
      description: (d.description as string) ?? '',
      color:       (d.color as string) ?? '#7C6AF6',
      order:       (d.order as number) ?? 0,
      isPublished: (d.isPublished as boolean) ?? false,
    };

    if (existing) {
      await ctx.db.patch(existing._id, record);
    } else {
      await ctx.db.insert('languages', record);
    }
  },
});

export const upsertSection = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const d = data as Record<string, unknown>;

    // Resolve languageId from payloadId
    const language = await ctx.db
      .query('languages')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', d.languageId as string))
      .first();

    if (!language) throw new Error(`Language not found for payloadId: ${d.languageId}`);

    const existing = await ctx.db
      .query('sections')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', d.id as string))
      .first();

    const record = {
      payloadId:   d.id as string,
      languageId:  language._id,
      title:       d.title as string,
      slug:        d.slug as string,
      description: (d.description as string) ?? '',
      order:       (d.order as number) ?? 0,
      isPublished: (d.isPublished as boolean) ?? false,
    };

    if (existing) {
      await ctx.db.patch(existing._id, record);
    } else {
      await ctx.db.insert('sections', record);
    }
  },
});

export const upsertFlashcard = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const d = data as Record<string, unknown>;

    const section = await ctx.db
      .query('sections')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', d.sectionId as string))
      .first();

    if (!section) throw new Error(`Section not found for payloadId: ${d.sectionId}`);

    const existing = await ctx.db
      .query('flashcards')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', d.id as string))
      .first();

    const record = {
      payloadId:      d.id as string,
      sectionId:      section._id,
      question:       d.question as string,
      questionType:   (d.questionType as 'free_recall') ?? 'free_recall',
      answer:         d.answer as string,
      answerCode:     d.answerCode as string | undefined,
      explanation:    d.explanation as string | undefined,
      hint:           d.hint as string | undefined,
      commonMistakes: (d.commonMistakes as string[]) ?? [],
      difficulty:     (d.difficulty as 'beginner') ?? 'beginner',
      tags:           (d.tags as string[]) ?? [],
      order:          (d.order as number) ?? 0,
    };

    if (existing) {
      await ctx.db.patch(existing._id, record);
    } else {
      await ctx.db.insert('flashcards', record);
    }
  },
});

export const upsertExercise = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const d = data as Record<string, unknown>;

    const section = await ctx.db
      .query('sections')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', d.sectionId as string))
      .first();

    if (!section) throw new Error(`Section not found for payloadId: ${d.sectionId}`);

    const existing = await ctx.db
      .query('exercises')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', d.id as string))
      .first();

    const record = {
      payloadId:     d.id as string,
      sectionId:     section._id,
      type:          (d.type as 'fill_blank') ?? 'fill_blank',
      prompt:        d.prompt as string,
      codeTemplate:  d.codeTemplate as string | undefined,
      options:       d.options,
      correctAnswer: d.correctAnswer,
      explanation:   d.explanation as string | undefined,
      order:         (d.order as number) ?? 0,
    };

    if (existing) {
      await ctx.db.patch(existing._id, record);
    } else {
      await ctx.db.insert('exercises', record);
    }
  },
});
