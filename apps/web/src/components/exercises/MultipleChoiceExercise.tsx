'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { PracticeExercise } from './types';

type Props = {
  exercise: PracticeExercise;
  onAnswered: (isCorrect: boolean, answer: string) => void;
};

export function MultipleChoiceExercise({ exercise, onAnswered }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const options = exercise.options ?? [];
  const correct = String(exercise.correctAnswer);
  const isCorrect = selected === correct;

  function submit() {
    if (!selected || submitted) return;
    setSubmitted(true);
    onAnswered(isCorrect, selected);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multiple choice</CardTitle>
        <CardDescription>{exercise.prompt}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => {
          const active = selected === option;
          return (
            <button
              key={option}
              onClick={() => !submitted && setSelected(option)}
              className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                active ? 'border-[--primary] bg-[--primary]/10' : 'border-[--border] hover:bg-[--secondary]'
              } ${submitted ? 'opacity-90' : ''}`}
              disabled={submitted}
            >
              {option}
            </button>
          );
        })}

        {!submitted ? (
          <Button onClick={submit} disabled={!selected}>Check</Button>
        ) : (
          <div className={`rounded-lg p-3 text-sm ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {isCorrect ? 'Correct!' : `Not quite. Correct answer: ${correct}`}
            <p className="mt-1 text-[--muted-foreground]">{exercise.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

