import Link from 'next/link';
import {
  type LucideIcon,
  Keyboard,
  BookOpen,
  Code2,
  BarChart2,
  Trophy,
  Flame,
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Learn', href: '/learn', icon: BookOpen },
  { label: 'Languages', href: '/languages', icon: Code2 },
  { label: 'Progress', href: '/progress', icon: BarChart2 },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { label: 'Quests', href: '/quests', icon: Flame },
];

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
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.href} {...item} />
        ))}
      </nav>

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
