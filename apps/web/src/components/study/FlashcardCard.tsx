'use client';

import type { QualityRating } from '@repo/domain';
import type { StudyCard } from './FlashcardDeck';
import { FlashcardFront } from './FlashcardFront';
import { FlashcardBack } from './FlashcardBack';

type Props = {
  card: StudyCard;
  flipped: boolean;
  onReveal: () => void;
  onRate: (quality: QualityRating) => void;
};

export function FlashcardCard({ card, flipped, onReveal, onRate }: Props) {
  return (
    // Perspective container
    <div className="w-full" style={{ perspective: '1200px' }}>
      <div
        className="relative w-full transition-transform duration-[650ms]"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '420px',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl bg-[--card] border border-[--border] overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <FlashcardFront
            question={card.question}
            codeSnippet={card.codeSnippet}
            language={card.language}
            hint={card.hint}
            onReveal={onReveal}
          />
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl bg-[--card] border border-green-500/20 overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <FlashcardBack
            answer={card.answer}
            answerCode={card.answerCode}
            language={card.language}
            explanation={card.explanation}
            onRate={onRate}
          />
        </div>
      </div>
    </div>
  );
}
