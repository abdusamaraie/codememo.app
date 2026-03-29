import Link from 'next/link';
import { BookOpen, Flame, Zap, Clock } from 'lucide-react';
import { FeedWrapper, RightSidebar } from '@/components/layout';

export const metadata = { title: 'Learn — CodeMemo' };

const LANGUAGES = [
  { name: 'Python',     slug: 'python',     color: '#3B82F6', sections: 14, done: 4,  cardsDue: 12 },
  { name: 'TypeScript', slug: 'typescript', color: '#7C6AF6', sections: 10, done: 1,  cardsDue: 28 },
  { name: 'JavaScript', slug: 'javascript', color: '#F59E0B', sections: 12, done: 0,  cardsDue: 0  },
  { name: 'Rust',       slug: 'rust',       color: '#F97316', sections: 8,  done: 0,  cardsDue: 0  },
  { name: 'Go',         slug: 'go',         color: '#06B6D4', sections: 8,  done: 0,  cardsDue: 0  },
  { name: 'SQL',        slug: 'sql',        color: '#10B981', sections: 6,  done: 0,  cardsDue: 0  },
];

export default function LearnPage() {
  const inProgress = LANGUAGES.filter((l) => l.done > 0);
  const notStarted = LANGUAGES.filter((l) => l.done === 0);
  const totalDue   = LANGUAGES.reduce((sum, l) => sum + l.cardsDue, 0);

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--foreground]">Good morning! 👋</h1>
          <p className="text-sm text-[--muted-foreground] mt-1">
            {totalDue > 0 ? `You have ${totalDue} cards due for review today.` : 'All caught up! Great work.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {([
            { Icon: Flame, value: '7',   label: 'Day streak',   color: 'text-orange-500' },
            { Icon: Zap,   value: '340', label: 'XP this week', color: 'text-yellow-400' },
            { Icon: Clock, value: '23',  label: 'Min today',    color: 'text-blue-400'   },
          ] as const).map(({ Icon, value, label, color }) => (
            <div key={label} className="bg-[--card] border border-[--border] rounded-xl p-3 flex items-center gap-3">
              <Icon className={`h-5 w-5 shrink-0 ${color}`} />
              <div>
                <div className="text-lg font-bold text-[--foreground] leading-none">{value}</div>
                <div className="text-xs text-[--muted-foreground] mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {inProgress.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider mb-3">Continue</h2>
            <div className="flex flex-col gap-3">
              {inProgress.map((lang) => {
                const pct = Math.round((lang.done / lang.sections) * 100);
                return (
                  <Link key={lang.slug} href={`/path/${lang.slug}`}
                    className="bg-[--card] border border-[--border] hover:border-[--primary] rounded-xl p-4 flex items-center gap-4 transition-colors">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                      style={{ backgroundColor: lang.color }}>{lang.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-[--foreground] text-sm">{lang.name}</span>
                        <span className="text-xs text-[--muted-foreground]">{lang.done}/{lang.sections} sections</span>
                      </div>
                      <div className="h-1.5 bg-[--secondary] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: lang.color }} />
                      </div>
                    </div>
                    {lang.cardsDue > 0 && (
                      <span className="shrink-0 text-xs font-semibold bg-[--primary] text-white px-2 py-0.5 rounded-full">{lang.cardsDue} due</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider mb-3">
            {inProgress.length > 0 ? 'Start a new language' : 'Choose a language'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {notStarted.map((lang) => (
              <Link key={lang.slug} href={`/path/${lang.slug}`}
                className="bg-[--card] border border-[--border] hover:border-[--primary] rounded-xl p-4 flex items-center gap-3 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: lang.color }}>{lang.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[--foreground] text-sm">{lang.name}</div>
                  <div className="text-xs text-[--muted-foreground]">{lang.sections} sections</div>
                </div>
                <BookOpen className="h-4 w-4 text-[--muted-foreground] shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
