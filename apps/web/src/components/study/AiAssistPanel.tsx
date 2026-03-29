'use client';

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRemainingAiRequests } from '@/lib/ai-assist';

type Props = {
  title: string;
  text: string;
  source: 'curated' | 'ai' | 'heuristic';
};

export function AiAssistPanel({ title, text, source }: Props) {
  const [expanded, setExpanded] = useState(true);
  const remaining = useMemo(() => getRemainingAiRequests(), []);

  return (
    <div className="rounded-xl border border-[--primary]/30 bg-[--primary]/10 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[--primary]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[--primary]">{title}</span>
          <span className="text-[10px] text-[--muted-foreground]">({source})</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)} className="h-6 px-2 text-xs">
          {expanded ? 'Hide' : 'Show'}
        </Button>
      </div>
      {expanded && (
        <>
          <p className="mt-2 text-sm text-[--foreground] whitespace-pre-line">{text}</p>
          <p className="mt-2 text-[10px] text-[--muted-foreground]">AI requests left today: {remaining}</p>
        </>
      )}
    </div>
  );
}

