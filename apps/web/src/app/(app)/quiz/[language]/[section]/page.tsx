import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { getSectionBySlug, getExercises, normalizeExerciseType } from '@/lib/api/payload';
import type { CMSExercise } from '@/lib/api/payload';
import type { PracticeExercise } from '@/components/exercises/types';

export const metadata: Metadata = { title: 'Quiz — CodeMemo' };

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

export default async function QuizPage({
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
    const mcOnly = cmsExercises.filter((e) => normalizeExerciseType(e.type) === 'multiple_choice');
    exercises = mcOnly.map(toExercise);
  }

  // Pad to 12 questions by cycling if needed. Preserve original IDs for the first
  // exercises.length entries; only rewrite IDs for the duplicated tail.
  if (exercises.length > 0 && exercises.length < 12) {
    const padded = Array.from({ length: 12 }, (_, i) => {
      const source = exercises[i % exercises.length]!;
      return i < exercises.length
        ? source
        : { ...source, id: `${source.id}-dup${Math.floor(i / exercises.length)}` };
    });
    exercises = padded;
  }

  return (
    <div className="flex gap-8 px-4 sm:px-6 py-6">
      <FeedWrapper>
        <QuizRunner exercises={exercises} />
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
