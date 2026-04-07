'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@repo/convex';
import { calculateNextReview } from '@repo/domain';
import type { QualityRating, SM2Params } from '@repo/domain';
import { incrementAnonReviewCount } from '@/components/layout/SaveProgressNudge';
import type { StudyCard } from '@/components/study/FlashcardDeck';
import { incrementDailyMetric } from '@/lib/gamification';

type RatingSummary = { forgot: number; hard: number; good: number; nailed: number };

const XP_MAP: Record<QualityRating, number> = { 1: 0, 3: 5, 4: 10, 5: 15 };

const DEFAULT_SM2: SM2Params = {
  interval: 1,
  repetitions: 0,
  easeFactor: 2.5,
  nextReviewAt: 0,
};

const PROGRESS_STORAGE_KEY = 'codememo-card-progress';

function loadProgress(): Record<string, SM2Params> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveProgress(cardId: string, params: SM2Params) {
  if (typeof window === 'undefined') return;
  const all = loadProgress();
  all[cardId] = params;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(all));
}

export function useStudySession(cards: StudyCard[]) {
  const { isSignedIn } = useAuth();
  const updateStreak = useMutation(api.streaks.updateStreak);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [ratings, setRatings] = useState<RatingSummary>({ forgot: 0, hard: 0, good: 0, nailed: 0 });
  const [completed, setCompleted] = useState(false);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  const reveal = useCallback(() => {
    setFlipped(true);
  }, []);

  const rate = useCallback((quality: QualityRating) => {
    if (!currentCard) return;

    // SM-2 calculation
    const stored = loadProgress();
    const current = stored[currentCard.id] ?? DEFAULT_SM2;
    const next = calculateNextReview(quality, current);
    saveProgress(currentCard.id, next);

    // Track XP + ratings
    const xp = XP_MAP[quality];
    setXpEarned((prev) => prev + xp);
    setRatings((prev) => ({
      ...prev,
      forgot: prev.forgot + (quality === 1 ? 1 : 0),
      hard:   prev.hard   + (quality === 3 ? 1 : 0),
      good:   prev.good   + (quality === 4 ? 1 : 0),
      nailed: prev.nailed + (quality === 5 ? 1 : 0),
    }));

    if (isSignedIn) {
      updateStreak({ isPerfectRecall: quality === 5 }).catch(() => {});
    } else {
      incrementAnonReviewCount();
      incrementDailyMetric('reviews');
    }

    // Advance after short delay for UX feedback
    setTimeout(() => {
      setFlipped(false);
      if (isLastCard) {
        setCompleted(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 400);
  }, [currentCard, isLastCard, isSignedIn, updateStreak]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setFlipped(false);
    setXpEarned(0);
    setRatings({ forgot: 0, hard: 0, good: 0, nailed: 0 });
    setCompleted(false);
  }, []);

  return {
    currentCard,
    currentIndex,
    flipped,
    completed,
    xpEarned,
    ratings,
    reveal,
    rate,
    restart,
  };
}
