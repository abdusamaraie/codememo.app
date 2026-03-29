import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Configuration',
  },
  fields: [
    {
      name: 'allowThemeSwitch',
      type: 'checkbox',
      defaultValue: false,
      label: 'Allow users to switch theme',
      admin: {
        description: 'When disabled, the app always uses the default dark + purple theme.',
      },
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      defaultValue: false,
      label: 'Maintenance Mode',
      admin: {
        description: 'When enabled, the app will display a maintenance page to all users.',
      },
    },
    {
      name: 'announcementBanner',
      type: 'group',
      label: 'Announcement Banner',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Banner',
        },
        {
          name: 'message',
          type: 'text',
          label: 'Banner Message',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.enabled),
          },
        },
      ],
    },
  ],
};
