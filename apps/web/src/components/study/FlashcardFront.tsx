'use client';

import { useRef, useCallback, useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProgressiveHint, type AiHintResult } from '@/lib/ai-assist';
import { getRemainingAiRequests } from '@/lib/ai-assist';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
  question: string;
  codeSnippet?: string;
  language?: string;
  hint?: string;
  /** Controlled value from parent */
  attempt: string;
  onAttemptChange: (value: string) => void;
  hintVisible: boolean;
  onShowHint: () => void;
};

export function FlashcardFront({
  question, codeSnippet, language, hint,
  attempt, onAttemptChange, hintVisible, onShowHint,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [aiHint, setAiHint] = useState<AiHintResult | null>(null);
  const [loadingAiHint, setLoadingAiHint] = useState(false);
  const [aiHintOpen, setAiHintOpen] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onAttemptChange(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [onAttemptChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = attempt.substring(0, start) + '  ' + attempt.substring(end);
      onAttemptChange(next);
      requestAnimationFrame(() => {
        el.selectionStart = start + 2;
        el.selectionEnd = start + 2;
      });
    }
  }, [attempt, onAttemptChange]);

  const requestAiHint = useCallback(async () => {
    if (loadingAiHint) return;
    setLoadingAiHint(true);
    const result = await getProgressiveHint({
      question,
      curatedHint: hintVisible ? hint : undefined,
      language,
      userAttempt: attempt,
    });
    setAiHint(result);
    setAiHintOpen(true);
    setLoadingAiHint(false);
  }, [loadingAiHint, question, hintVisible, hint, language, attempt]);

  return (
    <div className="flex flex-col gap-6">
      {/* Question */}
      <p className="text-xl font-semibold text-[--foreground] leading-relaxed text-center">
        {question}
      </p>

      {/* Optional context snippet */}
      {codeSnippet && (
        <pre className="font-mono text-sm bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto text-[--foreground] leading-relaxed">
          <code className={language ? `language-${language}` : undefined}>{codeSnippet}</code>
        </pre>
      )}

      {/* Answer textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[--muted-foreground]">
          Write from memory
        </label>
        <textarea
          ref={textareaRef}
          value={attempt}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={4}
          placeholder={'# type your answer here…\n# Tab inserts 2 spaces'}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="w-full font-mono text-sm bg-white/5 border border-white/10 focus:border-[--primary] rounded-xl p-4 text-[--foreground] placeholder-[--muted-foreground]/40 resize-none outline-none transition-colors leading-relaxed overflow-hidden"
          style={{ minHeight: '120px' }}
        />
      </div>

      {hintVisible && hint && (
        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/25 rounded-xl p-3">
          <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-300">{hint}</p>
        </div>
      )}

      {/* Hint actions */}
      <div className="flex items-center justify-between gap-3">
        <div>
          {hint && !hintVisible && (
            <button
              onClick={onShowHint}
              className="flex items-center gap-1.5 text-sm text-[--muted-foreground] hover:text-amber-400 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              Show hint
            </button>
          )}
        </div>

        <TooltipProvider delayDuration={150}>
          <Tooltip open={aiHintOpen} onOpenChange={setAiHintOpen}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={requestAiHint}
                disabled={loadingAiHint}
                className="h-8 px-2.5 text-xs text-[--muted-foreground] hover:text-[--foreground] hover:bg-white/5"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[--primary]" />
                {loadingAiHint ? 'Generating...' : 'AI hint'}
              </Button>
            </TooltipTrigger>
            {aiHint && (
              <TooltipContent
                side="bottom"
                align="end"
                sideOffset={8}
                className="max-w-[320px] rounded-xl border border-[--primary]/30 bg-[--card] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="h-4 w-4 text-[--primary]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[--primary]">AI Hint</span>
                  <span className="text-[10px] text-[--muted-foreground]">({aiHint.source})</span>
                </div>
                <p className="text-sm text-[--foreground] whitespace-pre-line leading-relaxed">{aiHint.text}</p>
                <p className="mt-2 text-[10px] text-[--muted-foreground]">
                  AI requests left today: {getRemainingAiRequests()}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
