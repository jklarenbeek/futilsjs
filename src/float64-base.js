import {
  mathf64_min,
  mathf64_max,
  mathf64_round,
  mathf64_sqrt,
  mathf64_pow,
  mathf64_atan2,
  mathf64_asin,
  mathf64_SQRTFIVE,
  mathf64_PI2,
  mathf64_PI1H,
  mathf64_PI41,
  mathf64_PI42,
} from './float64-math';

export function float64_gcd(a=0.0, b=0.0) {
  a = +a; b = +b;
  // For example, a 1024x768 monitor has a GCD of 256.
  // When you divide both values by that you get 4x3 or 4: 3.
  return +((b === 0.0) ? +a : +float64_gcd(b, a % b));
}

export function float64_sqrt(n = 0.0) {
  return +mathf64_sqrt(+n);
}

export function float64_hypot2(dx = 0.0, dy = 0.0) {
  return +(+(+dx * +dx) + +(+dy * +dy));
}

export function float64_hypot(dx = 0.0, dy = 0.0) {
  return +mathf64_sqrt(+(+(+dx * +dx) + +(+dy * +dy)));
}

export const float64_isqrt = (function float64_isqrt_oncompile() {
  const f = new Float32Array(1);
  const i = new Int32Array(f.buffer);
  return function float64_isqrt_impl(n = 0.0) {
    n = +n;
    const n2 = +(n * 0.5);
    f[0] = +n;
    i[0] = (0x5f375a86 - ((i[0]|0) >> 1))|0;
    n = +f[0];
    return +(+n * +(1.5 - (+n2 * +n * +n)));
  };
})();

export function float64_fib(n = 0.0) {
  n = +n;
  let c = 0.0;
  let x = 1.0;
  let i = 1.0;
  for (; i !== n; i += 1.0) {
    const t = +(+c + +x);
    c = +x;
    x = +t;
  }
  return +c;
}

// https://gist.github.com/geraldyeo/988116export
export function float64_fib2(value = 0.0) {
  value = +value;
  const fh = +(1.0 / +mathf64_SQRTFIVE * +mathf64_pow(+(+(1.0 + mathf64_SQRTFIVE) / 2.0), +value));
  const sh = +(1.0 / +mathf64_SQRTFIVE * +mathf64_pow(+(+(1.0 - mathf64_SQRTFIVE) / 2.0), +value));
  return +mathf64_round(+(fh - sh));
}

export function float64_norm(value = 0.0, min = 0.0, max = 0.0) {
  value = +value; min = +min; max = +max;
  return +((value - min) / (max - min));
}

export function float64_lerp(norm = 0.0, min = 0.0, max = 0.0) {
  norm = +norm; min = +min; max = +max;
  return +((max - min) * (norm + min));
}

export function float64_map(value = 0.0, smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  value = +value; smin = +smin; smax = +smax; dmin = +dmin; dmax = +dmax;
  return +float64_lerp(+float64_norm(value, smin, smax), dmin, dmax);
}

/**
 * Clamps a value between a checked boudary.
 * and can therefor handle swapped min/max arguments
 *
 * @param {float} value input value
 * @param {float} min minimum bounds
 * @param {float} max maximum bounds
 * @returns {float} clamped value
 */
export function float64_clamp(value = 0.0, min = 0.0, max = 0.0) {
  return +mathf64_min(+mathf64_max(+value, +mathf64_min(+min, +max)), +mathf64_max(+min, +max));
}
/**
 * Clamps a value between an unchecked boundary
 * this function needs min < max!!
 * (see float64_clamp for a checked boundary)
 *
 * @param {float} value input value
 * @param {float} min minimum bounds
 * @param {float} max maximum bounds
 * @returns {float} clamped value
 */
export function float64_clampu(value = 0.0, min = 0.0, max = 0.0) {
  return +mathf64_min(+mathf64_max(+value, +min), +max);
}

export function float64_inRange(value = 0.0, min = 0.0, max = 0.0) {
  return +(+value >= +mathf64_min(+min, +max) && +value <= +mathf64_max(+min, +max));
}

export function float64_intersectsRange(smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +(+mathf64_max(+smin, +smax) >= +mathf64_min(+dmin, +dmax)
    && +mathf64_min(+smin, +smax) <= +mathf64_max(+dmin, +dmax));
}

export function float64_intersectsRect(
  ax = 0.0, ay = 0.0, aw = 0.0, ah = 0.0,
  bx = 0.0, by = 0.0, bw = 0.0, bh = 0.0,
) {
  return +(+(+float64_intersectsRange(+ax, +(+ax + +aw), +bx, +(+bx + +bw)) > 0.0
    && +float64_intersectsRange(+ay, +(+ay + +ah), +by, +(+by + +bh)) > 0.0));
}

/**
 *
 * We can calculate the Dot Product of two vectors this way:
 *
 *    a · b = |a| × |b| × cos(θ)
 *
 * or in this implementation as:
 *
 *    a · b = ax × bx + ay × by
 *
 * When two vectors are at right angles to each other the dot product is zero.
 *
 * @param {float} ax vector A x velocity
 * @param {float} ay vector A y velocity
 * @param {float} bx vector B x velocity
 * @param {float} by vector B y velocity
 * @returns {float} scalar of the dot product
 */
export function float64_dot(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
  return +(+(+ax * +bx) + +(+ay * +by));
}

/**
 *
 * The Cross Product Magnitude
 * a × b of two vectors is another vector that is at right angles to both:
 * The magnitude (length) of the cross product equals the area
 * of a parallelogram with vectors a and b for sides:
 *
 * We can calculate the Cross Product this way:
 *
 *    a × b = |a| |b| sin(θ) n
 *
 * or as
 *
 *    a × b = ax × by - bx × ay
 *
 * Another useful property of the cross product is,
 * that its magnitude is related to the sine of
 * the angle between the two vectors:
 *
 *    | a x b | = |a| . |b| . sine(theta)
 *
 * or
 *
 *    sine(theta) = | a x b | / (|a| . |b|)
 *
 * So, in implementation 1 above, if a and b are known in advance
 * to be unit vectors then the result of that function is exactly that sine() value.
 * @param {float} ax
 * @param {float} ay
 * @param {float} bx
 * @param {float} by
 */
export function float64_cross(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
  return +(+(+ax * +by) - +(+bx * +ay));
}

//#region trigonometry

export function float64_toRadian(degrees = 0.0) {
  return +(+degrees * +Math.PI / 180.0);
}

export function float64_toDegrees(radians = 0.0) {
  return +(+radians * 180.0 / +Math.PI);
}

export function float64_wrapRadians(r = 0.0) {
  r = +r;
  if (+r > Math.PI) return +(+r - +mathf64_PI2);
  else if (+r < -Math.PI) return +(+r + +mathf64_PI2);
  return +r;
}

export function float64_sinLpEx(r = 0.0) {
  r = +r;
  return +((r < 0.0)
    ? +(+mathf64_PI41 * +r + +mathf64_PI42 * +r * +r)
    : +(+mathf64_PI41 * +r - +mathf64_PI42 * +r * +r));
}

export function float64_sinLp(r = 0.0) {
  //always wrap input angle between -PI and PI
  return +float64_sinLpEx(+float64_wrapRadians(+r));
}

export function float64_cosLp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float64_sinLp(+(+r + +mathf64_PI1H));
}

export function float64_cosHp(r = 0.0) {
//   template<typename T>
// inline T cos(T x) noexcept
// {
//     constexpr T tp = 1./(2.*M_PI);
//     x *= tp;
//     x -= T(.25) + std::floor(x + T(.25));
//     x *= T(16.) * (std::abs(x) - T(.5));
//     #if EXTRA_PRECISION
//     x += T(.225) * x * (std::abs(x) - T(1.));
//     #endif
//     return x;
// }
  throw new Error('float64_cosHp is not implemented! r=' + String(r));
}

export function float64_sinMpEx(r = 0.0) {
  r = +r;
  const sin = +((r < 0.0)
    ? +(mathf64_PI41 * r + mathf64_PI42 * r * r)
    : +(mathf64_PI41 * r - mathf64_PI42 * r * r));
  return +((sin < 0.0)
    ? +(0.225 * (sin * -sin - sin) + sin)
    : +(0.225 * (sin * sin - sin) + sin));
}

export function float64_sinMp(r = 0.0) {
  return +float64_sinMpEx(+float64_wrapRadians(+r));
}
export function float64_cosMp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float64_sinMp(+(+r + +mathf64_PI1H));
}

export function float64_theta(x = 0.0, y = 0.0) {
  return +mathf64_atan2(+y, +x);
  /*
    // alternative was faster, but not anymore.
    // error < 0.005
    y = +y;
    x = +x;
    if (x == 0.0) {
      if (y > 0.0) return +(Math.PI / 2.0);
      if (y == 0.0) return 0.0;
      return +(-Math.PI / 2.0);
    }

    const z = +(y / x);
    var atan = 0.0;
    if (+Math.abs(z) < 1.0) {
      atan = +(z / (1.0 + 0.28 * z * z));
      if (x < 0.0) {
        if (y < 0.0) return +(atan - Math.PI);
        return +(atan + Math.PI);
      }
    }
    else {
      atan = +(Math.PI / 2.0 - z / (z * z + 0.28));
      if (y < 0.0) return +(atan - Math.PI);
    }
    return +(atan);
  */
}

export function float64_phi(y = 0.0, length = 0.0) {
  return +mathf64_asin(+y / +length);
}

//#endregion

export default {
  gcd: float64_gcd,
  sqrt: float64_sqrt,
  hypot2: float64_hypot2,
  hypot: float64_hypot,
  isqrt: float64_isqrt,
  fib: float64_fib,
  fib2: float64_fib2,
  norm: float64_norm,
  lerp: float64_lerp,

  map: float64_map,
  clamp: float64_clamp,
  clampu: float64_clampu,

  inrange: float64_inRange,
  intersectsRange: float64_intersectsRange,
  intersectsRect: float64_intersectsRect,

  dot: float64_dot,
  cross: float64_cross,

  toRadian: float64_toRadian,
  toDefrees: float64_toDegrees,
  wrapRadians: float64_wrapRadians,

  theta: float64_theta,
  phi: float64_phi,
};
