/**
 * Barrel export for all seed data.
 *
 * Usage:
 *   import { languages, sections, flashcards, exercises } from '@repo/mock-data/seed';
 */
export { languages } from './languages';
export { sections, pythonSections, jsSections, jcrSections } from './sections';
export type { SectionSeed } from './sections';
export { pythonFlashcards } from './flashcards-python';
export type { FlashcardSeed } from './flashcards-python';
export { jsFlashcards } from './flashcards-javascript';
export { jcrFlashcards } from './flashcards-jcr-sql2';
export { exercises, pythonExercises, jsExercises } from './exercises';
export { jcrExercises } from './exercises-jcr-sql2';
export type { ExerciseSeed } from './exercises';
export { cheatSheetEntries } from './cheatsheet-entries';
export type { CheatSheetEntrySeed } from './cheatsheet-entries';
