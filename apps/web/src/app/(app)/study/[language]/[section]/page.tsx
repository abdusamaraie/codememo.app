import type { Metadata } from 'next';
import { FlashcardDeckClient } from '@/components/study/FlashcardDeckClient';
import type { StudyCard } from '@/components/study/FlashcardDeck';
import { getSectionBySlug, getFlashcards } from '@/lib/api/payload';
import type { CMSFlashcard } from '@/lib/api/payload';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Study — CodeMemo' };

function toStudyCard(fc: CMSFlashcard): StudyCard {
  return {
    id: String(fc.id),
    question: fc.front.prompt,
    codeSnippet: fc.front.code ?? undefined,
    language: fc.front.language ?? undefined,
    answer: fc.back.prompt,
    answerCode: fc.back.code ?? undefined,
  };
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ language: string; section: string }>;
}) {
  const { language, section } = await params;
  const sectionDoc = await getSectionBySlug(section);

  let cards: StudyCard[] = [];
  let sectionTitle = section;

  if (sectionDoc) {
    sectionTitle = sectionDoc.title;
    const cmsCards = await getFlashcards(sectionDoc.id);
    cards = cmsCards.map(toStudyCard);
  }

  if (cards.length === 0) return notFound();

  return (
    <FlashcardDeckClient
      cards={cards}
      sectionTitle={sectionTitle}
      language={language}
      backHref={`/path/${language}`}
    />
  );
}
