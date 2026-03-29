import Link from 'next/link';
import { Keyboard } from 'lucide-react';
import { Show, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
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

      {/* User section */}
      <div className="p-4 border-t border-[--border] shrink-0">
        <Show when="signed-in">
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8',
                },
              }}
            />
            <span className="text-sm font-medium text-[--foreground]">My Account</span>
          </div>
        </Show>
        <Show when="signed-out">
          <div className="flex flex-col gap-2">
            <SignInButton mode="modal">
              <button className="w-full px-3 py-2 rounded-lg border border-[--border] text-sm font-semibold text-[--foreground] hover:bg-[--muted] transition-colors">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full px-3 py-2 rounded-lg bg-[--primary] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                Create account
              </button>
            </SignUpButton>
          </div>
        </Show>
      </div>
    </div>
  );
}
