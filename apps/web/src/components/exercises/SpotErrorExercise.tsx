'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { PracticeExercise } from './types';

type Props = {
  exercise: PracticeExercise;
  onAnswered: (isCorrect: boolean, answer: string) => void;
};

export function SpotErrorExercise({ exercise, onAnswered }: Props) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const isCorrect = useMemo(
    () => answer.trim().toLowerCase() === String(exercise.correctAnswer).trim().toLowerCase(),
    [answer, exercise.correctAnswer],
  );

  function submit() {
    if (submitted) return;
    setSubmitted(true);
    onAnswered(isCorrect, answer);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spot the error</CardTitle>
        <CardDescription>{exercise.prompt}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercise.codeTemplate && (
          <pre className="rounded-xl border border-[--border] bg-[--secondary] p-4 text-sm font-mono overflow-x-auto">
            {exercise.codeTemplate}
          </pre>
        )}
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Describe the error and fix..."
          disabled={submitted}
          className="min-h-[100px]"
        />
        {!submitted ? (
          <Button onClick={submit}>Check</Button>
        ) : (
          <div className={`rounded-lg p-3 text-sm ${isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {isCorrect ? 'Correct diagnosis!' : 'Not quite.'}
            <p className="mt-1 text-[--muted-foreground]">Expected: {String(exercise.correctAnswer)}</p>
            <p className="mt-1 text-[--muted-foreground]">{exercise.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

