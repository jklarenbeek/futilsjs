export const mathf64_abs = Math.abs;

export const mathf64_sqrt = Math.sqrt;
export const mathf64_pow = Math.pow;
export const mathf64_sin = Math.sin;
export const mathf64_cos = Math.cos;
export const mathf64_atan2 = Math.atan2;
export const mathf64_asin = Math.asin;

export const mathf64_ceil = Math.ceil;
export const mathf64_floor = Math.floor;
export const mathf64_round = Math.round;
export const mathf64_min = Math.min;
export const mathf64_max = Math.max;

export const mathf64_random = Math.random;

export const mathf64_EPSILON = +0.000001;

export const mathf64_SQRTFIVE = +mathf64_sqrt(5);

export const mathf64_PI = +Math.PI;
export const mathf64_PI2 = +(mathf64_PI * 2);
export const mathf64_PI1H = +(mathf64_PI / 2);
export const mathf64_PI41 = +(4 / mathf64_PI);
export const mathf64_PI42 = +(4 / (mathf64_PI * mathf64_PI));

export default {
  abs: mathf64_abs,

  sqrt: mathf64_sqrt,
  pow: mathf64_pow,
  sin: mathf64_sin,
  cos: mathf64_cos,
  atan2: mathf64_atan2,
  asin: mathf64_asin,

  ceil: mathf64_ceil,
  floor: mathf64_floor,
  round: mathf64_round,
  min: mathf64_min,
  max: mathf64_max,

  random: mathf64_random,

  EPSILON: mathf64_EPSILON,

  SQRTFIVE: mathf64_SQRTFIVE,

  PI: mathf64_PI,
  PI2: mathf64_PI2,
  PI1H: mathf64_PI1H,
  PI41: mathf64_PI41,
  PI42: mathf64_PI42,
};
