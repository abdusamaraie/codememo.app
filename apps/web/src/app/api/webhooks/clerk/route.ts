import { headers } from 'next/headers';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Missing CLERK_WEBHOOK_SECRET', { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const email = email_addresses[0]?.email_address ?? '';
    const name = [first_name, last_name].filter(Boolean).join(' ') || email;

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      // Fire-and-forget: provision user in Convex (never block the response)
      fetch(`${convexUrl.replace('.cloud', '.cloud')}/api/mutation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'users:createFromClerk',
          args: { clerkId: id, email, name, avatarUrl: image_url ?? '' },
        }),
      }).catch((err) => console.error('[clerk-webhook] Convex sync failed:', err));
    }
  }

  return new Response('OK', { status: 200 });
}
