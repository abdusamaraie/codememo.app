/**
 * Payload CMS seed script.
 *
 * Populates Languages → Sections → Flashcards → Exercises
 * using the verified seed data from @repo/mock-data.
 *
 * Usage:
 *   cd apps/admin
 *   npm run seed
 *
 * Requires DATABASE_URL and PAYLOAD_SECRET in .env.local.
 */
import pg from 'pg';
import { getPayload } from 'payload';
import config from './payload.config';
import { syncToConvex } from './endpoints';
import {
  exercises,
  jcrExercises,
  jcrFlashcards,
  jsFlashcards,
  languages,
  pythonFlashcards,
  sections,
} from '@repo/mock-data';

/**
 * Migrate legacy hyphenated text values to underscore equivalents.
 * Only runs when the column is still TEXT — once Payload has migrated
 * the column to an enum type this step is a no-op.
 */
async function migrateEnums() {
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
        ['fill-in-blank',   'fill_blank'],
        ['multiple-choice', 'multiple_choice'],
        ['code-completion', 'code_completion'],
        ['true-false',      'free_recall'],
      ],
    },
    {
      table: 'exercises',
      column: 'type',
      updates: [
        ['fill-blank',     'fill_blank'],
        ['multiple-choice','multiple_choice'],
        ['arrange-lines',  'arrange_code'],
        ['spot-error',     'spot_error'],
      ],
    },
  ];

  for (const { table, column, updates } of migrations) {
    // Skip if the column has already been converted to an enum type
    const { rows } = await client.query<{ data_type: string }>(
      `SELECT data_type FROM information_schema.columns
       WHERE table_name = $1 AND column_name = $2`,
      [table, column],
    );
    if (!rows[0] || rows[0].data_type !== 'text') {
      console.log(`  ⏭ ${table}.${column} is already an enum — skipping`);
      continue;
    }

    for (const [from, to] of updates) {
      const { rowCount } = await client.query(
        `UPDATE "${table}" SET "${column}" = $1 WHERE "${column}" = $2`,
        [to, from],
      );
      if (rowCount && rowCount > 0) {
        console.log(`  ✔ ${table}.${column}: '${from}' → '${to}' (${rowCount} rows)`);
      }
    }
  }

  await client.end();
}

async function seed() {
  console.log('🌱 Starting seed…\n');

  console.log('🔧 Migrating enum values…');
  await migrateEnums();

  const payload = await getPayload({ config });


  // ── 1. Languages ────────────────────────────────────────────────────────────
  console.log('📚 Seeding languages…');
  const langIdBySlug = new Map<string, number>();

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
      console.log(`  ✓ ${lang.name} (exists — ${doc.id})`);
      docToSync = doc as unknown as Record<string, unknown>;
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
      console.log(`  + ${lang.name} → ${doc.id}`);
      docToSync = doc as unknown as Record<string, unknown>;
    }

    // Ensure Convex has the latest language records even when Payload entries already exist.
    await syncToConvex('languages', docToSync, 'update');
  }

  // ── 2. Sections ─────────────────────────────────────────────────────────────
  console.log('\n📂 Seeding sections…');
  const sectionIdBySlug = new Map<string, number>();

  for (const sec of sections) {
    let docToSync: Record<string, unknown>;

    const langId = langIdBySlug.get(sec.languageSlug);
    if (!langId) {
      console.warn(`  ⚠ Skipping section "${sec.title}" — language "${sec.languageSlug}" not found`);
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
      console.log(`  ✓ ${sec.title} (exists — ${doc.id})`);
      docToSync = doc as unknown as Record<string, unknown>;
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
      console.log(`  + ${sec.title} → ${doc.id}`);
      docToSync = doc as unknown as Record<string, unknown>;
    }

    // Ensure Convex has section records required by flashcards/exercises sync.
    await syncToConvex('sections', docToSync, 'update');
  }

  // ── 3. Flashcards ──────────────────────────────────────────────────────────
  const allFlashcards = [...pythonFlashcards, ...jsFlashcards, ...jcrFlashcards];
  console.log(`\n🃏 Seeding ${allFlashcards.length} flashcards…`);
  let fcCreated = 0;
  let fcSkipped = 0;

  // Pre-fetch existing prompts per section to avoid one query per flashcard (N+1).
  const existingPromptsPerSection = new Map<number, Set<string>>();
  for (const sectionId of sectionIdBySlug.values()) {
    const existing = await payload.find({
      collection: 'flashcards',
      where: { section: { equals: sectionId } },
      limit: 500,
    });
    existingPromptsPerSection.set(
      sectionId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new Set(existing.docs.map((d: any) => d.front?.prompt ?? '')),
    );
  }

  for (const fc of allFlashcards) {
    const sectionId = sectionIdBySlug.get(fc.sectionSlug);
    if (!sectionId) {
      console.warn(`  ⚠ Skipping flashcard for section "${fc.sectionSlug}" — not found`);
      fcSkipped++;
      continue;
    }

    if (existingPromptsPerSection.get(sectionId)?.has(fc.front.prompt)) {
      fcSkipped++;
      continue;
    }

    await payload.create({
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
    fcCreated++;
    if (fcCreated % 10 === 0) {
      console.log(`  … ${fcCreated} flashcards created`);
    }
  }
  console.log(`  ✅ ${fcCreated} flashcards created, ${fcSkipped} skipped`);

  // ── 4. Exercises ────────────────────────────────────────────────────────────
  const allExercises = [...exercises, ...jcrExercises];
  console.log(`\n🏋️ Seeding ${allExercises.length} exercises…`);
  let exCreated = 0;
  let exSkipped = 0;

  for (const ex of allExercises) {
    const sectionId = sectionIdBySlug.get(ex.sectionSlug);
    if (!sectionId) {
      console.warn(`  ⚠ Skipping exercise for section "${ex.sectionSlug}" — not found`);
      exSkipped++;
      continue;
    }

    // Coerce hyphenated mock-data types to the underscore values used by PayloadCMS schema
    const exerciseType = (ex.type as string)
      .replace('fill-blank',     'fill_blank')
      .replace('multiple-choice','multiple_choice')
      .replace('arrange-lines',  'arrange_code')
      .replace('spot-error',     'spot_error') as
        'fill_blank' | 'multiple_choice' | 'arrange_code' | 'spot_error';

    await payload.create({
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
    exCreated++;
  }
  console.log(`  ✅ ${exCreated} exercises created, ${exSkipped} skipped`);

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n──────────────────────────');
  console.log('🎉 Seed complete!');
  console.log(`   Languages:  ${langIdBySlug.size}`);
  console.log(`   Sections:   ${sectionIdBySlug.size}`);
  console.log(`   Flashcards: ${fcCreated}`);
  console.log(`   Exercises:  ${exCreated}`);
  console.log('──────────────────────────\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
