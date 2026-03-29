const PAYLOAD_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001';

export type SiteSettings = {
  allowThemeSwitch: boolean;
  maintenanceMode: boolean;
  announcementBanner: {
    enabled: boolean;
    message?: string;
  };
};

const FALLBACK: SiteSettings = {
  allowThemeSwitch: false,
  maintenanceMode: false,
  announcementBanner: { enabled: false },
};

/**
 * Fetches SiteSettings from PayloadCMS. Returns safe defaults when the CMS
 * is unreachable (e.g. during local dev without the admin app running).
 *
 * Cached for 60 seconds — revalidate when admin publishes changes.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/site-settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as Partial<SiteSettings>;
    return {
      allowThemeSwitch:    data.allowThemeSwitch    ?? false,
      maintenanceMode:     data.maintenanceMode     ?? false,
      announcementBanner:  data.announcementBanner  ?? { enabled: false },
    };
  } catch {
    return FALLBACK;
  }
}
