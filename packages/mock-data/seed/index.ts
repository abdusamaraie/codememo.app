/**
 * Barrel export for all seed data.
 *
 * Usage:
 *   import { languages, sections, flashcards, exercises } from '@repo/mock-data/seed';
 */
export { languages } from './languages';
export { sections, pythonSections, jsSections } from './sections';
export type { SectionSeed } from './sections';
export { pythonFlashcards } from './flashcards-python';
export type { FlashcardSeed } from './flashcards-python';
export { jsFlashcards } from './flashcards-javascript';
export { exercises, pythonExercises, jsExercises } from './exercises';
export type { ExerciseSeed } from './exercises';
