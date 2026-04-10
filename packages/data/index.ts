/**
 * @repo/data
 *
 * Seed data, canonical types, and data services.
 * Services switch between mock and real API data based on appDataSource.
 */

// ── Seed data (used by admin for seeding Payload CMS) ──────────────────────
export { languages } from './seed/languages';
export { sections, pythonSections, jsSections, jcrSections } from './seed/sections';
export type { SectionSeed } from './seed/sections';
export { pythonFlashcards } from './seed/flashcards-python';
export type { FlashcardSeed } from './seed/flashcards-python';
export { jsFlashcards } from './seed/flashcards-javascript';
export { jcrFlashcards } from './seed/flashcards-jcr-sql2';
export { exercises, pythonExercises, jsExercises } from './seed/exercises';
export { jcrExercises } from './seed/exercises-jcr-sql2';
export type { ExerciseSeed } from './seed/exercises';
export { cheatSheetEntries } from './seed/cheatsheet-entries';
export type { CheatSheetEntrySeed } from './seed/cheatsheet-entries';

// ── Services (canonical types + mock|real switching) ───────────────────────
export { getQuests } from './service/quests';
export type { Quest } from './service/quests';

export { getLeaderboard } from './service/leaderboard';
export type { LeaderboardEntry } from './service/leaderboard';
