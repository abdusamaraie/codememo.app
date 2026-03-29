'use client';

import type { QualityRating } from '@repo/domain';

type Props = {
  answer: string;
  answerCode?: string;
  language?: string;
  explanation?: string;
  onRate: (quality: QualityRating) => void;
};

const RATINGS: { label: string; emoji: string; quality: QualityRating; color: string }[] = [
  { label: 'Forgot',  emoji: '😓', quality: 1, color: 'border-red-500/40    text-red-400    hover:bg-red-500/10'    },
  { label: 'Hard',    emoji: '😤', quality: 3, color: 'border-orange-500/40 text-orange-400 hover:bg-orange-500/10' },
  { label: 'Good',    emoji: '🙂', quality: 4, color: 'border-blue-500/40   text-blue-400   hover:bg-blue-500/10'   },
  { label: 'Nailed',  emoji: '🔥', quality: 5, color: 'border-green-500/40  text-green-400  hover:bg-green-500/10'  },
];

export function FlashcardBack({ answer, answerCode, language, explanation, onRate }: Props) {
  return (
    <div className="flex flex-col h-full p-8 gap-6">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
          Answer
        </span>
      </div>

      {/* Answer content */}
      <div className="flex-1 flex flex-col justify-center gap-4 overflow-y-auto">
        {answer && (
          <p className="text-base text-[--foreground] leading-relaxed">{answer}</p>
        )}

        {answerCode && (
          <pre className="font-mono text-sm bg-[--secondary] border border-green-500/30 rounded-xl p-4 overflow-x-auto text-green-300 leading-relaxed">
            <code className={language ? `language-${language}` : undefined}>{answerCode}</code>
          </pre>
        )}

        {explanation && (
          <p className="text-sm text-[--muted-foreground] leading-relaxed border-l-2 border-[--border] pl-3">
            {explanation}
          </p>
        )}
      </div>

      {/* Confidence rating */}
      <div className="space-y-2">
        <p className="text-xs text-center text-[--muted-foreground] font-medium">How well did you know this?</p>
        <div className="grid grid-cols-4 gap-2">
          {RATINGS.map(({ label, emoji, quality, color }) => (
            <button
              key={quality}
              onClick={() => onRate(quality)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border font-semibold text-xs transition-all active:scale-95 ${color}`}
            >
              <span className="text-lg">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
