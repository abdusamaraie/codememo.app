import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { getLanguages, getSections } from '@/lib/api/payload';
import { LearnPageStats } from './LearnPageStats';

export const metadata = { title: 'Learn — CodeMemo' };

export default async function LearnPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? 'there';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 18 ? 'Good afternoon' :
                'Good evening';

  const cmsLanguages = await getLanguages();

  const languages = await Promise.all(
    cmsLanguages.map(async (lang) => {
      const sections = await getSections(lang.id);
      return {
        name: lang.name,
        slug: lang.slug,
        color: lang.color,
        sections: sections.length,
        done: 0,
        cardsDue: 0,
      };
    }),
  );

  const inProgress = languages.filter((l) => l.done > 0);
  const notStarted = languages.filter((l) => l.done === 0);
  const totalDue   = languages.reduce((sum, l) => sum + l.cardsDue, 0);

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--foreground]">{greeting}, {firstName}! 👋</h1>
          <p className="text-sm text-[--muted-foreground] mt-1">
            {totalDue > 0 ? `You have ${totalDue} cards due for review today.` : 'All caught up! Great work.'}
          </p>
        </div>

        <LearnPageStats />

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
