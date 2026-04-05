export default function RootLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading…</p>
      </div>
    </div>
  );
}
