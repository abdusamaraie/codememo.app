import { httpAction, mutation } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

type SyncPayload = {
  collection: 'languages' | 'sections' | 'flashcards' | 'exercises' | 'cheatSheetEntries';
  operation:  'create' | 'update' | 'delete';
  data:       Record<string, unknown>;
};

/** Receives PayloadCMS webhook and upserts content into Convex */
export const syncFromPayload = httpAction(async (ctx, request) => {
  // Verify shared secret — reject empty/missing secrets explicitly
  const secret = request.headers.get('x-sync-secret');
  if (!process.env.CONVEX_SYNC_SECRET) {
    return new Response('Sync secret not configured on server', { status: 503 });
  }
  if (!secret || secret !== process.env.CONVEX_SYNC_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json() as SyncPayload;

  // Delete operations are not yet implemented — reject early
  if (body.operation === 'delete') {
    return new Response('Delete sync not yet implemented', { status: 501 });
  }

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
    case 'cheatSheetEntries':
      await ctx.runMutation(api.sync.upsertCheatSheetEntry, { data: body.data });
      break;
    default:
      return new Response(`Unknown collection: ${body.collection}`, { status: 400 });
  }

  return new Response('OK', { status: 200 });
});

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
    const front = (d.front ?? {}) as Record<string, unknown>;
    const back  = (d.back  ?? {}) as Record<string, unknown>;

    // Payload relationship fields send the ID directly (depth: 0)
    const sectionPayloadId = String(d.section);
    const section = await ctx.db
      .query('sections')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', sectionPayloadId))
      .first();

    if (!section) throw new Error(`Section not found for payloadId: ${sectionPayloadId}`);

    const existing = await ctx.db
      .query('flashcards')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', String(d.id)))
      .first();

    // Payload tags are [{id, value}] — flatten to string[]
    const rawTags = (d.tags as Array<{ value?: string }> | undefined) ?? [];
    const tags = rawTags.map((t) => t.value ?? '').filter(Boolean);

    const record = {
      payloadId:      String(d.id),
      sectionId:      section._id,
      question:       (front.prompt as string) ?? '',
      questionType:   (d.questionType as 'free_recall') ?? 'free_recall',
      answer:         (back.prompt as string) ?? '',
      answerCode:     (back.code as string | undefined) || undefined,
      explanation:    (d.explanation as string | undefined) || undefined,
      hint:           (d.hint as string | undefined) || undefined,
      commonMistakes: (d.commonMistakes as string[]) ?? [],
      difficulty:     (d.difficulty as 'beginner') ?? 'beginner',
      tags,
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

    // Payload relationship fields send the ID directly (depth: 0)
    const sectionPayloadId = String(d.section);
    const section = await ctx.db
      .query('sections')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', sectionPayloadId))
      .first();

    if (!section) throw new Error(`Section not found for payloadId: ${sectionPayloadId}`);

    const existing = await ctx.db
      .query('exercises')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', String(d.id)))
      .first();

    // Payload options are [{id, value}] — pass through as-is (v.any())
    const record = {
      payloadId:     String(d.id),
      sectionId:     section._id,
      type:          (d.type as 'fill_blank') ?? 'fill_blank',
      prompt:        (d.question as string) ?? '',   // Payload field is "question"
      codeTemplate:  (d.code as string | undefined) || undefined, // Payload field is "code"
      options:       d.options,
      correctAnswer: d.correctAnswer,
      explanation:   (d.explanation as string | undefined) || undefined,
      order:         (d.order as number) ?? 0,
    };

    if (existing) {
      await ctx.db.patch(existing._id, record);
    } else {
      await ctx.db.insert('exercises', record);
    }
  },
});

export const upsertCheatSheetEntry = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const d = data as Record<string, unknown>;

    // Resolve language relationship to slug
    const language = await ctx.db
      .query('languages')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', d.languageId as string))
      .first();

    if (!language) throw new Error(`Language not found for payloadId: ${d.languageId}`);

    const existing = await ctx.db
      .query('cheatSheetEntries')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', d.id as string))
      .first();

    const record = {
      payloadId:    d.id as string,
      languageSlug: language.slug,
      category:     d.category as string,
      title:        d.title as string,
      syntax:       d.syntax as string,
      description:  (d.description as string) ?? '',
      example:      d.example as string | undefined,
      order:        (d.order as number) ?? 0,
    };

    if (existing) {
      await ctx.db.patch(existing._id, record);
    } else {
      await ctx.db.insert('cheatSheetEntries', record);
    }
  },
});
