import Link from 'next/link';
import { FeedWrapper, RightSidebar } from '@/components/layout';

export const metadata = { title: 'Languages — CodeMemo' };

const LANGUAGES = [
  { name: 'Python',     slug: 'python',     color: '#3B82F6', desc: 'List comprehensions, decorators, async/await, type hints.',     sections: 14, done: 4,  totalCards: 150 },
  { name: 'TypeScript', slug: 'typescript', color: '#7C6AF6', desc: 'Generics, utility types, discriminated unions, decorators.',      sections: 10, done: 1,  totalCards: 120 },
  { name: 'JavaScript', slug: 'javascript', color: '#F59E0B', desc: 'Closures, prototypes, Promises, ES6+ patterns.',                  sections: 12, done: 0,  totalCards: 140 },
  { name: 'Rust',       slug: 'rust',       color: '#F97316', desc: 'Ownership, borrowing, lifetimes, traits, pattern matching.',     sections: 8,  done: 0,  totalCards: 100 },
  { name: 'Go',         slug: 'go',         color: '#06B6D4', desc: 'Goroutines, channels, interfaces, error handling.',              sections: 8,  done: 0,  totalCards: 90  },
  { name: 'SQL',        slug: 'sql',        color: '#10B981', desc: 'Joins, subqueries, window functions, indexes, transactions.',    sections: 6,  done: 0,  totalCards: 70  },
  { name: 'Bash',       slug: 'bash',       color: '#8B5CF6', desc: 'Shell scripting, pipes, process substitution, awk/sed.',         sections: 5,  done: 0,  totalCards: 60  },
  { name: 'Java',       slug: 'java',       color: '#EF4444', desc: 'Generics, streams, concurrency, design patterns.',               sections: 10, done: 0,  totalCards: 120 },
];

const FILTERS = ['All', 'In Progress', 'Not Started'] as const;
type Filter = (typeof FILTERS)[number];
const FILTER_QUERY_VALUE: Record<Filter, string> = {
  All: 'all',
  'In Progress': 'in-progress',
  'Not Started': 'not-started',
};

function parseFilter(value?: string): Filter {
  if (value === 'in-progress') return 'In Progress';
  if (value === 'not-started') return 'Not Started';
  return 'All';
}

function filterLanguages(langs: typeof LANGUAGES, filter: Filter) {
  if (filter === 'In Progress') return langs.filter((l) => l.done > 0 && l.done < l.sections);
  if (filter === 'Not Started') return langs.filter((l) => l.done === 0);
  return langs;
}

export default async function LanguagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: rawFilter } = await searchParams;
  const filter: Filter = parseFilter(rawFilter);
  const filtered = filterLanguages(LANGUAGES, filter);

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--foreground]">Languages</h1>
          <p className="text-sm text-[--muted-foreground] mt-1">
            {LANGUAGES.length} languages available · pick one to start memorising
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 border-b border-[--border]">
          {FILTERS.map((f) => (
            <Link
              key={f}
              href={`/languages?filter=${FILTER_QUERY_VALUE[f]}`}
              aria-current={f === filter ? 'page' : undefined}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                f === filter
                  ? 'text-[--primary] border-b-2 border-[--primary] bg-[--primary]/10 rounded-b-none -mb-px'
                  : 'text-[--muted-foreground] border-b-2 border-transparent hover:text-[--foreground] hover:bg-[--primary]/5 rounded-b-none -mb-px'
              }`}
            >
              {f}
            </Link>
          ))}
        </div>

        <div className="grid gap-3">
          {filtered.map((lang) => {
            const pct = lang.sections > 0 ? Math.round((lang.done / lang.sections) * 100) : 0;
            const status = lang.done === 0 ? 'Not started' : lang.done === lang.sections ? 'Completed' : `${lang.done} / ${lang.sections} sections`;
            return (
              <Link
                key={lang.slug}
                href={`/path/${lang.slug}`}
                className="bg-[--card] border border-[--border] hover:border-[--primary] rounded-xl p-4 flex items-center gap-4 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ backgroundColor: lang.color }}
                >
                  {lang.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-[--foreground]">{lang.name}</span>
                    <span className="text-xs text-[--muted-foreground]">{lang.totalCards} cards</span>
                  </div>
                  <p className="text-xs text-[--muted-foreground] truncate mb-2">{lang.desc}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[--secondary] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: lang.color }} />
                    </div>
                    <span className="text-xs text-[--muted-foreground] shrink-0">{status}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
