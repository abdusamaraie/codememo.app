import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/ui', '@repo/theme', '@repo/tailwind-config'],
  serverExternalPackages: ['pg', 'pg-native', '@payloadcms/db-postgres'],
};

export default withPayload(nextConfig);
