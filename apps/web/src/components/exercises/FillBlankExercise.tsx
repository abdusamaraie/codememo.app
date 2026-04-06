'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { PracticeExercise } from './types';

type Props = {
  exercise: PracticeExercise;
  onAnswered: (isCorrect: boolean, answer: string) => void;
};

export function FillBlankExercise({ exercise, onAnswered }: Props) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = useMemo(
    () => value.trim().toLowerCase() === String(exercise.correctAnswer).trim().toLowerCase(),
    [value, exercise.correctAnswer],
  );

  function submit() {
    if (submitted) return;
    setSubmitted(true);
    onAnswered(isCorrect, value);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fill in the blank</CardTitle>
        <CardDescription>{exercise.prompt}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercise.codeTemplate && (
          <pre className="rounded-xl border border-[--border] bg-[--secondary] p-4 text-sm font-mono overflow-x-auto">
            {exercise.codeTemplate}
          </pre>
        )}
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type the missing syntax..."
          disabled={submitted}
        />
        {!submitted ? (
          <Button onClick={submit}>Check</Button>
        ) : (
          <div className={`rounded-lg p-3 text-sm ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {isCorrect ? 'Correct!' : `Not quite. Correct answer: ${String(exercise.correctAnswer)}`}
            <p className="mt-1 text-[--muted-foreground]">{exercise.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

