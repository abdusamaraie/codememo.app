import { CheckCircle2, Circle, Flame, Star } from 'lucide-react';
import { mockQuests, type MockQuest } from '@repo/mock-data';
import { FeedWrapper, RightSidebar } from '@/components/layout';

export const metadata = { title: 'Quests — CodeMemo' };

function QuestCard({ quest }: { quest: MockQuest }) {
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
  const daily  = mockQuests.filter((q) => q.type === 'daily');
  const weekly = mockQuests.filter((q) => q.type === 'weekly');
  const totalXpEarned = mockQuests.filter((q) => q.done).reduce((s, q) => s + q.xp, 0);
  const totalXpAvailable = mockQuests.reduce((s, q) => s + q.xp, 0);

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
