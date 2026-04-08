import type { AdminViewServerProps } from 'payload';
import { DefaultTemplate } from '@payloadcms/next/templates';
import { SeedDataClient } from './SeedDataClient';

export default async function SeedDataManagerView({
  initPageResult,
  params,
  payload,
  searchParams,
}: AdminViewServerProps) {
  const { permissions } = initPageResult;

  const [langResult, secResult, fcResult, exResult, csResult, siteSettings] = await Promise.all([
    payload.count({ collection: 'languages' }),
    payload.count({ collection: 'sections' }),
    payload.count({ collection: 'flashcards' }),
    payload.count({ collection: 'exercises' }),
    payload.count({ collection: 'cheatSheetEntries' }),
    payload.findGlobal({ slug: 'site-settings' }).catch(() => null),
  ]);

  const counts = {
    languages: langResult.totalDocs,
    sections: secResult.totalDocs,
    flashcards: fcResult.totalDocs,
    exercises: exResult.totalDocs,
    cheatSheetEntries: csResult.totalDocs,
  };

  const appDataSource = (siteSettings as Record<string, unknown> | null)?.appDataSource as string ?? 'real';

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      visibleEntities={initPageResult.visibleEntities}
    >
      <SeedDataClient counts={counts} appDataSource={appDataSource} />
    </DefaultTemplate>
  );
}
