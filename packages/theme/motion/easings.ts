/**
 * Animation Easing Tokens
 *
 * Standard easing functions for animations.
 * Cubic bezier values for smooth, natural motion.
 *
 * Platform: Agnostic (cubic bezier format)
 */

/**
 * Easing definition as cubic bezier control points
 */
export interface EasingDefinition {
  /** First control point X */
  x1: number;
  /** First control point Y */
  y1: number;
  /** Second control point X */
  x2: number;
  /** Second control point Y */
  y2: number;
}

/**
 * Standard easing curves
 */
export const easings: Record<string, EasingDefinition> = {
  /** Linear - constant speed */
  linear: { x1: 0, y1: 0, x2: 1, y2: 1 },

  /** Ease in - slow start */
  easeIn: { x1: 0.42, y1: 0, x2: 1, y2: 1 },

  /** Ease out - slow end (most common for UI) */
  easeOut: { x1: 0, y1: 0, x2: 0.58, y2: 1 },

  /** Ease in-out - slow start and end */
  easeInOut: { x1: 0.42, y1: 0, x2: 0.58, y2: 1 },

  /** Ease out cubic - natural deceleration */
  easeOutCubic: { x1: 0.33, y1: 1, x2: 0.68, y2: 1 },

  /** Ease in cubic - natural acceleration */
  easeInCubic: { x1: 0.32, y1: 0, x2: 0.67, y2: 0 },

  /** Ease out quart - strong deceleration */
  easeOutQuart: { x1: 0.25, y1: 1, x2: 0.5, y2: 1 },

  /** Ease out back - slight overshoot */
  easeOutBack: { x1: 0.34, y1: 1.56, x2: 0.64, y2: 1 },

  /** Spring - bouncy feel */
  spring: { x1: 0.5, y1: 1.8, x2: 0.4, y2: 0.8 },
} as const;

/**
 * Semantic easing aliases for common use cases
 */
export const semanticEasings = {
  /** Default transition easing */
  default: easings.easeOut,
  /** Enter animations (elements appearing) */
  enter: easings.easeOutCubic,
  /** Exit animations (elements disappearing) */
  exit: easings.easeInCubic,
  /** Emphasis animations (drawing attention) */
  emphasis: easings.easeOutBack,
  /** Modal/overlay animations */
  modal: easings.easeOutCubic,
  /** Button press animations */
  button: easings.easeOut,
  /** Scroll-related animations */
  scroll: easings.easeOutQuart,
} as const;

/**
 * Convert easing to CSS cubic-bezier string
 */
export function toCssBezier(easing: EasingDefinition): string {
  return `cubic-bezier(${easing.x1}, ${easing.y1}, ${easing.x2}, ${easing.y2})`;
}

/**
 * Convert easing to array format for React Native Animated
 */
export function toRnBezier(easing: EasingDefinition): [number, number, number, number] {
  return [easing.x1, easing.y1, easing.x2, easing.y2];
}

export type EasingName = keyof typeof easings;
export type SemanticEasing = keyof typeof semanticEasings;
