/**
 * Pencil Design Sync Utilities
 *
 * Bridges code → design by generating the variable payload for the
 * pencil MCP `set_variables` tool. When called, the .pen file's
 * accent variables update to match the theme accent, re-rendering
 * all pencil components with the new brand color.
 *
 * Usage (with pencil MCP):
 *   import { getPencilVars } from '@repo/theme';
 *   import { accents } from '@repo/theme';
 *
 *   // Push sky blue accent to pencil-shadcn.pen
 *   mcp__pencil__set_variables({
 *     filePath: 'pencil-shadcn.pen',
 *     variables: getPencilVars(accents.sky),
 *   });
 *
 * Platform: Tooling only (not included in app bundles)
 */

const ACCENT_STEPS = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

/**
 * Returns the variable payload for pencil's set_variables tool.
 * Maps an accent palette to pencil's --accent-* CSS variable names.
 */
export function getPencilVars(accent: Record<string, string>): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const step of ACCENT_STEPS) {
    if (accent[step]) {
      vars[`--accent-${step}`] = accent[step];
    }
  }
  vars['--white'] = '#ffffff';
  vars['--black'] = '#000000';
  return vars;
}
