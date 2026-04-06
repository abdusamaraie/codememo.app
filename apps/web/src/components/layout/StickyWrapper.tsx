export function StickyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden xl:flex flex-col gap-4 w-[320px] shrink-0">
      <div className="sticky top-6 flex flex-col gap-4">{children}</div>
    </div>
  );
}
