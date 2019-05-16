export const mathi32_MULTIPLIER = 10000;

export const mathi32_abs = Math.abs;
export const mathi32_round = Math.round;
export const mathi32_ceil = Math.ceil;
export const mathi32_floor = Math.floor;
export const mathi32_min = Math.min;
export const mathi32_max = Math.max;

export const mathi32_sqrt = Math.sqrt;
export const mathi32_asin = Math.asin;
export const mathi32_atan2 = Math.atan2;

export const mathi32_PI = (Math.PI * mathi32_MULTIPLIER)|0;
export const mathi32_PI2 = (mathi32_PI * 2)|0;
export const mathi32_PI1H = (mathi32_PI / 2)|0;
export const mathi32_PI41 = ((4 / Math.PI) * mathi32_MULTIPLIER)|0;
export const mathi32_PI42 = ((4 / (Math.PI * Math.PI)) * mathi32_MULTIPLIER)|0;

export default {
  abs: mathi32_abs,
  round: mathi32_round,
  floor: mathi32_floor,
  min: mathi32_min,
  max: mathi32_max,
  sqrt: mathi32_sqrt,
  asin: mathi32_asin,
  atan2: mathi32_atan2,

  MULTIPLIER: mathi32_MULTIPLIER,
  PI: mathi32_PI,
  PI2: mathi32_PI2,
  PI1H: mathi32_PI1H,
  PI41: mathi32_PI41,
  PI42: mathi32_PI42,
};
