import Link from 'next/link';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { getLanguages, getSections } from '@/lib/api/payload';

export const metadata = { title: 'Languages — CodeMemo' };

type LangRow = {
  name: string;
  slug: string;
  color: string;
  desc: string;
  sections: number;
  done: number;
  totalCards: number;
};

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

function filterLanguages(langs: LangRow[], filter: Filter) {
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

  const cmsLanguages = await getLanguages();
  const languages: LangRow[] = await Promise.all(
    cmsLanguages.map(async (lang) => {
      const sections = await getSections(lang.id);
      return {
        name: lang.name,
        slug: lang.slug,
        color: lang.color,
        desc: lang.description ?? '',
        sections: sections.length,
        done: 0,
        totalCards: 0,
      };
    }),
  );

  const filtered = filterLanguages(languages, filter);

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--foreground]">Languages</h1>
          <p className="text-sm text-[--muted-foreground] mt-1">
            {languages.length} languages available · pick one to start memorising
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

        <div className="grid gap-3 min-w-0">
          {filtered.map((lang) => {
            const pct = lang.sections > 0 ? Math.round((lang.done / lang.sections) * 100) : 0;
            const status = lang.done === 0 ? 'Not started' : lang.done === lang.sections ? 'Completed' : `${lang.done} / ${lang.sections} sections`;
            return (
              <Link
                key={lang.slug}
                href={`/path/${lang.slug}`}
                className="bg-[--card] border border-[--border] hover:border-[--primary] rounded-xl p-4 flex items-center gap-4 transition-colors min-w-0"
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
