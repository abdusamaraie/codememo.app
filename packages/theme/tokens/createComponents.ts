import { createSemantics } from './createSemantics';

type Theme = ReturnType<typeof createSemantics>['light'];

export const createComponents = (theme: Theme) => ({
  Default: {
    Default: {
      Surface: theme.Default.Surface,
      Foreground: theme.Default.Foreground,
      Overlay: theme.Tertiary.Default.Overlay,
      Border: theme.Default.Border,
    },
    Active: {
      Surface: theme.Default.Active.Surface,
      Foreground: theme.Default.Active.Foreground,
      Overlay: theme.Default.Active.Overlay,
      Border: theme.Default.Active.Border,
    },
    Hover: {
      Surface: theme.Default.Hover.Surface,
      Foreground: theme.Default.Hover.Foreground,
      Overlay: theme.Tertiary.Hover.Overlay,
      Border: theme.Default.Hover.Border,
    },
    Focus: {
      Ring: theme.Tertiary.Focus.Ring,
    },
    Disabled: {
      Surface: theme.Tertiary.Disabled.Surface,
      Foreground: theme.Tertiary.Disabled.Foreground,
      Overlay: theme.Tertiary.Disabled.Overlay,
      Border: theme.Tertiary.Disabled.Border,
    },
  },
  Primary: {
    Default: {
      Surface: theme.Primary.Default.Surface,
      Foreground: theme.Primary.Default.Foreground,
      Overlay: theme.Primary.Default.Overlay,
      Border: theme.Primary.Default.Border,
    },
    Active: {
      Surface: theme.Primary.Active.Surface,
      Foreground: theme.Primary.Active.Foreground,
      Overlay: theme.Primary.Active.Overlay,
      Border: theme.Primary.Active.Border,
    },
    Hover: {
      Surface: theme.Primary.Hover.Surface,
      Foreground: theme.Primary.Hover.Foreground,
      Overlay: theme.Primary.Hover.Overlay,
      Border: theme.Primary.Hover.Border,
    },
    Focus: {
      Ring: theme.Primary.Focus.Ring,
    },
    Disabled: {
      Surface: theme.Primary.Disabled.Surface,
      Foreground: theme.Primary.Disabled.Foreground,
      Overlay: theme.Primary.Disabled.Overlay,
      Border: theme.Primary.Disabled.Border,
    },
  },
  Secondary: {
    Default: {
      Surface: theme.Secondary.Default.Surface,
      Foreground: theme.Secondary.Default.Foreground,
      Overlay: theme.Secondary.Default.Overlay,
      Border: theme.Secondary.Default.Border,
    },
    Active: {
      Surface: theme.Secondary.Active.Surface,
      Foreground: theme.Secondary.Active.Foreground,
      Overlay: theme.Secondary.Active.Overlay,
      Border: theme.Secondary.Active.Border,
    },
    Hover: {
      Surface: theme.Secondary.Hover.Surface,
      Foreground: theme.Secondary.Hover.Foreground,
      Overlay: theme.Secondary.Hover.Overlay,
      Border: theme.Secondary.Hover.Border,
    },
    Focus: {
      Ring: theme.Secondary.Focus.Ring,
    },
    Disabled: {
      Surface: theme.Secondary.Disabled.Surface,
      Foreground: theme.Secondary.Disabled.Foreground,
      Overlay: theme.Secondary.Disabled.Overlay,
      Border: theme.Secondary.Disabled.Border,
    },
  },
  Tertiary: {
    Default: {
      Surface: theme.Tertiary.Default.Surface,
      Foreground: theme.Tertiary.Default.Foreground,
      Overlay: theme.Tertiary.Default.Overlay,
      Border: theme.Tertiary.Default.Border,
    },
    Active: {
      Surface: theme.Tertiary.Active.Surface,
      Foreground: theme.Tertiary.Active.Foreground,
      Overlay: theme.Tertiary.Active.Overlay,
      Border: theme.Tertiary.Active.Border,
    },
    Hover: {
      Surface: theme.Tertiary.Hover.Surface,
      Foreground: theme.Tertiary.Hover.Foreground,
      Overlay: theme.Tertiary.Hover.Overlay,
      Border: theme.Tertiary.Hover.Border,
    },
    Focus: {
      Ring: theme.Tertiary.Focus.Ring,
    },
    Disabled: {
      Surface: theme.Tertiary.Disabled.Surface,
      Foreground: theme.Tertiary.Disabled.Foreground,
      Overlay: theme.Tertiary.Disabled.Overlay,
      Border: theme.Tertiary.Disabled.Border,
    },
  },
});
