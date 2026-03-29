'use client';

import { Progress } from '@/components/ui/progress';
import { useGamificationStats } from '@/hooks/useGamificationStats.hook';

export function DailyGoal() {
  const { daily } = useGamificationStats();
  const goals = { reviews: 20, practice: 3, quiz: 1 };
  const reviewPct = Math.min(100, Math.round((daily.reviews / goals.reviews) * 100));
  const practicePct = Math.min(100, Math.round((daily.practice / goals.practice) * 100));
  const quizPct = Math.min(100, Math.round((daily.quiz / goals.quiz) * 100));

  return (
    <div className="bg-[--card] border border-[--border] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-[--foreground]">Daily Goal</span>
        <span className="text-xs text-[--muted-foreground]">{daily.reviews}/{goals.reviews} reviews</span>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-[10px] text-[--muted-foreground] mb-1">
            <span>Flashcards</span>
            <span>{daily.reviews}/{goals.reviews}</span>
          </div>
          <Progress value={reviewPct} className="h-2" />
        </div>
        <div>
          <div className="flex items-center justify-between text-[10px] text-[--muted-foreground] mb-1">
            <span>Practice</span>
            <span>{daily.practice}/{goals.practice}</span>
          </div>
          <Progress value={practicePct} className="h-2" />
        </div>
        <div>
          <div className="flex items-center justify-between text-[10px] text-[--muted-foreground] mb-1">
            <span>Quiz</span>
            <span>{daily.quiz}/{goals.quiz}</span>
          </div>
          <Progress value={quizPct} className="h-2" />
        </div>
      </div>
    </div>
  );
}
