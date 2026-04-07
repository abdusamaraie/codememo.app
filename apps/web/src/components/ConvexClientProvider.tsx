'use client';

import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs';
import { type ReactNode } from 'react';
import { useMigrateLocalProgress } from '@/hooks/useMigrateLocalProgress.hook';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error('NEXT_PUBLIC_CONVEX_URL is not set');
}

const convex = new ConvexReactClient(convexUrl);

function AppInitializer() {
  useMigrateLocalProgress();
  return null;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <AppInitializer />
      {children}
    </ConvexProviderWithClerk>
  );
}
