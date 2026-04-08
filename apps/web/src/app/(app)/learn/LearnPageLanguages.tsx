'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@repo/convex';

export function LearnPageLanguages() {
  const { isSignedIn } = useAuth();

  const convexLanguages = useQuery(api.content.listLanguages);
  const progressSummary = useQuery(api.progress.getProgressSummary, isSignedIn ? {} : 'skip');

  // Wait for both to resolve to avoid a flash where all languages show as "not started"
  if (!convexLanguages || (isSignedIn && progressSummary === undefined)) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-[--card] border border-[--border] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const progressBySlug = new Map(
    (progressSummary ?? []).map((p) => [p.slug, p]),
  );

  // Deduplicate by slug in case CMS sync created duplicate entries
  const uniqueLanguages = [...new Map(convexLanguages.map((l) => [l.slug, l])).values()];

  const languages = uniqueLanguages.map((lang) => {
    const prog = progressBySlug.get(lang.slug);
    return {
      name:     lang.name,
      slug:     lang.slug,
      color:    lang.color,
      done:     prog?.completedSections ?? 0,
      cardsDue: prog?.cardsDue ?? 0,
      started:  !!prog,
    };
  });

  const inProgress = languages.filter((l) => l.started);
  const notStarted = languages.filter((l) => !l.started);
  const totalDue   = languages.reduce((sum, l) => sum + l.cardsDue, 0);

  return (
    <>
      {totalDue > 0 && (
        <p className="text-sm text-[--muted-foreground] mb-4">
          You have {totalDue} cards due for review today.
        </p>
      )}

      {inProgress.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-[--muted-foreground] uppercase tracking-wider mb-3">Continue</h2>
          <div className="flex flex-col gap-3">
            {inProgress.map((lang) => {
              const prog = progressBySlug.get(lang.slug);
              const total = prog?.totalSections ?? 1;
              const pct   = Math.round((lang.done / total) * 100);
              return (
                <Link key={lang.slug} href={`/path/${lang.slug}`}
                  className="bg-[--card] border border-[--border] hover:border-[--primary] rounded-xl p-4 flex items-center gap-4 transition-colors">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                    style={{ backgroundColor: lang.color }}>{lang.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-[--foreground] text-sm">{lang.name}</span>
                      <span className="text-xs text-[--muted-foreground]">{lang.done}/{total} sections</span>
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

      {notStarted.length > 0 && (
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
                </div>
                <BookOpen className="h-4 w-4 text-[--muted-foreground] shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
