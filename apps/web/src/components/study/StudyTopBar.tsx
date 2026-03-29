'use client';

import { X } from 'lucide-react';

type Props = {
  current: number;      // 0-based index of current card
  total: number;
  sectionTitle: string;
  onExit: () => void;
};

export function StudyTopBar({ current, total, sectionTitle, onExit }: Props) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 shrink-0">
      {/* Exit */}
      <button
        onClick={onExit}
        className="p-1.5 rounded-lg text-[--muted-foreground] hover:text-[--foreground] hover:bg-white/10 transition-colors shrink-0"
        aria-label="Exit study session"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Segmented pill progress — one pill per card */}
      <div className="flex-1 flex items-center gap-1 overflow-hidden" aria-label={`Card ${current + 1} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="flex-1 h-[6px] rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                i < current
                  ? 'var(--primary)'
                  : i === current
                  ? 'color-mix(in srgb, var(--primary) 50%, transparent)'
                  : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </div>

      {/* Section label */}
      <span className="text-xs font-semibold text-[--muted-foreground] shrink-0 hidden sm:block max-w-[140px] truncate">
        {sectionTitle}
      </span>
    </div>
  );
}
