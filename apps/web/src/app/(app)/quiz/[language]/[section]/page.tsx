import type { Metadata } from 'next';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { QuizRunner } from '@/components/exercises/QuizRunner';
import { getMockExercises } from '@/components/exercises/mock-data';

export const metadata: Metadata = { title: 'Quiz — CodeMemo' };

export default async function QuizPage({
  params,
}: {
  params: Promise<{ language: string; section: string }>;
}) {
  const { language } = await params;
  const base = getMockExercises(language).filter((e) => e.type === 'multiple_choice');
  const exercises = Array.from({ length: 12 }, (_, i) => base[i % base.length]).map((e, idx) => ({
    ...e,
    id: `${e.id}-${idx + 1}`,
  }));

  return (
    <div className="flex gap-8 px-4 sm:px-6 py-6">
      <FeedWrapper>
        <QuizRunner exercises={exercises} />
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
