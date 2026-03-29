'use client';

import type { QualityRating } from '@repo/domain';
import { similarity } from '@/lib/code-diff';
import { Mascot } from './Mascot';

type Props = {
  /** true = card is flipped (answer visible) */
  flipped: boolean;
  userAttempt: string;
  answerCode?: string;
  onReveal: () => void;
  onRate: (quality: QualityRating) => void;
};

const RATINGS: { label: string; emoji: string; quality: QualityRating; style: string }[] = [
  { label: 'Forgot', emoji: '😓', quality: 1, style: 'border-red-500/50    text-red-400    hover:bg-red-500/15'    },
  { label: 'Hard',   emoji: '😤', quality: 3, style: 'border-orange-500/50 text-orange-400 hover:bg-orange-500/15' },
  { label: 'Good',   emoji: '🙂', quality: 4, style: 'border-blue-500/50   text-blue-400   hover:bg-blue-500/15'   },
  { label: 'Nailed', emoji: '🔥', quality: 5, style: 'border-green-500/50  text-green-400  hover:bg-green-500/15'  },
];

function getFeedback(score: number, hasAttempt: boolean): {
  text: string;
  sub: string;
  mascot: 'celebrate' | 'think' | 'default';
} {
  if (!hasAttempt) return { text: 'Study the answer', sub: 'Try typing next time for better retention.', mascot: 'default' };
  if (score >= 85) return { text: 'Great recall! 🔥',      sub: `${score}% match — nice work!`,           mascot: 'celebrate' };
  if (score >= 60) return { text: 'Getting there! 👍',     sub: `${score}% match — a few small errors.`,  mascot: 'default'   };
  return           { text: 'Keep practicing 💪',           sub: `${score}% match — review the answer.`,   mascot: 'think'     };
}

export function StudyBottomBar({ flipped, userAttempt, answerCode, onReveal, onRate }: Props) {
  const score = answerCode ? similarity(userAttempt, answerCode) : 0;
  const hasAttempt = userAttempt.trim().length > 0;
  const feedback = getFeedback(score, hasAttempt);

  return (
    <div
      className="shrink-0 border-t border-white/10 bg-[--background]"
      style={{ transition: 'background 0.3s' }}
    >
      {flipped ? (
        /* ── Post-reveal: mascot + feedback + confidence rating ── */
        <div className="flex items-center gap-4 px-5 py-4">
          {/* Mascot + text */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Mascot size={48} variant={feedback.mascot} className="shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-[--foreground] truncate">{feedback.text}</p>
              <p className="text-xs text-[--muted-foreground] truncate">{feedback.sub}</p>
            </div>
          </div>

          {/* Confidence buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {RATINGS.map(({ label, emoji, quality, style }) => (
              <button
                key={quality}
                onClick={() => onRate(quality)}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl border text-[10px] font-bold transition-all active:scale-95 ${style}`}
                title={label}
              >
                <span className="text-base leading-none">{emoji}</span>
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Pre-reveal: Check Answer button ── */
        <div className="flex items-center justify-end px-5 py-4">
          <button
            onClick={onReveal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[--primary] text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Check Answer
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
              ↵
            </kbd>
          </button>
        </div>
      )}
    </div>
  );
}
