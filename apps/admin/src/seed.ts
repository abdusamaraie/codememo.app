/**
 * Payload CMS seed script.
 *
 * Populates Languages → Sections → Flashcards → Exercises
 * using the verified seed data from @repo/mock-data.
 *
 * Usage:
 *   cd apps/admin
 *   npx tsx src/seed.ts
 *
 * Requires DATABASE_URL and PAYLOAD_SECRET in .env.local.
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });

import { getPayload } from 'payload';
import config from './payload.config';
import {
  languages,
  sections,
  pythonFlashcards,
  jsFlashcards,
  exercises,
} from '@repo/mock-data';

async function seed() {
  console.log('🌱 Starting seed…\n');

  const payload = await getPayload({ config });

  // ── 1. Languages ────────────────────────────────────────────────────────────
  console.log('📚 Seeding languages…');
  const langIdBySlug = new Map<string, number>();

  for (const lang of languages) {
    const existing = await payload.find({
      collection: 'languages',
      where: { slug: { equals: lang.slug } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]!;
      langIdBySlug.set(lang.slug, Number(doc.id));
      console.log(`  ✓ ${lang.name} (exists — ${doc.id})`);
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
    }
  }

  // ── 2. Sections ─────────────────────────────────────────────────────────────
  console.log('\n📂 Seeding sections…');
  const sectionIdBySlug = new Map<string, number>();

  for (const sec of sections) {
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
    }
  }

  // ── 3. Flashcards ──────────────────────────────────────────────────────────
  const allFlashcards = [...pythonFlashcards, ...jsFlashcards];
  console.log(`\n🃏 Seeding ${allFlashcards.length} flashcards…`);
  let fcCreated = 0;
  let fcSkipped = 0;

  for (const fc of allFlashcards) {
    const sectionId = sectionIdBySlug.get(fc.sectionSlug);
    if (!sectionId) {
      console.warn(`  ⚠ Skipping flashcard for section "${fc.sectionSlug}" — not found`);
      fcSkipped++;
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
    fcCreated++;
    if (fcCreated % 10 === 0) {
      console.log(`  … ${fcCreated} flashcards created`);
    }
  }
  console.log(`  ✅ ${fcCreated} flashcards created, ${fcSkipped} skipped`);

  // ── 4. Exercises ────────────────────────────────────────────────────────────
  console.log(`\n🏋️ Seeding ${exercises.length} exercises…`);
  let exCreated = 0;
  let exSkipped = 0;

  for (const ex of exercises) {
    const sectionId = sectionIdBySlug.get(ex.sectionSlug);
    if (!sectionId) {
      console.warn(`  ⚠ Skipping exercise for section "${ex.sectionSlug}" — not found`);
      exSkipped++;
      continue;
    }

    const doc = await payload.create({
      collection: 'exercises',
      data: {
        section: sectionId,
        type: ex.type,
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
