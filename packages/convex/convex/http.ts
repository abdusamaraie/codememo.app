import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { syncFromPayload } from './sync';

const http = httpRouter();

http.route({
  path:    '/sync',
  method:  'POST',
  handler: syncFromPayload,
});

http.route({
  path:   '/webhooks/clerk',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const secret = request.headers.get('x-webhook-secret');
    if (!process.env.CONVEX_SYNC_SECRET || secret !== process.env.CONVEX_SYNC_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json() as {
      clerkId:   string;
      email:     string;
      name:      string;
      avatarUrl: string;
    };

    await ctx.runMutation(internal.users.createFromWebhook, body);
    return new Response('OK', { status: 200 });
  }),
});

export default http;
