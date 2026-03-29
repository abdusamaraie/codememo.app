'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { QualityRating } from '@repo/domain';
import { useStudySession } from '@/hooks/useStudySession.hook';
import { FlashcardCard } from './FlashcardCard';
import { SessionComplete } from './SessionComplete';
import { StudyTopBar } from './StudyTopBar';
import { StudyBottomBar } from './StudyBottomBar';

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
  const [userAttempt, setUserAttempt] = useState('');

  const { currentCard, currentIndex, flipped, completed, xpEarned, ratings, reveal, rate, restart } =
    useStudySession(cards);

  // Reset attempt whenever the card changes
  useEffect(() => {
    setUserAttempt('');
  }, [currentIndex]);

  // Enter key shortcut: reveal if front, continue (rate Good) if back
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (!flipped) reveal();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, reveal]);

  const handleRate = useCallback((q: QualityRating) => {
    rate(q);
    setUserAttempt('');
  }, [rate]);

  if (cards.length === 0) {
    return (
      <div className="fixed inset-0 bg-[--background] flex flex-col items-center justify-center gap-4 text-center p-8">
        <p className="text-lg font-semibold text-[--foreground]">No cards due for review!</p>
        <p className="text-sm text-[--muted-foreground]">Come back later or choose another section.</p>
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
    <div className="fixed inset-0 bg-[--background] flex flex-col">
      {/* Top bar — progress segments */}
      <StudyTopBar
        current={completed ? cards.length : currentIndex}
        total={cards.length}
        sectionTitle={sectionTitle}
        onExit={() => router.push(backHref)}
      />

      {/* Main content — centered */}
      <main className="flex-1 overflow-y-auto flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
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
                userAttempt={userAttempt}
                onAttemptChange={setUserAttempt}
                onRate={handleRate}
              />
            )
          )}
        </div>
      </main>

      {/* Bottom bar — Check Answer (front) / Mascot + Confidence (back) */}
      {!completed && currentCard && (
        <StudyBottomBar
          flipped={flipped}
          userAttempt={userAttempt}
          answerCode={currentCard.answerCode}
          onReveal={reveal}
          onRate={handleRate}
        />
      )}
    </div>
  );
}
