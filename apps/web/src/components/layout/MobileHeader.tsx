'use client';

import Link from 'next/link';
import { Keyboard } from 'lucide-react';

export function MobileHeader() {
  return (
    <header className="flex lg:hidden fixed top-0 left-0 right-0 z-50 h-[50px] items-center justify-between px-4 bg-[--background] border-b border-[--border]">
      <Link href="/learn" className="flex items-center gap-2">
        <Keyboard className="h-5 w-5 text-[--primary]" />
        <span className="font-bold text-[--primary]">CodeMemo</span>
      </Link>

      <button
        className="h-8 w-8 rounded-full bg-[--primary] flex items-center justify-center text-white text-sm font-semibold shrink-0"
        aria-label="Account"
        data-testid="mobile-header-avatar"
      >
        U
      </button>
    </header>
  );
}
