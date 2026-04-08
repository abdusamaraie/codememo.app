/**
 * Sync service — re-pushes all existing PayloadCMS records to Convex.
 *
 * Used by the "Force Sync to Convex" action to recover from silent
 * hook failures or out-of-sync states.
 */
import type { BasePayload, CollectionSlug } from 'payload';
import { syncToConvex } from '../endpoints';

export interface SyncEvent {
  type: 'progress' | 'summary' | 'error';
  collection: string;
  message: string;
  synced?: number;
}

const SYNC_COLLECTIONS: CollectionSlug[] = [
  'languages',
  'sections',
  'flashcards',
  'exercises',
  'cheatSheetEntries',
];

export async function* runFullSync(payload: BasePayload): AsyncGenerator<SyncEvent> {
  for (const slug of SYNC_COLLECTIONS) {
    let page = 1;
    let total = 0;

    try {
      while (true) {
        const result = await payload.find({
          collection: slug,
          page,
          limit: 100,
          pagination: true,
        });

        for (const doc of result.docs) {
          await syncToConvex(slug, doc as unknown as Record<string, unknown>, 'update');
          total++;
        }

        if (result.docs.length > 0) {
          yield { type: 'progress', collection: slug, message: `Synced ${total} ${slug}…` };
        }

        if (!result.hasNextPage) break;
        page++;
      }

      yield {
        type: 'summary',
        collection: slug,
        message: `${slug} done — ${total} records synced`,
        synced: total,
      };
    } catch (err) {
      yield {
        type: 'error',
        collection: slug,
        message: `Failed syncing ${slug}: ${String(err)}`,
      };
    }
  }
}
