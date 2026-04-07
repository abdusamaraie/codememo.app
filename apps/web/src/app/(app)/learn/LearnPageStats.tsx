'use client';

import { Flame, Zap, Clock } from 'lucide-react';
import { useGamificationStats } from '@/hooks/useGamificationStats.hook';
import { calculateDailyXP } from '@/lib/gamification';

export function LearnPageStats() {
  const { streak, daily } = useGamificationStats();

  const xpToday = calculateDailyXP(daily);

  const stats = [
    { Icon: Flame, value: String(streak.current), label: 'Day streak',   color: 'text-orange-500' },
    { Icon: Zap,   value: String(xpToday),         label: 'XP today',     color: 'text-yellow-400' },
    { Icon: Clock, value: String(daily.reviews),   label: 'Cards today',  color: 'text-blue-400'   },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map(({ Icon, value, label, color }) => (
        <div key={label} className="bg-[--card] border border-[--primary]/40 rounded-xl p-3 flex items-center gap-3">
          <Icon className={`h-7 w-7 shrink-0 ${color}`} />
          <div>
            <div className="text-lg font-bold text-[--foreground] leading-none">{value}</div>
            <div className="text-xs text-[--muted-foreground] mt-0.5">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
