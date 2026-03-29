'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { QualityRating } from '@repo/domain';
import { useStudySession } from '@/hooks/useStudySession.hook';
import { FlashcardCard } from './FlashcardCard';
import { StudyProgressBar } from './StudyProgressBar';
import { SessionComplete } from './SessionComplete';

export type StudyCard = {
  id: string;
  question: string;
  codeSnippet?: string;
  language?: string;
  hint?: string;
  answer: string;
  answerCode?: string;
  explanation?: string;
};

type Props = {
  cards: StudyCard[];
  sectionTitle: string;
  language: string;
  backHref: string;
};

export function FlashcardDeck({ cards, sectionTitle, language, backHref }: Props) {
  const router = useRouter();
  const { currentCard, currentIndex, flipped, completed, xpEarned, ratings, reveal, rate, restart } =
    useStudySession(cards);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
        <p className="text-lg font-semibold text-[--foreground]">No cards due for review!</p>
        <p className="text-sm text-[--muted-foreground]">Come back later or choose a new section.</p>
        <button
          onClick={() => router.push(backHref)}
          className="px-6 py-2.5 rounded-xl bg-[--primary] text-white font-semibold text-sm"
        >
          Back to Path
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[--border] shrink-0">
        <button
          onClick={() => router.push(backHref)}
          className="p-1.5 rounded-lg hover:bg-[--muted] transition-colors"
          aria-label="Exit session"
        >
          <X className="h-5 w-5 text-[--muted-foreground]" />
        </button>
        <div className="flex-1">
          <StudyProgressBar
            current={completed ? cards.length : currentIndex}
            total={cards.length}
          />
        </div>
        <span className="text-xs font-semibold text-[--muted-foreground] shrink-0">
          {sectionTitle}
        </span>
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-xl">
          {completed ? (
            <SessionComplete
              sectionTitle={sectionTitle}
              language={language}
              totalCards={cards.length}
              xpEarned={xpEarned}
              ratings={ratings}
              onRestart={restart}
            />
          ) : (
            currentCard && (
              <FlashcardCard
                card={currentCard}
                flipped={flipped}
                onReveal={reveal}
                onRate={(q: QualityRating) => rate(q)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
