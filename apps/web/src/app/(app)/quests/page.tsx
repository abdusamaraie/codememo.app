import { CheckCircle2, Circle, Flame, Star } from 'lucide-react';
import { FeedWrapper, RightSidebar } from '@/components/layout';

export const metadata = { title: 'Quests — CodeMemo' };

type Quest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  progress: number;
  total: number;
  done: boolean;
  type: 'daily' | 'weekly';
};

const QUESTS: Quest[] = [
  // Daily
  { id: 'q1', type: 'daily', title: 'First Review',      description: 'Review at least 1 flashcard',              xp: 10,  progress: 12, total: 1,  done: true  },
  { id: 'q2', type: 'daily', title: 'Study Session',      description: 'Review 20 flashcards today',              xp: 25,  progress: 12, total: 20, done: false },
  { id: 'q3', type: 'daily', title: 'Perfect Recall',     description: 'Nail 5 cards in a row',                   xp: 30,  progress: 3,  total: 5,  done: false },
  { id: 'q4', type: 'daily', title: 'Keep the Streak',    description: 'Study on 2 consecutive days',             xp: 20,  progress: 2,  total: 2,  done: true  },
  // Weekly
  { id: 'q5', type: 'weekly', title: 'Dedicated Learner', description: 'Study 5 days this week',                  xp: 100, progress: 3,  total: 5,  done: false },
  { id: 'q6', type: 'weekly', title: 'Section Master',    description: 'Complete an entire section',              xp: 150, progress: 0,  total: 1,  done: false },
  { id: 'q7', type: 'weekly', title: 'Century Club',      description: 'Review 100 cards in a week',              xp: 200, progress: 42, total: 100,done: false },
  { id: 'q8', type: 'weekly', title: 'Accuracy King',     description: 'Achieve 80% accuracy across 30 reviews',  xp: 120, progress: 30, total: 30, done: true  },
];

const daily  = QUESTS.filter((q) => q.type === 'daily');
const weekly = QUESTS.filter((q) => q.type === 'weekly');
const totalXpEarned = QUESTS.filter((q) => q.done).reduce((s, q) => s + q.xp, 0);
const totalXpAvailable = QUESTS.reduce((s, q) => s + q.xp, 0);

function QuestCard({ quest }: { quest: Quest }) {
  const pct = Math.min(100, Math.round((quest.progress / quest.total) * 100));
  return (
    <div className={`bg-[--card] border rounded-xl p-4 flex items-center gap-4 ${quest.done ? 'border-green-800/40 opacity-70' : 'border-[--border]'}`}>
      <div className="shrink-0">
        {quest.done
          ? <CheckCircle2 className="h-6 w-6 text-green-500" />
          : <Circle className="h-6 w-6 text-[--muted-foreground]" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-semibold text-[--foreground]">{quest.title}</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-yellow-400 shrink-0 ml-2">
            <Star className="h-3 w-3" />{quest.xp} XP
          </span>
        </div>
        <p className="text-xs text-[--muted-foreground] mb-2">{quest.description}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-[--secondary] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${quest.done ? 'bg-green-500' : 'bg-[--primary]'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-[--muted-foreground] shrink-0">{quest.progress}/{quest.total}</span>
        </div>
      </div>
    </div>
  );
}

export default function QuestsPage() {
  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--foreground]">Quests</h1>
          <p className="text-sm text-[--muted-foreground] mt-1">
            Complete quests to earn XP · {totalXpEarned} / {totalXpAvailable} XP earned today
          </p>
        </div>

        {/* XP banner */}
        <div className="bg-gradient-to-r from-[--primary]/20 to-[--secondary] border border-[--border] rounded-xl p-4 flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[--primary]/20 flex items-center justify-center shrink-0">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[--foreground] mb-1">Daily XP Progress</div>
            <div className="h-2 bg-[--secondary] rounded-full overflow-hidden">
              <div className="h-full bg-[--primary] rounded-full" style={{ width: `${Math.round((totalXpEarned / totalXpAvailable) * 100)}%` }} />
            </div>
          </div>
          <div className="text-lg font-bold text-[--primary] shrink-0">{totalXpEarned} XP</div>
        </div>

        <section className="mb-6">
          <h2 className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider mb-3">Daily Quests</h2>
          <div className="flex flex-col gap-2">
            {daily.map((q) => <QuestCard key={q.id} quest={q} />)}
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider mb-3">Weekly Challenge</h2>
          <div className="flex flex-col gap-2">
            {weekly.map((q) => <QuestCard key={q.id} quest={q} />)}
          </div>
        </section>
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
