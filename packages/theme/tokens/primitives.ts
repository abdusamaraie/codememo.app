export const scale = {
  '0': 0,
  '25': 1, // 1px
  '50': 2,
  '100': 4,
  '150': 6,
  '200': 8,
  '300': 12,
  '400': 16,
  '500': 20,
  '600': 24,
  '700': 28,
  '800': 32,
  '900': 40,
  '950': 64,
  '1000': 80,
  '1100': 96,
  '1200': 128,
} as const;

export const colors = {
  foundation: {
    'white': '#ffffff',
    'black': '#000000',
  } as const,
  gray: {
    '25': '#fdfdfd',
    '50': '#f9fafb',
    '100': '#f3f4f6',
    '200': '#e5e7eb',
    '300': '#d1d5dc',
    '400': '#99a1af',
    '500': '#6a7282',
    '600': '#4a5565',
    '700': '#364153',
    '800': '#1e2939',
    '900': '#101828',
    '950': '#030712',
  },
  sky: {
    '25': '#fcfcfd',
    '50': '#f0f9ff',
    '100': '#dff2fe',
    '200': '#b8e6fe',
    '300': '#74d4ff',
    '400': '#00bcff',
    '500': '#00a6f4',
    '600': '#0084d1',
    '700': '#0069a8',
    '800': '#00598a',
    '900': '#024a70',
    '950': '#052f4a',
  },
  blue: {
    '25': '#f5faff',
    '50': '#eff6ff',
    '100': '#dbeafe',
    '200': '#bedbff',
    '300': '#8ec5ff',
    '400': '#51a2ff',
    '500': '#2b7fff',
    '600': '#155dfc',
    '700': '#1447e6',
    '800': '#193cb8',
    '900': '#1c398e',
    '950': '#162456',
  },
  yellow: {
    '25': '#fffbf2',
    '50': '#fefce8',
    '100': '#fef9c2',
    '200': '#fff085',
    '300': '#ffdf20',
    '400': '#fdc700',
    '500': '#f0b100',
    '600': '#d08700',
    '700': '#a65f00',
    '800': '#894b00',
    '900': '#733e0a',
    '950': '#432004',
  },
  green: {
    '25': '#f6fef9',
    '50': '#f0fdf4',
    '100': '#dcfce7',
    '200': '#b9f8cf',
    '300': '#7bf1a8',
    '400': '#05df72',
    '500': '#12b76a',
    '600': '#00a63e',
    '700': '#008236',
    '800': '#016630',
    '900': '#0d542b',
    '950': '#032e15',
  },
  lime: {
    '25': '#f8ffef',
    '50': '#eef6e3',
    '100': '#deeec6',
    '200': '#cae6a0',
    '300': '#a6d467',
    '400': '#77b71c',
    '500': '#5b9500',
    '600': '#4f7f06',
    '700': '#3f6900',
    '800': '#365310',
    '900': '#243a02',
    '950': '#1b2b03',
  },
  red: {
    '25': '#fffbfa',
    '50': '#fef2f2',
    '100': '#ffe2e2',
    '200': '#ffc9c9',
    '300': '#ffa2a2',
    '400': '#ff6467',
    '500': '#fb2c36',
    '600': '#e7000b',
    '700': '#c10007',
    '800': '#9f0712',
    '900': '#82181a',
    '950': '#460809',
  },
  orange: {
    '25': '#fffaf5',
    '50': '#fff6ed',
    '100': '#ffead5',
    '200': '#fddcab',
    '300': '#feb273',
    '400': '#fd853a',
    '500': '#fb6514',
    '600': '#ec4a0a',
    '700': '#c4320a',
    '800': '#9c2a10',
    '900': '#7e2410',
    '950': '#511c10',
  },
  indigo: {
    '25': '#fafaff',
    '50': '#f4f3ff',
    '100': '#e0e7ff',
    '200': '#c6d2ff',
    '300': '#a3b3ff',
    '400': '#a3b3ff',
    '500': '#615fff',
    '600': '#4f39f6',
    '700': '#432dd7',
    '800': '#372aac',
    '900': '#312c85',
    '950': '#1e1a4d',
  },
  teal: {
    '25': '#effdfe',
    '50': '#f0fdfa',
    '100': '#cbfbf1',
    '200': '#96f7e4',
    '300': '#46ecd5',
    '400': '#00d5be',
    '500': '#00bba7',
    '600': '#009689',
    '700': '#00786f',
    '800': '#005f5a',
    '900': '#0b4f4a',
    '950': '#022f2e',
  },
  rose: {
    '25': '#fffbfa',
    '50': '#fff1f2',
    '100': '#ffe4e6',
    '200': '#ffccd3',
    '300': '#ffa1ad',
    '400': '#ff637e',
    '500': '#ff2056',
    '600': '#ec003f',
    '700': '#c70036',
    '800': '#a50036',
    '900': '#8b0836',
    '950': '#4d0218',
  },
  purple: {
    '25':  '#faf9ff',
    '50':  '#f3f0ff',
    '100': '#e9e4ff',
    '200': '#d4ccff',
    '300': '#b3a8ff',
    '400': '#8d7eff',
    '500': '#7c6af6',
    '600': '#6b55e8',
    '700': '#5842d4',
    '800': '#4534b0',
    '900': '#3a2d8a',
    '950': '#1e1650',
  },
} as const;

export const accents = {
  blue: {
    '25': colors.blue['25'],
    '50': colors.blue['50'],
    '100': colors.blue['100'],
    '200': colors.blue['200'],
    '300': colors.blue['300'],
    '400': colors.blue['400'],
    '500': colors.blue['500'],
    '600': colors.blue['600'],
    '700': colors.blue['700'],
    '800': colors.blue['800'],
    '900': colors.blue['900'],
    '950': colors.blue['950'],
  },
  gray: {
    '25': colors.gray['25'],
    '50': colors.gray['50'],
    '100': colors.gray['100'],
    '200': colors.gray['200'],
    '300': colors.gray['300'],
    '400': colors.gray['400'],
    '500': colors.gray['500'],
    '600': colors.gray['600'],
    '700': colors.gray['700'],
    '800': colors.gray['800'],
    '900': colors.gray['900'],
    '950': colors.gray['950'],
  },
  green: {
    '25': colors.green['25'],
    '50': colors.green['50'],
    '100': colors.green['100'],
    '200': colors.green['200'],
    '300': colors.green['300'],
    '400': colors.green['400'],
    '500': colors.green['500'],
    '600': colors.green['600'],
    '700': colors.green['700'],
    '800': colors.green['800'],
    '900': colors.green['900'],
    '950': colors.green['950'],
  },
  indigo: {
    '25': colors.indigo['25'],
    '50': colors.indigo['50'],
    '100': colors.indigo['100'],
    '200': colors.indigo['200'],
    '300': colors.indigo['300'],
    '400': colors.indigo['400'],
    '500': colors.indigo['500'],
    '600': colors.indigo['600'],
    '700': colors.indigo['700'],
    '800': colors.indigo['800'],
    '900': colors.indigo['900'],
    '950': colors.indigo['950'],
  },
  orange: {
    '25': colors.orange['25'],
    '50': colors.orange['50'],
    '100': colors.orange['100'],
    '200': colors.orange['200'],
    '300': colors.orange['300'],
    '400': colors.orange['400'],
    '500': colors.orange['500'],
    '600': colors.orange['600'],
    '700': colors.orange['700'],
    '800': colors.orange['800'],
    '900': colors.orange['900'],
    '950': colors.orange['950'],
  },
  red: {
    '25': colors.red['25'],
    '50': colors.red['50'],
    '100': colors.red['100'],
    '200': colors.red['200'],
    '300': colors.red['300'],
    '400': colors.red['400'],
    '500': colors.red['500'],
    '600': colors.red['600'],
    '700': colors.red['700'],
    '800': colors.red['800'],
    '900': colors.red['900'],
    '950': colors.red['950'],
  },
  rose: {
    '25': colors.rose['25'],
    '50': colors.rose['50'],
    '100': colors.rose['100'],
    '200': colors.rose['200'],
    '300': colors.rose['300'],
    '400': colors.rose['400'],
    '500': colors.rose['500'],
    '600': colors.rose['600'],
    '700': colors.rose['700'],
    '800': colors.rose['800'],
    '900': colors.rose['900'],
    '950': colors.rose['950'],
  },
  sky: {
    '25': colors.sky['25'],
    '50': colors.sky['50'],
    '100': colors.sky['100'],
    '200': colors.sky['200'],
    '300': colors.sky['300'],
    '400': colors.sky['400'],
    '500': colors.sky['500'],
    '600': colors.sky['600'],
    '700': colors.sky['700'],
    '800': colors.sky['800'],
    '900': colors.sky['900'],
    '950': colors.sky['950'],
  },
  teal: {
    '25': colors.teal['25'],
    '50': colors.teal['50'],
    '100': colors.teal['100'],
    '200': colors.teal['200'],
    '300': colors.teal['300'],
    '400': colors.teal['400'],
    '500': colors.teal['500'],
    '600': colors.teal['600'],
    '700': colors.teal['700'],
    '800': colors.teal['800'],
    '900': colors.teal['900'],
    '950': colors.teal['950'],
  },
  yellow: {
    '25': colors.yellow['25'],
    '50': colors.yellow['50'],
    '100': colors.yellow['100'],
    '200': colors.yellow['200'],
    '300': colors.yellow['300'],
    '400': colors.yellow['400'],
    '500': colors.yellow['500'],
    '600': colors.yellow['600'],
    '700': colors.yellow['700'],
    '800': colors.yellow['800'],
    '900': colors.yellow['900'],
    '950': colors.yellow['950'],
  },
  purple: {
    '25':  colors.purple['25'],
    '50':  colors.purple['50'],
    '100': colors.purple['100'],
    '200': colors.purple['200'],
    '300': colors.purple['300'],
    '400': colors.purple['400'],
    '500': colors.purple['500'],
    '600': colors.purple['600'],
    '700': colors.purple['700'],
    '800': colors.purple['800'],
    '900': colors.purple['900'],
    '950': colors.purple['950'],
  },
};

/**
 * Maps pencil-shadcn.pen Accent theme names to color palettes.
 * Use with getPencilVars() to sync a theme accent to a .pen file.
 */
export const pencilAccents = {
  'Gray':   colors.gray,
  'Blue':   colors.blue,
  'Red':    colors.red,
  'Green':  colors.green,
  'Yellow': colors.yellow,
  'Sky':    colors.sky,
  'Indigo': colors.indigo,
  'Teal':   colors.teal,
} as const;


/**
 * Opacity Tokens
 *
 * Discrete opacity scale for overlays, disabled states, and effects.
 *
 * Platform: Agnostic
 */

export const opacityScale = {
  /** 0% — fully transparent */
  0: 0,
  /** 5% — barely visible overlays */
  5: 0.05,
  /** 10% — subtle hover tint */
  10: 0.1,
  /** 20% — light disabled overlay */
  20: 0.2,
  /** 25% */
  25: 0.25,
  /** 30% */
  30: 0.3,
  /** 40% */
  40: 0.4,
  /** 50% — standard scrim */
  50: 0.5,
  /** 60% */
  60: 0.6,
  /** 70% — dark scrim */
  70: 0.7,
  /** 75% */
  75: 0.75,
  /** 80% — disabled elements */
  80: 0.8,
  /** 90% */
  90: 0.9,
  /** 100% — fully opaque */
  100: 1,
} as const;

export const spacing = {
  'xxs': scale['25'],
  'xs': scale['300'],
  'sm': scale['400'],
  'md': scale['500'],
  'lg': scale['600'],
  'xl': scale['700'],
  'xxl': scale['800'],
};

export const fonts = {
  family: {
    base: 'Nunito',
    brand: 'Nunito',
    mono: 'JetBrains Mono, SF Mono, Monaco, Consolas, monospace',
  },
  weight: {
    labels: {
      light: 'Light',
      regular: 'Regular',
      medium: 'Medium',
      semibold: 'Semi Bold',
      bold: 'Bold',
    },
    values: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  size: {
    '10': scale['300'] - scale['50'],
    '12': scale['300'],
    '14': scale['300'] + scale['50'],
    '16': scale['400'],
    '18': scale['400'] + scale['50'],
    '20': scale['500'],
    '24': scale['600'],
    '28': scale['700'],
    '32': scale['800'],
    '40': scale['900'],
    '48': scale['900'] + scale['200'],
    '60': scale['900'] + scale['500'],
  },
  lineHeight: {
    tight: scale['300'],
    normal: scale['300'] + scale['50'] + scale['25'],
    relaxed: scale['400'] + scale['50'],
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

export const typography = {
  'font-family': fonts.family,
  'font-weight': fonts.weight.labels,
  'font-size': fonts.size,
  'line-height': fonts.lineHeight,
  'letter-spacing': fonts.letterSpacing,
} as const;


/**
 * Border width scale
 */
export const borderWidths = {
  none: scale['0'],
  thin: scale['25'],
  medium: scale['50'],
  thick: scale['100'],
  heavy: scale['150'],
} as const;

/**
 * Border radius scale
 */
export const borderRadiuses = {
  none: scale['0'],
  xxs: scale['50'],
  xs: scale['100'],
  sm: scale['200'],
  md: scale['300'],
  lg: scale['400'],
  xl: scale['500'],
  xxl: scale['600'],
  xxxl: scale['800'],
  full: 999,
} as const;

/**
 * Raw breakpoint values in pixels
 */
export const breakpoints = {
  /** small phones (iPhone SE) */
  xs: 375,
  /** large phones / small tablets */
  sm: 640,
  /** tablets (iPad portrait) */
  md: 768,
  /** tablets landscape / small laptops */
  lg: 1024,
  /** desktop */
  xl: 1280,
  /**  large / wide desktop */
  '2xl': 1536,
} as const;



interface ShadowDefinition {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

/**
 * Base shadow scale
 */
export const shadows: Record<string, ShadowDefinition> = {
  none: { x: 0, y: 0, blur: 0, spread: 0, color: '#000000', opacity: 0 },
  sm: { x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 0.04 },
  md: { x: 0, y: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.06 },
  lg: { x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.08 },
  xl: { x: 0, y: 20, blur: 25, spread: -5, color: '#000000', opacity: 0.1 },
} as const;

export const zIndexScale = {
  /** 0 — base layer, static content */
  base: 0,
  /** 1 — slightly raised (e.g., focused card) */
  raised: 1,
  /** 10 — sticky headers, floating labels */
  sticky: 10,
  /** 100 — dropdowns, autocomplete menus */
  dropdown: 100,
  /** 200 — fixed navigation, sidebars */
  fixed: 200,
  /** 300 — drawer / side sheets */
  drawer: 300,
  /** 400 — modal overlays / backdrops */
  overlay: 400,
  /** 500 — modal dialogs */
  modal: 500,
  /** 600 — toast / snackbar notifications */
  toast: 600,
  /** 700 — tooltips and popovers */
  tooltip: 700,
  /** 9999 — always on top (debug overlays) */
  top: 9999,
} as const;