/**
 * @repo/convex
 *
 * Convex backend functions, schema, and client helpers.
 * Import from this package to use Convex in web and mobile apps.
 *
 * Note: The `convex/_generated/` directory is created by `npx convex dev`.
 * Run that before first use.
 */

// Re-export the generated API reference for type-safe queries/mutations
export type { Id } from 'convex/values';
export { ConvexProvider, useQuery, useMutation, useAction } from 'convex/react';
