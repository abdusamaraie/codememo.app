/**
 * Payload CMS seed script — CLI entry point.
 *
 * Usage:
 *   cd apps/admin
 *   npm run seed
 *
 * Requires DATABASE_URL and PAYLOAD_SECRET in .env.local.
 * All seed logic lives in src/services/seedService.ts.
 */
import { getPayload } from 'payload';
import config from './payload.config';
import { ALL_COLLECTIONS, runSeed } from './services/seedService';

async function main() {
  const payload = await getPayload({ config });

  for await (const event of runSeed({ mode: 'mock', collections: ALL_COLLECTIONS, payload })) {
    const prefix =
      event.type === 'summary' ? '✅' :
      event.type === 'error'   ? '❌' :
      event.type === 'skip'    ? '  ✓' :
      event.type === 'progress'? '  +' :
      '  •';
    console.log(`${prefix} ${event.message}`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
