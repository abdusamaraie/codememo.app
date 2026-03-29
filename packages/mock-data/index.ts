/**
 * @repo/mock-data
 *
 * Seed data, mock data, and fixture factories for development and testing.
 */

export { languages } from './seed/languages.js';
export { sections, pythonSections, jsSections, jcrSections } from './seed/sections.js';
export type { SectionSeed } from './seed/sections.js';
export { pythonFlashcards } from './seed/flashcards-python.js';
export type { FlashcardSeed } from './seed/flashcards-python.js';
export { jsFlashcards } from './seed/flashcards-javascript.js';
export { jcrFlashcards } from './seed/flashcards-jcr-sql2.js';
export { exercises, pythonExercises, jsExercises } from './seed/exercises.js';
export { jcrExercises } from './seed/exercises-jcr-sql2.js';
export type { ExerciseSeed } from './seed/exercises.js';
export { cheatSheetEntries } from './seed/cheatsheet-entries.js';
export type { CheatSheetEntrySeed } from './seed/cheatsheet-entries.js';
