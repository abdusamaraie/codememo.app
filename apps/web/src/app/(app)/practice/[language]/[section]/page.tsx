import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner';
import { getSectionBySlug, getExercises, normalizeExerciseType } from '@/lib/api/payload';
import type { CMSExercise } from '@/lib/api/payload';
import type { PracticeExercise } from '@/components/exercises/types';

export const metadata: Metadata = { title: 'Practice — CodeMemo' };

function toExercise(ex: CMSExercise): PracticeExercise {
  const normalizedType = normalizeExerciseType(ex.type);
  return {
    id: String(ex.id),
    type: normalizedType,
    prompt: ex.question,
    codeTemplate: ex.code ?? undefined,
    language: ex.language ?? undefined,
    options: ex.options?.map((o) => o.value),
    correctAnswer: normalizedType === 'arrange_code'
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
  if (sectionDoc) {
    const sectionLanguageSlug = typeof sectionDoc.language === 'object'
      ? sectionDoc.language.slug
      : null;
    if (sectionLanguageSlug && sectionLanguageSlug !== language) {
      notFound();
    }
  }

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
