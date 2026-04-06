/**
 * Payload CMS data-fetching layer.
 *
 * Server-side only — used in RSC pages to fetch content from the
 * Payload admin API at NEXT_PUBLIC_ADMIN_URL (default: http://localhost:3001).
 *
 * Every function returns typed data and gracefully falls back to
 * empty arrays when the CMS is unreachable.
 */

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001';

// ── Payload REST envelope ────────────────────────────────────────────────────

interface PayloadListResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ── CMS Types (mirrors payload-types.ts) ─────────────────────────────────────

export interface CMSLanguage {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  color: string;
  order: number;
  isPublished?: boolean | null;
}

export interface CMSSection {
  id: number;
  title: string;
  slug: string;
  language: number | CMSLanguage;
  description?: string | null;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPublished?: boolean | null;
}

export interface CMSFlashcard {
  id: number;
  section: number | CMSSection;
  questionType: string;
  front: { prompt: string; code?: string | null; language?: string | null };
  back: { prompt: string; code?: string | null; language?: string | null };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order?: number | null;
  tags?: { value: string }[] | null;
  isPublished?: boolean | null;
}

export interface CMSExercise {
  id: number;
  section: number | CMSSection;
  type:
    | 'fill_blank'
    | 'multiple_choice'
    | 'arrange_code'
    | 'spot_error'
    | 'fill-blank'
    | 'multiple-choice'
    | 'arrange-lines'
    | 'spot-error';
  question: string;
  code?: string | null;
  language?: string | null;
  options?: { value: string }[] | null;
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order?: number | null;
  isPublished?: boolean | null;
}

export type NormalizedExerciseType =
  | 'fill_blank'
  | 'multiple_choice'
  | 'arrange_code'
  | 'spot_error';

export function normalizeExerciseType(type: CMSExercise['type']): NormalizedExerciseType {
  switch (type) {
    case 'fill_blank':
    case 'fill-blank':
      return 'fill_blank';
    case 'multiple_choice':
    case 'multiple-choice':
      return 'multiple_choice';
    case 'spot_error':
    case 'spot-error':
      return 'spot_error';
    case 'arrange_code':
    case 'arrange-lines':
      return 'arrange_code';
    default:
      return 'arrange_code';
  }
}

// ── Fetcher ──────────────────────────────────────────────────────────────────

async function fetchPayload<T>(path: string): Promise<PayloadListResponse<T>> {
  try {
    const url = `${ADMIN_URL}/api${path}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error(`[payload] ${res.status} ${res.statusText} — ${url}`);
      return emptyList();
    }
    return (await res.json()) as PayloadListResponse<T>;
  } catch (err) {
    console.error('[payload] CMS unreachable:', err);
    return emptyList();
  }
}

function emptyList<T>(): PayloadListResponse<T> {
  return { docs: [], totalDocs: 0, limit: 0, totalPages: 0, page: 1, hasNextPage: false, hasPrevPage: false };
}

// ── Public API ───────────────────────────────────────────────────────────────

/** All published languages, sorted by `order`. */
export async function getLanguages(): Promise<CMSLanguage[]> {
  const res = await fetchPayload<CMSLanguage>(
    '/languages?where[isPublished][equals]=true&sort=order&limit=100',
  );
  return res.docs;
}

/** Single language by slug. */
export async function getLanguageBySlug(slug: string): Promise<CMSLanguage | null> {
  const res = await fetchPayload<CMSLanguage>(
    `/languages?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );
  return res.docs[0] ?? null;
}

/** Published sections for a language (by language ID), sorted by `order`. */
export async function getSections(languageId: number): Promise<CMSSection[]> {
  const res = await fetchPayload<CMSSection>(
    `/sections?where[language][equals]=${languageId}&where[isPublished][equals]=true&sort=order&limit=100`,
  );
  return res.docs;
}

/** Published sections for a language slug (convenience wrapper). */
export async function getSectionsByLanguageSlug(slug: string): Promise<CMSSection[]> {
  const lang = await getLanguageBySlug(slug);
  if (!lang) return [];
  return getSections(lang.id);
}

/** Single section by slug. */
export async function getSectionBySlug(slug: string): Promise<CMSSection | null> {
  const res = await fetchPayload<CMSSection>(
    `/sections?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
  );
  return res.docs[0] ?? null;
}

/** Published flashcards for a section (by section ID), sorted by `order`. */
export async function getFlashcards(sectionId: number): Promise<CMSFlashcard[]> {
  const res = await fetchPayload<CMSFlashcard>(
    `/flashcards?where[section][equals]=${sectionId}&where[isPublished][equals]=true&sort=order&limit=200`,
  );
  return res.docs;
}

/** Published flashcards for a section slug (convenience wrapper). */
export async function getFlashcardsBySectionSlug(sectionSlug: string): Promise<CMSFlashcard[]> {
  const section = await getSectionBySlug(sectionSlug);
  if (!section) return [];
  return getFlashcards(section.id);
}

/** Published exercises for a section (by section ID), sorted by `order`. */
export async function getExercises(sectionId: number): Promise<CMSExercise[]> {
  const res = await fetchPayload<CMSExercise>(
    `/exercises?where[section][equals]=${sectionId}&where[isPublished][equals]=true&sort=order&limit=200`,
  );
  return res.docs;
}

/** Published exercises for a section slug (convenience wrapper). */
export async function getExercisesBySectionSlug(sectionSlug: string): Promise<CMSExercise[]> {
  const section = await getSectionBySlug(sectionSlug);
  if (!section) return [];
  return getExercises(section.id);
}

/** Count of flashcards per section (returns Map<sectionId, count>). */
export async function getFlashcardCounts(sectionIds: number[]): Promise<Map<number, number>> {
  const counts = new Map<number, number>();
  await Promise.all(
    sectionIds.map(async (id) => {
      const res = await fetchPayload<CMSFlashcard>(
        `/flashcards?where[section][equals]=${id}&where[isPublished][equals]=true&limit=0`,
      );
      counts.set(id, res.totalDocs);
    }),
  );
  return counts;
}
