import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { SidebarProvider } from '@/components/layout/SidebarContext';
import { AppShell } from '@/components/layout/AppShell';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="h-full">
        {/* Desktop: fixed collapsible sidebar */}
        <Sidebar />

        {/* Mobile: fixed top header (50px) */}
        <MobileHeader />

        {/* Main content — offset tracks sidebar width */}
        <AppShell>{children}</AppShell>

        {/* Mobile: fixed bottom nav (60px) */}
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
