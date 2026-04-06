import { Trophy, Zap, RotateCcw, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type RatingSummary = { forgot: number; hard: number; good: number; nailed: number };

type Props = {
  sectionTitle: string;
  language: string;
  totalCards: number;
  xpEarned: number;
  ratings: RatingSummary;
  onRestart: () => void;
};

export function SessionComplete({ sectionTitle, language, totalCards, xpEarned, ratings, onRestart }: Props) {
  const accuracy = totalCards > 0
    ? Math.round(((ratings.good + ratings.nailed) / totalCards) * 100)
    : 0;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-8 text-center">
      {/* Trophy */}
      <div className="relative">
        <div className="h-24 w-24 rounded-full bg-[--primary]/15 flex items-center justify-center">
          <Trophy className="h-12 w-12 text-[--primary]" />
        </div>
        <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-[--primary] flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-[--foreground]">Section Complete!</h2>
        <p className="text-[--muted-foreground] mt-1">{sectionTitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        <StatCard label="Cards" value={String(totalCards)} />
        <StatCard label="Accuracy" value={`${accuracy}%`} highlight />
        <StatCard label="XP Earned" value={`+${xpEarned}`} />
      </div>

      {/* Rating breakdown */}
      <div className="w-full max-w-sm space-y-2">
        <RatingRow emoji="🔥" label="Nailed" count={ratings.nailed} total={totalCards} color="bg-green-500" />
        <RatingRow emoji="🙂" label="Good"   count={ratings.good}   total={totalCards} color="bg-blue-500"  />
        <RatingRow emoji="😤" label="Hard"   count={ratings.hard}   total={totalCards} color="bg-orange-500"/>
        <RatingRow emoji="😓" label="Forgot" count={ratings.forgot} total={totalCards} color="bg-red-500"   />
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full max-w-sm">
        <Button
          onClick={onRestart}
          variant="outline"
          className="flex-1 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Retry
        </Button>
        <Button asChild className="flex-1 gap-2">
          <Link href={`/path/${language}`}>
            Next Section
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <Card className={highlight ? 'bg-[--primary]/10 border-[--primary]/30' : 'bg-[--secondary]'}>
      <CardContent className="p-3">
        <div className={`text-xl font-bold ${highlight ? 'text-[--primary]' : 'text-[--foreground]'}`}>{value}</div>
        <div className="text-xs text-[--muted-foreground] mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}

function RatingRow({ emoji, label, count, total, color }: { emoji: string; label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 text-sm">{emoji}</span>
      <span className="w-12 text-xs text-[--muted-foreground]">{label}</span>
      <div className="flex-1 h-1.5 bg-[--secondary] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-4 text-xs text-[--muted-foreground] text-right">{count}</span>
    </div>
  );
}
