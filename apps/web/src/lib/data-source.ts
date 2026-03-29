export type AppDataSource = 'real' | 'mock';

export function getClientAppDataSource(): AppDataSource {
  if (typeof document === 'undefined') return 'real';
  return document.documentElement.dataset.appDataSource === 'mock' ? 'mock' : 'real';
}
