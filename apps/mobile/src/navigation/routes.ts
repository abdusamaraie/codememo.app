export const ROUTES = {
  HOME: 'Home',
  SETTINGS: 'Settings',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
