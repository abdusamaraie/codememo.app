'use client';

import { useSidebar } from './SidebarContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <main className={`h-full pt-[50px] lg:pt-0 transition-[padding] duration-300 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-[256px]'}`}>
      <div className="mx-auto h-full max-w-[1056px]">{children}</div>
    </main>
  );
}
