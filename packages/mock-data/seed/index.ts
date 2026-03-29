/**
 * Barrel export for all seed data.
 *
 * Usage:
 *   import { languages, sections, flashcards, exercises } from '@repo/mock-data/seed';
 */
export { languages } from './languages.js';
export { sections, pythonSections, jsSections, jcrSections } from './sections.js';
export type { SectionSeed } from './sections.js';
export { pythonFlashcards } from './flashcards-python.js';
export type { FlashcardSeed } from './flashcards-python.js';
export { jsFlashcards } from './flashcards-javascript.js';
export { jcrFlashcards } from './flashcards-jcr-sql2.js';
export { exercises, pythonExercises, jsExercises } from './exercises.js';
export { jcrExercises } from './exercises-jcr-sql2.js';
export type { ExerciseSeed } from './exercises.js';
