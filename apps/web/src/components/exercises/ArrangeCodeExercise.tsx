'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { PracticeExercise } from './types';

type Props = {
  exercise: PracticeExercise;
  onAnswered: (isCorrect: boolean, answer: string[]) => void;
};

export function ArrangeCodeExercise({ exercise, onAnswered }: Props) {
  const initial = (exercise.options ?? []).slice();
  const [lines, setLines] = useState<string[]>(initial);
  const [submitted, setSubmitted] = useState(false);
  const correct = useMemo(
    () => (Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer : []),
    [exercise.correctAnswer],
  );
  const isCorrect = useMemo(
    () => JSON.stringify(lines) === JSON.stringify(correct),
    [lines, correct],
  );

  function moveUp(idx: number) {
    if (idx === 0 || submitted) return;
    setLines((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveDown(idx: number) {
    if (idx === lines.length - 1 || submitted) return;
    setLines((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  function submit() {
    if (submitted) return;
    setSubmitted(true);
    onAnswered(isCorrect, lines);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arrange the code</CardTitle>
        <CardDescription>{exercise.prompt}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {lines.map((line, idx) => (
          <div key={`${line}-${idx}`} className="flex items-center gap-2 rounded-xl border border-[--border] bg-[--secondary] p-2">
            <div className="flex-1 font-mono text-sm">{line}</div>
            <Button variant="outline" size="sm" onClick={() => moveUp(idx)} disabled={idx === 0 || submitted}>↑</Button>
            <Button variant="outline" size="sm" onClick={() => moveDown(idx)} disabled={idx === lines.length - 1 || submitted}>↓</Button>
          </div>
        ))}

        {!submitted ? (
          <Button onClick={submit}>Check</Button>
        ) : (
          <div className={`rounded-lg p-3 text-sm ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {isCorrect ? 'Correct order!' : 'Not quite in the right order.'}
            {!isCorrect && (
              <pre className="mt-2 rounded-lg bg-[--background] p-3 text-xs text-[--muted-foreground] overflow-x-auto">
                {(correct as string[]).join('\n')}
              </pre>
            )}
            <p className="mt-1 text-[--muted-foreground]">{exercise.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
