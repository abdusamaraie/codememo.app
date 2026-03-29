'use client';

import { TrendingUp, BookOpen, Target, Flame } from 'lucide-react';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { useGamificationStats } from '@/hooks/useGamificationStats.hook';

function generateCalendarSkeleton() {
  const cells: { date: string; count: number }[] = [];
  const now = new Date();
  for (let i = 111; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    cells.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  return cells;
}

const calendarCells = generateCalendarSkeleton();
const HEATMAP_COLORS = ['bg-[--secondary]', 'bg-blue-900/60', 'bg-blue-700/70', 'bg-blue-500/80', 'bg-[--primary]'];

const LANGUAGE_PROGRESS = [
  { name: 'Python', color: '#3B82F6', done: 4, total: 14, accuracy: 78 },
  { name: 'TypeScript', color: '#7C6AF6', done: 1, total: 10, accuracy: 65 },
];

export function ProgressClientPage() {
  const { activityMap, streak, daily } = useGamificationStats();
  const daysStudied = Object.values(activityMap).filter((n) => n > 0).length;

  const stats = [
    { Icon: BookOpen, value: String(daily.reviews), label: 'Cards reviewed', color: 'text-blue-400' },
    { Icon: Target, value: `${Math.min(100, Math.round(daily.quiz > 0 ? 80 : 70))}%`, label: 'Accuracy', color: 'text-green-400' },
    { Icon: TrendingUp, value: String(daysStudied), label: 'Days studied', color: 'text-purple-400' },
    { Icon: Flame, value: String(streak.best), label: 'Best streak', color: 'text-orange-500' },
  ];

  const mergedActivity = calendarCells.map((cell) => ({
    ...cell,
    count: Math.min(activityMap[cell.date] ?? 0, 4),
  }));

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--foreground]">Progress</h1>
          <p className="text-sm text-[--muted-foreground] mt-1">Your learning journey so far</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map(({ Icon, value, label, color }) => (
            <div key={label} className="bg-[--card] border border-[--border] rounded-xl p-4 flex flex-col gap-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <div className="text-2xl font-bold text-[--foreground]">{value}</div>
              <div className="text-xs text-[--muted-foreground]">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-[--card] border border-[--border] rounded-xl p-4 mb-6">
          <h2 className="text-sm font-semibold text-[--foreground] mb-4">Study Activity</h2>
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
            {Array.from({ length: 16 }, (_, week) =>
              Array.from({ length: 7 }, (_, day) => {
                const cell = mergedActivity[week * 7 + day];
                const colorClass = HEATMAP_COLORS[Math.min(cell?.count ?? 0, 4)];
                return (
                  <div
                    key={`${week}-${day}`}
                    title={cell ? `${cell.date}: ${cell.count} actions` : ''}
                    className={`aspect-square rounded-sm ${colorClass}`}
                  />
                );
              }),
            )}
          </div>
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-xs text-[--muted-foreground]">Less</span>
            {HEATMAP_COLORS.map((c, i) => (
              <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
            ))}
            <span className="text-xs text-[--muted-foreground]">More</span>
          </div>
        </div>

        <div className="bg-[--card] border border-[--border] rounded-xl p-4">
          <h2 className="text-sm font-semibold text-[--foreground] mb-4">By Language</h2>
          <div className="flex flex-col gap-4">
            {LANGUAGE_PROGRESS.map((lang) => {
              const pct = Math.round((lang.done / lang.total) * 100);
              return (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                      <span className="text-sm font-medium text-[--foreground]">{lang.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[--muted-foreground]">
                      <span>{lang.done}/{lang.total} sections</span>
                      <span className="text-green-400">{lang.accuracy}% accuracy</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[--secondary] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: lang.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
