'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  type LucideIcon,
  BookOpen,
  Code2,
  BarChart2,
  Trophy,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavTab = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_TABS: NavTab[] = [
  { label: 'Learn',       href: '/learn',       icon: BookOpen  },
  { label: 'Languages',   href: '/languages',   icon: Code2     },
  { label: 'Progress',    href: '/progress',    icon: BarChart2 },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy    },
  { label: 'Settings',    href: '/settings',    icon: Settings  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[--background] border-t border-[--border]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-[60px] w-full items-center justify-around">
        {NAV_TABS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 text-[10px] px-2',
                isActive
                  ? 'text-[--sidebar-primary]'
                  : 'text-[--muted-foreground]',
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
