import type { PayloadHandler } from 'payload';

export const seedUserDataHandler: PayloadHandler = async (req) => {
  if (!req.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = process.env.CONVEX_HTTP_URL;
  const secret = process.env.CONVEX_SYNC_SECRET;

  if (!baseUrl || !secret) {
    return Response.json({ error: 'Convex not configured (CONVEX_HTTP_URL / CONVEX_SYNC_SECRET missing)' }, { status: 503 });
  }

  let clerkUserId: string;
  try {
    const body = await (req as unknown as Request).json() as { clerkUserId?: string };
    clerkUserId = body.clerkUserId ?? '';
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!clerkUserId.trim()) {
    return Response.json({ error: 'clerkUserId is required' }, { status: 400 });
  }

  const res = await fetch(`${baseUrl}/seed-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-sync-secret': secret,
    },
    body: JSON.stringify({ clerkUserId: clerkUserId.trim() }),
  });

  if (!res.ok) {
    const text = await res.text();
    return Response.json({ error: text }, { status: res.status });
  }

  return Response.json({ ok: true });
};
