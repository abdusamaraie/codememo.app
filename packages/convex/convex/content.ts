import { query } from './_generated/server';
import { v } from 'convex/values';

export const listLanguages = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query('languages')
      .withIndex('by_order')
      .filter((q) => q.eq(q.field('isPublished'), true))
      .collect();
  },
});

export const getLanguage = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query('languages')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .first();
  },
});

export const listSections = query({
  args: { languageId: v.id('languages') },
  handler: async (ctx, { languageId }) => {
    return ctx.db
      .query('sections')
      .withIndex('by_language_order', (q) => q.eq('languageId', languageId))
      .filter((q) => q.eq(q.field('isPublished'), true))
      .collect();
  },
});

export const getSection = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    return ctx.db.get(sectionId);
  },
});

export const getFlashcards = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    return ctx.db
      .query('flashcards')
      .withIndex('by_section_order', (q) => q.eq('sectionId', sectionId))
      .collect();
  },
});

export const getExercises = query({
  args: { sectionId: v.id('sections') },
  handler: async (ctx, { sectionId }) => {
    return ctx.db
      .query('exercises')
      .withIndex('by_section', (q) => q.eq('sectionId', sectionId))
      .collect();
  },
});
