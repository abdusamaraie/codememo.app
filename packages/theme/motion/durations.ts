/**
 * Animation Duration Tokens
 *
 * Consistent timing values for animations and transitions.
 *
 * Platform: Agnostic (values in milliseconds)
 */

/**
 * Duration scale in milliseconds
 */
export const durations = {
  /** Instant: 0ms - No animation */
  instant: 0,
  /** Fastest: 75ms - Micro-interactions */
  fastest: 75,
  /** Fast: 150ms - Quick feedback */
  fast: 150,
  /** Normal: 250ms - Standard transitions */
  normal: 250,
  /** Slow: 400ms - Emphasis animations */
  slow: 400,
  /** Slower: 600ms - Complex animations */
  slower: 600,
  /** Slowest: 1000ms - Dramatic effects */
  slowest: 1000,
} as const;

/**
 * Semantic duration aliases for common use cases
 */
export const semanticDurations = {
  /** Button press feedback */
  buttonPress: durations.fast,
  /** Modal open/close */
  modal: durations.normal,
  /** Page transitions */
  pageTransition: durations.slow,
  /** Toast notifications */
  toast: durations.normal,
  /** Fade in/out */
  fade: durations.fast,
  /** Scale animations */
  scale: durations.normal,
  /** Slide animations */
  slide: durations.normal,
  /** Skeleton loading pulse */
  skeleton: durations.slower,
} as const;

export type Duration = keyof typeof durations;
export type SemanticDuration = keyof typeof semanticDurations;
