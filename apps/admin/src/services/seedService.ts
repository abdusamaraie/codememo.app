/**
 * Seed service — reusable async generator that populates PayloadCMS content.
 *
 * Extracted from seed.ts so it can be called from both the CLI wrapper
 * and the HTTP endpoint without re-initialising Payload each time.
 *
 * All entities are explicitly synced to Convex after creation/update —
 * we do NOT rely solely on afterChange hooks (which are silent + non-blocking
 * and can fail undetected during bulk seeding).
 */
import pg from 'pg';
import type { BasePayload } from 'payload';
import { syncToConvex } from '../endpoints';
import {
  cheatSheetEntries,
  exercises,
  jcrExercises,
  jcrFlashcards,
  jsFlashcards,
  languages,
  pythonFlashcards,
  sections,
} from '@repo/mock-data';

export type SeedCollection =
  | 'languages'
  | 'sections'
  | 'flashcards'
  | 'exercises'
  | 'cheatSheetEntries';

export type SeedMode = 'mock' | 'production';

export const ALL_COLLECTIONS: SeedCollection[] = [
  'languages',
  'sections',
  'flashcards',
  'exercises',
  'cheatSheetEntries',
];

export interface SeedOptions {
  mode: SeedMode;
  collections: SeedCollection[];
  payload: BasePayload;
}

export interface SeedEvent {
  type: 'progress' | 'summary' | 'error' | 'skip' | 'info';
  collection?: SeedCollection;
  message: string;
  created?: number;
  skipped?: number;
}

// ── Enum migration ────────────────────────────────────────────────────────────

async function migrateEnums(): Promise<string[]> {
  const logs: string[] = [];
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const migrations: Array<{
    table: string;
    column: string;
    updates: Array<[string, string]>;
  }> = [
    {
      table: 'flashcards',
      column: 'question_type',
      updates: [
        ['fill-in-blank', 'fill_blank'],
        ['multiple-choice', 'multiple_choice'],
        ['code-completion', 'code_completion'],
        ['true-false', 'free_recall'],
      ],
    },
    {
      table: 'exercises',
      column: 'type',
      updates: [
        ['fill-blank', 'fill_blank'],
        ['multiple-choice', 'multiple_choice'],
        ['arrange-lines', 'arrange_code'],
        ['spot-error', 'spot_error'],
      ],
    },
  ];

  for (const { table, column, updates } of migrations) {
    const { rows } = await client.query<{ data_type: string }>(
      `SELECT data_type FROM information_schema.columns WHERE table_name = $1 AND column_name = $2`,
      [table, column],
    );
    if (!rows[0] || rows[0].data_type !== 'text') {
      logs.push(`${table}.${column} is already an enum — skipping`);
      continue;
    }
    for (const [from, to] of updates) {
      const { rowCount } = await client.query(
        `UPDATE "${table}" SET "${column}" = $1 WHERE "${column}" = $2`,
        [to, from],
      );
      if (rowCount && rowCount > 0) {
        logs.push(`${table}.${column}: '${from}' → '${to}' (${rowCount} rows)`);
      }
    }
  }

  await client.end();
  return logs;
}

// ── Main seed generator ───────────────────────────────────────────────────────

export async function* runSeed(options: SeedOptions): AsyncGenerator<SeedEvent> {
  const { collections: requested, payload } = options;
  const want = new Set(requested);

  // Enum migration runs when flashcards or exercises are requested
  if (want.has('flashcards') || want.has('exercises')) {
    yield { type: 'info', message: 'Migrating legacy enum values…' };
    try {
      const logs = await migrateEnums();
      for (const msg of logs) {
        yield { type: 'info', message: msg };
      }
    } catch (err) {
      yield { type: 'error', message: `Enum migration failed: ${String(err)}` };
    }
  }

  // ── 1. Languages ────────────────────────────────────────────────────────────
  const langIdBySlug = new Map<string, number>();

  if (want.has('languages')) {
    yield { type: 'info', message: 'Seeding languages…' };
    let created = 0;
    let skipped = 0;

    for (const lang of languages) {
      let docToSync: Record<string, unknown>;

      const existing = await payload.find({
        collection: 'languages',
        where: { slug: { equals: lang.slug } },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        const doc = existing.docs[0]!;
        langIdBySlug.set(lang.slug, Number(doc.id));
        docToSync = doc as unknown as Record<string, unknown>;
        skipped++;
        yield { type: 'skip', collection: 'languages', message: `Language exists: ${lang.name}` };
      } else {
        const doc = await payload.create({
          collection: 'languages',
          data: {
            name: lang.name,
            slug: lang.slug,
            description: lang.description,
            color: lang.color,
            order: lang.order,
            isPublished: lang.isPublished,
          },
        });
        langIdBySlug.set(lang.slug, Number(doc.id));
        docToSync = doc as unknown as Record<string, unknown>;
        created++;
        yield { type: 'progress', collection: 'languages', message: `Created language: ${lang.name}` };
      }

      await syncToConvex('languages', docToSync, 'update');
    }

    yield {
      type: 'summary',
      collection: 'languages',
      message: `Languages done — ${created} created, ${skipped} skipped`,
      created,
      skipped,
    };
  } else {
    // Still build langIdBySlug for dependent steps
    if (want.has('sections') || want.has('flashcards') || want.has('exercises') || want.has('cheatSheetEntries')) {
      const existing = await payload.find({ collection: 'languages', limit: 100 });
      for (const doc of existing.docs) {
        langIdBySlug.set(String((doc as unknown as Record<string, unknown>).slug), Number(doc.id));
      }
    }
  }

  // ── 2. Sections ─────────────────────────────────────────────────────────────
  const sectionIdBySlug = new Map<string, number>();

  if (want.has('sections')) {
    yield { type: 'info', message: 'Seeding sections…' };
    let created = 0;
    let skipped = 0;

    for (const sec of sections) {
      let docToSync: Record<string, unknown>;

      const langId = langIdBySlug.get(sec.languageSlug);
      if (!langId) {
        yield { type: 'skip', collection: 'sections', message: `Skipping section "${sec.title}" — language "${sec.languageSlug}" not found` };
        skipped++;
        continue;
      }

      const existing = await payload.find({
        collection: 'sections',
        where: { slug: { equals: sec.slug } },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        const doc = existing.docs[0]!;
        sectionIdBySlug.set(sec.slug, Number(doc.id));
        docToSync = doc as unknown as Record<string, unknown>;
        skipped++;
        yield { type: 'skip', collection: 'sections', message: `Section exists: ${sec.title}` };
      } else {
        const doc = await payload.create({
          collection: 'sections',
          data: {
            title: sec.title,
            slug: sec.slug,
            language: langId,
            description: sec.description,
            order: sec.order,
            difficulty: sec.difficulty,
            isPublished: sec.isPublished,
          },
        });
        sectionIdBySlug.set(sec.slug, Number(doc.id));
        docToSync = doc as unknown as Record<string, unknown>;
        created++;
        yield { type: 'progress', collection: 'sections', message: `Created section: ${sec.title}` };
      }

      await syncToConvex('sections', docToSync, 'update');
    }

    yield {
      type: 'summary',
      collection: 'sections',
      message: `Sections done — ${created} created, ${skipped} skipped`,
      created,
      skipped,
    };
  } else {
    // Build sectionIdBySlug for dependent steps
    if (want.has('flashcards') || want.has('exercises')) {
      const existing = await payload.find({ collection: 'sections', limit: 500 });
      for (const doc of existing.docs) {
        const d = doc as unknown as Record<string, unknown>;
        sectionIdBySlug.set(String(d.slug), Number(doc.id));
      }
    }
  }

  // ── 3. Flashcards ──────────────────────────────────────────────────────────
  if (want.has('flashcards')) {
    const allFlashcards = [...pythonFlashcards, ...jsFlashcards, ...jcrFlashcards];
    yield { type: 'info', message: `Seeding ${allFlashcards.length} flashcards…` };
    let created = 0;
    let skipped = 0;

    // Pre-fetch existing prompts per section to avoid N+1 queries
    const existingPromptsPerSection = new Map<number, Set<string>>();
    for (const sectionId of sectionIdBySlug.values()) {
      const existing = await payload.find({
        collection: 'flashcards',
        where: { section: { equals: sectionId } },
        limit: 500,
      });
      existingPromptsPerSection.set(
        sectionId,
        new Set(existing.docs.map((d: unknown) => (d as Record<string, Record<string, string>>).front?.prompt ?? '')),
      );
    }

    for (const fc of allFlashcards) {
      const sectionId = sectionIdBySlug.get(fc.sectionSlug);
      if (!sectionId) {
        skipped++;
        continue;
      }
      if (existingPromptsPerSection.get(sectionId)?.has(fc.front.prompt)) {
        skipped++;
        continue;
      }

      const doc = await payload.create({
        collection: 'flashcards',
        data: {
          section: sectionId,
          questionType: fc.questionType,
          front: {
            prompt: fc.front.prompt,
            code: fc.front.code ?? undefined,
            language: fc.front.language ?? undefined,
          },
          back: {
            prompt: fc.back.prompt,
            code: fc.back.code ?? undefined,
            language: fc.back.language ?? undefined,
          },
          difficulty: fc.difficulty,
          order: fc.order,
          tags: fc.tags.map((t) => ({ value: t })),
          isPublished: fc.isPublished,
        },
      });

      // Explicit sync — don't rely solely on afterChange hook
      await syncToConvex('flashcards', doc as unknown as Record<string, unknown>, 'create');

      created++;
      if (created % 10 === 0) {
        yield { type: 'progress', collection: 'flashcards', message: `${created} flashcards created…`, created };
      }
    }

    yield {
      type: 'summary',
      collection: 'flashcards',
      message: `Flashcards done — ${created} created, ${skipped} skipped`,
      created,
      skipped,
    };
  }

  // ── 4. Exercises ────────────────────────────────────────────────────────────
  if (want.has('exercises')) {
    const allExercises = [...exercises, ...jcrExercises];
    yield { type: 'info', message: `Seeding ${allExercises.length} exercises…` };
    let created = 0;
    let skipped = 0;

    for (const ex of allExercises) {
      const sectionId = sectionIdBySlug.get(ex.sectionSlug);
      if (!sectionId) {
        skipped++;
        continue;
      }

      const exerciseType = (ex.type as string)
        .replace('fill-blank', 'fill_blank')
        .replace('multiple-choice', 'multiple_choice')
        .replace('arrange-lines', 'arrange_code')
        .replace('spot-error', 'spot_error') as
        | 'fill_blank'
        | 'multiple_choice'
        | 'arrange_code'
        | 'spot_error';

      const doc = await payload.create({
        collection: 'exercises',
        data: {
          section: sectionId,
          type: exerciseType,
          question: ex.question,
          code: ex.code ?? undefined,
          language: ex.language,
          options: ex.options?.map((o) => ({ value: o })) ?? [],
          correctAnswer: ex.correctAnswer,
          explanation: ex.explanation,
          difficulty: ex.difficulty,
          order: ex.order,
          isPublished: ex.isPublished,
        },
      });

      // Explicit sync — don't rely solely on afterChange hook
      await syncToConvex('exercises', doc as unknown as Record<string, unknown>, 'create');

      created++;
    }

    yield {
      type: 'summary',
      collection: 'exercises',
      message: `Exercises done — ${created} created, ${skipped} skipped`,
      created,
      skipped,
    };
  }

  // ── 5. Cheat Sheet Entries ──────────────────────────────────────────────────
  if (want.has('cheatSheetEntries')) {
    yield { type: 'info', message: `Seeding ${cheatSheetEntries.length} cheat sheet entries…` };
    let created = 0;
    let skipped = 0;

    // Pre-fetch existing titles per language
    const existingTitlesPerLang = new Map<number, Set<string>>();
    for (const langId of langIdBySlug.values()) {
      const existing = await payload.find({
        collection: 'cheatSheetEntries',
        where: { language: { equals: langId } },
        limit: 500,
      });
      existingTitlesPerLang.set(
        langId,
        new Set(existing.docs.map((d: unknown) => (d as Record<string, string>).title ?? '')),
      );
    }

    for (const entry of cheatSheetEntries) {
      const langId = langIdBySlug.get(entry.languageSlug);
      if (!langId) {
        skipped++;
        continue;
      }
      if (existingTitlesPerLang.get(langId)?.has(entry.title)) {
        skipped++;
        continue;
      }

      const doc = await payload.create({
        collection: 'cheatSheetEntries',
        data: {
          language: langId,
          category: entry.category,
          title: entry.title,
          syntax: entry.syntax,
          description: entry.description,
          example: entry.example ?? undefined,
          order: entry.order,
          isPublished: entry.isPublished,
        },
      });

      // Explicit sync — don't rely solely on afterChange hook
      await syncToConvex('cheatSheetEntries', doc as unknown as Record<string, unknown>, 'create');

      created++;
      if (created % 20 === 0) {
        yield { type: 'progress', collection: 'cheatSheetEntries', message: `${created} cheat sheet entries created…`, created };
      }
    }

    yield {
      type: 'summary',
      collection: 'cheatSheetEntries',
      message: `Cheat sheet entries done — ${created} created, ${skipped} skipped`,
      created,
      skipped,
    };
  }

  yield { type: 'info', message: 'Seed complete!' };
}
