'use client';

import { useState } from 'react';
import type { StudyCard } from './FlashcardDeck';
import { FlashcardFront } from './FlashcardFront';
import { FlashcardBack } from './FlashcardBack';

type Props = {
  card: StudyCard;
  flipped: boolean;
  userAttempt: string;
  onAttemptChange: (v: string) => void;
};

export function FlashcardCard({ card, flipped, userAttempt, onAttemptChange }: Props) {
  const [hintVisible, setHintVisible] = useState(false);

  return (
    <div style={{ perspective: '1200px' }}>
      <div
        className="relative transition-transform duration-[650ms]"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '360px',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl bg-white/[0.03] border border-white/[0.07] p-4 sm:p-6 md:p-8 overflow-y-auto"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <FlashcardFront
            question={card.question}
            codeSnippet={card.codeSnippet}
            language={card.language}
            hint={card.hint}
            attempt={userAttempt}
            onAttemptChange={onAttemptChange}
            hintVisible={hintVisible}
            onShowHint={() => setHintVisible(true)}
          />
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl bg-white/[0.03] border border-green-500/20 p-4 sm:p-6 md:p-8 overflow-y-auto"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <FlashcardBack
            answer={card.answer}
            answerCode={card.answerCode}
            language={card.language}
            explanation={card.explanation}
            userAttempt={userAttempt}
          />
        </div>
      </div>
    </div>
  );
}
