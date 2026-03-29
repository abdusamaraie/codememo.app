import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      {/* Desktop: fixed 256px left sidebar */}
      <Sidebar />

      {/* Mobile: fixed top header (50px) */}
      <MobileHeader />

      {/* Main content — offset for fixed sidebar (desktop) and fixed header (mobile) */}
      <main className="h-full pt-[50px] lg:pl-[256px] lg:pt-0">
        <div className="mx-auto h-full max-w-[1056px]">{children}</div>
      </main>

      {/* Mobile: fixed bottom nav (60px) */}
      <MobileBottomNav />
    </div>
  );
}
