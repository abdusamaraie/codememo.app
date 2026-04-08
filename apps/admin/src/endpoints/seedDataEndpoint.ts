import type { PayloadHandler } from 'payload';
import { ALL_COLLECTIONS, runSeed } from '../services/seedService';
import type { SeedCollection, SeedMode } from '../services/seedService';

export const seedDataHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let mode: SeedMode = 'mock';
  let collections: SeedCollection[] = ALL_COLLECTIONS;

  try {
    const body = await (req as unknown as Request).json();
    if (body.mode === 'production') mode = 'production';
    if (Array.isArray(body.collections) && body.collections.length > 0) {
      collections = body.collections as SeedCollection[];
    }
  } catch {
    // No body or invalid JSON — use defaults
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));

      try {
        for await (const event of runSeed({ mode, collections, payload: req.payload })) {
          send(event);
        }
      } catch (err) {
        send({ type: 'error', message: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
};
