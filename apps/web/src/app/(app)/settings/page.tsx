import { getSiteSettings } from '@/lib/site-settings';
import { getThemeFromCookie } from '@/lib/theme-cookie';
import { FeedWrapper, RightSidebar } from '@/components/layout';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';

export const metadata = {
  title: 'Settings — CodeMemo',
};

export default async function SettingsPage() {
  const [settings, { accent, theme }] = await Promise.all([
    getSiteSettings(),
    getThemeFromCookie(),
  ]);

  return (
    <div className="flex gap-8 px-6 py-6">
      <FeedWrapper>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-[--muted-foreground] mb-8">
          Manage your preferences
        </p>

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
