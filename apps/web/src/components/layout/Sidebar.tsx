'use client';

import Link from 'next/link';
import { Keyboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Show, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { SidebarNav } from './SidebarNav';
import { useSidebar } from './SidebarContext';

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();

  return (
    <div
      className={`hidden lg:flex fixed top-0 left-0 h-full flex-col border-r border-[--border] bg-[--background] z-40 transition-[width] duration-300 overflow-hidden ${
        collapsed ? 'w-[72px]' : 'w-[256px]'
      }`}
    >
      {/* Logo */}
      <div className={`shrink-0 flex items-center border-b border-[--border] h-[64px] ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
        <Link href="/learn" className="flex items-center gap-2 min-w-0">
          <Keyboard className="h-6 w-6 text-[--primary] shrink-0" />
          {!collapsed && (
            <span className="text-lg font-bold text-[--primary] truncate">CodeMemo</span>
          )}
        </Link>
      </div>

      {/* Nav items */}
      <SidebarNav collapsed={collapsed} />

      {/* Collapse toggle button */}
      <div className={`px-3 py-2 shrink-0 ${collapsed ? 'flex justify-center' : 'flex justify-end'}`}>
        <Button
          onClick={toggle}
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-[--muted-foreground] hover:text-[--foreground]"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User section */}
      <div className={`border-t border-[--border] shrink-0 ${collapsed ? 'p-2' : 'p-4'}`}>
        <Show when="signed-in">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-3 py-2'}`}>
            <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
            {!collapsed && (
              <span className="text-sm font-medium text-[--foreground] truncate">My Account</span>
            )}
          </div>
        </Show>
        <Show when="signed-out">
              {collapsed ? (
                <SignInButton mode="modal">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-auto p-2"
                    title="Sign in"
                  >
                    <div className="h-8 w-8 rounded-full border-2 border-dashed border-[--border] flex items-center justify-center text-[--muted-foreground] text-xs font-bold">
                      ?
                    </div>
                  </Button>
                </SignInButton>
              ) : (
                <div className="flex flex-col gap-2">
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm" className="w-full">
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm" className="w-full">
                      Create account
                    </Button>
                  </SignUpButton>
                </div>
              )}
        </Show>
      </div>
    </div>
  );
}
