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

  const [langResult, secResult, fcResult, exResult, csResult] = await Promise.all([
    payload.count({ collection: 'languages' }),
    payload.count({ collection: 'sections' }),
    payload.count({ collection: 'flashcards' }),
    payload.count({ collection: 'exercises' }),
    payload.count({ collection: 'cheatSheetEntries' }),
  ]);

  const counts = {
    languages: langResult.totalDocs,
    sections: secResult.totalDocs,
    flashcards: fcResult.totalDocs,
    exercises: exResult.totalDocs,
    cheatSheetEntries: csResult.totalDocs,
  };

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
      <SeedDataClient counts={counts} />
    </DefaultTemplate>
  );
}
