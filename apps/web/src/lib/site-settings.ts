const PAYLOAD_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001';

export type SiteSettings = {
  allowThemeSwitch: boolean;
  maintenanceMode: boolean;
  appDataSource: 'real' | 'mock';
  announcementBanner: {
    enabled: boolean;
    message?: string;
  };
};

const FALLBACK: SiteSettings = {
  allowThemeSwitch: false,
  maintenanceMode: false,
  appDataSource: 'real',
  announcementBanner: { enabled: false },
};

export type SiteSettingsFetchResult = {
  settings: SiteSettings;
  connected: boolean;
  payloadUrl: string;
};

/**
 * Fetches SiteSettings from PayloadCMS. Returns safe defaults when the CMS
 * is unreachable (e.g. during local dev without the admin app running).
 *
 * Cached for 60 seconds — revalidate when admin publishes changes.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await getSiteSettingsWithStatus();
  return result.settings;
}

export async function getSiteSettingsWithStatus(): Promise<SiteSettingsFetchResult> {
  try {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const res = await fetch(`${PAYLOAD_URL}/api/globals/site-settings`, {
      ...(isDevelopment ? { cache: 'no-store' as const } : { next: { revalidate: 60 } }),
    });
    if (!res.ok) {
      return {
        settings: FALLBACK,
        connected: false,
        payloadUrl: PAYLOAD_URL,
      };
    }
    const data = (await res.json()) as Partial<SiteSettings>;
    return {
      settings: {
        allowThemeSwitch: data.allowThemeSwitch ?? false,
        maintenanceMode: data.maintenanceMode ?? false,
        appDataSource: data.appDataSource === 'mock' ? 'mock' : 'real',
        announcementBanner: data.announcementBanner ?? { enabled: false },
      },
      connected: true,
      payloadUrl: PAYLOAD_URL,
    };
  } catch {
    return {
      settings: FALLBACK,
      connected: false,
      payloadUrl: PAYLOAD_URL,
    };
  }
}
