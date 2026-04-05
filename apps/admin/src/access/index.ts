import type { Access } from 'payload';

/** Allows access only to authenticated Payload CMS users. */
export const isAdmin: Access = ({ req }) => Boolean(req.user);
