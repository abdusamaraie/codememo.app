/**
 * CSS Variable Generator
 *
 * Generates the 3-layer CSS custom property system for shadcn/Tailwind compatibility.
 * Mirrors the pencil-shadcn.pen variable system exactly:
 *
 *   Dimension 1 — Accent  : --accent-25 through --accent-950 (Layer 1, hardcoded hex)
 *   Dimension 2 — Mode    : Light (:root) / Dark (.dark) — controls --default-* (Layer 2)
 *   Dimension 3 — Base    : Primary (:root default) / Neutral / Secondary (Layer 2 overrides)
 *
 * Layer 2 and Layer 3 use var(--accent-*) references so swapping only the
 * Layer 1 values is enough to rebrand at runtime — no CSS regeneration needed.
 *
 * Platform: Web only (CSS variables)
 */

export interface CssVarOptions {
  /** Base border radius in px. Default: 6 */
  radius?: number;
}

const ACCENT_STEPS = ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

/**
 * Generate only the --accent-* CSS variable declarations (Layer 1).
 * Useful for accent swapping inside a scoped selector.
 */
export function generateAccentVars(accent: Record<string, string>): string {
  const lines: string[] = [];
  for (const step of ACCENT_STEPS) {
    if (accent[step]) {
      lines.push(`  --accent-${step}: ${accent[step]};`);
    }
  }
  lines.push('  --white: #ffffff;');
  lines.push('  --black: #000000;');
  return lines.join('\n');
}

/**
 * Generate the full 3-layer CSS variable system as :root + .dark + [data-base] blocks.
 *
 * Layer 2/3 use var(--accent-*) references — swap Layer 1 to rebrand without regenerating.
 *
 * @param accent  - Accent color palette (e.g. `accents.gray` or `accents.sky`)
 * @param options - Optional config (radius override)
 */
export function generateCssVars(
  accent: Record<string, string>,
  options?: CssVarOptions
): string {
  const r = options?.radius ?? 6;

  const root = `
:root {
  /* ── Layer 1: Accent scale — swap these 12 values to rebrand ── */
${generateAccentVars(accent)}

  /* ── Layer 2: Semantic tokens — Light mode (Mode=Light) ── */
  --default-foreground: #000000;
  --default-border:     var(--accent-400);
  --default-icon:       var(--accent-500);
  --default-overlay:    var(--accent-200);
  --default-ring:       var(--accent-400);
  --default-text:       var(--accent-600);

  /* ── Layer 3: Component tokens — Primary base (Base=Primary) ── */
  --cmp-default-foreground: var(--default-foreground);
  --cmp-default-border:     var(--default-border);
  --cmp-default-icon:       var(--default-icon);
  --cmp-default-overlay:    var(--default-overlay);
  --cmp-default-ring:       var(--default-ring);
  --cmp-default-text:       var(--default-text);

  /* ── shadcn standard variables ── */
  --background:             var(--accent-25);
  --foreground:             var(--accent-900);
  --card:                   #ffffff;
  --card-foreground:        var(--accent-900);
  --popover:                #ffffff;
  --popover-foreground:     var(--accent-900);
  --primary:                var(--accent-900);
  --primary-foreground:     var(--accent-25);
  --secondary:              var(--accent-100);
  --secondary-foreground:   var(--accent-900);
  --muted:                  var(--accent-100);
  --muted-foreground:       var(--accent-500);
  --accent:                 var(--accent-100);
  --accent-foreground:      var(--accent-900);
  --destructive:            #e7000b;
  --destructive-foreground: #ffffff;
  --border:                 var(--accent-200);
  --input:                  var(--accent-200);
  --ring:                   var(--default-ring);
  --radius:                 ${r}px;

  /* ── Sidebar ── */
  --sidebar-foreground:           var(--accent-900);
  --sidebar-primary:              var(--accent-900);
  --sidebar-primary-foreground:   var(--accent-25);
  --sidebar-accent:               var(--accent-100);
  --sidebar-accent-foreground:    var(--accent-900);
  --sidebar-border:               var(--accent-200);
  --sidebar-ring:                 var(--default-ring);
}`;

  const dark = `
.dark {
  /* ── Layer 2: Semantic overrides — Dark mode (Mode=Dark) ── */
  --default-foreground: var(--accent-900);
  --default-icon:       var(--accent-300);
  --default-overlay:    var(--accent-800);
  --default-ring:       var(--accent-500);
  --default-text:       var(--accent-300);

  /* ── shadcn dark overrides ── */
  --background:           var(--accent-950);
  --foreground:           var(--accent-25);
  --card:                 var(--accent-900);
  --card-foreground:      var(--accent-25);
  --popover:              var(--accent-900);
  --popover-foreground:   var(--accent-25);
  --primary:              var(--accent-50);
  --primary-foreground:   var(--accent-900);
  --secondary:            var(--accent-800);
  --secondary-foreground: var(--accent-50);
  --muted:                var(--accent-800);
  --muted-foreground:     var(--accent-400);
  --border:               var(--accent-800);
  --input:                var(--accent-800);

  /* ── Sidebar dark ── */
  --sidebar-foreground:           var(--accent-25);
  --sidebar-primary:              #1447e6;
  --sidebar-primary-foreground:   var(--accent-25);
  --sidebar-accent:               var(--accent-800);
  --sidebar-accent-foreground:    var(--accent-25);
  --sidebar-border:               rgba(255, 255, 255, 0.1);
}`;

  const neutral = `
/* ── Base=Neutral — matches pencil-shadcn Base=Neutral ── */
[data-base="neutral"] {
  --default-foreground: #e5e5e5;
  --default-overlay:    #0a0a0a;
  --default-ring:       #e5e5e5;
  --default-border:     #000000;
}`;

  const secondary = `
/* ── Base=Secondary — matches pencil-shadcn Base=Secondary (warm) ── */
[data-base="secondary"] {
  --default-foreground: #e5e5e5;
  --default-overlay:    #0c0a09;
  --default-ring:       #e5e5e5;
  --default-border:     #000000;
}`;

  return `${root}\n${dark}\n${neutral}\n${secondary}\n`;
}
