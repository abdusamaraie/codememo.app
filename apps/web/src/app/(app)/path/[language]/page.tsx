import Link from 'next/link';
import { Lock, CheckCircle2, PlayCircle, BookOpen, ChevronRight } from 'lucide-react';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { getLanguageBySlug, getSections, getFlashcardCounts } from '@/lib/api/payload';
import { notFound } from 'next/navigation';

export const metadata = { title: 'Learning Path — CodeMemo' };

type SectionStatus = 'locked' | 'available' | 'in-progress' | 'completed';

type Section = {
  order: number;
  slug: string;
  title: string;
  description: string;
  cardCount: number;
  masteryPct: number;
  status: SectionStatus;
};

const STATUS_CONFIG = {
  locked:      { icon: Lock,          bg: 'bg-[--secondary]',        text: 'text-[--muted-foreground]', label: 'Locked'      },
  available:   { icon: BookOpen,       bg: 'bg-[--primary]/10',       text: 'text-[--primary]',          label: 'Start'       },
  'in-progress': { icon: PlayCircle,  bg: 'bg-blue-500/10',           text: 'text-blue-400',             label: 'Continue'    },
  completed:   { icon: CheckCircle2,  bg: 'bg-green-500/10',          text: 'text-green-400',            label: 'Review'      },
};

export default async function LanguagePathPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;
  const lang = await getLanguageBySlug(language);
  if (!lang) return notFound();

  const cmsSections = await getSections(lang.id);
  const cardCounts = await getFlashcardCounts(cmsSections.map((s) => s.id));

  // Until user progress is wired, all sections default to 'available'
  const sections: Section[] = cmsSections.map((s, i) => ({
    order: s.order,
    slug: s.slug,
    title: s.title,
    description: s.description ?? `Master the key syntax patterns for ${s.title.toLowerCase()}.`,
    cardCount: cardCounts.get(s.id) ?? 0,
    masteryPct: 0,
    status: i === 0 ? 'available' : 'available',
  }));

  const completedCount = sections.filter((s) => s.status === 'completed').length;
  const overallPct = sections.length > 0 ? Math.round((completedCount / sections.length) * 100) : 0;

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
            style={{ backgroundColor: lang.color }}
          >
            {lang.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[--foreground]">{lang.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-1.5 bg-[--secondary] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${overallPct}%`, backgroundColor: lang.color }} />
              </div>
              <span className="text-xs text-[--muted-foreground] shrink-0">{completedCount}/{sections.length} sections</span>
            </div>
          </div>
        </div>

        {/* Section path — vertical list */}
        <div className="relative flex flex-col gap-0">
          {sections.map((section, idx) => {
            const cfg = STATUS_CONFIG[section.status];
            const Icon = cfg.icon;
            const isClickable = section.status !== 'locked';
            const studyHref = isClickable ? `/study/${language}/${section.slug}` : undefined;
            const practiceHref = isClickable ? `/practice/${language}/${section.slug}` : undefined;
            const quizHref = isClickable ? `/quiz/${language}/${section.slug}` : undefined;

            const card = (
              <div
                className={`flex items-center gap-4 bg-[--card] border rounded-xl p-4 transition-colors
                  ${isClickable ? 'hover:border-[--primary] cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                  ${section.status === 'in-progress' ? 'border-blue-500/40' : 'border-[--border]'}`}
              >
                {/* Status icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                  <Icon className={`h-5 w-5 ${cfg.text}`} />
                </div>

                {/* Content */}
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

                {/* CTA */}
                {isClickable && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={studyHref!} className={`flex items-center gap-1 text-xs font-semibold ${cfg.text} hover:underline`}>
                      {cfg.label} <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href={practiceHref!}
                      className="text-[10px] px-2 py-1 rounded border border-[--border] text-[--muted-foreground] hover:text-[--foreground]"
                    >
                      Practice
                    </Link>
                    <Link
                      href={quizHref!}
                      className="text-[10px] px-2 py-1 rounded border border-[--border] text-[--muted-foreground] hover:text-[--foreground]"
                    >
                      Quiz
                    </Link>
                  </div>
                )}
              </div>
            );

            return (
              <div key={section.order} className="relative">
                {card}
                {idx < sections.length - 1 && (
                  <div className="absolute left-[29px] top-full h-4 w-px bg-[--border]" />
                )}
                {idx < sections.length - 1 && <div className="h-4" />}
              </div>
            );
          })}
        </div>
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
