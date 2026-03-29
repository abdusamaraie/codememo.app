import type { Metadata } from 'next';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner';
import { getSectionBySlug, getExercises } from '@/lib/api/payload';
import type { CMSExercise } from '@/lib/api/payload';
import type { PracticeExercise } from '@/components/exercises/types';

export const metadata: Metadata = { title: 'Practice — CodeMemo' };

function toExercise(ex: CMSExercise): PracticeExercise {
  return {
    id: String(ex.id),
    type: ex.type === 'fill-blank' ? 'fill_blank'
      : ex.type === 'multiple-choice' ? 'multiple_choice'
      : ex.type === 'spot-error' ? 'spot_error'
      : 'arrange_code',
    prompt: ex.question,
    codeTemplate: ex.code ?? undefined,
    language: ex.language ?? undefined,
    options: ex.options?.map((o) => o.value),
    correctAnswer: ex.type === 'arrange-lines'
      ? ex.correctAnswer.split('\n')
      : ex.correctAnswer,
    explanation: ex.explanation,
  };
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ language: string; section: string }>;
}) {
  const { language, section } = await params;
  const sectionDoc = await getSectionBySlug(section);

  let exercises: PracticeExercise[] = [];
  if (sectionDoc) {
    const cmsExercises = await getExercises(sectionDoc.id);
    exercises = cmsExercises.map(toExercise);
  }

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <ExerciseRunner
          language={language}
          section={section}
          exercises={exercises}
        />
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
