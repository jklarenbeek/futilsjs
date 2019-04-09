export const int_MULTIPLIER = 10000;

export function int_sqrtEx(n = 0) {
  n = n|0;
  return (int_MULTIPLIER * Math.sqrt(n))|0;
}

export function int_sqrt(n = 0) {
  n = n|0;
  return Math.sqrt(n)|0;
}

export function int_fib(n = 0) {
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

export function int_norm(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return ((value - min) / (max - min))|0;
}

export function int_lerp(norm = 0, min = 0, max = 0) {
  norm = norm|0; min = min|0; max = max|0;
  return ((max - min) * (norm + min))|0;
}

export function int_map(value = 0, smin = 0, smax = 0, dmin = 0, dmax = 0) {
  value = value|0; smin = smin|0; smax = smax|0; dmin = dmin|0; dmax = dmax|0;
  return int_lerp(int_norm(value, smin, smax), dmin, dmax)|0;
}

export function int_clamp(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max))|0;
}
export function int_clampu(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return Math.min(Math.max(value, min), max)|0;
}

export function int_inRange(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return ((value >= Math.min(min, max)) &&
          (value <= Math.max(min, max)))|0;
}

export function int_intersectsRange(smin = 0, smax = 0, dmin = 0, dmax = 0) {
  smin = smin|0; smax = smax|0; dmin = dmin|0; dmax = dmax|0;
  return ((Math.max(smin, smax) >= Math.min(dmin, dmax)) && 
          (Math.min(smin, smax) <= Math.max(dmin, dmax)))|0;
}

export function int_intersectsRect(ax = 0, ay = 0, aw = 0, ah = 0, bx = 0, by = 0, bw = 0, bh = 0) {
  ax = ax|0; ay = ay|0; aw = aw|0; ah = ah|0; bx = bx|0; by = by|0; bw = bw|0; bh = bh|0;
  return ((int_intersectsRange(ax|0, (ax + aw)|0, bx|0, (bx + bw)|0) > 0) &&
          (int_intersectsRange(ay|0, (ay + ah)|0, by|0, (by + bh)|0) > 0))|0;
}

export function int_mag2(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return ((dx * dx) + (dy * dy))|0;
}

export function int_hypot(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return int_sqrt((dx * dx) + (dy * dy))|0;
}

export function int_hypotEx(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return int_sqrtEx((dx * dx) + (dy * dy))|0;
}

export function int_dot(ax = 0, ay = 0, bx = 0, by = 0) {
  ax = ax|0; ay = ay|0; bx = bx|0; by = by|0;
  return ((ax * bx) + (ay * by))|0;
}

export function int_cross(ax = 0, ay = 0, bx = 0, by = 0) {
  ax = ax|0; ay = ay|0; bx = bx|0; by = by|0;
  return ((ax * by) - (bx * ay))|0;
}

//#region trigonometry

export const int_PI = (Math.PI * int_MULTIPLIER)|0;
export const int_PI2 = (int_PI * 2)|0;
export const int_PI_A = ((4 / Math.PI) * int_MULTIPLIER)|0;
export const int_PI_B = ((4 / (Math.PI * Math.PI)) * int_MULTIPLIER)|0;

export function int_toRadianEx(degrees = 0) {
  degrees = degrees|0;
  return ((degrees * int_PI) / 180)|0;
}

export function int_toDegreesEx(radians = 0) {
  radians = radians|0;
  return ((int_MULTIPLIER * radians * 180) / int_PI)|0;
}

export function int_wrapRadians(r = 0) {
  r = r|0;
  if (r > int_PI) return (r - int_PI2)|0;
  else if (r < -int_PI) return (r + int_PI2)|0;
  return r|0;
}

export function int_sinLpEx(r = 0) {
  r = r|0;
  return ((r < 0)
    ? (int_PI_A * r + int_PI_B * r * r)
    : (int_PI_A * r - int_PI_B * r * r))|0;
}

export function int_sinLp(r = 0) {
  r = r|0;
  //always wrap input angle between -PI and PI
  return int_sinLpEx(int_wrapRadians(r))|0;
}
