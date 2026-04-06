/**
 * Theme Creation Utilities
 *
 * Functions for creating and extending themes.
 *
 * Platform: Agnostic
 */

import {
  colorPrimitives,
  semanticColors,
  spacing,
  border,
  shadows,
  typography,
} from '../tokens';
import { accents } from '../tokens/primitives';
import { createSemantics } from '../tokens/createSemantics';
import { createComponents } from '../tokens/createComponents';
import { motion } from '../motion';

type Semantics = ReturnType<typeof createSemantics>;
type Components = ReturnType<typeof createComponents>;

/**
 * Base theme structure
 */
export interface BaseTheme {
  colors: {
    primitives: typeof colorPrimitives;
    semantic: typeof semanticColors;
    components: Components;
  };
  spacing: typeof spacing;
  radius: typeof border.radius;
  shadows: typeof shadows;
  typography: typeof typography;
  motion: typeof motion;
}

/**
 * Create the base theme with all design tokens.
 * Uses sky blue as the default accent for the dynamic component palette.
 */
export function createBaseTheme(): BaseTheme {
  const semantics: Semantics = createSemantics(accents.sky);
  const components: Components = createComponents(semantics.light);

  return {
    colors: {
      primitives: colorPrimitives,
      semantic: semanticColors,
      components,
    },
    spacing,
    radius: border.radius,
    shadows,
    typography,
    motion,
  };
}

/**
 * Deep merge two objects
 */
function deepMerge<T extends object>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key as keyof typeof source];
      const targetValue = target[key as keyof T];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        (result as Record<string, unknown>)[key] = deepMerge(
          targetValue as object,
          sourceValue as object
        );
      } else {
        (result as Record<string, unknown>)[key] = sourceValue;
      }
    }
  }

  return result;
}

/**
 * Extend the base theme with custom overrides
 */
export function extendTheme<T extends Partial<BaseTheme>>(
  overrides: T
): BaseTheme & T {
  const base = createBaseTheme();
  return deepMerge(base as object, overrides as object) as BaseTheme & T;
}

/**
 * Create a themed value getter for type-safe token access
 */
export function createThemeGetter<T extends BaseTheme>(theme: T) {
  return {
    color: (path: string) => {
      const parts = path.split('.');
      let value: unknown = theme.colors;
      for (const part of parts) {
        if (value && typeof value === 'object' && part in value) {
          value = (value as Record<string, unknown>)[part];
        } else {
          return undefined;
        }
      }
      return value as string | undefined;
    },
    space: (key: keyof typeof spacing) => theme.spacing[key],
    radius: (key: keyof typeof border.radius) => theme.radius[key],
  };
}
