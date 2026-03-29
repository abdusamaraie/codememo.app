import Link from 'next/link';
import { Lock, CheckCircle2, PlayCircle, BookOpen, ChevronRight } from 'lucide-react';
import { FeedWrapper, RightSidebar } from '@/components/layout';

export const metadata = { title: 'Learning Path — CodeMemo' };

type SectionStatus = 'locked' | 'available' | 'in-progress' | 'completed';

type Section = {
  order: number;
  title: string;
  description: string;
  cardCount: number;
  masteryPct: number;
  status: SectionStatus;
};

const LANGUAGE_META: Record<string, { name: string; color: string; totalSections: number }> = {
  python:     { name: 'Python',     color: '#3B82F6', totalSections: 14 },
  typescript: { name: 'TypeScript', color: '#7C6AF6', totalSections: 10 },
  javascript: { name: 'JavaScript', color: '#F59E0B', totalSections: 12 },
  rust:       { name: 'Rust',       color: '#F97316', totalSections: 8  },
  go:         { name: 'Go',         color: '#06B6D4', totalSections: 8  },
  sql:        { name: 'SQL',        color: '#10B981', totalSections: 6  },
};

function buildSections(lang: string): Section[] {
  const sectionTitles: Record<string, string[]> = {
    python: [
      'Variables & Types', 'Control Flow', 'Functions', 'List Comprehensions',
      'Dictionaries & Sets', 'Classes & OOP', 'Decorators', 'Generators',
      'Context Managers', 'Type Hints', 'Async/Await', 'Standard Library',
      'Testing with pytest', 'Packaging & Imports',
    ],
    typescript: [
      'Basic Types', 'Interfaces & Types', 'Generics', 'Utility Types',
      'Discriminated Unions', 'Type Guards', 'Decorators', 'Modules',
      'Advanced Patterns', 'Compiler Options',
    ],
    javascript: [
      'Variables & Scope', 'Functions & Closures', 'Prototypes', 'ES6 Classes',
      'Promises', 'Async/Await', 'Modules', 'Destructuring',
      'Iterators & Generators', 'WeakMap & WeakSet', 'Proxy & Reflect', 'Error Handling',
    ],
    rust: [
      'Ownership', 'Borrowing', 'Lifetimes', 'Structs',
      'Enums & Pattern Matching', 'Traits', 'Closures', 'Concurrency',
    ],
    go: [
      'Variables & Types', 'Functions', 'Goroutines', 'Channels',
      'Interfaces', 'Error Handling', 'Packages', 'Testing',
    ],
    sql: [
      'SELECT & Filtering', 'Joins', 'Aggregations', 'Subqueries',
      'Window Functions', 'Indexes & Performance',
    ],
  };

  const titles = sectionTitles[lang] ?? Array.from({ length: 8 }, (_, i) => `Section ${i + 1}`);
  const doneCount = lang === 'python' ? 4 : lang === 'typescript' ? 1 : 0;

  return titles.map((title, i) => {
    let status: SectionStatus = 'locked';
    if (i < doneCount) status = 'completed';
    else if (i === doneCount) status = i === 0 ? 'available' : 'in-progress';
    else if (i === doneCount + 1) status = 'available';

    return {
      order: i + 1,
      title,
      description: `Master the key syntax patterns for ${title.toLowerCase()}.`,
      cardCount: 8 + Math.floor(Math.random() * 8),
      masteryPct: status === 'completed' ? 80 + Math.floor(Math.random() * 20) : 0,
      status,
    };
  });
}

const STATUS_CONFIG = {
  locked:      { icon: Lock,          bg: 'bg-[--secondary]',        text: 'text-[--muted-foreground]', label: 'Locked'      },
  available:   { icon: BookOpen,       bg: 'bg-[--primary]/10',       text: 'text-[--primary]',          label: 'Start'       },
  'in-progress': { icon: PlayCircle,  bg: 'bg-blue-500/10',           text: 'text-blue-400',             label: 'Continue'    },
  completed:   { icon: CheckCircle2,  bg: 'bg-green-500/10',          text: 'text-green-400',            label: 'Review'      },
};

export default function LanguagePathPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  // Static render — params resolved at build time in production
  // For dev, we fall back to 'python' via the mock data
  const language = 'python'; // TODO: replace with `(await params).language` when on Next 15+
  const meta = LANGUAGE_META[language] ?? { name: language, color: '#7C6AF6', totalSections: 8 };
  const sections = buildSections(language);
  const completedCount = sections.filter((s) => s.status === 'completed').length;
  const overallPct = Math.round((completedCount / sections.length) * 100);

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
            style={{ backgroundColor: meta.color }}
          >
            {meta.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-[--foreground]">{meta.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-1.5 bg-[--secondary] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${overallPct}%`, backgroundColor: meta.color }} />
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
            const studyHref = isClickable ? `/study/${language}/${section.order}` : undefined;
            const practiceHref = isClickable ? `/practice/${language}/${section.order}` : undefined;
            const quizHref = isClickable ? `/quiz/${language}/${section.order}` : undefined;

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
