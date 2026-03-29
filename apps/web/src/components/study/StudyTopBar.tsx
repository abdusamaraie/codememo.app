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
    <div className="shrink-0 px-3 pt-6 pb-3 sm:px-4 sm:pt-4 sm:pb-3 md:px-6">
      <div className="mx-auto w-full max-w-2xl">
        {/* Section label */}
        <div className="mb-2 text-center">
          <span className="text-xs font-semibold text-[--muted-foreground] truncate inline-block max-w-full">
            {sectionTitle}
          </span>
        </div>

        <div className="grid grid-cols-[36px_minmax(0,1fr)_36px] items-center gap-2 sm:grid-cols-[40px_minmax(0,1fr)_40px]">
          {/* Exit */}
          <button
            onClick={onExit}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[--muted-foreground] hover:text-[--foreground] hover:bg-white/10 transition-colors"
            aria-label="Exit study session"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Segmented pill progress — centered, same width rhythm as card container */}
          <div className="w-full flex items-center gap-1 overflow-hidden" aria-label={`Card ${current + 1} of ${total}`}>
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

          {/* Right spacer keeps progress visually centered against left exit button */}
          <div />
        </div>
      </div>
    </div>
  );
}
