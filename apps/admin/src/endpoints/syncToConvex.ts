/**
 * Syncs a Payload CMS document to Convex via HTTP action.
 * Used by afterChange hooks — errors are logged but never thrown so
 * a sync failure can never block an admin save.
 */

let warnedMissingUrl = false;

export async function syncToConvex(
  entityType: string,
  doc: unknown,
  operation: 'create' | 'update' | 'delete' = 'update',
): Promise<void> {
  const baseUrl = process.env.CONVEX_HTTP_URL;
  const secret = process.env.CONVEX_SYNC_SECRET;

  if (!baseUrl) {
    if (!warnedMissingUrl) {
      console.warn('[syncToConvex] CONVEX_HTTP_URL is not set — skipping sync');
      warnedMissingUrl = true;
    }
    return;
  }

  // Require a non-empty secret — never send an empty string that could match
  // an unset CONVEX_SYNC_SECRET on the Convex side
  if (!secret || secret.length < 16) {
    console.error('[syncToConvex] CONVEX_SYNC_SECRET is missing or too short — aborting sync');
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sync-secret': secret,
      },
      body: JSON.stringify({ collection: entityType, operation, data: doc }),
    });

    if (!response.ok) {
      console.error(
        `[syncToConvex] Sync failed: ${response.status} ${response.statusText} (collection=${entityType})`,
      );
    }
  } catch (error) {
    console.error('[syncToConvex] Network error during sync:', error);
  }
}
