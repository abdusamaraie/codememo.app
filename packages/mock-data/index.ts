/**
 * @repo/mock-data
 *
 * Seed data, mock data, and fixture factories for development and testing.
 */

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
export { mockLeaderboard } from './seed/leaderboard';
export type { LeaderboardUser } from './seed/leaderboard';
export { mockQuests } from './seed/quests';
export type { MockQuest } from './seed/quests';
