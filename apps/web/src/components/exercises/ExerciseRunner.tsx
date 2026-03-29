'use client';

import { useMemo, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import type { PracticeExercise } from './types';
import { FillBlankExercise } from './FillBlankExercise';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { SpotErrorExercise } from './SpotErrorExercise';
import { ArrangeCodeExercise } from './ArrangeCodeExercise';

type Attempt = { id: string; answer: unknown; isCorrect: boolean };

type Props = {
  language: string;
  section: string;
  exercises: PracticeExercise[];
};

export function ExerciseRunner({ language, section, exercises }: Props) {
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [done, setDone] = useState(false);
  const current = exercises[index];
  const progress = Math.round((index / exercises.length) * 100);
  const correctCount = useMemo(() => attempts.filter((a) => a.isCorrect).length, [attempts]);

  function nextAnswer(isCorrect: boolean, answer: unknown) {
    const nextAttempts = [...attempts, { id: current.id, answer, isCorrect }];
    setAttempts(nextAttempts);
    if (index + 1 >= exercises.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-bold">Practice complete</h3>
          <p className="text-sm text-[--muted-foreground]">
            You got {correctCount} / {exercises.length} correct.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2 text-xs text-[--muted-foreground]">
            <span>{language.toUpperCase()} • Section {section}</span>
            <span>{index + 1}/{exercises.length}</span>
          </div>
          <Progress value={progress} />
          <div className="mt-2 text-xs text-[--muted-foreground]">Correct so far: {correctCount}</div>
        </CardContent>
      </Card>

      {current.type === 'fill_blank' && <FillBlankExercise exercise={current} onAnswered={nextAnswer} />}
      {current.type === 'multiple_choice' && <MultipleChoiceExercise exercise={current} onAnswered={nextAnswer} />}
      {current.type === 'spot_error' && <SpotErrorExercise exercise={current} onAnswered={nextAnswer} />}
      {current.type === 'arrange_code' && <ArrangeCodeExercise exercise={current} onAnswered={nextAnswer} />}
    </div>
  );
}
