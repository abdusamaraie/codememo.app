import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { requireAuth } from './auth';

export const getUserProgress = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query('sectionProgress')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .collect();
  },
});

export const getSectionProgress = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    const user = await requireAuth(ctx);
    return ctx.db
      .query('sectionProgress')
      .withIndex('by_user_section', (q) =>
        q.eq('userId', user._id).eq('sectionId', sectionId),
      )
      .first();
  },
});

/**
 * Returns per-language progress summary for the current user.
 * Used by the progress page, learn page, and path page.
 */
export const getProgressSummary = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    const userId = user._id;

    const sectionProgressList = await ctx.db
      .query('sectionProgress')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    if (sectionProgressList.length === 0) return [];

    // Resolve sections
    const sectionIds = [...new Set(sectionProgressList.map((sp) => sp.sectionId))] as Id<'sections'>[];
    const sections = await Promise.all(sectionIds.map((id) => ctx.db.get(id)));
    const sectionMap = new Map(sections.flatMap((s) => (s ? [[s._id as string, s]] : [])));

    // Resolve languages
    const languageIds = [...new Set(
      sections.flatMap((s) => (s ? [s.languageId as string] : [])),
    )] as Id<'languages'>[];
    const languages = await Promise.all(languageIds.map((id) => ctx.db.get(id)));
    const languageMap = new Map(languages.flatMap((l) => (l ? [[l._id as string, l]] : [])));

    // Total published sections per language
    const totalByLang = new Map<string, number>();
    for (const langId of languageIds) {
      const all = await ctx.db
        .query('sections')
        .withIndex('by_language', (q) => q.eq('languageId', langId))
        .collect();
      totalByLang.set(langId as string, all.filter((s) => s.isPublished).length);
    }

    // Aggregate
    const byLanguage = new Map<string, {
      languageId: string; slug: string; name: string; color: string;
      totalSections: number; completedSections: number;
      inProgressSections: number; cardsDue: number; cardsMastered: number;
    }>();

    for (const sp of sectionProgressList) {
      const section = sectionMap.get(sp.sectionId as string);
      if (!section) continue;
      const lang = languageMap.get(section.languageId as string);
      if (!lang) continue;

      const key = lang._id as string;
      if (!byLanguage.has(key)) {
        byLanguage.set(key, {
          languageId:         key,
          slug:               lang.slug,
          name:               lang.name,
          color:              lang.color,
          totalSections:      totalByLang.get(key) ?? 0,
          completedSections:  0,
          inProgressSections: 0,
          cardsDue:           0,
          cardsMastered:      0,
        });
      }
      const entry = byLanguage.get(key)!;
      if (sp.status === 'completed' || sp.status === 'mastered') {
        entry.completedSections++;
      } else if (sp.status === 'in_progress') {
        entry.inProgressSections++;
      }
      entry.cardsDue      += sp.cardsDue;
      entry.cardsMastered += sp.cardsMastered;
    }

    return [...byLanguage.values()];
  },
});

export const updateSectionProgress = mutation({
  args: {
    sectionId:     v.id('sections'),
    status:        v.optional(v.union(
      v.literal('locked'),
      v.literal('available'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('mastered'),
    )),
    cardsDue:      v.optional(v.number()),
    cardsNew:      v.optional(v.number()),
    cardsMastered: v.optional(v.number()),
  },
  handler: async (ctx, { sectionId, ...patch }) => {
    const user = await requireAuth(ctx);
    const userId = user._id;

    const existing = await ctx.db
      .query('sectionProgress')
      .withIndex('by_user_section', (q) =>
        q.eq('userId', userId).eq('sectionId', sectionId),
      )
      .first();

    const update = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined),
    );

    if (existing) {
      await ctx.db.patch(existing._id, { ...update, lastStudiedAt: Date.now() });
    } else {
      await ctx.db.insert('sectionProgress', {
        userId,
        sectionId,
        status:        'in_progress',
        cardsDue:      0,
        cardsNew:      0,
        cardsMastered: 0,
        lastStudiedAt: Date.now(),
        ...update,
      });
    }
  },
});
