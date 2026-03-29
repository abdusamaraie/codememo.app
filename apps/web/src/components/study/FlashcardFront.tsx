'use client';

import { useState } from 'react';
import { Lightbulb, Eye } from 'lucide-react';

type Props = {
  question: string;
  codeSnippet?: string;
  language?: string;
  hint?: string;
  onReveal: () => void;
};

export function FlashcardFront({ question, codeSnippet, language, hint, onReveal }: Props) {
  const [hintVisible, setHintVisible] = useState(false);

  return (
    <div className="flex flex-col h-full p-8 gap-6">
      {/* Badge */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[--muted-foreground] bg-[--secondary] px-3 py-1 rounded-full">
          Prompt
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        <p className="text-lg font-semibold text-[--foreground] leading-relaxed">{question}</p>

        {codeSnippet && (
          <pre className="font-mono text-sm bg-[--secondary] border border-[--border] rounded-xl p-4 overflow-x-auto text-[--foreground] leading-relaxed">
            <code className={language ? `language-${language}` : undefined}>{codeSnippet}</code>
          </pre>
        )}

        {/* Hint */}
        {hint && (
          <div className="mt-2">
            {hintVisible ? (
              <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-300">{hint}</p>
              </div>
            ) : (
              <button
                onClick={() => setHintVisible(true)}
                className="flex items-center gap-1.5 text-sm text-[--muted-foreground] hover:text-amber-400 transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                Show hint
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reveal button */}
      <button
        onClick={onReveal}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[--primary] text-white font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all"
      >
        <Eye className="h-4 w-4" />
        Reveal Answer
      </button>
    </div>
  );
}
