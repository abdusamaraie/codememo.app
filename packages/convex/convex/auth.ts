import { mutation } from './_generated/server';
import type { MutationCtx, QueryCtx } from './_generated/server';
import { v } from 'convex/values';

// ── Auth helpers ──────────────────────────────────────────────────────────────

/**
 * For queries: returns the user or null (never throws).
 *
 * Looks up by `tokenIdentifier` (the canonical issuer-scoped stable key).
 * Falls back to `clerkId` (= identity.subject) for users created before
 * tokenIdentifier was stored.
 */
export async function getAuthedUser(ctx: MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const byToken = await ctx.db
    .query('users')
    .withIndex('by_token_identifier', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
    .first();
  if (byToken) return byToken;

  // Legacy fallback: users provisioned before tokenIdentifier was introduced
  return ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
    .first();
}

/**
 * For mutations and authenticated queries: throws if unauthenticated.
 *
 * Looks up by `tokenIdentifier` (the canonical issuer-scoped stable key).
 * Falls back to `clerkId` (= identity.subject) for users created before
 * tokenIdentifier was stored, and backfills the field so future lookups use
 * the fast path.
 *
 * Note: uses ctx.db — do NOT call from actions. Use a dedicated action helper
 * (e.g. the one in ai.ts) that routes through ctx.runQuery instead.
 */
export async function requireAuth(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthenticated');

  const byToken = await ctx.db
    .query('users')
    .withIndex('by_token_identifier', (q) => q.eq('tokenIdentifier', identity.tokenIdentifier))
    .first();
  if (byToken) return byToken;

  // Legacy fallback + backfill
  const byClerkId = await ctx.db
    .query('users')
    .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
    .first();
  if (!byClerkId) throw new Error('User not found — please sign in again');

  await ctx.db.patch(byClerkId._id, { tokenIdentifier: identity.tokenIdentifier });
  return byClerkId;
}

// ── Mutations ─────────────────────────────────────────────────────────────────

/** Create a new anonymous user (called on first app load) */
export const createAnonymousUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.db.insert('users', {
      authProvider:     'anonymous',
      themePreference:  'dark',
      accentPreference: 'purple',
      aiRequestsToday:  0,
      aiRequestsDate:   new Date().toISOString().slice(0, 10),
    });

    await ctx.db.insert('streaks', {
      userId,
      currentStreak:          0,
      longestStreak:          0,
      lastActiveDate:         new Date().toISOString().slice(0, 10),
      todayCompleted:         false,
      freezesAvailable:       1,
      freezesUsed:            0,
      cardsTarget:            20,
      perfectRecallsTarget:   5,
      minutesTarget:          10,
      cardsCompletedToday:    0,
      perfectRecallsToday:    0,
      minutesStudiedToday:    0,
    });

    return userId;
  },
});

/** Upgrade anonymous user to email auth — requires Clerk session */
export const upgradeToEmail = mutation({
  args: {
    email:       v.string(),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, { email, displayName }) => {
    const user = await requireAuth(ctx);

    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', email))
      .first();

    if (existing && existing._id !== user._id) throw new Error('Email already in use');

    await ctx.db.patch(user._id, {
      authProvider: 'email',
      email,
      displayName,
    });
  },
});

/** Upgrade anonymous user to GitHub auth — requires Clerk session */
export const upgradeToGitHub = mutation({
  args: {
    githubId:    v.string(),
    email:       v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl:   v.optional(v.string()),
  },
  handler: async (ctx, { githubId, email, displayName, avatarUrl }) => {
    const user = await requireAuth(ctx);

    const existing = await ctx.db
      .query('users')
      .withIndex('by_github_id', (q) => q.eq('githubId', githubId))
      .first();

    if (existing && existing._id !== user._id) throw new Error('GitHub account already linked');

    await ctx.db.patch(user._id, {
      authProvider: 'github',
      githubId,
      email,
      displayName,
      avatarUrl,
    });
  },
});
