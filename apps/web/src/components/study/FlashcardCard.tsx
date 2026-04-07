'use client';

import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getProgressiveHint, getRemainingAiRequests, type AiHintResult } from '@/lib/ai-assist';
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
  const [aiHint, setAiHint] = useState<AiHintResult | null>(null);
  const [loadingAiHint, setLoadingAiHint] = useState(false);
  const [aiHintOpen, setAiHintOpen] = useState(false);

  const requestAiHint = useCallback(async () => {
    if (loadingAiHint) return;
    setLoadingAiHint(true);
    try {
      const result = await getProgressiveHint({
        question: card.question,
        curatedHint: hintVisible ? card.hint : undefined,
        language: card.language,
        userAttempt,
      });
      setAiHint(result);
      setAiHintOpen(true);
    } catch {
      setAiHint({
        source: 'ai',
        text: 'Could not generate a hint right now. Check your connection and try again in a moment.',
      });
      setAiHintOpen(true);
    } finally {
      setLoadingAiHint(false);
    }
  }, [loadingAiHint, card.question, card.hint, card.language, hintVisible, userAttempt]);

  return (
    <div style={{ perspective: '1200px' }}>
      <div
        className="relative min-h-[320px] md:min-h-[360px] transition-transform duration-[650ms]"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 rounded-2xl bg-card border border-border shadow-sm p-4 sm:p-6 md:p-8 overflow-y-auto"
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

          {/* AI hint button — pinned to bottom-left corner of card */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
            <TooltipProvider delayDuration={150}>
              <Tooltip open={aiHintOpen} onOpenChange={setAiHintOpen}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={requestAiHint}
                    disabled={loadingAiHint}
                    className="h-8 w-8 p-0 text-[--muted-foreground] hover:text-[--primary] hover:bg-[--primary]/10"
                  >
                    <Sparkles className={`h-3.5 w-3.5 text-[--primary] ${loadingAiHint ? 'animate-pulse' : ''}`} />
                  </Button>
                </TooltipTrigger>
                {aiHint && (
                  <TooltipContent
                    side="bottom"
                    align="start"
                    sideOffset={8}
                    className="max-w-[300px] rounded-xl border-0 bg-[--primary] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-white/80" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">AI Hint</span>
                    </div>
                    <p className="text-sm text-white whitespace-pre-line leading-relaxed">{aiHint.text}</p>
                    <p className="mt-2 text-[10px] text-white/60">
                      AI requests left today: {getRemainingAiRequests()}
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl bg-card border border-green-500/30 shadow-sm p-4 sm:p-6 md:p-8 overflow-y-auto"
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
