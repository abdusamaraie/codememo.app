'use client';

import { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[root-error]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <div className="text-5xl">⚠️</div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
      </div>
      <button
        onClick={reset}
        className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
