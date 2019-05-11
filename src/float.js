export const mathf_abs = Math.abs;

export const mathf_sqrt = Math.sqrt;
export const mathf_pow = Math.pow;
export const mathf_sin = Math.sin;
export const mathf_cos = Math.cos;
export const mathf_atan2 = Math.atan2;
export const mathf_asin = Math.asin;

export const mathf_ciel = Math.ceil;
export const mathf_floor = Math.floor;
export const mathf_round = Math.round;
export const mathf_min = Math.min;
export const mathf_max = Math.max;

export const mathf_random = Math.max;

export const mathf_EPSILON = 0.000001;
export const mathf_PI = Math.PI;

export function float_sqrt(n = 0.0) {
  return +mathf_sqrt(+n);
}

export function float_hypot2(dx = 0.0, dy = 0.0) {
  return +(+(+dx * +dx) + +(+dy * +dy));
}

export function float_hypot(dx = 0.0, dy = 0.0) {
  return +Math.sqrt(+(+(+dx * +dx) + +(+dy * +dy)));
}

export const float_isqrt = (function() {
  const f = new Float32Array(1);
  const i = new Int32Array(f.buffer);
  return function float_isqrt_impl(n = 0.0) {
    n = +n;
    const n2 = +(n * 0.5);
    f[0] = +n;
    i[0] = (0x5f375a86 - (i[0]|0 >> 1))|0;
    n = +f[0];
    return +(+n * +(1.5 - (+n2 * +n * +n)));
  };
})();

export function float_fib(n = 0.0) {
  n = +n;
  let c = 0.0;
  let x = 1.0;
  let i = 1.0;
  for (; i !== x; i += 1.0) {
    const t = +(+c + +x);
    c = +x;
    x = +t;
  }
  return +c;
}

// https://gist.github.com/geraldyeo/988116export 
export const float_sqrtFive = +mathf_sqrt(5);
export function float_fib2(n = 0.0) {
  n = +n;
  const fh = +(1.0 / +float_sqrtFive * +mathf_pow(+(+(1.0 + float_sqrtFive ) / 2.0), +n));
  const sh = +(1.0 / +float_sqrtFive * +mathf_pow(+(+(1.0 - float_sqrtFive ) / 2.0), +n));
  return +mathf_round(fh - sh);
}

export function float_norm(value = 0.0, min = 0.0, max = 0.0) {
  return +(+(+value - +min) / +(+max - +min));
}

export function float_lerp(norm = 0.0, min = 0.0, max = 0.0) {
  return +(+(+max - +min) * +(+norm + +min));
}

export function float_map(value = 0.0, smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +float_lerp(+float_norm(+value, +smin, +smax), +dmin, +dmax);
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
export function float_clamp(value = 0.0, min = 0.0, max = 0.0) {
  return +mathf_min(+mathf_max(+value, +mathf_min(+min, +max)), +mathf_max(+min, +max));
}
/**
 * Clamps a value between an unchecked boundary
 * this function needs min < max!!
 * (see float_clamp for a checked boundary)
 * 
 * @param {float} value input value
 * @param {float} min minimum bounds
 * @param {float} max maximum bounds
 * @returns {float} clamped value 
 */
export function float_clampu(value = 0.0, min = 0.0, max = 0.0) {
  return +mathf_min(+mathf_max(+value, +min), +max);
}

export function float_inRange(value = 0.0, min = 0.0, max = 0.0) {
  return +(+value >= +mathf_min(+min, +max) && +value <= +mathf_max(+min, +max));
}

export function float_intersectsRange(smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +(+mathf_max(+smin, +smax) >= +mathf_min(+dmin, +dmax) && 
           +mathf_min(+smin, +smax) <= +mathf_max(+dmin, +dmax));
}

export function float_intersectsRect(ax = 0.0, ay = 0.0, aw = 0.0, ah = 0.0, bx = 0.0, by = 0.0, bw = 0.0, bh = 0.0) {
  return +(+(+float_intersectsRange(+ax, +(+ax + +aw), +bx, +(+bx + +bw)) > 0.0 &&
             +float_intersectsRange(+ay, +(+ay + +ah), +by, +(+by + +bh)) > 0.0));
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
export function float_dot(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
  return +(+(+ax * +bx) + +(+ay * +by));
}

/**
 * 
 * The Cross Product Magnitude
 * a × b of two vectors is another vector that is at right angles to both:
 * The magnitude (length) of the cross product equals the area of a parallelogram with vectors a and b for sides:
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
 * So, in implementation 1 above, if a and b are known in advance to be unit vectors then the result of that function is exactly that sine() value.
 * @param {float} ax 
 * @param {float} ay 
 * @param {float} bx 
 * @param {float} by 
 */
export function float_cross(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
  return +(+(+ax * +by) - +(+bx * +ay));
}

//#region trigonometry

export const float_PIx2 = Math.PI * 2; // 6.28318531
export const float_PIh = Math.PI / 2; // 1.57079632
export const float_PI_A = 4 / Math.PI; // 1.27323954
export const float_PI_B = 4 / (Math.PI * Math.PI); // 0.405284735

export function float_toRadian(degrees = 0.0) {
  return +(+degrees * +Math.PI / 180.0);
}

export function float_toDegrees(radians = 0.0) {
  return +(+radians * 180.0 / +Math.PI);
}

export function float_wrapRadians(r = 0.0) {
  r = +r;
  if (+r > Math.PI) return +(+r - +float_PIx2);
  else if (+r < -Math.PI) return +(+r + +float_PIx2);
  return +r;
}

export function float_sinLpEx(r = 0.0) {
  r = +r;
  return +((r < 0.0)
    ? +(+float_PI_A * +r + +float_PI_B * +r * +r)
    : +(+float_PI_A * +r - +float_PI_B * +r * +r));
}

export function float_sinLp(r = 0.0) {
  //always wrap input angle between -PI and PI
  return +float_sinLpEx(+float_wrapRadians(+r));
}

export function float_cosLp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float_sinLp(+(+r + +float_PIh));
}

export function float_cosHp(r = 0.0) {
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
  throw new Error("float_cosHp is not implemented!");
}

export function float_sinMpEx(r = 0.0) {
  r = +r;
  const sin = +((r < 0.0)
    ? +(float_PI_A * r + float_PI_B * r * r)
    : +(float_PI_A * r - float_PI_B * r * r));
  return +((sin < 0.0)
    ? +(0.225 * (sin * -sin - sin) + sin)
    : +(0.225 * (sin *  sin - sin) + sin));
}

export function float_sinMp(r = 0.0) {
  return +float_sinHpEx(+float_wrapRadians(+r));
}
export function float_cosMp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float_sinHp(+(+r + +float_PIh));
}

export function float_theta(x = 0.0, y = 0.0) {
  return +mathf_atan2(+y, +x);
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
export const float_angle = float_theta;

export function float_phi(y = 0.0, length = 0.0) {
  return +mathf_asin(+y / +length);
}

//#endregion

