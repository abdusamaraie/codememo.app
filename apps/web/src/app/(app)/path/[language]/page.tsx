import { FeedWrapper, RightSidebar } from '@/components/layout';
import { getLanguageBySlug, getSections, getFlashcardCounts } from '@/lib/api/payload';
import { notFound } from 'next/navigation';
import { PathPageSections } from './PathPageSections';

export const metadata = { title: 'Learning Path — CodeMemo' };

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

  const sections = cmsSections.map((s) => ({
    order:     s.order,
    slug:      s.slug,
    title:     s.title,
    cardCount: cardCounts.get(s.id) ?? 0,
  }));

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
          </div>
        </div>

        {/* Section path — client component reads real progress from Convex */}
        <PathPageSections
          languageSlug={language}
          languageColor={lang.color}
          sections={sections}
        />
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
