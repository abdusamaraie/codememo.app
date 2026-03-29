import { StickyWrapper } from './StickyWrapper';
import { UserStats } from './UserStats';
import { DailyGoal } from './DailyGoal';
import { AdBanner } from './AdBanner';

export function RightSidebar() {
  return (
    <StickyWrapper>
      <UserStats />
      <DailyGoal />
      <AdBanner />
    </StickyWrapper>
  );
}
