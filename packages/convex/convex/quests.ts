import { query } from './_generated/server';
import type { Doc } from './_generated/dataModel';
import { getAuthedUser } from './auth';

// ── Quest shape (mirrors @repo/data Quest type) ────────────────────────────
export type QuestResult = {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  total: number;
  completed: boolean;
  type: 'daily' | 'weekly';
};

// ── Quest definitions ──────────────────────────────────────────────────────
type QuestDef = Omit<QuestResult, 'progress' | 'completed'> & {
  getProgress: (streak: Doc<'streaks'> | null, completedSections: number) => number;
};

const QUEST_DEFINITIONS: QuestDef[] = [
  // Daily
  {
    id: 'first_review', type: 'daily',
    title: 'First Review', description: 'Review at least 1 flashcard',
    xp: 10, total: 1,
    getProgress: (s) => Math.min(s?.cardsCompletedToday ?? 0, 1),
  },
  {
    id: 'study_session', type: 'daily',
    title: 'Study Session', description: 'Review 20 flashcards today',
    xp: 25, total: 20,
    getProgress: (s) => s?.cardsCompletedToday ?? 0,
  },
  {
    id: 'perfect_recall', type: 'daily',
    title: 'Perfect Recall', description: 'Nail 5 cards in a row',
    xp: 30, total: 5,
    getProgress: (s) => s?.perfectRecallsToday ?? 0,
  },
  {
    id: 'keep_streak', type: 'daily',
    title: 'Keep the Streak', description: 'Study on 2 consecutive days',
    xp: 20, total: 2,
    getProgress: (s) => Math.min(s?.currentStreak ?? 0, 2),
  },
  // Weekly
  {
    id: 'dedicated_learner', type: 'weekly',
    title: 'Dedicated Learner', description: 'Study 5 days this week',
    xp: 100, total: 5,
    getProgress: (s) => Math.min(s?.studyDaysThisWeek ?? 0, 5),
  },
  {
    id: 'section_master', type: 'weekly',
    title: 'Section Master', description: 'Complete an entire section',
    xp: 150, total: 1,
    getProgress: (_s, completedSections) => Math.min(completedSections, 1),
  },
  {
    id: 'century_club', type: 'weekly',
    title: 'Century Club', description: 'Review 100 cards in a week',
    xp: 200, total: 100,
    getProgress: (s) => Math.min(s?.weeklyCardsCompleted ?? 0, 100),
  },
];

function buildQuests(
  streak: Doc<'streaks'> | null,
  completedSections: number,
): QuestResult[] {
  return QUEST_DEFINITIONS.map((def) => {
    const progress = Math.max(0, def.getProgress(streak, completedSections));
    return {
      id:          def.id,
      type:        def.type,
      title:       def.title,
      description: def.description,
      xp:          def.xp,
      total:       def.total,
      progress,
      completed:   progress >= def.total,
    };
  });
}

// ── Query ──────────────────────────────────────────────────────────────────

export const getUserQuests = query({
  args: {},
  handler: async (ctx): Promise<QuestResult[] | null> => {
    const user = await getAuthedUser(ctx);
    if (!user) return null;

    const streak = await ctx.db
      .query('streaks')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .first();

    // Count completed/mastered sections (bounded query — users rarely complete many)
    const sectionProgressRows = await ctx.db
      .query('sectionProgress')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .take(200);

    const completedSections = sectionProgressRows.filter(
      (s) => s.status === 'completed' || s.status === 'mastered',
    ).length;

    return buildQuests(streak, completedSections);
  },
});
