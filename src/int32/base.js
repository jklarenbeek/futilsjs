import {
  mathi32_MULTIPLIER,
  mathi32_abs,
  mathi32_sqrt,
  mathi32_min,
  mathi32_max,
  mathi32_round,
  mathi32_PI,
  mathi32_PI2,
  mathi32_PI41,
  mathi32_PI42,
} from './math';
import {
  mathf64_random,
} from '../float64/math';

let random_seed = mathi32_abs(performance.now() ^ (+mathf64_random() * Number.MAX_SAFE_INTEGER));
export function int32_random() {
  const x = (Math.sin(random_seed++) * mathi32_MULTIPLIER);
  return x - Math.floor(x);
}

export function int32_sqrtEx(n = 0) {
  n = n|0;
  return (mathi32_MULTIPLIER * mathi32_sqrt(n))|0;
}

export function int32_sqrt(n = 0) {
  n = n|0;
  return mathi32_sqrt(n)|0;
}

export function int32_fib(n = 0) {
  n = n|0;
  let c = 0;
  let x = 1;
  let i = 1;
  for (; i !== n; i += 1) {
    const t = (c + x)|0;
    c = x|0;
    x = t|0;
  }
  return c|0;
}

export function int32_norm(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return ((value - min) / (max - min))|0;
}

export function int32_lerp(norm = 0, min = 0, max = 0) {
  norm = norm|0; min = min|0; max = max|0;
  return ((max - min) * (norm + min))|0;
}

export function int32_map(value = 0, smin = 0, smax = 0, dmin = 0, dmax = 0) {
  value = value|0; smin = smin|0; smax = smax|0; dmin = dmin|0; dmax = dmax|0;
  // return int32_lerp(int32_norm(value, smin, smax), dmin, dmax) | 0;
  return mathi32_round((value - smin) * (dmax - dmin) / (smax - smin) + dmin)|0;
}

export function int32_clamp(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return mathi32_min(mathi32_max(value, mathi32_min(min, max)), mathi32_max(min, max))|0;
}
export function int32_clampu(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  // return mathi32_min(mathi32_max(value, min), max)|0;
  return mathi32_max(min, mathi32_min(value, max))|0;
}
export function int32_clampu_u8a(value = 0) {
  value = value | 0;
  return -((255 - value & (value - 255) >> 31)
    - 255 & (255 - value & (value - 255) >> 31)
    - 255 >> 31);
}
export function int32_clampu_u8b(value = 0) {
  value = value | 0;
  value &= -(value >= 0);
  return value | ~-!(value & -256);
}

export function int32_inRange(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return ((value >= mathi32_min(min, max))
    && (value <= mathi32_max(min, max)))|0;
}

export function int32_intersectsRange(smin = 0, smax = 0, dmin = 0, dmax = 0) {
  smin = smin|0; smax = smax|0; dmin = dmin|0; dmax = dmax|0;
  return ((mathi32_max(smin, smax) >= mathi32_min(dmin, dmax))
    && (mathi32_min(smin, smax) <= mathi32_max(dmin, dmax)))|0;
}

export function int32_intersectsRect(
  ax = 0, ay = 0, aw = 0, ah = 0,
  bx = 0, by = 0, bw = 0, bh = 0,
) {
  ax = ax|0; ay = ay|0; aw = aw|0; ah = ah|0; bx = bx|0; by = by|0; bw = bw|0; bh = bh|0;
  return ((int32_intersectsRange(ax | 0, (ax + aw) | 0, bx | 0, (bx + bw) | 0) > 0)
    && (int32_intersectsRange(ay|0, (ay + ah)|0, by|0, (by + bh)|0) > 0))|0;
}

export function int32_mag2(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return ((dx * dx) + (dy * dy))|0;
}

export function int32_hypot(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return int32_sqrt((dx * dx) + (dy * dy))|0;
}

export function int32_hypotEx(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return int32_sqrtEx((dx * dx) + (dy * dy))|0;
}

export function int32_dot(ax = 0, ay = 0, bx = 0, by = 0) {
  ax = ax|0; ay = ay|0; bx = bx|0; by = by|0;
  return ((ax * bx) + (ay * by))|0;
}

export function int32_cross(ax = 0, ay = 0, bx = 0, by = 0) {
  ax = ax|0; ay = ay|0; bx = bx|0; by = by|0;
  return ((ax * by) - (bx * ay))|0;
}

//#region trigonometry

export function int32_toRadianEx(degrees = 0) {
  degrees = degrees|0;
  return ((degrees * mathi32_PI) / 180)|0;
}

export function int32_toDegreesEx(radians = 0) {
  radians = radians|0;
  return ((mathi32_MULTIPLIER * radians * 180) / mathi32_PI)|0;
}

export function int32_wrapRadians(r = 0) {
  r = r|0;
  if (r > mathi32_PI) return (r - mathi32_PI2)|0;
  else if (r < -mathi32_PI) return (r + mathi32_PI2)|0;
  return r|0;
}

export function int32_sinLpEx(r = 0) {
  r = r|0;
  return ((r < 0)
    ? (mathi32_PI41 * r + mathi32_PI42 * r * r)
    : (mathi32_PI41 * r - mathi32_PI42 * r * r))|0;
}

export function int32_sinLp(r = 0) {
  r = r|0;
  //always wrap input angle between -PI and PI
  return int32_sinLpEx(int32_wrapRadians(r))|0;
}

export default {
  random: int32_random,
  sqrt: int32_sqrt,
  sqrtEx: int32_sqrtEx,
  fib: int32_fib,
  norm: int32_norm,
  lerp: int32_lerp,
  map: int32_map,
  clamp: int32_clamp,
  clampu: int32_clampu,
  clamp8u: int32_clampu_u8a,
  clampu8a: int32_clampu_u8a,
  clampu8b: int32_clampu_u8b,
  inRange: int32_inRange,
  intersectsRange: int32_intersectsRange,
  intersectsRect: int32_intersectsRect,
  mag2: int32_mag2,
  hypot: int32_hypot,
  hypotEx: int32_hypotEx,
  dot: int32_dot,
  cross: int32_cross,
  toRadianEx: int32_toRadianEx,
  toDegreesEx: int32_toDegreesEx,
  wrapRadians: int32_wrapRadians,
};
