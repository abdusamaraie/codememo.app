import { getSiteSettings } from '@/lib/site-settings';
import { QuestsView } from '@/components/quests/QuestsView';

export const metadata = { title: 'Quests — CodeMemo' };

export default async function QuestsPage() {
  const settings = await getSiteSettings();
  return <QuestsView source={settings.appDataSource} />;
}
