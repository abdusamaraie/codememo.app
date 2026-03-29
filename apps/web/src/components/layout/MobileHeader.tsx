'use client';

import Link from 'next/link';
import { Keyboard } from 'lucide-react';
import { Show, UserButton, SignInButton } from '@clerk/nextjs';

export function MobileHeader() {
  return (
    <header className="flex lg:hidden fixed top-0 left-0 right-0 z-50 h-[50px] items-center justify-between px-4 bg-[--background] border-b border-[--border]">
      <Link href="/learn" className="flex items-center gap-2">
        <Keyboard className="h-5 w-5 text-[--primary]" />
        <span className="font-bold text-[--primary]">CodeMemo</span>
      </Link>

      <Show when="signed-in">
        <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
      </Show>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            className="h-8 px-3 rounded-lg bg-[--primary] text-white text-sm font-semibold"
            aria-label="Sign in"
          >
            Sign in
          </button>
        </SignInButton>
      </Show>
    </header>
  );
}
