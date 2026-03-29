'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarItemProps = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export function SidebarItem({ label, href, icon: Icon }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium transition-colors',
        isActive
          ? 'bg-[--sidebar-accent] text-[--sidebar-primary] font-semibold border-l-[3px] border-l-[--sidebar-primary] rounded-l-none pl-[calc(0.75rem-3px)]'
          : 'text-[--muted-foreground] hover:bg-[--muted] hover:text-[--foreground]',
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
