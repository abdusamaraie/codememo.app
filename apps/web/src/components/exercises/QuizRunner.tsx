'use client';

import { useMemo, useState } from 'react';
import { calculateQuizScore } from '@repo/domain';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { incrementDailyMetric } from '@/lib/gamification';
import type { PracticeExercise } from './types';

type QuizAnswer = { exerciseId: string; answer: unknown; isCorrect: boolean };

type Props = {
  exercises: PracticeExercise[];
};

export function QuizRunner({ exercises }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [done, setDone] = useState(false);
  const totalQuestions = Math.min(exercises.length, 15);
  const quizItems = exercises.slice(0, totalQuestions);

  const current = quizItems[index];
  const progress = totalQuestions === 0 ? 0 : Math.round((index / totalQuestions) * 100);
  const result = useMemo(() => calculateQuizScore(answers as never), [answers]);

  function submitCurrent() {
    if (!selected || !current || done) return;
    const correct = String(current.correctAnswer);
    const isCorrect = selected === correct;
    const nextAnswers = [...answers, { exerciseId: current.id, answer: selected, isCorrect }];
    setAnswers(nextAnswers);
    setSelected(null);
    incrementDailyMetric('quiz');

    if (index + 1 >= totalQuestions) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>
            Score: {result.scorePercent}% • {result.passed ? 'Passed ✅' : 'Needs review ❌'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-[--muted-foreground]">Threshold is 80% to pass.</p>
          <Button onClick={() => { setIndex(0); setAnswers([]); setDone(false); }}>Retake Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[--muted-foreground]">
            <span>Quiz</span>
            <span>{index + 1}/{totalQuestions}</span>
          </div>
          <Progress value={progress} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Question {index + 1}</CardTitle>
          <CardDescription>{current.prompt}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          {(current.options ?? []).map((option, optionIndex) => {
            const active = selected === option;
            const letter = String.fromCharCode(65 + optionIndex); // A, B, C, D
            return (
              <button
                key={`${current.id}-${optionIndex}`}
                type="button"
                onClick={() => setSelected(option)}
                aria-pressed={active}
                className={`w-full text-left rounded-[16px] border border-b-4 px-4 py-3 transition-colors ${
                  active
                    ? 'border-[--primary] bg-[--primary]/10 shadow-[0_3px_0_var(--accent-700)]'
                    : 'border-[--border] bg-[--card] hover:bg-[--secondary] hover:border-[--primary]/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge variant={active ? 'default' : 'secondary'} className="shrink-0">
                    {letter}
                  </Badge>
                  <span className="text-sm font-semibold text-[--foreground] break-words">{option}</span>
                </div>
              </button>
            );
          })}
          <Button onClick={submitCurrent} disabled={!selected}>
            Next
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
