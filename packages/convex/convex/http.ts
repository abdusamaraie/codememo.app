import { httpRouter } from 'convex/server';
import { syncFromPayload } from './sync';

const http = httpRouter();

http.route({
  path:    '/sync',
  method:  'POST',
  handler: syncFromPayload,
});

export default http;
