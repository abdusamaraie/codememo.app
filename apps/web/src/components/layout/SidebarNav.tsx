'use client';

import { BookOpen, Code2, BarChart2, Trophy, Flame, Settings } from 'lucide-react';
import { SidebarItem } from './SidebarItem';

const NAV_ITEMS = [
  { label: 'Learn',        href: '/learn',        icon: BookOpen  },
  { label: 'Languages',    href: '/languages',    icon: Code2     },
  { label: 'Progress',     href: '/progress',     icon: BarChart2 },
  { label: 'Leaderboard',  href: '/leaderboard',  icon: Trophy    },
  { label: 'Quests',       href: '/quests',       icon: Flame     },
  { label: 'Settings',     href: '/settings',     icon: Settings  },
];

export function SidebarNav({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <nav className={`flex-1 py-2 flex flex-col gap-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'}`}>
      {NAV_ITEMS.map((item) => (
        <SidebarItem key={item.href} collapsed={collapsed} {...item} />
      ))}
    </nav>
  );
}
