import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const securityHeaders = [
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'X-Frame-Options',           value: 'DENY' },
  { key: 'X-XSS-Protection',          value: '1; mode=block' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // React (Turbopack) needs 'unsafe-eval' in development for call-stack reconstruction
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://clerk.com https://*.clerk.accounts.dev https://clerk.codememo.app https://challenges.cloudflare.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://clerk.codememo.app",
      "font-src 'self' https://fonts.gstatic.com https://clerk.codememo.app",
      "img-src 'self' data: blob: https://img.clerk.com https://*.convex.cloud",
      "connect-src 'self' https://*.convex.cloud https://*.convex.site wss://*.convex.cloud https://api.clerk.com https://*.clerk.accounts.dev https://clerk.codememo.app https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com https://clerk.codememo.app https://*.clerk.accounts.dev",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui', '@repo/theme', '@repo/tailwind-config'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
