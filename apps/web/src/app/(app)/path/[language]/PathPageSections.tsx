'use client';

import Link from 'next/link';
import { Lock, CheckCircle2, PlayCircle, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@repo/convex';

type SectionStatus = 'locked' | 'available' | 'in-progress' | 'completed';

type CmsSection = {
  order: number;
  slug: string;
  title: string;
  cardCount: number;
};

type Props = {
  languageSlug: string;
  languageColor: string;
  sections: CmsSection[];
};

const STATUS_CONFIG = {
  locked:        { icon: Lock,         bg: 'bg-[--secondary]',   text: 'text-[--muted-foreground]', label: 'Locked'   },
  available:     { icon: BookOpen,     bg: 'bg-[--primary]/10',  text: 'text-[--primary]',          label: 'Start'    },
  'in-progress': { icon: PlayCircle,   bg: 'bg-blue-500/10',     text: 'text-blue-400',             label: 'Continue' },
  completed:     { icon: CheckCircle2, bg: 'bg-green-500/10',    text: 'text-green-400',             label: 'Review'   },
};

export function PathPageSections({ languageSlug, languageColor, sections }: Props) {
  const { isSignedIn } = useAuth();

  // Get language from Convex to resolve its ID for section progress lookup
  const convexLanguage = useQuery(api.content.getLanguage, { slug: languageSlug });
  const convexSections = useQuery(
    api.content.listSections,
    convexLanguage ? { languageId: convexLanguage._id } : 'skip',
  );
  const userProgress = useQuery(api.progress.getUserProgress, isSignedIn ? {} : 'skip');

  // Build a map: convex sectionId → progress record
  const progressBySectionId = new Map(
    (userProgress ?? []).map((p) => [p.sectionId as string, p]),
  );

  // Build a map: section slug → convex sectionId
  const convexIdBySlug = new Map(
    (convexSections ?? []).map((s) => [s.slug, s._id as string]),
  );

  const enrichedSections = sections.map((section) => {
    const convexId = convexIdBySlug.get(section.slug);
    const progress = convexId ? progressBySectionId.get(convexId) : undefined;

    let status = 'available' as SectionStatus;
    let masteryPct = 0;

    if (progress) {
      if (progress.status === 'completed' || progress.status === 'mastered') {
        status = 'completed';
        const totalCards = section.cardCount || 1;
        masteryPct = Math.round((progress.cardsMastered / totalCards) * 100);
      } else if (progress.status === 'in_progress') {
        status = 'in-progress';
      }
    }

    return { ...section, status, masteryPct };
  });

  const completedCount = enrichedSections.filter((s) => s.status === 'completed').length;
  const overallPct = sections.length > 0 ? Math.round((completedCount / sections.length) * 100) : 0;

  return (
    <>
      {/* Language header progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 bg-[--secondary] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${overallPct}%`, backgroundColor: languageColor }} />
        </div>
        <span className="text-xs text-[--muted-foreground] shrink-0">{completedCount}/{sections.length} sections</span>
      </div>

      {/* Section path */}
      <div className="relative flex flex-col gap-0">
        {enrichedSections.map((section, idx) => {
          const cfg = STATUS_CONFIG[section.status];
          const Icon = cfg.icon;
          const isClickable = section.status !== 'locked';
          const studyHref    = isClickable ? `/study/${languageSlug}/${section.slug}` : undefined;
          const practiceHref = isClickable ? `/practice/${languageSlug}/${section.slug}` : undefined;
          const quizHref     = isClickable ? `/quiz/${languageSlug}/${section.slug}` : undefined;

          return (
            <div key={section.order} className="relative">
              <div className={`flex items-center gap-4 bg-[--card] border rounded-xl p-4 transition-colors
                ${isClickable ? 'hover:border-[--primary] cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                ${section.status === 'in-progress' ? 'border-blue-500/40' : 'border-[--border]'}`}>

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                  <Icon className={`h-5 w-5 ${cfg.text}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-[--muted-foreground]">Section {section.order}</span>
                    {section.status === 'in-progress' && (
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">In Progress</span>
                    )}
                    {section.status === 'completed' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">{section.masteryPct}% mastery</span>
                    )}
                  </div>
                  <div className="font-semibold text-[--foreground] text-sm">{section.title}</div>
                  <div className="text-xs text-[--muted-foreground] mt-0.5">{section.cardCount} flashcards</div>
                </div>

                {isClickable && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={studyHref!} className={`flex items-center gap-1 text-xs font-semibold ${cfg.text} hover:underline`}>
                      {cfg.label} <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link href={practiceHref!} className="text-[10px] px-2 py-1 rounded border border-[--border] text-[--muted-foreground] hover:text-[--foreground]">
                      Practice
                    </Link>
                    <Link href={quizHref!} className="text-[10px] px-2 py-1 rounded border border-[--border] text-[--muted-foreground] hover:text-[--foreground]">
                      Quiz
                    </Link>
                  </div>
                )}
              </div>
              {idx < enrichedSections.length - 1 && (
                <div className="absolute left-[29px] top-full h-4 w-px bg-[--border]" />
              )}
              {idx < enrichedSections.length - 1 && <div className="h-4" />}
            </div>
          );
        })}
      </div>
    </>
  );
}
