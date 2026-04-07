'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { QualityRating } from '@repo/domain';
import { useStudySession } from '@/hooks/useStudySession.hook';
import { useSidebar } from '@/components/layout/SidebarContext';
import { Button } from '@/components/ui/button';
import { FlashcardCard } from './FlashcardCard';
import { SessionComplete } from './SessionComplete';
import { StudyTopBar } from './StudyTopBar';
import { StudyBottomBar } from './StudyBottomBar';
import { CheatSheetPanel } from './CheatSheetPanel';

const SESSION_SIZE = 10;

function pickSession(cards: StudyCard[]): StudyCard[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, SESSION_SIZE);
}

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
  const { collapsed } = useSidebar();
  const [userAttempt, setUserAttempt] = useState('');
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [sessionCards, setSessionCards] = useState<StudyCard[]>(() => pickSession(cards));

  const sidebarOffset = collapsed ? 'lg:left-[72px]' : 'lg:left-[256px]';

  const { currentCard, currentIndex, flipped, completed, xpEarned, ratings, reveal, rate, restart: resetSession } =
    useStudySession(sessionCards);

  const restart = useCallback(() => {
    setSessionCards(pickSession(cards));
    resetSession();
  }, [cards, resetSession]);

  // Space shortcut: reveal card (skip when focus is inside a textarea/input)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== ' ') return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      e.preventDefault();
      if (!flipped) reveal();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, reveal]);

  const handleRate = useCallback((q: QualityRating) => {
    rate(q);
    setUserAttempt('');
  }, [rate]);

  const handleAttemptChange = useCallback((value: string) => {
    if (value === userAttempt) return;
    setUserAttempt(value);
  }, [userAttempt]);

  if (cards.length === 0) {
    return (
      <div className={`fixed inset-0 ${sidebarOffset} z-[70] bg-background flex flex-col items-center justify-center gap-4 text-center p-8 transition-[left] duration-300`}>
        <p className="text-lg font-semibold text-[--foreground]">No cards due for review!</p>
        <p className="text-sm text-[--muted-foreground]">Come back later or choose another section.</p>
        <Button
          onClick={() => router.push(backHref)}
          size="sm"
        >
          Back to Path
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 ${sidebarOffset} z-[70] bg-background flex flex-col transition-[left] duration-300`}>
      {/* Top bar — progress segments */}
      <StudyTopBar
        current={completed ? sessionCards.length : currentIndex}
        total={sessionCards.length}
        sectionTitle={sectionTitle}
        onExit={() => router.push(backHref)}
        onQuickRef={() => setCheatSheetOpen(true)}
      />

      <CheatSheetPanel
        open={cheatSheetOpen}
        onOpenChange={setCheatSheetOpen}
        languageSlug={language}
        sectionTitle={sectionTitle}
      />

      {/* Main content — centered, shares responsive width rhythm with top bar */}
      <main className="flex-1 overflow-y-auto flex items-start justify-center px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <div className="w-full max-w-2xl">
          {completed ? (
            <SessionComplete
              sectionTitle={sectionTitle}
              language={language}
              totalCards={sessionCards.length}
              xpEarned={xpEarned}
              ratings={ratings}
              onRestart={restart}
            />
          ) : (
            currentCard && (
              <div className="space-y-3 sm:space-y-0">
                <FlashcardCard
                  key={currentCard.id}
                  card={currentCard}
                  flipped={flipped}
                  userAttempt={userAttempt}
                  onAttemptChange={handleAttemptChange}
                />

                {/* Mobile + tablet CTA sits directly under the card (avoids menu bar overlap) */}
                {!flipped && (
                  <div className="lg:hidden flex justify-center">
                    <Button onClick={reveal} size="lg" className="gap-2 w-full max-w-sm md:max-w-md">
                      Check Answer
                    </Button>
                  </div>
                )}
              </div>
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
          hidePreRevealCtaOnMobile
          onReveal={reveal}
          onRate={handleRate}
        />
      )}
    </div>
  );
}
