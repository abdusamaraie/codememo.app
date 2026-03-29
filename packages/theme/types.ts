/**
 * Theme Type Definitions
 *
 * All types are derived via `typeof` inference from the monolithic tokens.ts,
 * so they stay in sync automatically as tokens evolve.
 */

// ── Token value types ──────────────────────────────────────────────────────

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

// ── Motion types ───────────────────────────────────────────────────────────

export type { Duration, SemanticDuration, EasingDefinition, EasingName, SemanticEasing } from './motion';

// ── Utility / theme types ──────────────────────────────────────────────────

export type { BaseTheme, CssVarOptions } from './utils';
