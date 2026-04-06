/**
 * Design System Tokens
 *
 * Single-file snapshot of all design tokens extracted from Figma.
 * Source: Abdu Design System — Button frame (node 23659:3069)
 * Brand: Sky Blue (#00a6f4)
 *
 * Sections:
 *   1. Raw Figma Variables  — direct 1:1 mapping from Figma variable panel
 *   2. Color Primitives     — full hue scales (50–900)
 *   3. Semantic Colors      — purpose-driven tokens referencing primitives
 *   4. Border               — radius + width scales
 *   5. Typography           — families, weights, sizes, line-heights
 *   6. Spacing              — 4px grid scale + semantic aliases
 *   7. Shadows              — elevation definitions
 *   8. Component: Button    — sizes, variants, 3D depth effect
 *
 * Platform: Agnostic (React Native + Web)
 */

import { colors } from './tokens/primitives';

// ─────────────────────────────────────────────────────────────────────────────
// 1. RAW FIGMA VARIABLES
//    Direct export from Figma variable panel — do not hand-edit.
// ─────────────────────────────────────────────────────────────────────────────

export const figmaVars = {
  // Component state property
  'component/default/surface':    '#fdfdfd',
  'component/default/border':     '#d1d5dc',
  'component/default/foreground': '#00a6f4',

  'component/hover/surface':      '#f0f9ff',
  'component/hover/border':       '#00a6f4',
  'component/hover/foreground':   '#dff2fe',
  'component/hover/text':         '#0069a8',

  'component/active/surface':     '#00a6f4',
  'component/active/border':      '#0084d1',
  'component/active/foreground':  '#dff2fe',

  'component/disabled/surface':   '#e5e7eb',
  'component/disabled/border':    '#d1d5dc',
  'component/disabled/foreground':'#99a1af',

  'component/focus/ring':         '#0084d1',

  // Button-specific
  'button/hover/text':            '#4a5565',
  'button/active/icon':           '#364153',

  // Text semantic
  'text/action':                  '#00a6f4',
  'text/action-hover':            '#0084d1',
  'text/success':                 '#016630',

  // Border
  'border/radius/md':             12,
  'border/radius/full':           40,
  'border/width/none':            0,
  'border/width/thin':            1,
  'border/width/medium':          2,
  'border/width/thick':           4,
  'border/width/heavy':           6,

  // Typography
  'par/font-family':              'Nunito',
  'par/md/font-size':             16,
  'par/md/font-weight':           400,   // Regular
  'par/md/line-height':           20,
  'par/md/letter-spacing':        0,
  'par/md/paragraph-spacing':     20,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 2. COLOR PRIMITIVES
//    Full 50–900 hue scales. Brand = sky blue (#00a6f4).
// ─────────────────────────────────────────────────────────────────────────────

export const colorPrimitives = {
  /**
   * Brand — sky blue. Sourced from tokens/primitives.ts → colors.sky
   * 500 = #00a6f4 (Figma text/action, primary surface)
   * 600 = #0084d1 (Figma active border, focus ring)
   * 700 = #0069a8 (Figma text/action-hover)
   * 100 = #dff2fe (Figma active/hover foreground)
   *  50 = #f0f9ff (Figma hover surface, secondary button bg)
   */
  brand: colors.sky,

  /**
   * Neutral gray. Sourced from tokens/primitives.ts → colors.gray
   * 25  = #fdfdfd (Figma component/default/surface)
   * 300 = #d1d5dc (Figma component/default/border & disabled/border)
   * 400 = #99a1af (Figma component/disabled/foreground)
   * 600 = #4a5565 (Figma button/hover/text)
   * 700 = #364153 (Figma button/active/icon)
   */
  gray: colors.gray,

  /** Pure whites */
  white: {
    pure: colors.foundation['white'],
    off:  colors.gray['25'],   // #fdfdfd — Figma component/default/surface
    warm: colors.gray['100'],  // #f3f4f6
  },

  /** Blacks */
  black: {
    pure: colors.foundation['black'],
    soft: colors.gray['800'],  // #1e2939
  },

  /**
   * Green — success / feedback button. Sourced from tokens/primitives.ts → colors.green
   * 600 = #00a63e (success border)
   * 800 = #016630 (Figma text/success — feedback button text)
   */
  green: colors.green,

  /** Red — error / danger */
  red: colors.red,

  /** Yellow — warning */
  yellow: colors.yellow,

  /** Blue — info */
  blue: colors.blue,

  /** Purple — CodeMemo accent (#7C6AF6) */
  purple: colors.purple,

  transparent: 'transparent' as const,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 3. SEMANTIC COLORS
//    Purpose-driven tokens. All values reference colorPrimitives above.
// ─────────────────────────────────────────────────────────────────────────────

export const semanticColors = {
  text: {
    primary:     colorPrimitives.gray[800],    // #181d27
    secondary:   colorPrimitives.gray[700],    // #252b37
    muted:       colorPrimitives.gray[500],    // #717680
    disabled:    colorPrimitives.gray[400],    // #99a1af — Figma component/disabled/foreground
    inverse:     colorPrimitives.white.pure,   // #ffffff — on dark/brand surfaces
    action:      colorPrimitives.brand[500],   // #00a6f4 — Figma text/action
    actionHover: colorPrimitives.brand[700],   // #0069a8 — Figma text/action-hover
    success:     colorPrimitives.green[800],   // #016630 — Figma text/success
    error:       colorPrimitives.red[600],     // #dc2626
    warning:     colorPrimitives.yellow[700],  // #a16207
    info:        colorPrimitives.blue[700],    // #1d4ed8
  },

  background: {
    primary:   colorPrimitives.gray[50],       // #fafafa — app background
    secondary: colorPrimitives.gray[100],      // #f5f5f5
    elevated:  colorPrimitives.white.pure,     // #ffffff — cards, modals
    overlay:   'rgba(0,0,0,0.5)',
    dark:      colorPrimitives.gray[800],      // #181d27
  },

  interactive: {
    primary:        colorPrimitives.brand[500],  // #00a6f4 — Figma component/active/surface
    primaryHover:   colorPrimitives.brand[600],  // #0084d1
    primaryPressed: colorPrimitives.brand[700],  // #0069a8
    secondary:      colorPrimitives.brand[50],   // #f0f9ff — Figma component/hover/surface
    secondaryHover: colorPrimitives.brand[100],  // #dff2fe
    disabled:       colorPrimitives.gray[200],   // #e5e7eb — Figma component/disabled/surface
    disabledText:   colorPrimitives.gray[400],   // #99a1af — Figma component/disabled/foreground
  },

  border: {
    default:    colorPrimitives.gray[300],     // #d1d5dc — Figma component/default/border
    muted:      colorPrimitives.gray[200],     // #e5e7eb
    action:     colorPrimitives.brand[500],    // #00a6f4 — Figma component/hover/border
    actionDark: colorPrimitives.brand[600],    // #0084d1 — Figma component/active/border
    focused:    colorPrimitives.brand[600],    // #0084d1 — Figma component/focus/ring
    disabled:   colorPrimitives.gray[300],     // #d1d5dc — Figma component/disabled/border
    error:      colorPrimitives.red[600],      // #dc2626
    bottom:     colorPrimitives.gray[300],     // #d1d5dc — 3D card bottom border
  },

  status: {
    success:      colorPrimitives.green[600],  // #16a34a
    successLight: colorPrimitives.green[100],  // #dcfce7
    successText:  colorPrimitives.green[800],  // #016630 — Figma text/success
    warning:      colorPrimitives.yellow[600], // #ca8a04
    warningLight: colorPrimitives.yellow[100], // #fef9c3
    error:        colorPrimitives.red[600],    // #dc2626
    errorLight:   colorPrimitives.red[100],    // #fee2e2
    info:         colorPrimitives.blue[600],   // #2563eb
    infoLight:    colorPrimitives.blue[100],   // #dbeafe
  },

  brand: {
    primary:   colorPrimitives.brand[500],     // #00a6f4
    secondary: colorPrimitives.brand[50],      // #f0f9ff
    accent:    colorPrimitives.brand[600],     // #0084d1
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 4. BORDER
//    Radius scale + width scale directly from Figma variables.
// ─────────────────────────────────────────────────────────────────────────────

export const border = {
  /**
   * Radius scale
   * Figma border/radius/md = 12, border/radius/full = 40 (avatar)
   */
  radius: {
    none:  0,
    xs:    4,
    sm:    8,
    md:    12,   // Figma border/radius/md — buttons, inputs
    lg:    16,   // cards
    xl:    20,   // modals
    xxl:   24,
    full:  40,   // Figma border/radius/full — avatars
    pill:  9999, // true pill shape
  },

  /**
   * Width scale
   * Figma: none=0, thin=1, medium=2, thick=4, heavy=6
   */
  width: {
    none:   0,   // Figma border/width/none
    thin:   1,   // Figma border/width/thin
    medium: 2,   // Figma border/width/medium — side/top borders
    thick:  4,   // Figma border/width/thick
    heavy:  6,   // Figma border/width/heavy — bottom 3D border on buttons
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 5. TYPOGRAPHY
//    Figma: Nunito (body + heading), JetBrains Mono (code).
// ─────────────────────────────────────────────────────────────────────────────

export const typography = {
  families: {
    heading:  'DIN Next Rounded',  // Section titles / subtitles (falls back to Nunito)
    body:     'Nunito',            // Figma par/font-family — all body text
    bodyBold: 'Nunito',
    mono:     'JetBrains Mono',
  },

  weights: {
    light:     '300',
    regular:   '400',   // Figma par/md/font-weight
    medium:    '500',
    semibold:  '600',
    bold:      '700',   // Figma Body/lg-bold weight
    extrabold: '800',   // Figma Body/md-bold weight (Nunito Black)
  },

  /**
   * Size scale (px)
   * Figma par/md/font-size = 16
   */
  sizes: {
    display:   36,
    h1:        32,
    h2:        24,
    h3:        20,
    body1:     16,   // Figma par/md/font-size
    body2:     14,
    body2Bold: 14,
    body3:     12,
    caption:   11,
    micro:     10,
  },

  /**
   * Line heights (px)
   * Figma par/md/line-height = 20
   */
  lineHeights: {
    display:   44,
    h1:        38,
    h2:        28,
    h3:        24,
    body1:     20,   // Figma par/md/line-height
    body2:     16,
    body2Bold: 16,
    body3:     18,
    caption:   16,
    micro:     14,
  },

  letterSpacing: {
    tight:   -0.3,
    normal:  0,     // Figma par/md/letter-spacing
    wide:    0.5,
  },

  paragraphSpacing: {
    md: 20,         // Figma par/md/paragraph-spacing
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 6. SPACING
//    4px grid. Semantic aliases for common use.
// ─────────────────────────────────────────────────────────────────────────────

export const spacing = {
  /** Raw 4px grid values (px) */
  scale: {
    0:   0,
    1:   1,
    2:   2,
    4:   4,
    6:   6,
    8:   8,
    10:  10,
    12:  12,
    14:  14,
    16:  16,
    20:  20,
    24:  24,
    28:  28,
    32:  32,
    40:  40,
    48:  48,
    56:  56,
    64:  64,
    80:  80,
    96:  96,
  },

  /** Semantic aliases */
  xs:   4,
  sm:   6,
  md:   8,
  lg:   12,
  xl:   16,
  xxl:  24,
  xxxl: 32,

  /** Component-specific */
  component: {
    buttonPaddingVertical:   8,    // Figma button py = 8px
    buttonPaddingHorizontal: 12,   // Figma button px = 12px
    buttonGap:               8,    // Figma gap between icon and label
    cardPadding:             16,
    cardGap:                 12,
    inputPadding:            12,
    screenPadding:           16,
    sectionGap:              24,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 7. SHADOWS
//    Subtle elevation. Depth from whitespace, not heavy shadows.
// ─────────────────────────────────────────────────────────────────────────────

export interface ShadowDefinition {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

export const shadows = {
  none: { x: 0, y: 0, blur: 0, spread: 0, color: '#000000', opacity: 0 },
  sm:   { x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.04 },
  card: { x: 0, y: 2, blur: 8, spread: 0, color: '#000000', opacity: 0.06 },
  md:   { x: 0, y: 4, blur: 8, spread: 0, color: '#000000', opacity: 0.08 },
  modal:{ x: 0, y: 4, blur: 12,spread: 0, color: '#000000', opacity: 0.10 },
  lg:   { x: 0, y: 8, blur: 16,spread: 0, color: '#000000', opacity: 0.12 },
} as const satisfies Record<string, ShadowDefinition>;

// ─────────────────────────────────────────────────────────────────────────────
// 8. COMPONENT: BUTTON
//    Extracted from Figma node 23659:3069.
//    3D Duolingo-style: heavy bottom border (6px) + pressed = no border + translateY.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Button sizes.
 * md = Figma reference (48px height, py=8, px=12, font=16px, gap=8px).
 */
export const buttonSizes = {
  xs: {
    paddingVertical:   4,
    paddingHorizontal: 8,
    fontSize:          12,
    lineHeight:        18,
    minHeight:         28,
    iconSize:          14,
    gap:               4,
  },
  sm: {
    paddingVertical:   6,
    paddingHorizontal: 8,
    fontSize:          14,
    lineHeight:        20,
    minHeight:         32,
    iconSize:          16,
    gap:               6,
  },
  /** Figma reference size — 48px height */
  md: {
    paddingVertical:   8,    // Figma button py = 8
    paddingHorizontal: 12,   // Figma button px = 12
    fontSize:          16,   // Figma par/md/font-size = 16
    lineHeight:        20,   // Figma par/md/line-height = 20
    minHeight:         48,   // Figma button height = 48
    iconSize:          20,
    gap:               8,    // Figma gap = 8
  },
  lg: {
    paddingVertical:   12,
    paddingHorizontal: 24,
    fontSize:          16,
    lineHeight:        20,
    minHeight:         56,
    iconSize:          20,
    gap:               8,
  },
  xl: {
    paddingVertical:   16,
    paddingHorizontal: 32,
    fontSize:          18,
    lineHeight:        24,
    minHeight:         64,
    iconSize:          24,
    gap:               10,
  },
} as const;

/**
 * 3D depth effect — Duolingo-style thick bottom border.
 *
 * Default:  6px heavy bottom border (Figma border/width/heavy = 6)
 * Pressed:  border removed + translateY 6px (element shifts down, pushed flat)
 *
 * NOTE: Figma uses border/width/heavy = 6px (heavier than the 4px Duolingo default).
 */
export const button3D = {
  borderBottomWidth:        6,  // Figma border/width/heavy
  borderBottomWidthPressed: 0,
  borderSideWidth:          2,  // Figma border/width/medium (sides + top)
  borderSideWidthPrimary:   0,  // Primary button: no side borders
  translateY:               0,
  translateYPressed:        6,  // Matches heavy border width
} as const;

/**
 * Button shapes (border radius).
 * Figma: border/radius/md = 12 for standard, border/radius/full = 40 for pill.
 */
export const buttonShapes = {
  rounded: border.radius.md,   // 12px — Figma border/radius/md
  pill:    border.radius.pill, // 9999px
  circle:  border.radius.pill, // 9999px — icon circle buttons
} as const;

/**
 * Button variants — faithfully mapped from Figma.
 *
 * default   → white bg (#fdfdfd), gray border (#d1d5dc), blue text (#00a6f4)
 * primary   → blue bg (#00a6f4), dark blue bottom border (#0084d1), no side borders
 * secondary → light blue bg (#f0f9ff), blue border (#00a6f4), blue text (#00a6f4)
 * ghost     → transparent bg, dark blue border (#0084d1), white foreground (#f0f9ff)
 * feedback  → green bg, dark green border, white text
 * disabled  → gray bg (#e5e7eb), gray border (#d1d5dc), muted text (#99a1af)
 */
export const buttonVariants = {
  /**
   * Default — white/off-white, blue text, gray border.
   * Figma: component/default/* variables.
   */
  default: {
    background:         figmaVars['component/default/surface'],    // #fdfdfd
    backgroundHover:    figmaVars['component/hover/surface'],      // #f0f9ff
    backgroundPressed:  figmaVars['component/active/surface'],     // #00a6f4
    backgroundDisabled: figmaVars['component/disabled/surface'],   // #e5e7eb
    text:               figmaVars['component/default/foreground'], // #00a6f4
    textHover:          figmaVars['component/hover/text'],         // #0069a8
    textPressed:        figmaVars['component/active/foreground'],  // #dff2fe
    textDisabled:       figmaVars['component/disabled/foreground'],// #99a1af
    border:             figmaVars['component/default/border'],     // #d1d5dc
    borderHover:        figmaVars['component/hover/border'],       // #00a6f4
    borderBottom:       figmaVars['component/default/border'],     // #d1d5dc (3D)
    borderBottomHover:  figmaVars['component/hover/border'],       // #00a6f4
    borderBottomPressed:figmaVars['component/active/border'],      // #0084d1
    borderDisabled:     figmaVars['component/disabled/border'],    // #d1d5dc
  },

  /**
   * Primary — solid sky-blue CTA.
   * Figma: no side/top borders; heavy bottom border (#0084d1).
   */
  primary: {
    background:         figmaVars['component/active/surface'],     // #00a6f4
    backgroundHover:    colorPrimitives.brand[600],                // #0084d1
    backgroundPressed:  colorPrimitives.brand[500],                // #00a6f4 (border disappears)
    backgroundDisabled: figmaVars['component/disabled/surface'],   // #e5e7eb
    text:               colorPrimitives.white.off,                 // #fdfdfd — near white
    textHover:          colorPrimitives.white.pure,                // #ffffff
    textPressed:        figmaVars['component/active/foreground'],  // #dff2fe
    textDisabled:       figmaVars['component/disabled/foreground'],// #99a1af
    border:             colorPrimitives.transparent,               // no side/top border
    borderHover:        colorPrimitives.transparent,
    borderBottom:       figmaVars['component/active/border'],      // #0084d1 (3D depth)
    borderBottomHover:  colorPrimitives.brand[700],                // #0069a8
    borderBottomPressed:colorPrimitives.transparent,               // pressed = no border
    borderDisabled:     figmaVars['component/disabled/border'],    // #d1d5dc
  },

  /**
   * Secondary — light blue bg, blue border.
   * Figma: component/hover/surface bg + component/hover/border.
   */
  secondary: {
    background:         figmaVars['component/hover/surface'],      // #f0f9ff
    backgroundHover:    colorPrimitives.brand[100],                // #dff2fe
    backgroundPressed:  figmaVars['component/active/surface'],     // #00a6f4
    backgroundDisabled: figmaVars['component/disabled/surface'],   // #e5e7eb
    text:               figmaVars['component/default/foreground'], // #00a6f4
    textHover:          figmaVars['component/hover/text'],         // #0069a8
    textPressed:        colorPrimitives.white.pure,                // #ffffff
    textDisabled:       figmaVars['component/disabled/foreground'],// #99a1af
    border:             figmaVars['component/hover/border'],       // #00a6f4
    borderHover:        figmaVars['component/active/border'],      // #0084d1
    borderBottom:       figmaVars['component/active/border'],      // #0084d1 (3D depth darker)
    borderBottomHover:  colorPrimitives.brand[700],                // #0069a8
    borderBottomPressed:colorPrimitives.transparent,
    borderDisabled:     figmaVars['component/disabled/border'],    // #d1d5dc
  },

  /**
   * Ghost — transparent bg, outlined with dark-blue border.
   * Designed for use on colored/dark backgrounds (white text).
   */
  ghost: {
    background:         colorPrimitives.transparent,
    backgroundHover:    figmaVars['component/hover/surface'],      // #f0f9ff
    backgroundPressed:  figmaVars['component/hover/surface'],
    backgroundDisabled: colorPrimitives.transparent,
    text:               figmaVars['component/default/foreground'], // #00a6f4 (light bg)
    textHover:          figmaVars['component/hover/text'],         // #0069a8
    textPressed:        figmaVars['component/active/foreground'],  // #dff2fe
    textDisabled:       figmaVars['component/disabled/foreground'],// #99a1af
    border:             figmaVars['component/active/border'],      // #0084d1
    borderHover:        colorPrimitives.brand[700],                // #0069a8
    borderBottom:       figmaVars['component/active/border'],      // #0084d1 (3D)
    borderBottomHover:  colorPrimitives.brand[700],
    borderBottomPressed:colorPrimitives.transparent,
    borderDisabled:     figmaVars['component/disabled/border'],
  },

  /**
   * Feedback — green success/positive action button.
   * Figma: matches green feedback row in button frame.
   */
  feedback: {
    background:         colorPrimitives.green[500],                // #22c55e
    backgroundHover:    colorPrimitives.green[600],                // #16a34a
    backgroundPressed:  colorPrimitives.green[500],
    backgroundDisabled: figmaVars['component/disabled/surface'],   // #e5e7eb
    text:               colorPrimitives.white.pure,                // #ffffff
    textHover:          colorPrimitives.white.pure,
    textPressed:        colorPrimitives.white.pure,
    textDisabled:       figmaVars['component/disabled/foreground'],// #99a1af
    border:             colorPrimitives.transparent,
    borderHover:        colorPrimitives.transparent,
    borderBottom:       colorPrimitives.green[800],                // #016630 (3D depth)
    borderBottomHover:  colorPrimitives.green[800],
    borderBottomPressed:colorPrimitives.transparent,
    borderDisabled:     figmaVars['component/disabled/border'],
  },

  /**
   * Danger — solid red for destructive actions.
   */
  danger: {
    background:         colorPrimitives.red[500],                  // #ef4444
    backgroundHover:    colorPrimitives.red[600],                  // #dc2626
    backgroundPressed:  colorPrimitives.red[500],
    backgroundDisabled: figmaVars['component/disabled/surface'],
    text:               colorPrimitives.white.pure,
    textHover:          colorPrimitives.white.pure,
    textPressed:        colorPrimitives.white.pure,
    textDisabled:       figmaVars['component/disabled/foreground'],
    border:             colorPrimitives.transparent,
    borderHover:        colorPrimitives.transparent,
    borderBottom:       colorPrimitives.red[700],                  // #b91c1c (3D)
    borderBottomHover:  colorPrimitives.red[800],
    borderBottomPressed:colorPrimitives.transparent,
    borderDisabled:     figmaVars['component/disabled/border'],
  },
} as const;

/** Typography tokens specific to buttons */
export const buttonTypography = {
  fontFamily:    typography.families.body,   // Nunito
  fontWeight:    typography.weights.bold,    // 700 — Figma Body/lg-bold
  fontSize:      typography.sizes.body1,     // 16px — Figma par/md/font-size
  lineHeight:    typography.lineHeights.body1, // 20px — Figma par/md/line-height
  letterSpacing: typography.letterSpacing.normal, // 0 — Figma par/md/letter-spacing
} as const;

/** Composed button tokens object */
export const buttonTokens = {
  sizes:         buttonSizes,
  variants:      buttonVariants,
  shapes:        buttonShapes,
  depth:         button3D,
  typography:    buttonTypography,
  radius:        buttonShapes.rounded,       // 12px
  minTouchTarget: 44,
  focusRing: {
    color: figmaVars['component/focus/ring'], // #0084d1
    width: border.width.medium,              // 2px
    offset: 2,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 9. COMPONENT: CARD
// ─────────────────────────────────────────────────────────────────────────────

export const cardVariants = {
  /** White bg, subtle border, 4px 3D bottom border, subtle shadow */
  default: {
    background:        semanticColors.background.elevated,   // #ffffff
    border:            semanticColors.border.default,        // #d1d5dc
    borderBottom:      semanticColors.border.bottom,         // #d1d5dc (3D)
    shadow:            shadows.card,
  },
  /** White bg, no border, shadow only */
  elevated: {
    background:        semanticColors.background.elevated,
    border:            colorPrimitives.transparent,
    borderBottom:      colorPrimitives.transparent,
    shadow:            shadows.md,
  },
  /** White bg, thin border, no 3D, no shadow */
  outlined: {
    background:        semanticColors.background.elevated,
    border:            semanticColors.border.default,
    borderBottom:      semanticColors.border.default,
    shadow:            shadows.none,
  },
  /** Gray bg, no border */
  filled: {
    background:        semanticColors.background.secondary,  // #f5f5f5
    border:            colorPrimitives.transparent,
    borderBottom:      colorPrimitives.transparent,
    shadow:            shadows.none,
  },
  /** Thick borders, prominent 3D effect */
  heavy: {
    background:        semanticColors.background.elevated,
    border:            semanticColors.border.default,
    borderBottom:      semanticColors.border.muted,
    shadow:            shadows.card,
  },
} as const;

export const cardTokens = {
  variants:    cardVariants,
  radius:      border.radius.xl,          // 20px
  borderWidth: border.width.thin,          // 1px
  borderBottomWidth: border.width.thick,   // 4px 3D effect
  padding: {
    compact: spacing.lg,   // 12px
    sm:      spacing.xl,   // 16px
    md:      spacing.xxl,  // 24px
    lg:      spacing.xxxl, // 32px
  },
  gap: {
    card:    spacing.component.cardGap,    // 12px
    grid:    spacing.component.sectionGap, // 24px
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 10. COMPONENT: MODAL
// ─────────────────────────────────────────────────────────────────────────────

export const modalTokens = {
  backdrop:    semanticColors.background.overlay,   // rgba(0,0,0,0.5)
  background:  semanticColors.background.elevated,  // #ffffff
  border:      semanticColors.border.muted,
  radius:      border.radius.xxl,                   // 24px
  shadow:      shadows.modal,
  sizes: {
    sm:   { width: 400 },
    md:   { width: 560 },
    lg:   { width: 720 },
    xl:   { width: 900 },
    full: { width: '100%' as const },
  },
  padding: {
    header:  spacing.xxl,   // 24px
    content: spacing.xxl,
    footer:  spacing.xxl,
  },
  gap: {
    header:  spacing.xl,    // 16px
    content: spacing.xl,
    footer:  spacing.md,    // 8px
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 11. COMPONENT: INPUT
// ─────────────────────────────────────────────────────────────────────────────

export const inputSizes = {
  sm: {
    paddingVertical:   spacing.sm,   // 6px
    paddingHorizontal: spacing.md,   // 8px
    fontSize:          typography.sizes.body2,  // 14px
    minHeight:         32,
  },
  md: {
    paddingVertical:   spacing.lg,   // 12px
    paddingHorizontal: spacing.lg,
    fontSize:          typography.sizes.body1,  // 16px
    minHeight:         40,
  },
  lg: {
    paddingVertical:   spacing.xl,   // 16px
    paddingHorizontal: spacing.xl,
    fontSize:          typography.sizes.body1,
    minHeight:         48,
  },
} as const;

export const inputStates = {
  default: {
    background:  semanticColors.background.elevated,
    border:      semanticColors.border.default,
    text:        semanticColors.text.primary,
    placeholder: semanticColors.text.muted,
    ring:        colorPrimitives.transparent,
  },
  focused: {
    background:  semanticColors.background.elevated,
    border:      semanticColors.border.focused,
    text:        semanticColors.text.primary,
    placeholder: semanticColors.text.muted,
    ring:        semanticColors.border.focused,
  },
  error: {
    background:  semanticColors.background.elevated,
    border:      semanticColors.border.error,
    text:        semanticColors.text.primary,
    placeholder: semanticColors.text.muted,
    ring:        semanticColors.border.error,
  },
  disabled: {
    background:  semanticColors.interactive.disabled,
    border:      semanticColors.border.disabled,
    text:        semanticColors.text.disabled,
    placeholder: semanticColors.text.disabled,
    ring:        colorPrimitives.transparent,
  },
} as const;

export const inputTokens = {
  sizes:   inputSizes,
  states:  inputStates,
  radius:  border.radius.sm,   // 8px
  labelFontSize:  typography.sizes.body2,
  errorFontSize:  typography.sizes.body3,
  helperFontSize: typography.sizes.caption,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 12. COMPONENT: HEADER
// ─────────────────────────────────────────────────────────────────────────────

export const headerTokens = {
  heights: {
    sm: 44,
    md: 56,
    lg: 64,
  },
  backgrounds: {
    solid:       semanticColors.background.elevated,
    transparent: colorPrimitives.transparent,
    blur:        semanticColors.background.elevated,
  },
  border:     semanticColors.border.muted,
  titleFontSize:  typography.sizes.h2,
  titleFontFamily: typography.families.heading,
  navIconSize: 24,
  actionsGap:  spacing.md,  // 8px
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 13. COMPONENT: TABS
// ─────────────────────────────────────────────────────────────────────────────

export const tabsTokens = {
  height:           48,
  bottomNavHeight:  80,
  itemPadding: {
    vertical:   spacing.sm,   // 6px
    horizontal: spacing.lg,   // 12px
  },
  iconSize:       24,
  labelFontSize:  typography.sizes.caption,  // 11px
  indicator: {
    height: 2,
    radius: border.radius.full,
  },
  colors: {
    active:      semanticColors.text.action,
    inactive:    semanticColors.text.muted,
    background:  semanticColors.background.primary,
    indicator:   semanticColors.interactive.primary,
  },
  bottomNav: {
    addButtonSize: 56,
    lift:          8,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 14. COMPONENT: AVATAR
// ─────────────────────────────────────────────────────────────────────────────

export const avatarSizes = {
  xs: { size: 24,  fontSize: typography.sizes.micro,   borderWidth: border.width.thin },
  sm: { size: 32,  fontSize: typography.sizes.caption, borderWidth: border.width.thin },
  md: { size: 40,  fontSize: typography.sizes.body1,   borderWidth: border.width.medium },
  lg: { size: 56,  fontSize: typography.sizes.h2,      borderWidth: border.width.medium },
  xl: { size: 80,  fontSize: typography.sizes.h1,      borderWidth: border.width.thick },
} as const;

export const avatarTokens = {
  sizes:            avatarSizes,
  radius:           border.radius.pill,  // 9999px — circle
  placeholder: {
    background:     semanticColors.background.secondary,
    text:           semanticColors.text.muted,
  },
  status: {
    online:  colorPrimitives.green[500],
    offline: semanticColors.text.muted,
    away:    colorPrimitives.yellow[500],
    busy:    colorPrimitives.red[500],
    size:    10,
    borderWidth: border.width.medium,
    borderColor: semanticColors.background.elevated,
  },
  group: {
    overlap:    0.25,
    maxDisplay: 4,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 15. COMPONENT: BADGE
// ─────────────────────────────────────────────────────────────────────────────

export const badgeSizes = {
  sm: { paddingVertical: 1, paddingHorizontal: spacing.sm,  fontSize: typography.sizes.micro,   minHeight: 16 },
  md: { paddingVertical: 2, paddingHorizontal: spacing.md,  fontSize: typography.sizes.caption, minHeight: 20 },
  lg: { paddingVertical: 4, paddingHorizontal: spacing.lg,  fontSize: typography.sizes.body3,   minHeight: 24 },
} as const;

export const badgeVariants = {
  default:   { background: semanticColors.interactive.primary,   text: colorPrimitives.white.pure },
  secondary: { background: semanticColors.background.secondary,  text: semanticColors.text.secondary },
  success:   { background: semanticColors.status.successLight,   text: semanticColors.status.successText },
  warning:   { background: semanticColors.status.warningLight,   text: semanticColors.status.warning },
  error:     { background: semanticColors.status.errorLight,     text: semanticColors.status.error },
  info:      { background: semanticColors.status.infoLight,      text: semanticColors.status.info },
  outline:   { background: colorPrimitives.transparent,          text: semanticColors.text.primary },
} as const;

export const badgeTokens = {
  sizes:    badgeSizes,
  variants: badgeVariants,
  radius:   border.radius.pill,  // 9999px — pill
  borderWidth: border.width.thin,
  dot: {
    size:    8,
    radius:  border.radius.pill,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 16. COMPONENT: TOAST
// ─────────────────────────────────────────────────────────────────────────────

export const toastVariants = {
  default: {
    background: semanticColors.background.dark,
    border:     colorPrimitives.transparent,
    text:       semanticColors.text.inverse,
    icon:       semanticColors.text.inverse,
  },
  success: {
    background: semanticColors.status.successLight,
    border:     semanticColors.status.success,
    text:       semanticColors.status.successText,
    icon:       semanticColors.status.success,
  },
  warning: {
    background: semanticColors.status.warningLight,
    border:     semanticColors.status.warning,
    text:       semanticColors.status.warning,
    icon:       semanticColors.status.warning,
  },
  error: {
    background: semanticColors.status.errorLight,
    border:     semanticColors.status.error,
    text:       semanticColors.status.error,
    icon:       semanticColors.status.error,
  },
  info: {
    background: semanticColors.status.infoLight,
    border:     semanticColors.status.info,
    text:       semanticColors.status.info,
    icon:       semanticColors.status.info,
  },
} as const;

export const toastTokens = {
  variants:     toastVariants,
  radius:       border.radius.md,   // 12px
  shadow:       shadows.md,
  padding:      spacing.xl,         // 16px
  iconSize:     20,
  closeSize:    16,
  titleFontSize:   typography.sizes.body2,
  messageFontSize: typography.sizes.body3,
  position: {
    top:        spacing.xl,
    bottom:     spacing.xl,
    horizontal: spacing.xl,
  },
  durations: {
    short:     3000,
    default:   5000,
    long:      8000,
    persistent: 0,  // 0 = no auto-dismiss
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 17. COMPONENT: DROPDOWN
// ─────────────────────────────────────────────────────────────────────────────

export const dropdownItemStates = {
  default: {
    background:  colorPrimitives.transparent,
    text:        semanticColors.text.primary,
    icon:        semanticColors.text.secondary,
  },
  hover: {
    background:  semanticColors.background.secondary,
    text:        semanticColors.text.primary,
    icon:        semanticColors.text.primary,
  },
  active: {
    background:  semanticColors.interactive.secondary,
    text:        semanticColors.text.action,
    icon:        semanticColors.text.action,
  },
  disabled: {
    background:  colorPrimitives.transparent,
    text:        semanticColors.text.disabled,
    icon:        semanticColors.text.disabled,
  },
} as const;

export const dropdownTokens = {
  itemStates:    dropdownItemStates,
  menu: {
    background:  semanticColors.background.elevated,
    border:      semanticColors.border.muted,
    radius:      border.radius.md,   // 12px
    shadow:      shadows.md,
    minWidth:    160,
    maxWidth:    320,
    padding:     spacing.xs,         // 4px
  },
  item: {
    minHeight:         40,
    paddingVertical:   spacing.sm,   // 6px
    paddingHorizontal: spacing.xl,   // 16px
    radius:            border.radius.xs,  // 4px
    fontSize:          typography.sizes.body2,
  },
  divider: {
    color:  semanticColors.border.muted,
    height: border.width.thin,
    marginVertical: spacing.xs,
  },
  header: {
    fontSize:    typography.sizes.caption,
    color:       semanticColors.text.muted,
    paddingLeft: spacing.xl,
  },
  iconSize: 16,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE ALIASES — backward-compat exports
// ─────────────────────────────────────────────────────────────────────────────

/** @alias colorPrimitives */
export const primitives = colorPrimitives;

/** @alias semanticColors */
export const semantic = semanticColors;

/** @alias border.radius */
export const radius = border.radius;

/** Semantic radius values for each component type */
export const radiusSemantic = {
  input:  border.radius.sm,    // 8px
  card:   border.radius.xl,    // 20px
  modal:  border.radius.xxl,   // 24px
  avatar: border.radius.full,  // 40px
  badge:  border.radius.pill,  // 9999px
} as const;

/** Semantic shadow values for each component type */
export const shadowsSemantic = {
  card:     shadows.card,
  modal:    shadows.modal,
  toast:    shadows.md,
  dropdown: shadows.sm,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT — all tokens in one object
// ─────────────────────────────────────────────────────────────────────────────

const tokens = {
  figmaVars,
  color:      colorPrimitives,
  semantic:   semanticColors,
  border,
  radius,
  typography,
  spacing,
  shadows,
  button:     buttonTokens,
  card:       cardTokens,
  modal:      modalTokens,
  input:      inputTokens,
  header:     headerTokens,
  tabs:       tabsTokens,
  avatar:     avatarTokens,
  badge:      badgeTokens,
  toast:      toastTokens,
  dropdown:   dropdownTokens,
} as const;

export default tokens;

// Named type exports
export type ColorPrimitives  = typeof colorPrimitives;
export type SemanticColors   = typeof semanticColors;
export type BorderTokens     = typeof border;
export type TypographyTokens = typeof typography;
export type SpacingTokens    = typeof spacing;
export type ShadowTokens     = typeof shadows;
export type ButtonVariant    = keyof typeof buttonVariants;
export type ButtonSize       = keyof typeof buttonSizes;
export type ButtonShape      = keyof typeof buttonShapes;
export type CardVariant      = keyof typeof cardVariants;
export type ModalSize        = keyof typeof modalTokens.sizes;
export type InputSize        = keyof typeof inputSizes;
export type InputState       = keyof typeof inputStates;
export type AvatarSize       = keyof typeof avatarSizes;
export type BadgeSize        = keyof typeof badgeSizes;
export type BadgeVariant     = keyof typeof badgeVariants;
export type ToastVariant     = keyof typeof toastVariants;
export type DropdownItemState = keyof typeof dropdownItemStates;