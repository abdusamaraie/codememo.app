type Props = {
  current: number;
  total: number;
};

export function StudyProgressBar({ current, total }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-[--secondary] rounded-full overflow-hidden">
        <div
          className="h-full bg-[--primary] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-[--muted-foreground] tabular-nums shrink-0">
        {current}/{total}
      </span>
    </div>
  );
}
