import { Crown, Flame, Zap } from 'lucide-react';
import { mockLeaderboard } from '@repo/mock-data';
import { FeedWrapper, RightSidebar } from '@/components/layout';

export const metadata = { title: 'Leaderboard — CodeMemo' };

const TABS = ['Weekly', 'Monthly', 'All-time'] as const;

const RANK_COLORS: Record<number, string> = { 1: 'text-yellow-400', 2: 'text-slate-300', 3: 'text-orange-400' };

export default function LeaderboardPage() {
  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[--foreground]">Leaderboard</h1>
          <p className="text-sm text-[--muted-foreground] mt-1">Top learners this week</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {TABS.map((tab) => (
            <span
              key={tab}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                tab === 'Weekly'
                  ? 'bg-[--primary] text-white'
                  : 'bg-[--secondary] text-[--muted-foreground] hover:text-[--foreground]'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((user, i) => {
            const podiumRank = [2, 1, 3][i];
            const height = ['h-20', 'h-28', 'h-16'][i];
            return (
              <div key={user.name} className="flex flex-col items-center gap-2">
                {podiumRank <= 3 && <Crown className={`h-5 w-5 ${RANK_COLORS[podiumRank]}`} />}
                <div className="w-12 h-12 rounded-full bg-[--secondary] border-2 border-[--border] flex items-center justify-center text-sm font-bold text-[--foreground]">
                  {user.name[0].toUpperCase()}
                </div>
                <div className={`w-full ${height} rounded-t-lg flex flex-col items-center justify-center bg-[--card] border border-[--border]`}
                  style={{ borderColor: podiumRank === 1 ? 'var(--primary)' : undefined }}>
                  <span className={`text-lg font-bold ${RANK_COLORS[podiumRank] ?? 'text-[--foreground]'}`}>#{podiumRank}</span>
                  <span className="text-xs text-[--muted-foreground] truncate px-1 max-w-full">{user.name}</span>
                  <span className="text-xs font-semibold text-[--foreground]">{user.xp.toLocaleString()} XP</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="bg-[--card] border border-[--border] rounded-xl overflow-hidden">
          {mockLeaderboard.map((user, idx) => (
            <div
              key={user.name}
              className={`flex items-center gap-4 px-4 py-3 ${idx < mockLeaderboard.length - 1 ? 'border-b border-[--border]' : ''} ${user.isYou ? 'bg-[--primary]/10' : ''}`}
            >
              <span className={`w-6 text-sm font-bold text-center shrink-0 ${RANK_COLORS[user.rank] ?? 'text-[--muted-foreground]'}`}>
                {user.rank}
              </span>
              <div className="w-8 h-8 rounded-full bg-[--secondary] flex items-center justify-center text-xs font-bold text-[--foreground] shrink-0">
                {user.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium ${user.isYou ? 'text-[--primary]' : 'text-[--foreground]'}`}>
                  {user.isYou ? 'You' : user.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[--muted-foreground] shrink-0">
                <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-500" />{user.streak}</span>
                <span className="flex items-center gap-1 font-semibold text-[--foreground]"><Zap className="h-3.5 w-3.5 text-yellow-400" />{user.xp.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
