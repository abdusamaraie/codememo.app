import { Show } from '@clerk/nextjs';
import { StickyWrapper } from './StickyWrapper';
import { UserStats } from './UserStats';
import { DailyGoal } from './DailyGoal';
import { AdBanner } from './AdBanner';
import { SaveProgressNudge } from './SaveProgressNudge';

export function RightSidebar() {
  return (
    <StickyWrapper>
      <UserStats />
      <DailyGoal />
      <Show when="signed-out">
        <SaveProgressNudge />
      </Show>
      <AdBanner />
    </StickyWrapper>
  );
}
