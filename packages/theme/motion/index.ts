/**
 * Motion Tokens Barrel Export
 *
 * Re-exports all animation-related tokens.
 */

export { durations, semanticDurations } from './durations';
export type { Duration, SemanticDuration } from './durations';

export { easings, semanticEasings, toCssBezier, toRnBezier } from './easings';
export type { EasingDefinition, EasingName, SemanticEasing } from './easings';

/**
 * Unified motion export
 */
import { durations, semanticDurations } from './durations';
import { easings, semanticEasings } from './easings';

export const motion = {
  durations,
  semanticDurations,
  easings,
  semanticEasings,
} as const;

export type Motion = typeof motion;
