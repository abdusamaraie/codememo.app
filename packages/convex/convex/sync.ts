import { httpAction, mutation } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

type SyncPayload = {
  collection: 'languages' | 'sections' | 'flashcards' | 'exercises' | 'cheatSheetEntries';
  operation:  'create' | 'update' | 'delete';
  data:       Record<string, unknown>;
};

type FlashcardQuestionType =
  | 'free_recall'
  | 'multiple_choice'
  | 'code_completion'
  | 'explain_output'
  | 'spot_error'
  | 'fill_blank';

type ExerciseType =
  | 'fill_blank'
  | 'multiple_choice'
  | 'spot_error'
  | 'arrange_code'
  | 'translate';

function resolvePayloadId(data: Record<string, unknown>): string {
  const rawId = data.id;
  if (typeof rawId !== 'string' && typeof rawId !== 'number') {
    throw new Error('Delete payload must include an id (string or number)');
  }
  const payloadId = String(rawId).trim();
  if (!payloadId) {
    throw new Error('Delete payload id cannot be empty');
  }
  return payloadId;
}

/**
 * Payload's afterChange hook populates relationship fields as objects at depth > 0.
 * This helper safely extracts the ID whether the field is a raw ID or a populated object.
 */
function resolveRelationId(field: unknown): string {
  if (field !== null && typeof field === 'object' && 'id' in field) {
    return String((field as { id: unknown }).id);
  }
  return String(field);
}

function normalizeEnumToken(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function normalizeFlashcardQuestionType(value: unknown): FlashcardQuestionType {
  const token = normalizeEnumToken(value);

  switch (token) {
    case 'multiple_choice':
      return 'multiple_choice';
    case 'code_completion':
      return 'code_completion';
    case 'fill_blank':
      return 'fill_blank';
    case 'spot_error':
      return 'spot_error';
    case 'explain_output':
      return 'explain_output';
    case 'true_false':
      return 'free_recall';
    case 'free_recall':
    default:
      return 'free_recall';
  }
}

function normalizeExerciseType(value: unknown): ExerciseType {
  const token = normalizeEnumToken(value);

  switch (token) {
    case 'multiple_choice':
      return 'multiple_choice';
    case 'arrange_code':
    case 'arrange_lines':
      return 'arrange_code';
    case 'spot_error':
      return 'spot_error';
    case 'translate':
      return 'translate';
    case 'fill_blank':
    default:
      return 'fill_blank';
  }
}

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

  if (body.operation === 'delete') {
    try {
      const payloadId = resolvePayloadId(body.data);

      switch (body.collection) {
        case 'languages':
          await ctx.runMutation(api.sync.deleteLanguage, { payloadId });
          break;
        case 'sections':
          await ctx.runMutation(api.sync.deleteSection, { payloadId });
          break;
        case 'flashcards':
          await ctx.runMutation(api.sync.deleteFlashcard, { payloadId });
          break;
        case 'exercises':
          await ctx.runMutation(api.sync.deleteExercise, { payloadId });
          break;
        case 'cheatSheetEntries':
          await ctx.runMutation(api.sync.deleteCheatSheetEntry, { payloadId });
          break;
        default:
          return new Response(`Unknown collection: ${body.collection}`, { status: 400 });
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      return new Response(
        error instanceof Error ? `Invalid delete payload: ${error.message}` : 'Invalid delete payload',
        { status: 400 },
      );
    }
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

export const deleteLanguage = mutation({
  args: { payloadId: v.string() },
  handler: async (ctx, { payloadId }) => {
    const existing = await ctx.db
      .query('languages')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', payloadId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const deleteSection = mutation({
  args: { payloadId: v.string() },
  handler: async (ctx, { payloadId }) => {
    const existing = await ctx.db
      .query('sections')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', payloadId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const deleteFlashcard = mutation({
  args: { payloadId: v.string() },
  handler: async (ctx, { payloadId }) => {
    const existing = await ctx.db
      .query('flashcards')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', payloadId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const deleteExercise = mutation({
  args: { payloadId: v.string() },
  handler: async (ctx, { payloadId }) => {
    const existing = await ctx.db
      .query('exercises')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', payloadId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const deleteCheatSheetEntry = mutation({
  args: { payloadId: v.string() },
  handler: async (ctx, { payloadId }) => {
    const existing = await ctx.db
      .query('cheatSheetEntries')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', payloadId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const upsertLanguage = mutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const d = data as Record<string, unknown>;
    const existing = await ctx.db
      .query('languages')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', String(d.id)))
      .first();

    const record = {
      payloadId:   String(d.id),
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

    // Payload relationship fields send the ID directly (depth: 0)
    const languagePayloadId = resolveRelationId(d.language);
    const language = await ctx.db
      .query('languages')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', languagePayloadId))
      .first();

    if (!language) throw new Error(`Language not found for payloadId: ${languagePayloadId}`);

    const existing = await ctx.db
      .query('sections')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', String(d.id)))
      .first();

    const record = {
      payloadId:   String(d.id),
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
    const sectionPayloadId = resolveRelationId(d.section);
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
      questionType:   normalizeFlashcardQuestionType(d.questionType),
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
    const sectionPayloadId = resolveRelationId(d.section);
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
      type:          normalizeExerciseType(d.type),
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

    // Payload relationship fields send the ID directly (depth: 0)
    const languagePayloadId = resolveRelationId(d.language);
    const language = await ctx.db
      .query('languages')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', languagePayloadId))
      .first();

    if (!language) throw new Error(`Language not found for payloadId: ${languagePayloadId}`);

    const existing = await ctx.db
      .query('cheatSheetEntries')
      .withIndex('by_payload_id', (q) => q.eq('payloadId', String(d.id)))
      .first();

    const record = {
      payloadId:    String(d.id),
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
