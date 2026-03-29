import type { Metadata } from 'next';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { ExerciseRunner } from '@/components/exercises/ExerciseRunner';
import { getMockExercises } from '@/components/exercises/mock-data';

export const metadata: Metadata = { title: 'Practice — CodeMemo' };

export default async function PracticePage({
  params,
}: {
  params: Promise<{ language: string; section: string }>;
}) {
  const { language, section } = await params;
  const exercises = getMockExercises(language);

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
