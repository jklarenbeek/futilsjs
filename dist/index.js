const int_MULTIPLIER = 10000;

function int_sqrtEx(n = 0) {
  n = n|0;
  return (int_MULTIPLIER * Math.sqrt(n))|0;
}

function int_sqrt(n = 0) {
  n = n|0;
  return Math.sqrt(n)|0;
}

function int_fib(n = 0) {
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

function int_norm(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return ((value - min) / (max - min))|0;
}

function int_lerp(norm = 0, min = 0, max = 0) {
  norm = norm|0; min = min|0; max = max|0;
  return ((max - min) * (norm + min))|0;
}

function int_map(value = 0, smin = 0, smax = 0, dmin = 0, dmax = 0) {
  value = value|0; smin = smin|0; smax = smax|0; dmin = dmin|0; dmax = dmax|0;
  return int_lerp(int_norm(value, smin, smax), dmin, dmax)|0;
}

function int_clamp(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max))|0;
}
function int_clampu(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return Math.min(Math.max(value, min), max)|0;
}

function int_inRange(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return ((value >= Math.min(min, max)) &&
          (value <= Math.max(min, max)))|0;
}

function int_intersectsRange(smin = 0, smax = 0, dmin = 0, dmax = 0) {
  smin = smin|0; smax = smax|0; dmin = dmin|0; dmax = dmax|0;
  return ((Math.max(smin, smax) >= Math.min(dmin, dmax)) && 
          (Math.min(smin, smax) <= Math.max(dmin, dmax)))|0;
}

function int_intersectsRect(ax = 0, ay = 0, aw = 0, ah = 0, bx = 0, by = 0, bw = 0, bh = 0) {
  ax = ax|0; ay = ay|0; aw = aw|0; ah = ah|0; bx = bx|0; by = by|0; bw = bw|0; bh = bh|0;
  return ((int_intersectsRange(ax|0, (ax + aw)|0, bx|0, (bx + bw)|0) > 0) &&
          (int_intersectsRange(ay|0, (ay + ah)|0, by|0, (by + bh)|0) > 0))|0;
}

function int_mag2(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return ((dx * dx) + (dy * dy))|0;
}

function int_hypot(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return int_sqrt((dx * dx) + (dy * dy))|0;
}

function int_hypotEx(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return int_sqrtEx((dx * dx) + (dy * dy))|0;
}

function int_dot(ax = 0, ay = 0, bx = 0, by = 0) {
  ax = ax|0; ay = ay|0; bx = bx|0; by = by|0;
  return ((ax * bx) + (ay * by))|0;
}

function int_cross(ax = 0, ay = 0, bx = 0, by = 0) {
  ax = ax|0; ay = ay|0; bx = bx|0; by = by|0;
  return ((ax * by) - (bx * ay))|0;
}

//#region trigonometry

const int_PI = (Math.PI * int_MULTIPLIER)|0;
const int_PI2 = (int_PI * 2)|0;
const int_PI_A = ((4 / Math.PI) * int_MULTIPLIER)|0;
const int_PI_B = ((4 / (Math.PI * Math.PI)) * int_MULTIPLIER)|0;

function int_toRadianEx(degrees = 0) {
  degrees = degrees|0;
  return ((degrees * int_PI) / 180)|0;
}

function int_toDegreesEx(radians = 0) {
  radians = radians|0;
  return ((int_MULTIPLIER * radians * 180) / int_PI)|0;
}

function int_wrapRadians(r = 0) {
  r = r|0;
  if (r > int_PI) return (r - int_PI2)|0;
  else if (r < -int_PI) return (r + int_PI2)|0;
  return r|0;
}

function int_sinLpEx(r = 0) {
  r = r|0;
  return ((r < 0)
    ? (int_PI_A * r + int_PI_B * r * r)
    : (int_PI_A * r - int_PI_B * r * r))|0;
}

function int_sinLp(r = 0) {
  r = r|0;
  //always wrap input angle between -PI and PI
  return int_sinLpEx(int_wrapRadians(r))|0;
}

const mathf_sqrt = Math.sqrt;
const mathf_pow = Math.pow;
const mathf_sin = Math.sin;
const mathf_cos = Math.cos;
const mathf_atan2$1 = Math.atan2;
const mathf_asin = Math.asin;

const mathf_ciel = Math.ceil;
const mathf_floor$1 = Math.floor;
const mathf_round$1 = Math.round;
const mathf_min$1 = Math.min;
const mathf_max$1 = Math.max;

function float_sqrt(n = 0.0) {
  return +mathf_sqrt(+n);
}

function float_hypot2(dx = 0.0, dy = 0.0) {
  return +(+(+dx * +dx) + +(+dy * +dy));
}

function float_hypot(dx = 0.0, dy = 0.0) {
  return +Math.sqrt(+(+(+dx * +dx) + +(+dy * +dy)));
}

const float_isqrt = (function() {
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

function float_fib(n = 0.0) {
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
const float_sqrtFive = +mathf_sqrt(5);
function float_fib2(n = 0.0) {
  n = +n;
  const fh = +(1.0 / +float_sqrtFive * +mathf_pow(+(+(1.0 + float_sqrtFive ) / 2.0), +n));
  const sh = +(1.0 / +float_sqrtFive * +mathf_pow(+(+(1.0 - float_sqrtFive ) / 2.0), +n));
  return +mathf_round$1(fh - sh);
}

function float_norm(value = 0.0, min = 0.0, max = 0.0) {
  return +(+(+value - +min) / +(+max - +min));
}

function float_lerp(norm = 0.0, min = 0.0, max = 0.0) {
  return +(+(+max - +min) * +(+norm + +min));
}

function float_map(value = 0.0, smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
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
function float_clamp(value = 0.0, min = 0.0, max = 0.0) {
  return +mathf_min$1(+mathf_max$1(+value, +mathf_min$1(+min, +max)), +mathf_max$1(+min, +max));
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
function float_clampu(value = 0.0, min = 0.0, max = 0.0) {
  return +mathf_min$1(+mathf_max$1(+value, +min), +max);
}

function float_inRange(value = 0.0, min = 0.0, max = 0.0) {
  return +(+value >= +mathf_min$1(+min, +max) && +value <= +mathf_max$1(+min, +max));
}

function float_intersectsRange(smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +(+mathf_max$1(+smin, +smax) >= +mathf_min$1(+dmin, +dmax) && 
           +mathf_min$1(+smin, +smax) <= +mathf_max$1(+dmin, +dmax));
}

function float_intersectsRect(ax = 0.0, ay = 0.0, aw = 0.0, ah = 0.0, bx = 0.0, by = 0.0, bw = 0.0, bh = 0.0) {
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
function float_dot(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
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
function float_cross(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
  return +(+(+ax * +by) - +(+bx * +ay));
}

//#region trigonometry

const float_PIx2 = Math.PI * 2; // 6.28318531
const float_PIh = Math.PI / 2; // 1.57079632
const float_PI_A = 4 / Math.PI; // 1.27323954
const float_PI_B = 4 / (Math.PI * Math.PI); // 0.405284735

function float_toRadian(degrees = 0.0) {
  return +(+degrees * +Math.PI / 180.0);
}

function float_toDegrees(radians = 0.0) {
  return +(+radians * 180.0 / +Math.PI);
}

function float_wrapRadians(r = 0.0) {
  r = +r;
  if (+r > Math.PI) return +(+r - +float_PIx2);
  else if (+r < -Math.PI) return +(+r + +float_PIx2);
  return +r;
}

function float_sinLpEx(r = 0.0) {
  r = +r;
  return +((r < 0.0)
    ? +(+float_PI_A * +r + +float_PI_B * +r * +r)
    : +(+float_PI_A * +r - +float_PI_B * +r * +r));
}

function float_sinLp(r = 0.0) {
  //always wrap input angle between -PI and PI
  return +float_sinLpEx(+float_wrapRadians(+r));
}

function float_cosLp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float_sinLp(+(+r + +float_PIh));
}

function float_cosHp(r = 0.0) {
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

function float_sinMpEx(r = 0.0) {
  r = +r;
  const sin = +((r < 0.0)
    ? +(float_PI_A * r + float_PI_B * r * r)
    : +(float_PI_A * r - float_PI_B * r * r));
  return +((sin < 0.0)
    ? +(0.225 * (sin * -sin - sin) + sin)
    : +(0.225 * (sin *  sin - sin) + sin));
}

function float_sinMp(r = 0.0) {
  return +float_sinHpEx(+float_wrapRadians(+r));
}
function float_cosMp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float_sinHp(+(+r + +float_PIh));
}

function float_theta(x = 0.0, y = 0.0) {
  return +mathf_atan2$1(+y, +x);
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
const float_angle = float_theta;

function float_phi(y = 0.0, length = 0.0) {
  return +mathf_asin(+y / +length);
}

//#endregion

const def_vec2i = new vec2i();

class vec2i {
  constructor(x = 0, y = 0) {
    this.x = x|0;
    this.y = y|0;
  }
}
//#region flat vec2i pure primitive operators

function vec2i_neg(v = def_vec2i) {
  return new vec2i(
    (-(v.x | 0)) | 0,
    (-(v.y | 0)) | 0,
  );
}
function vec2i_add(a = def_vec2i, b = def_vec2i) {
  return new vec2i(
    ((a.x | 0) + (b.x | 0)) | 0,
    ((a.y | 0) + (b.y | 0)) | 0,
  );
}
function vec2i_adds(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return new vec2i(
    ((v.x | 0) + scalar) | 0,
    ((v.y | 0) + scalar) | 0,
  );
}

function vec2i_sub(a = def_vec2i, b = def_vec2i) {
  return new vec2i(
    ((a.x | 0) - (b.x | 0)) | 0,
    ((a.y | 0) - (b.y | 0)) | 0,
  );
}
function vec2i_subs(a = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return new vec2i(
    ((a.x | 0) - scalar) | 0,
    ((a.y | 0) - scalar) | 0,
  );
}

function vec2i_mul(a = def_vec2i, b = def_vec2i) {
  return new vec2i(
    ((a.x | 0) * (b.x | 0)) | 0,
    ((a.y | 0) * (b.y | 0)) | 0,
  );
}
function vec2i_muls(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return new vec2i(
    ((v.x | 0) * scalar) | 0,
    ((v.y | 0) * scalar) | 0,
  );
}

function vec2i_div(a = def_vec2i, b = def_vec2i) {
  return new vec2i(
    ((a.x | 0) / (b.x | 0)) | 0,
    ((a.y | 0) / (b.y | 0)) | 0,
  );
}
function vec2i_divs(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return new vec2i(
    ((v.x | 0) / scalar) | 0,
    ((v.y | 0) / scalar) | 0,
  );
}


//#endregion

//#region flat vec2i impure primitive operators

function vec2i_ineg(v = def_vec2i) {
  v.x = (-(v.x|0))|0;
  v.y = (-(v.y|0))|0;
  return v;
}

function vec2i_iadd(a = def_vec2i, b = def_vec2i) {
  a.x += (b.x|0)|0;
  a.y += (b.y|0)|0;
  return a;
}
function vec2i_iadds(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x += scalar|0;
  v.y += scalar|0;
  return v;
}

function vec2i_isub(a = def_vec2i, b = def_vec2i) {
  a.x -= (b.x|0)|0;
  a.y -= (b.y|0)|0;
  return a;
}
function vec2i_isubs(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x -= scalar|0;
  v.y -= scalar|0;
  return v;
}

function vec2i_imul(a = def_vec2i, b = def_vec2i) {
  a.x *= (b.x|0)|0;
  a.y *= (b.y|0)|0;
  return a;
}
function vec2i_imuls(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x *= scalar;
  v.y *= scalar;
  return v;
}

function vec2i_idiv(a = def_vec2i, b = def_vec2i) {
  a.x /= b.x|0;
  a.y /= b.y|0;
  return a;
}
function vec2i_idivs(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x /= scalar;
  v.y /= scalar;
  return v;
}

//#endregion

//#region flat vec2i vector products

function vec2i_mag2(v = def_vec2i) {
  return (((v.x|0) * (v.x|0)) + ((v.y|0) * (v.y|0)))|0;
}
function vec2i_mag(v = def_vec2i) {
  return mathf_sqrt(+vec2i_mag2(v))|0;
}

function vec2i_dot(a = def_vec2i, b = def_vec2i) {
  return (((a.x|0) * (b.x|0)) + ((a.y|0) * (b.y|0)))|0;
}
function vec2i_cross(a = def_vec2i, b = def_vec2i) {
  return (((a.x|0) * (b.y|0)) - ((a.y|0) * (b.x|0)))|0;
}

function vec2i_cross3(a = def_vec2i, b = def_vec2i, c = def_vec2i) {
  return (
    (((b.x|0) - (a.x|0)) * ((c.y|0) - (a.y|0))) -
    (((b.y|0) - (a.y|0)) * ((c.x|0) - (a.x|0))) );
}

function vec2i_thetaEx(v = def_vec2i) {
  return (int_MULTIPLIER * mathf_atan2((v.y|0), (v.x|0)))|0;
}
const vec2i_angleEx = vec2i_thetaEx;

function vec2i_phiEx(v= def_vec2i) {
  return (int_MULTIPLIER * mathf_asin((v.y|0) / vec2i_mag(v)));
}


//#endregion

//#region flat vec2i pure advanced vector functions

function vec2i_norm(v = def_vec2i) {
  return vec2i_divs(v, vec2i_mag(v)|0)|0;
}

function vec2i_rotn90(v = def_vec2i) {
  return new vec2i(
    v.y | 0,
    (-(v.x | 0)) | 0,
  );
}
function vec2i_rot90(v = def_vec2i) {
  return {
    x: (-(v.y|0))|0,
    y: v.x|0,
  };
}
const vec2i_perp = vec2i_rot90;


//#endregion

//#region rotation
function vec2i_inorm(v = def_vec2i) {
  return vec2i_idivs(v, vec2i_mag(v)|0)|0;
}

function vec2i_irotn90(v = def_vec2i) {
  const t = v.x|0;
  v.x = v.y|0;
  v.y = (-(t))|0;
  return v;
}

function vec2i_irot90(v = def_vec2i) {
  const t = v.y|0;
  v.x = (-(t))|0;
  v.y = (v.x|0);
  return v;
}
const vec2i_iperp = vec2f_irot90;

//#endregion

//#region shapes

/**
 * Tests if triangle intersects with a rectangle
 * 
 * @param {*} v1 
 * @param {*} v2 
 * @param {*} v3 
 * @param {*} r1 
 * @param {*} r2 
 * @returns {boolean} true if they intersect.
 */
function triangle2i_intersectsRect(v1, v2, v3, r1, r2) {
  /*
    This function borrowed faithfully from a wonderfl (:3) discussion on
    calculating triangle collision with AABBs on the following blog:
    http://sebleedelisle.com/2009/05/super-fast-trianglerectangle-intersection-test/

    This particular optimization best suits my purposes and was contributed
    to the discussion by someone from http://lab9.fr/
  */

  const x0 = v1.x|0;
  const y0 = v1.y|0;
  const x1 = v2.x|0;
  const y1 = v2.y|0;
  const x2 = v3.x|0;
  const y2 = v3.y|0;

  const l = r1.x|0;
  const r = r2.x|0;
  const t = r1.y|0;
  const b = r2.y|0;

  const b0 = (((x0 > l) ? 1 : 0) | (((y0 > t) ? 1 : 0) << 1) |
      (((x0 > r) ? 1 : 0) << 2) | (((y0 > b) ? 1 : 0) << 3))|0;
  if (b0 == 3) return true;

  const b1 = ((x1 > l) ? 1 : 0) | (((y1 > t) ? 1 : 0) << 1) |
      (((x1 > r) ? 1 : 0) << 2) | (((y1 > b) ? 1 : 0) << 3);
  if (b1 == 3) return true;

  const b2 = ((x2 > l) ? 1 : 0) | (((y2 > t) ? 1 : 0) << 1) |
      (((x2 > r) ? 1 : 0) << 2) | (((y2 > b) ? 1 : 0) << 3);
  if (b2 == 3) return true;

  let c = 0;
  let m = 0;
  let s = 0;

  const i0 = (b0 ^ b1)|0;
  if (i0 != 0) {
    m = ((y1-y0) / (x1-x0))|0;
    c = (y0 -(m * x0))|0;
    if (i0 & 1) { s = m * l + c; if ( s > t && s < b) return true; }
    if (i0 & 2) { s = (t - c) / m; if ( s > l && s < r) return true; }
    if (i0 & 4) { s = m * r + c; if ( s > t && s < b) return true; }
    if (i0 & 8) { s = (b - c) / m; if ( s > l && s < r) return true; }
  }

  const i1 = (b1 ^ b2)|0;
  if (i1 != 0) {
    m = ((y2 - y1) / (x2 - x1))|0;
    c = (y1 -(m * x1))|0;
    if (i1 & 1) { s = m * l + c; if ( s > t && s < b) return true; }
    if (i1 & 2) { s = (t - c) / m; if ( s > l && s < r) return true; }
    if (i1 & 4) { s = m * r + c; if ( s > t && s < b) return true; }
    if (i1 & 8) { s = (b - c) / m; if ( s > l && s < r) return true; }
  }

  const i2 = (b0 ^ b2)|0;
  if (i2 != 0) {
    m = ((y2 - y0) / (x2 - x0))|0;
    c = (y0 -(m * x0))|0;
    if (i2 & 1) { s = m * l + c; if ( s > t && s < b) return true; }
    if (i2 & 2) { s = (t - c) / m; if ( s > l && s < r) return true; }
    if (i2 & 4) { s = m * r + c; if ( s > t && s < b) return true; }
    if (i2 & 8) { s = (b - c) / m; if ( s > l && s < r) return true; }
  }

  return false;
}

/**
 * just some notes
 * 
 * 
const fastSin_B = 1.2732395; // 4/pi
const fastSin_C = -0.40528473; // -4 / (pi²)
export function fastSin(value) {
  // See  for graph and equations
  // https://www.desmos.com/calculator/8nkxlrmp7a
  // logic explained here : http://devmaster.net/posts/9648/fast-and-accurate-sine-cosine			
      
  return (value > 0)
    ? fastSin_B * value - fastSin_C * value * value
    : fastSin_B * value + fastSin_C * value * value;
}

export function fastSin2(a) {
  let b, c;
  return a *= 5214
    , c = a << 17
    , a -= 8192
    , a <<= 18
    , a >>= 18
    , a = a * a >> 12
    , b = 19900 - (3516 * a >> 14)
    , b = 4096 - (a * b >> 16)
    , 0 > c && (b = -b)
    , 2.44E-4 * b;
};
  
export function fastSin3(a) {
  a *= 5214;
  let b = a << 17;
  a = a - 8192 << 18 >> 18;
  a = a * a >> 12;
  a = 4096 - (a * (19900 - (3516 * a >> 14)) >> 16);
  0 > b && (a = -a);
  return 2.44E-4 * a
};


 */

const def_vec2f = Object.freeze(new vec2f());

class vec2f {
  constructor(x = 0.0, y = 0.0) {
    this.x = +x;
    this.y = +y;
  }

  gX() {
    return +this.x;
  }
  gY() {
    return +this.y;
  }

  //#region pure primitive vector operators

  neg() {
    return new vec2f(+(-(+this.x)), +(-(+this.y)));
  }

  add(vector = def_vec2f) {
    return new vec2f(+(+this.x + +vector.x), +(+this.y + +vector.y));
  }
  adds(scalar = 0.0) {
    return new vec2f(+(+this.x + +scalar), +(+this.y + +scalar));
  }

  sub(vector = def_vec2f) {
    return new vec2f(+(+this.x - +vector.x), +(+this.y - +vector.y));
  }
  subs(scalar = 0.0) {
    return new vec2f(+(+this.x - +scalar), +(+this.y - +scalar));
  }

  mul(vector = def_vec2f) {
    return new vec2f(+(+this.x * +vector.x), +(+this.y * +vector.y));
  }
  muls(scalar = 0.0) {
    return new vec2f(+(+this.x * +scalar), +(+this.y * +scalar));
  }

  div(vector = def_vec2f) {
    return new vec2f(+(+this.x / +vector.x), +(+this.y / +vector.y));
  }
  divs(scalar = 0.0) {
    return new vec2f(+(+this.x / +scalar), +(+this.y / +scalar));
  }

  //#endregion
  
  //#region impure primitive vector operators
  ineg() {
    this.x = +(-(+this.x));
    this.y = +(-(+this.y));
    return this;
  }

  iadd(vector = def_vec2f) {
    this.x += +vector.x;
    this.y += +vector.y;
    return this;
  }
  iadds(value = 0.0) {
    this.x += +value;
    this.y += +value;
    return this;
  }

  isub(vector = def_vec2f) {
    this.x -= +vector.x;
    this.y -= +vector.y;
    return this;
  }
  isubs(value = 0.0) {
    this.x -= +value;
    this.y -= +value;
    return this;
  }

  imul(vector = def_vec2f) {
    this.x *= +vector.x;
    this.y *= +vector.y;
    return this;
  }
  imuls(value = 0.0) {
    this.x *= +value;
    this.y *= +value;
    return this;
  }

  idiv(vector = def_vec2f) {
    this.x /= +vector.x;
    this.y /= +vector.y;
    return this;
  }
  idivs(value = 0.0) {
    this.x /= +value;
    this.y /= +value;
    return this;
  }

  //#endregion

  //#region vector products
  mag2() {
    return +(+(+this.x * +this.x) + +(+this.y * +this.y));
  }
  mag() {
    return +mathf_sqrt(+this.mag2());
  }

  dot(vector = def_vec2f) {
    return +(+(+this.x * +vector.x) + +(+this.y * +vector.y));
  }

  /**
   * Returns the cross-product of two vectors
   *
   * @param {vec2f} vector B
   * @returns {double} The cross product of two vectors
   */
  cross(vector = def_vec2f) {
    return +(+(+this.x * +vector.y) - +(+this.y * +vector.x));
  }

  /**
   * Returns the cross-product of three vectors
   * 
   * You can determine which side of a line a point is on
   * by converting the line to hyperplane form (implicitly
   * or explicitly) and then computing the perpendicular
   * (pseudo)distance from the point to the hyperplane.
   * 
   * With the crossproduct of two vectors A and B being the vector
   * 
   * AxB = (AyBz − AzBy, AzBx − AxBz, AxBy − AyBx)
   * with Az and Bz being zero you are left with the third component of that vector
   * 
   *    AxBy - AyBx
   * 
   * With A being the vector from point a to b, and B being the vector from point a to c means
   * 
   *    Ax = (b[x]-a[x])
   *    Ay = (b[y]-a[y])
   *    Bx = (c[x]-a[x])
   *    By = (c[y]-a[y])
   * 
   * giving
   * 
   *    AxBy - AyBx = (b[x]-a[x])*(c[y]-a[y])-(b[y]-a[y])*(c[x]-a[x])
   * 
   * which is a scalar, the sign of that scalar will tell you wether point c lies to the left or right of vector ab
   * 
   * @param {vec2f} vector B
   * @param {vec2f} vector C
   * @returns {double} The cross product of three vectors
   * 
   */
  cross3(vector2 = def_vec2f, vector3 = def_vec2f) {
    return +(
      +(+(+vector2.x - +this.x) * +(+vector3.y - +this.y)) -
      +(+(+vector2.y - +this.y) * +(+vector3.x - +this.x)) );
  }

  /**
   * Returns the angle in radians of its vector
   *
   * Math.atan2(dy, dx) === Math.asin(dy/Math.sqrt(dx*dx + dy*dy))
   * 
   * @param {} v Vector
   */
  theta() {
    return +mathf_atan2$1(+this.y, +this.x);
  }
  angle() {
    return +this.theta();
  }
  phi() {
    return +mathf_asin(+this.y / +this.mag());
  }
  
  //#endregion

  //#region pure advanced vector functions
  unit() {
    return this.divs(+this.mag());
  }

  rotn90() {
    return new vec2f(+this.y, +(-(+this.x)));
  }
  rot90() {
    return new vec2f(+(-(+this.y)), +this.x);
  }
  perp() {
    return this.rot90();
  }

  /**
   * Rotates a vector by the specified angle in radians
   * 
   * @param {float} r  angle in radians
   * @returns {vec2f} transformed output vector
   */
  rotate(radians = 0.0) {
    return new vec2f(
      +(+(+this.x * +mathf_cos(+radians)) - +(+this.y * +mathf_sin(+radians))),
      +(+(+this.x * +mathf_sin(+radians)) + +(+this.y * +mathf_cos(+radians)))
    );
  }
  about(vector = def_vec2f, radians = 0.0) {
    return new vec2f(
      +(+vector.x + +(+(+(+this.x - +vector.x) * +mathf_cos(+radians)) - +(+(+this.y - +vector.y) * +mathf_sin(+radians)))),
      +(+vector.y + +(+(+(+this.x - +vector.x) * +mathf_sin(+radians)) + +(+(+this.y - +vector.y) * +mathf_cos(+radians))))
    );
  }

  //#endregion

  //#region impure advanced vector functions
  iunit() {
    return this.idivs(+this.mag());
  }

  irotn90() {
    this.x = +this.y;
    this.y = +(-(+this.x));
    return this;
  }
  irot90() {
    this.x = +(-(+this.y));
    this.y = +this.x;
    return this;
  }
  iperp() {
    return this.irot90();
  }
  irotate(radians = 0.0) {
    this.x = +(+(+this.x * +mathf_cos(+radians)) - +(+this.y * +mathf_sin(+radians)));
    this.y = +(+(+this.x * +mathf_sin(+radians)) + +(+this.y * +mathf_cos(+radians)));
    return this;
  }
  iabout(vector = def_vec2f, radians = 0.0) {
    this.x = +(+vector.x + +(+(+(+this.x - +vector.x) * +mathf_cos(+radians)) - +(+(+this.y - +vector.y) * +mathf_sin(+radians)))),
    this.y = +(+vector.y + +(+(+(+this.x - +vector.x) * +mathf_sin(+radians)) + +(+(+this.y - +vector.y) * +mathf_cos(+radians))));
    return this;
  }


  //#endregion
}

//#region flat vec2f pure primitive operators

function vec2f_neg(v = def_vec2f) {
  return new vec2f(
    +(-(+v.x)),
    +(-(+v.y))
  );
}
function vec2f_add(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x + +b.x),
    +(+a.y + +b.y)
  );
}
function vec2f_adds(v = def_vec2f, scalar = 0.0) {
  return new vec2f(
    +(+v.x + +scalar),
    +(+v.y + +scalar)
  );
}
function vec2f_addms(a = def_vec2f, b = def_vec2f, scalar = 1.0) {
  return new vec2f(
    +(+a.x + +(+b.x * +scalar)),
    +(+a.y + +(+b.y * +scalar))
  );
}

function vec2f_sub(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x - +b.x),
    +(+a.y - +b.y)
  );
}
function vec2f_subs(a = def_vec2f, scalar = 0.0) {
  return new vec2f(
    +(+a.x - +scalar),
    +(+a.y - +scalar)
  );
}

function vec2f_mul(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x * +b.x),
    +(+a.y * +b.y)
  );
}
function vec2f_muls(v = def_vec2f, scalar = 1.0) {
  return new vec2f(
    +(+v.x * +scalar),
    +(+v.y * +scalar)
  );
}

function vec2f_div(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x / +b.x),
    +(+a.y / +b.y)
  );
}
function vec2f_divs(v = def_vec2f, scalar = 1.0) {
  return new vec2f(
    +(+v.x / +scalar),
    +(+v.y / +scalar)
  );
}

function vec2f_ceil(v = def_vec2f) {
  return new vec2f(
    +mathf_ceil(+v.x),
    +mathf_ceil(+v.y)
  );
}
function vec2f_floor(v = def_vec2f) {
  return new vec2f(
    +mathf_floor(+v.x),
    +mathf_floor(+v.y)
  );
}
function vec2f_round(v = def_vec2f) {
  return new vec2f(
    +mathf_round(+v.x),
    +mathf_round(+v.y)
  );
}

function vec2f_min(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +mathf_min(+a.x, +b.x),
    +mathf_min(+a.y, +b.y)
  );
}
function vec2f_max(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +mathf_max(+a.x, +b.x),
    +mathf_max(+a.y, +b.y)
  );
}

//#endregion

//#region flat vec2f impure primitive operators
function vec2f_ineg(v = def_vec2f) {
  v.x = +(-(+v.x));
  v.y = +(-(+v.y));
  return v;
}
function vec2f_iadd(a = def_vec2f, b = def_vec2f) {
  a.x += +b.x;
  a.y += +b.y;
  return a;
}
function vec2f_iadds(v = def_vec2f, scalar = 0.0) {
  v.x += +scalar;
  v.y += +scalar;
  return v;
}
function vec2f_isub(a = def_vec2f, b = def_vec2f) {
  a.x -= +(+b.x);
  a.y -= +(+b.y);
  return a;
}
function vec2f_isubs(v = def_vec2f, scalar = 0.0) {
  v.x -= +scalar;
  v.y -= +scalar;
  return v;
}

function vec2f_imul(a = def_vec2f, b = def_vec2f) {
  a.x *= +(+b.x);
  a.y *= +(+b.y);
  return a;
}
function vec2f_imuls(v = def_vec2f, scalar = 1.0) {
  v.x *= +scalar;
  v.y *= +scalar;
  return v;
}

function vec2f_idiv(a = def_vec2f, b = def_vec2f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  return a;
}
function vec2f_idivs$1(v = def_vec2f, scalar = 1.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  return v;
}

function vec2f_iceil(v = def_vec2f) {
  v.x = +mathf_ceil(+v.x);
  v.y = +mathf_ceil(+v.y);
  return v;
}
function vec2f_ifloor(v = def_vec2f) {
  v.x = +mathf_floor(+v.x),
  v.y = +mathf_floor(+v.y);
  return v;
}
function vec2f_iround(v = def_vec2f) {
  v.x = +mathf_round(+v.x),
  v.y = +mathf_round(+v.y);
  return v;
}

function vec2f_imin(a = def_vec2f, b = def_vec2f) {
  a.x = +mathf_min(+a.x, +b.x);
  a.y = +mathf_min(+a.y, +b.y);
  return a;
}
function vec2f_imax(a = def_vec2f, b = def_vec2f) {
  a.x = +mathf_max(+a.x, +b.x);
  a.y = +mathf_max(+a.y, +b.y);
  return a;
}

//#endregion

//#region flat vec2f vector products

function vec2f_mag2(v = def_vec2f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y));
}
function vec2f_mag(v = def_vec2f) {
  return +mathf_sqrt(+vec2f_mag2(v));
}

function vec2f_dot(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y));
}
function vec2f_cross(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * +b.y) - +(+a.y * +b.x));
}
function vec2f_cross3(a = def_vec2f, b = def_vec2f, c = def_vec2f) {
  return +(
    +(+(+b.x - +a.x) * +(+c.y - +a.y)) -
    +(+(+b.y - +a.y) * +(+c.x - +a.x)) );
}

function vec2f_theta(v = def_vec2f) {
  return +Math.atan2(+v.y, +v.x);
}
const vec2f_angle = vec2f_theta;
function vec2f_phi(v = def_vec2f) {
  return +Math.asin(+v.y / +vec2f_mag(v));
}

//#endregion

//#region flat vec2f pure advanced vector functions
function vec2f_unit(v = def_vec2f) {
  return vec2f_divs(v, +vec2f_mag(v));
}

function vec2f_rotn90(v = def_vec2f) {
  return new vec2f(
    +v.y,
    +(-(+v.x))
  );
}
function vec2f_rot90(v = def_vec2f) {
  return new vec2f(
    +(-(+v.y)),
    +v.x
  );
}
const vec2f_perp = vec2f_rot90;

/**
 * Rotates a vector by the specified angle in radians
 * 
 * @param {float} r  angle in radians
 * @returns {vec2f} transformed output vector
 */
function vec2f_rotate(v = def_vec2f, radians = 0.0) {
  return new vec2f(
    +(+(+v.x * +mathf_cos(+radians)) - +(+v.y * +mathf_sin(+radians))),
    +(+(+v.x * +mathf_sin(+radians)) + +(+v.y * +mathf_cos(+radians)))
  );
}
function vec2f_about(a = def_vec2f, b = def_vec2f, radians = 0.0) {
  return new vec2f(
    +(+vector.x + +(+(+(+a.x - +b.x) * +mathf_cos(+radians)) - +(+(+a.y - +b.y) * +mathf_sin(+radians)))),
    +(+vector.y + +(+(+(+a.x - +b.x) * +mathf_sin(+radians)) + +(+(+a.y - +b.y) * +mathf_cos(+radians))))
  );
}


//#endregion

//#region flat vec2f impure advanced vector functions

function vec2f_iunit(v = def_vec2f) {
  return vec2f_idivs$1(+vec2f_mag(v));
}

function vec2f_irotn90(v = def_vec2f) {
  v.x = +v.y;
  v.y = +(-(+v.x));
  return v;
}
function vec2f_irot90$1(v = def_vec2f) {
  v.x = +(-(+v.y));
  v.y = +v.x;
  return v;
}
const vec2f_iperp = vec2f_irot90$1;

function vec2f_irotate(v = def_vec2f, radians = 0.0) {
  v.x = +(+(+v.x * +mathf_cos(+radians)) - +(+v.y * +mathf_sin(+radians)));
  v.y = +(+(+v.x * +mathf_sin(+radians)) + +(+v.y * +mathf_cos(+radians)));
  return v;
}
function vec2f_iabout(a = def_vec2f, b = def_vec2f, radians = 0.0) {
  a.x = +(+b.x + +(+(+(+a.x - +b.x) * +mathf_cos(+radians)) - +(+(+a.y - +b.y) * +mathf_sin(+radians)))),
  a.y = +(+b.y + +(+(+(+a.x - +b.x) * +mathf_sin(+radians)) + +(+(+a.y - +b.y) * +mathf_cos(+radians))));
  return a;
}

//#endregion


function vec2f_new(x = 0.0, y = 0.0) { return new vec2f(+x, +y); }

const def_vec3f = Object.freeze(new vec3f());

class vec3f {
  constructor(x = 0.0, y = 0.0, z = 0.0) {
    if (x instanceof vec2f) {
      this.x = +x.x;
      this.y = +x.y;
      this.z = +y;
    }
    else {
      this.x = +x;
      this.y = +y;
      this.z = +z;
    }
  }
  gP1() { return new vec2f(+this.x, +this.y); }
  clone() { return Object.create(this); }
}

//#region flat vec3f pure primitive operators

function vec3f_div(a = def_vec3f, b = def_vec3f) {
  return new vec3f(
    +(+a.x / +b.x),
    +(+a.y / +b.y),
    +(+a.z / +b.z)
  );
}
function vec3f_divs(v = def_vec3f, scalar = 0.0) {
  return new vec3f(
    +(+v.x / +scalar),
    +(+v.y / +scalar),
    +(+v.z / +scalar)
  );
}

//#endregion

//#region flat vec3f impure primitive operators

function vec3f_idiv(a = def_vec3f, b = def_vec3f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  a.z /= +(+b.z);
  return a;
}
function vec3f_idivs(v = def_vec3f, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  v.z /= +scalar;
  return v;
}

//#endregion

//#region flat vec3f pure advanced operators

function vec3f_mag2(v = def_vec3f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y) + +(+v.z * +v.z));
}
function vec3f_mag(v = def_vec3f) {
  return +mathf_sqrt(+vec3f_mag2(v));
}
function vec3f_unit(v = def_vec3f) {
  return vec3f_divs(v, +vec3f_mag(v));
}
function vec3f_iunit(v = def_vec3f) {
  return vec2f_idivs(v, +vec3f_mag(v));
}

function vec3f_crossABAB(a = def_vec3f, b = def_vec3f) {
  return new vec3f(
    +(+(+a.y * +b.z) - +(+a.z * +b.y)),
    +(+(+a.z * +b.x) - +(+a.x * +b.z)),
    +(+(+a.x * +b.y) - +(+a.y * +b.x)),
  );
}

//#endregion

//#region vec2d basic shapes

class shape2f {
  pointCount() { return 0; }
}

const point2f_POINTS = 1;
class point2f extends shape2f {
  constructor(p1 = def_vec2f) {
    this.p1 = p1;
  }
  gP1() { return this.p1; }
  pointCount() { return point2f_POINTS; }
}

const circle2f_POINTS = 1;
class circle2f extends shape2f {
  constructor(p1 = def_vec2f, r = 1.0) {
    this.p1 = p1;
    this.radius = +r;
  }
  gP1() { return this.p1; };
  pointCount() { return circle2f_POINTS; }
}

const rectangle2f_POINTS = 2;
class rectangle2f extends shape2f {
  constructor(p1 = def_vec2f, p2 = def_vec2f) {
    this.p1 = p1;
    this.p2 = p2;
  }
  gP1() { return this.p1; };
  gP2() { return this.p2; };
  pointCount() { return rectangle2f_POINTS; }
}

// TODO: argument initialiser to def_triangle2f

const triangle2f_POINTS = 3;
class triangle2f extends shape2f {
  constructor(p1 = def_vec2f, p2 = def_vec2f, p3 = def_vec2f) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
  }
  gP1() { return this.p1; };
  gP2() { return this.p2; };
  gP3() { return this.p3; };
  pointCount() { return triangle2f_POINTS; }

  //#region intersects other shape

  intersectsRect(rectangle = rectangle2f, normal = 1.0) {
    return triangle2f_intersectsRect(this.p1, this.p2, this.p3, rectangle.p1, rectangle.p2, +normal);
  }
  intersectsTangle(triangle = triangle2f) {
    return triangle2f_intersectsTangle(this.p1, this.p2, this.p3, triangle.p1, triangle.p2, triangle.p3);
  }
  //#endregion
}

/**
 * Tests if triangle intersects with rectangle
 * 
 * @param {rectangle2f} rectangle; 
 * @param {*} normal 
 */
function triangle2f_intersectsRect(l1 = def_vec2f, l2 = def_vec2f, l3 = def_vec2f, r1 = def_vec2f, r2 = def_vec2f, normal = 1.0) {
  normal = +normal;
  const dx = +(+r2.x - +r1.x);
  const dy = +(+r2.y - +r1.y);
  return !(
    (((+l1.x - +r1.x) * +dy - (+l1.y - +r1.y) * +dx) * +normal < 0) ||
    (((+l2.x - +r1.x) * +dy - (+l2.y - +r1.y) * +dx) * +normal < 0) ||
    (((+l3.x - +r1.x) * +dy - (+l3.y - +r1.y) * +dx) * +normal < 0));
}
function triangle2f_intersectsTangle(l1, l2, l3, r1, r2, r3) {
  const lnorm = +(
      +(+(+l2.x - +l1.x) * +(+l3.y - +l1.y))
    - +(+(+l2.y - +l1.y) * +(+l3.x - +l1.x)));
  const rnorm = +(
      +(+(+r2.x - +r1.x) * +(+r3.y - +r1.y))
    - +(+(+r2.y - +r1.y) * +(+r3.x - +r1.x)));

  return !(triangle2f_intersectsRect(r1, r2, r3, l1, l2, lnorm)
    || triangle2f_intersectsRect(r1, r2, r3, l2, l3, lnorm)
    || triangle2f_intersectsRect(r1, r2, r3, l3, l1, lnorm)
    || triangle2f_intersectsRect(l1, l2, l3, r1, r2, rnorm)
    || triangle2f_intersectsRect(l1, l2, l3, r2, r3, rnorm)
    || triangle2f_intersectsRect(l1, l2, l3, r3, r1, rnorm));
}

//#endregion

//#region svg path segments

class segm2f {
  constructor(abs = true) {
    this.abs = (typeof abs === 'boolean')
      ? abs // is the coordinate absolute or relative?
      : true;
  }
  gAbs() { return this.abs; }
  isValidPrecursor(segment = segm2f) { return ((segment instanceof segm2f) && !(segment instanceof segm2f_Z)); }
}

class segm2f_M extends segm2f {
  constructor(abs = true, x = 0.0, y = 0.0) {
    super(abs);
    this.p1 = (x instanceof vec2f)
      ? x
      : new vec2f(+x, +y);
  }
  gP1() {
    return this.p1;
  }
}

class segm2f_v extends segm2f {
  constructor(abs = false, y = 0.0) {
    super(abs);
    this.y = (y instanceof vec2f)
      ? this.y = y.y
      : y;
  }
  gY() { return +this.y }
  gP1() { return new vec2f(0.0, +this.y); }
}
class segm2f_h extends segm2f {
  constructor(abs = false, x = 0.0) {
    super(abs);
    this.x = 0.0;
  }
  gX() { return +this.x; }
  gP1() { return new vec2f(+this.x, 0.0); }
}
class segm2f_l extends segm2f {
  constructor(abs = false, p1 = def_vec2f, y = 0.0) {
    super(abs);
    this.p1 = (p1 instanceof vec2f)
      ? p1
      : new vec2f(+p1, +y);
  }
}

class segm2f_q extends segm2f {
  constructor(abs = false, p1 = def_vec2f, p2 = def_vec2f, x2 = 0.0, y2 = 0.0) {
    super(abs);
    if (p1 instanceof vec2f) {
      this.p1 = p1;
      if (p2 instanceof vec2f) {
        this.p2 = p2;
      }
      else {
        this.p2 = new vec2f(+p2, +x2);
      }
    }
    else {
      this.p1 = new vec2f(+p1, +p2);
      this.p2 = new vec2f(+x2, +y2);
    }
  }
  gP1() {
    return this.p1;
  }
  gP2() {
    return this.p2;
  }
}
class segm2f_t extends segm2f {
  constructor(abs = false, p1 = def_vec2f, y = 0.0) {
    super(abs);
    this.p1 = (p1 instanceof vec2f)
      ? p1
      : new vec2f(+p1, +y);
  }
  isValidPrecursor(segment = seg2f) {
    if (segment instanceof segm2f_t) return true;
    if (segment instanceof segm2f_q) return true;
    return false;
  }
}

class segm2f_c extends segm2f {
  constructor(abs = false) {
    super(abs);
    // TODO
  }
}

class segm2f_s extends segm2f {
  constructor(abs = false) {
    super(abs);
    // TODO
  }
  isValidPrecursor(segment = seg2f) {
    if (segment instanceof segm2f_s) return true;
    if (segment instanceof segm2f_c) return true;
    return false;
  }

}

class segm2f_Z extends segm2f {
  constructor() {
    super(true);
  }  
}
//#endregion

//#region path2f
class path2f extends shape2f {
  constructor(list = []) {
    this.list = list;
  }
  isClosed() {
    const list = this.list;
    const len = list.length;
    return (len > 0 && (list[len - 1] instanceof segm2f_Z));
  }
  move(abs, x, y) {
    const segm = new segm2f_M(abs, x, y);
    this.list[this.list.length] = segm;
  }
  vertical(abs, y) {
    const segm = new segm2f_v(abs, y);
    this.list[this.list.length] = segm;
  }
  horizontal(abs, x) {
    const segm = new segm2f_h(abs, x);
    this.list[this.list.length] = segm;
  }
  line(abs, x, y) {
    const segm = new segm2f_l(abs, x, y);
    this.list[this.list.length] = segm;
  }
  close() {
    const segm = new seqm2f_Z();
    this.list[this.list.length] = segm;
  }

}
//#endregion

export { circle2f, circle2f_POINTS, def_vec2f, def_vec2i, def_vec3f, float_PI_A, float_PI_B, float_PIh, float_PIx2, float_angle, float_clamp, float_clampu, float_cosHp, float_cosLp, float_cosMp, float_cross, float_dot, float_fib, float_fib2, float_hypot, float_hypot2, float_inRange, float_intersectsRange, float_intersectsRect, float_isqrt, float_lerp, float_map, float_norm, float_phi, float_sinLp, float_sinLpEx, float_sinMp, float_sinMpEx, float_sqrt, float_sqrtFive, float_theta, float_toDegrees, float_toRadian, float_wrapRadians, int_MULTIPLIER, int_PI, int_PI2, int_PI_A, int_PI_B, int_clamp, int_clampu, int_cross, int_dot, int_fib, int_hypot, int_hypotEx, int_inRange, int_intersectsRange, int_intersectsRect, int_lerp, int_mag2, int_map, int_norm, int_sinLp, int_sinLpEx, int_sqrt, int_sqrtEx, int_toDegreesEx, int_toRadianEx, int_wrapRadians, mathf_asin, mathf_atan2$1 as mathf_atan2, mathf_ciel, mathf_cos, mathf_floor$1 as mathf_floor, mathf_max$1 as mathf_max, mathf_min$1 as mathf_min, mathf_pow, mathf_round$1 as mathf_round, mathf_sin, mathf_sqrt, path2f, point2f, point2f_POINTS, rectangle2f, rectangle2f_POINTS, segm2f, segm2f_M, segm2f_Z, segm2f_c, segm2f_h, segm2f_l, segm2f_q, segm2f_s, segm2f_t, segm2f_v, shape2f, triangle2f, triangle2f_POINTS, triangle2f_intersectsRect, triangle2f_intersectsTangle, triangle2i_intersectsRect, vec2f, vec2f_about, vec2f_add, vec2f_addms, vec2f_adds, vec2f_angle, vec2f_ceil, vec2f_cross, vec2f_cross3, vec2f_div, vec2f_divs, vec2f_dot, vec2f_floor, vec2f_iabout, vec2f_iadd, vec2f_iadds, vec2f_iceil, vec2f_idiv, vec2f_idivs$1 as vec2f_idivs, vec2f_ifloor, vec2f_imax, vec2f_imin, vec2f_imul, vec2f_imuls, vec2f_ineg, vec2f_iperp, vec2f_irot90$1 as vec2f_irot90, vec2f_irotate, vec2f_irotn90, vec2f_iround, vec2f_isub, vec2f_isubs, vec2f_iunit, vec2f_mag, vec2f_mag2, vec2f_max, vec2f_min, vec2f_mul, vec2f_muls, vec2f_neg, vec2f_new, vec2f_perp, vec2f_phi, vec2f_rot90, vec2f_rotate, vec2f_rotn90, vec2f_round, vec2f_sub, vec2f_subs, vec2f_theta, vec2f_unit, vec2i, vec2i_add, vec2i_adds, vec2i_angleEx, vec2i_cross, vec2i_cross3, vec2i_div, vec2i_divs, vec2i_dot, vec2i_iadd, vec2i_iadds, vec2i_idiv, vec2i_idivs, vec2i_imul, vec2i_imuls, vec2i_ineg, vec2i_inorm, vec2i_iperp, vec2i_irot90, vec2i_irotn90, vec2i_isub, vec2i_isubs, vec2i_mag, vec2i_mag2, vec2i_mul, vec2i_muls, vec2i_neg, vec2i_norm, vec2i_perp, vec2i_phiEx, vec2i_rot90, vec2i_rotn90, vec2i_sub, vec2i_subs, vec2i_thetaEx, vec3f, vec3f_crossABAB, vec3f_div, vec3f_divs, vec3f_idiv, vec3f_idivs, vec3f_iunit, vec3f_mag, vec3f_mag2, vec3f_unit };
