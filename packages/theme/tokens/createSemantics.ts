import { colors } from './primitives';

export const createSemantics = (accent: Record<string, string>) => ({
  light: {
    Default: {
      Surface: colors.gray['25'],
      Foreground: accent['500'],
      Border: colors.gray['300'],
      Hover: {
        Surface: accent['50'],
        Foreground: accent['500'],
        Overlay: accent['500'],
        Border: accent['200'],
      },
      Active: {
        Surface: accent['25'],
        Foreground: accent['500'],
        Overlay: accent['500'],
        Border: accent['200'],
      },
    },
    Primary: {
      Default: {
        Surface: accent['500'],
        Foreground: accent['50'],
        Overlay: accent['600'],
        Border: accent['600'],
      },
      Hover: {
        Surface: accent['600'],
        Foreground: accent['100'],
        Overlay: accent['500'],
        Border: accent['500'],
      },
      Active: {
        Surface: accent['500'],
        Foreground: accent['100'],
        Overlay: accent['400'],
        Border: accent['600'],
      },
      Focus: {
        Ring: accent['600'],
      },
      Disabled: {
        Surface: accent['200'],
        Foreground: accent['400'],
        Overlay: accent['200'],
        Border: accent['300'],
      },
    },
    Secondary: {
      Default: {
        Surface: accent['50'],
        Foreground: accent['500'],
        Overlay: accent['100'],
        Border: accent['400'],
      },
      Hover: {
        Surface: accent['100'],
        Foreground: accent['600'],
        Overlay: accent['100'],
        Border: accent['400'],
      },
      Active: {
        Surface: accent['100'],
        Foreground: accent['600'],
        Overlay: accent['100'],
        Border: accent['500'],
      },
      Focus: {
        Ring: accent['300'],
      },
      Disabled: {
        Surface: accent['200'],
        Foreground: accent['400'],
        Overlay: accent['200'],
        Border: accent['300'],
      },
    },
    Tertiary: {
      Default: {
        Surface: accent['400'],
        Foreground: accent['50'],
        Overlay: accent['400'],
        Border: accent['600'],
      },
      Hover: {
        Surface: accent['200'],
        Foreground: accent['600'],
        Overlay: accent['300'],
        Border: accent['600'],
      },
      Active: {
        Surface: accent['400'],
        Foreground: accent['800'],
        Overlay: accent['400'],
        Border: accent['800'],
      },
      Focus: {
        Ring: accent['600'],
      },
      Disabled: {
        Surface: accent['200'],
        Foreground: accent['400'],
        Overlay: accent['200'],
        Border: accent['300'],
      },
    },
  },
  dark: {
    Default: {
      Surface: colors.gray['950'],
      Foreground: accent['400'],
      Border: colors.gray['400'],
      Hover: {
        Surface: accent['600'],
        Foreground: accent['300'],
        Overlay: accent['700'],
        Border: accent['500'],
      },
      Active: {
        Surface: accent['600'],
        Foreground: accent['300'],
        Overlay: accent['700'],
        Border: accent['500'],
      },
    },
    Primary: {
      Default: {
        Surface: accent['500'],
        Foreground: accent['200'],
        Overlay: accent['800'],
        Border: accent['600'],
      },
      Hover: {
        Surface: accent['600'],
        Foreground: accent['300'],
        Overlay: accent['700'],
        Border: accent['500'],
      },
      Active: {
        Surface: accent['600'],
        Foreground: accent['950'],
        Overlay: accent['600'],
        Border: accent['400'],
      },
      Focus: {
        Ring: accent['500'],
      },
      Disabled: {
        Surface: accent['300'],
        Foreground: accent['400'],
        Overlay: accent['800'],
        Border: accent['400'],
      },
    },
    Secondary: {
      Default: {
        Surface: accent['950'],
        Foreground: accent['500'],
        Overlay: accent['800'],
        Border: accent['600'],
      },
      Hover: {
        Surface: accent['800'],
        Foreground: accent['500'],
        Overlay: accent['800'],
        Border: accent['600'],
      },
      Active: {
        Surface: accent['900'],
        Foreground: accent['400'],
        Overlay: accent['800'],
        Border: accent['700'],
      },
      Focus: {
        Ring: accent['500'],
      },
      Disabled: {
        Surface: accent['300'],
        Foreground: accent['400'],
        Overlay: accent['200'],
        Border: accent['300'],
      },
    },
    Tertiary: {
      Default: {
        Surface: accent['900'],
        Foreground: accent['500'],
        Overlay: accent['800'],
        Border: accent['600'],
      },
      Hover: {
        Surface: accent['800'],
        Foreground: accent['500'],
        Overlay: accent['800'],
        Border: accent['600'],
      },
      Active: {
        Surface: accent['700'],
        Foreground: accent['400'],
        Overlay: accent['800'],
        Border: accent['500'],
      },
      Focus: {
        Ring: accent['500'],
      },
      Disabled: {
        Surface: accent['300'],
        Foreground: accent['400'],
        Overlay: accent['200'],
        Border: accent['400'],
      },
    },
  },
});

