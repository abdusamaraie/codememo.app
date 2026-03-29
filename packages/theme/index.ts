/**
 * @repo/theme
 *
 * Platform-agnostic design tokens for the app ecosystem.
 *
 * ## Usage
 *
 * ```typescript
 * // Static tokens
 * import { primitives, semantic, spacing, radius, shadows, typography } from '@repo/theme';
 *
 * // Component tokens
 * import { buttonTokens, cardTokens } from '@repo/theme';
 *
 * // Dynamic theming (accent-based)
 * import { createSemantics, createComponents, accents } from '@repo/theme';
 * const semantics = createSemantics(accents.sky);
 * const components = createComponents(semantics.light);
 *
 * // CSS variable generation (web only)
 * import { generateCssVars } from '@repo/theme';
 * const css = generateCssVars(accents.gray, { radius: 8 });
 *
 * // Theme object (all tokens combined)
 * import { createBaseTheme, extendTheme } from '@repo/theme';
 * ```
 */

// ============================================================================
// Static Token Exports (from monolithic tokens.ts)
// ============================================================================

export {
  // Colors
  colorPrimitives,
  semanticColors,
  primitives,
  semantic,

  // Spacing
  spacing,

  // Border / Radius
  border,
  radius,
  radiusSemantic,

  // Shadows
  shadows,
  shadowsSemantic,

  // Typography
  typography,

  // Figma variable stubs
  figmaVars,

  // Component tokens — Button
  buttonTokens,
  buttonSizes,
  buttonVariants,
  button3D,
  buttonShapes,
  buttonTypography,

  // Component tokens — Card
  cardTokens,
  cardVariants,

  // Component tokens — Modal
  modalTokens,

  // Component tokens — Input
  inputTokens,
  inputSizes,
  inputStates,

  // Component tokens — Header
  headerTokens,

  // Component tokens — Tabs
  tabsTokens,

  // Component tokens — Avatar
  avatarTokens,
  avatarSizes,

  // Component tokens — Badge
  badgeTokens,
  badgeSizes,
  badgeVariants,

  // Component tokens — Toast
  toastTokens,
  toastVariants,

  // Component tokens — Dropdown
  dropdownTokens,
  dropdownItemStates,
} from './tokens';

export type {
  ButtonSize,
  ButtonVariant,
  CardVariant,
  ModalSize,
  InputSize,
  InputState,
  AvatarSize,
  BadgeSize,
  BadgeVariant,
  ToastVariant,
  DropdownItemState,
} from './tokens';

// ============================================================================
// Dynamic Theming Factories
// ============================================================================

export { createSemantics, createComponents } from './tokens/index';
export { accents, pencilAccents, scale as primitiveScale } from './tokens/primitives';

// ============================================================================
// Motion Exports
// ============================================================================

export {
  motion,
  durations,
  semanticDurations,
  easings,
  semanticEasings,
  toCssBezier,
  toRnBezier,
} from './motion';

export type { Duration, SemanticDuration, EasingDefinition, EasingName, SemanticEasing } from './motion';

// ============================================================================
// Utility Exports
// ============================================================================

export {
  hexToRgb,
  rgbToHex,
  withAlpha,
  lighten,
  darken,
  getLuminance,
  getContrastRatio,
  meetsContrastAA,
  getReadableTextColor,
  createBaseTheme,
  extendTheme,
  createThemeGetter,
  generateCssVars,
  generateAccentVars,
  getPencilVars,
} from './utils';

export type { BaseTheme, CssVarOptions } from './utils';
