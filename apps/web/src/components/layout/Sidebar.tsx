import Link from 'next/link';
import { Keyboard } from 'lucide-react';
import { SidebarNav } from './SidebarNav';

export function Sidebar() {
  return (
    <div className="hidden lg:flex fixed top-0 left-0 h-full w-[256px] flex-col border-r border-[--border] bg-[--background] z-40">
      {/* Logo */}
      <div className="p-6 shrink-0">
        <Link href="/learn" className="flex items-center gap-2">
          <Keyboard className="h-6 w-6 text-[--primary]" />
          <span className="text-lg font-bold text-[--primary]">CodeMemo</span>
        </Link>
      </div>

      {/* Nav items */}
      <SidebarNav />

      {/* User button */}
      <div className="p-4 border-t border-[--border] shrink-0">
        <button
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[--muted] transition-colors"
          aria-label="Account"
        >
          <div className="h-8 w-8 rounded-full bg-[--primary] flex items-center justify-center text-white text-sm font-semibold shrink-0">
            U
          </div>
          <span className="text-sm font-medium text-[--foreground]">Account</span>
        </button>
      </div>
    </div>
  );
}
