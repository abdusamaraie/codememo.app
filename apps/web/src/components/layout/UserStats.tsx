'use client';

import { Flame, Zap, Heart } from 'lucide-react';
import { useGamificationStats } from '@/hooks/useGamificationStats.hook';

export function UserStats() {
  const { daily, streak } = useGamificationStats();

  return (
    <div className="bg-[--card] border border-[--border] rounded-xl p-4">
      <div className="flex items-center justify-around">
        {/* Streak */}
        <div className="flex flex-col items-center gap-1">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-2xl font-bold text-[--foreground]">{streak.current}</span>
          <span className="text-xs text-[--muted-foreground]">day streak</span>
        </div>

        {/* XP */}
        <div className="flex flex-col items-center gap-1">
          <Zap className="h-5 w-5 text-yellow-400" />
          <span className="text-2xl font-bold text-[--foreground]">{daily.reviews * 10 + daily.practice * 20 + daily.quiz * 50}</span>
          <span className="text-xs text-[--muted-foreground]">today</span>
        </div>

        {/* Lives */}
        <div className="flex flex-col items-center gap-1">
          <Heart className="h-5 w-5 text-rose-500" />
          <span className="text-2xl font-bold text-[--foreground]">{streak.freezes}</span>
          <span className="text-xs text-[--muted-foreground]">freeze</span>
        </div>
      </div>
    </div>
  );
}
