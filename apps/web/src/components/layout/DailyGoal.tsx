import { Progress } from '@/components/ui/progress';

export function DailyGoal() {
  return (
    <div className="bg-[--card] border border-[--border] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-[--foreground]">Daily Goal</span>
        <span className="text-xs text-[--muted-foreground]">12 / 20 XP</span>
      </div>
      <Progress value={60} className="h-2 mb-2" />
      <p className="text-xs text-[--muted-foreground]">Keep it up! 8 XP to go</p>
    </div>
  );
}
