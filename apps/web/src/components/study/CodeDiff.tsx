'use client';

import { useMemo } from 'react';
import { diffCode, similarity, type DiffOp } from '@/lib/code-diff';

type Props = {
  userCode: string;
  correctCode: string;
};

export function CodeDiff({ userCode, correctCode }: Props) {
  const lineDiffs = useMemo(() => diffCode(userCode.trim(), correctCode.trim()), [userCode, correctCode]);
  const score = useMemo(() => similarity(userCode, correctCode), [userCode, correctCode]);

  if (!userCode.trim()) return null;

  const scoreColor =
    score >= 80 ? 'bg-green-500/20 text-green-400' :
    score >= 50 ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400';

  const hasMistakes = lineDiffs.some((l) => !l.isSame);

  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-[--muted-foreground]">
          Your attempt
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreColor}`}>
          {score}% match
        </span>
      </div>

      {/* Legend */}
      {hasMistakes && (
        <div className="flex items-center gap-3 text-[10px] text-[--muted-foreground]">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm bg-red-500/40" />
            wrong
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-sm bg-green-500/40" />
            missing
          </span>
        </div>
      )}

      {/* Diff block */}
      <pre className="font-mono text-sm rounded-xl p-4 overflow-x-auto leading-relaxed bg-[--secondary] border border-[--border]">
        {score === 100 ? (
          <span className="text-green-400">{correctCode.trim()}</span>
        ) : (
          lineDiffs.map((line, i) => (
            <div key={i}>
              {line.ops.map((op, j) => <DiffChar key={j} op={op} />)}
            </div>
          ))
        )}
      </pre>
    </div>
  );
}

function DiffChar({ op }: { op: DiffOp }) {
  if (op.type === 'same') {
    return <span className="text-[--foreground]">{op.value}</span>;
  }
  if (op.type === 'del') {
    // User typed this — it's wrong
    return (
      <span className="bg-red-500/25 text-red-300 line-through decoration-red-400 rounded-sm">
        {op.value}
      </span>
    );
  }
  // ins — user was missing this char
  return (
    <span className="bg-green-500/20 text-green-400 rounded-sm" title="You missed this">
      {op.value}
    </span>
  );
}
