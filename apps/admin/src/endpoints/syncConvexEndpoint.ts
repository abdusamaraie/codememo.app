import type { PayloadHandler } from 'payload';
import { runFullSync } from '../services/syncService';

export const syncConvexHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));

      try {
        for await (const event of runFullSync(req.payload)) {
          send(event);
        }
      } catch (err) {
        send({ type: 'error', collection: 'unknown', message: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' },
  });
};
