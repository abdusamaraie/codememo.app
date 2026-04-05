'use client';

import { useState, useSyncExternalStore } from 'react';
import { Lock, X } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STORAGE_KEY = 'codememo-nudge-dismissed';
const REVIEW_COUNT_KEY = 'codememo-anon-reviews';
const NUDGE_THRESHOLD = 5;

function readNudgeVisible() {
  const dismissed = localStorage.getItem(STORAGE_KEY);
  if (dismissed) return false;
  const count = parseInt(localStorage.getItem(REVIEW_COUNT_KEY) ?? '0', 10);
  return count >= NUDGE_THRESHOLD;
}

export function SaveProgressNudge() {
  // useSyncExternalStore gives false on the server (getServerSnapshot)
  // and reads localStorage on the client — no hydration mismatch, no setState-in-effect.
  const shouldShow = useSyncExternalStore(
    () => () => {},
    readNudgeVisible,
    () => false,
  );
  const [dismissed, setDismissed] = useState(false);

  if (!shouldShow || dismissed) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  }

  return (
    <Card className="relative">
      <CardContent className="p-4">
      <button
        onClick={dismiss}
        className="absolute top-2 right-2 p-1 rounded hover:bg-[--muted] transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5 text-[--muted-foreground]" />
      </button>

      <div className="flex flex-col items-center text-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[--primary]/15 flex items-center justify-center">
          <Lock className="h-5 w-5 text-[--primary]" />
        </div>
        <div>
          <p className="font-semibold text-sm text-[--foreground]">Save your progress</p>
          <p className="text-xs text-[--muted-foreground] mt-1">
            Create a free account to keep your streak and XP across sessions.
          </p>
        </div>
        <SignUpButton mode="modal">
          <Button className="w-full" size="sm">
            Create free account
          </Button>
        </SignUpButton>
      </div>
      </CardContent>
    </Card>
  );
}

/** Call this from the study session to increment anonymous review count. */
export function incrementAnonReviewCount() {
  if (typeof window === 'undefined') return;
  const count = parseInt(localStorage.getItem(REVIEW_COUNT_KEY) ?? '0', 10);
  localStorage.setItem(REVIEW_COUNT_KEY, String(count + 1));
}
