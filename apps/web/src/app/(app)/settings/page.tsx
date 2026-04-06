import { getSiteSettingsWithStatus } from '@/lib/site-settings';
import { getThemeFromCookie } from '@/lib/theme-cookie';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

export const metadata = {
  title: 'Settings — CodeMemo',
};

export default async function SettingsPage() {
  const [{ settings, connected, payloadUrl }, { accent, theme }] = await Promise.all([
    getSiteSettingsWithStatus(),
    getThemeFromCookie(),
  ]);

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-[--muted-foreground] mb-8">
          Manage your preferences
        </p>

        {!connected && (
          <section className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
            <h2 className="text-sm font-semibold text-amber-300 mb-1">Admin settings not reachable</h2>
            <p className="text-xs text-amber-200/90">
              Web app is currently using fallback defaults because it could not fetch
              <code className="mx-1 px-1.5 py-0.5 rounded bg-black/20">{payloadUrl}/api/globals/site-settings</code>.
              Check <code className="mx-1 px-1.5 py-0.5 rounded bg-black/20">NEXT_PUBLIC_ADMIN_URL</code> and ensure the admin app is running.
            </p>
          </section>
        )}

        {/* Appearance — only shown when admin enables it */}
        {settings.allowThemeSwitch ? (
          <section className="bg-[--card] border border-[--border] rounded-xl p-6 mb-4">
            <h2 className="text-base font-semibold mb-1">Appearance</h2>
            <p className="text-sm text-[--muted-foreground] mb-5">
              Personalise the look of CodeMemo
            </p>
            <ThemeSwitcher currentAccent={accent} currentTheme={theme} />
          </section>
        ) : (
          <section className="bg-[--card] border border-[--border] rounded-xl p-6 mb-4 opacity-60">
            <h2 className="text-base font-semibold mb-1">Appearance</h2>
            <p className="text-sm text-[--muted-foreground]">
              Theme customisation is not enabled. The app uses the default dark + purple theme.
            </p>
          </section>
        )}

        {/* Placeholder for future settings sections */}
        <section className="bg-[--card] border border-[--border] rounded-xl p-6">
          <h2 className="text-base font-semibold mb-1">Account</h2>
          <p className="text-sm text-[--muted-foreground]">
            Account settings coming soon.
          </p>
        </section>
      </FeedWrapper>
      <RightSidebar />
    </div>
  );
}
