import type { Config } from "tailwindcss";
import { colorPrimitives, semanticColors, spacing, border } from "@repo/theme";

const config: Omit<Config, "content"> = {
    theme: {
        extend: {
            colors: {
                // ── Layer 3: Component token classes ──────────────────────────────────
                // bg-cmp-default-foreground, text-cmp-default-text, border-cmp-default-border, etc.
                "cmp-default": {
                    foreground: "var(--cmp-default-foreground)",
                    border:     "var(--cmp-default-border)",
                    icon:       "var(--cmp-default-icon)",
                    overlay:    "var(--cmp-default-overlay)",
                    ring:       "var(--cmp-default-ring)",
                    text:       "var(--cmp-default-text)",
                },

                // ── shadcn standard names ─────────────────────────────────────────────
                background:  "var(--background)",
                foreground:  "var(--foreground)",
                card: {
                    DEFAULT:    "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                popover: {
                    DEFAULT:    "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                primary: {
                    DEFAULT:    "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT:    "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                muted: {
                    DEFAULT:    "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT:    "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                destructive: {
                    DEFAULT:    "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                border: "var(--border)",
                input:  "var(--input)",
                ring:   "var(--ring)",

                // ── Sidebar ───────────────────────────────────────────────────────────
                sidebar: {
                    DEFAULT:              "var(--sidebar-background)",
                    foreground:           "var(--sidebar-foreground)",
                    primary:              "var(--sidebar-primary)",
                    "primary-foreground": "var(--sidebar-primary-foreground)",
                    accent:               "var(--sidebar-accent)",
                    "accent-foreground":  "var(--sidebar-accent-foreground)",
                    border:               "var(--sidebar-border)",
                    ring:                 "var(--sidebar-ring)",
                },

                // ── Direct token palettes (NativeWind / non-CSS-var use) ──────────────
                brand:  colorPrimitives.brand,
                gray:   colorPrimitives.gray,
                green:  colorPrimitives.green,
                red:    colorPrimitives.red,
                yellow: colorPrimitives.yellow,
                blue:   colorPrimitives.blue,
                purple: colorPrimitives.purple,
                white:  colorPrimitives.white,
                black:  colorPrimitives.black,

                // Semantic groups (for NativeWind direct access)
                "text-semantic":        semanticColors.text,
                "bg-semantic":          semanticColors.background,
                "interactive-semantic": semanticColors.interactive,
                "border-semantic":      semanticColors.border,
                "status":               semanticColors.status,
            },

            borderRadius: {
                // shadcn CSS variable-based
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                // Direct scale values
                none: `${border.radius.none}px`,
                xs:   `${border.radius.xs}px`,
                base: `${border.radius.sm}px`,
                xl:   `${border.radius.xl}px`,
                xxl: `${border.radius.xxl}px`,
                full: `${border.radius.full}px`,
                pill: `${border.radius.pill}px`,
            },

            spacing: {
                0:  `${spacing.scale[0]}px`,
                1:  `${spacing.scale[1]}px`,
                2:  `${spacing.scale[2]}px`,
                4:  `${spacing.scale[4]}px`,
                6:  `${spacing.scale[6]}px`,
                8:  `${spacing.scale[8]}px`,
                10: `${spacing.scale[10]}px`,
                12: `${spacing.scale[12]}px`,
                14: `${spacing.scale[14]}px`,
                16: `${spacing.scale[16]}px`,
                20: `${spacing.scale[20]}px`,
                24: `${spacing.scale[24]}px`,
                28: `${spacing.scale[28]}px`,
                32: `${spacing.scale[32]}px`,
                40: `${spacing.scale[40]}px`,
                48: `${spacing.scale[48]}px`,
                56: `${spacing.scale[56]}px`,
                64: `${spacing.scale[64]}px`,
                80: `${spacing.scale[80]}px`,
                96: `${spacing.scale[96]}px`,
            },
        },
    },
    plugins: [],
};

export default config;
