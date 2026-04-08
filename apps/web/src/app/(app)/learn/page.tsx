import { currentUser } from '@clerk/nextjs/server';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { LearnPageStats } from './LearnPageStats';
import { LearnPageLanguages } from './LearnPageLanguages';

export const metadata = { title: 'Learn — CodeMemo' };

export default async function LearnPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? 'there';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 18 ? 'Good afternoon' :
                'Good evening';

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--foreground]">{greeting}, {firstName}! 👋</h1>
          <p className="text-sm text-[--muted-foreground] mt-1">All caught up! Great work.</p>
        </div>

        <LearnPageStats />

        <LearnPageLanguages />
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
