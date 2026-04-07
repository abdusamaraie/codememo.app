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
      action?:   'create' | 'update' | 'delete';
      clerkId:   string;
      email?:    string;
      name?:     string;
      avatarUrl?: string;
    };

    if (body.action === 'create') {
      await ctx.runMutation(internal.users.createFromWebhook, {
        clerkId:   body.clerkId,
        email:     body.email ?? '',
        name:      body.name ?? '',
        avatarUrl: body.avatarUrl ?? '',
      });
    } else if (body.action === 'update') {
      await ctx.runMutation(internal.users.updateFromWebhook, {
        clerkId:   body.clerkId,
        email:     body.email ?? '',
        name:      body.name ?? '',
        avatarUrl: body.avatarUrl ?? '',
      });
    } else if (body.action === 'delete') {
      await ctx.runMutation(internal.users.deleteFromWebhook, { clerkId: body.clerkId });
    } else {
      return new Response(`Unknown action: ${body.action}`, { status: 400 });
    }
    return new Response('OK', { status: 200 });
  }),
});

export default http;
