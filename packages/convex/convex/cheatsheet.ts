import { query } from './_generated/server';
import { v } from 'convex/values';

export const getByLanguage = query({
  args: { languageSlug: v.string() },
  handler: async (ctx, { languageSlug }) => {
    return ctx.db
      .query('cheatSheetEntries')
      .withIndex('by_language', (q) => q.eq('languageSlug', languageSlug))
      .collect();
  },
});
