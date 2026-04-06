import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Moderate scale — general sizing (margins, paddings, icon sizes).
 * @param size design-time value at 375px width
 * @param factor scaling intensity (0 = none, 1 = full)
 */
export function ms(size: number, factor = 0.5): number {
  return size + (scaleWidth(size) - size) * factor;
}

/** Font scale — text sizes only. */
export function fs(size: number): number {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

/** Radius scale — border radii. */
export function rs(size: number): number {
  return ms(size, 0.3);
}

function scaleWidth(size: number): number {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
}

export function scaleHeight(size: number): number {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
}
