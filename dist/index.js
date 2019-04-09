const int_MULTIPLIER = 10000;

function int_sqrtEx(n = 0) {
  n = n|0;
  return (int_MULTIPLIER * Math.sqrt(n))|0;
}

function int_sqrt$1(n = 0) {
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
  return int_sqrt$1((dx * dx) + (dy * dy))|0;
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

const def_vec2i = Object.seal({ x: 0, y: 0 });
const def_vec2f = Object.seal({ x: 0.0, y: 0.0 });
const def_vec3f = Object.seal({ x: 0.0, y: 0.0, z: 0.0 });

function vec2i(x = 0, y = 0) {
  return { x: x|0, y: y|0 } 
}
//#region neg

function vec2i_neg(v = def_vec2i) {
  return {
    x: (-(v.x|0))|0,
    y: (-(v.y|0))|0,
  }
}
function vec2i_ineg(v = def_vec2i) {
  v.x = (-(v.x|0))|0;
  v.y = (-(v.y|0))|0;
  return v;
}

//#endregion

//#region add

function vec2i_add(a = def_vec2i, b = def_vec2i) {
  return {
    x: ((a.x|0) + (b.x|0))|0,
    y: ((a.y|0) + (b.y|0))|0,
  }
}
function vec2i_addScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return {
    x: ((v.x|0) + scalar)|0,
    y: ((v.y|0) + scalar)|0,
  }
}
function vec2i_iadd(a = def_vec2i, b = def_vec2i) {
  a.x += (b.x|0)|0;
  a.y += (b.y|0)|0;
  return a;
}
function vec2i_iaddScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x += scalar;
  v.y += scalar;
  return v;
}

//#endregion

//#region sub

function vec2i_sub(a = def_vec2i, b = def_vec2i) {
  return {
    x: ((a.x|0) - (b.x|0))|0,
    y: ((a.y|0) - (b.y|0))|0,
  }
}
function vec2i_subScalar(a = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return {
    x: ((a.x|0) - scalar)|0,
    y: ((a.y|0) - scalar)|0,
  }
}
function vec2i_isub(a = def_vec2i, b = def_vec2i) {
  a.x -= (b.x|0)|0;
  a.y -= (b.y|0)|0;
  return a;
}
function vec2i_isubScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x -= scalar;
  v.y -= scalar;
  return v;
}

//#endregion

//#region mul

function vec2i_mul(a = def_vec2i, b = def_vec2i) {
  return {
    x: ((a.x|0) * (b.x|0))|0,
    y: ((a.y|0) * (b.y|0))|0,
  }
}
function vec2i_mulScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return {
    x: ((v.x|0) * scalar)|0,
    y: ((v.y|0) * scalar)|0,
  }
}
function vec2i_imul(a = def_vec2i, b = def_vec2i) {
  a.x *= (b.x|0)|0;
  a.y *= (b.y|0)|0;
  return a;
}
function vec2i_imulScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x *= scalar;
  v.y *= scalar;
  return v;
}

//#endregion

//#region div

function vec2i_div(a = def_vec2i, b = def_vec2i) {
  return {
    x: ((a.x|0) / (b.x|0))|0,
    y: ((a.y|0) / (b.y|0))|0,
  }  
}
function vec2i_divScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return {
    x: ((v.x|0) / scalar)|0,
    y: ((v.y|0) / scalar)|0,
  }
}

function vec2i_idiv(a = def_vec2i, b = def_vec2i) {
  a.x /= b.x|0;
  a.y /= b.y|0;
  return a;
}
function vec2i_idivScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x /= scalar;
  v.y /= scalar;
  return v;
}


//#endregion

//#region mag2, dot and cross products

function vec2i_mag2(v = def_vec2i) {
  return (((v.x|0) * (v.x|0)) + ((v.y|0) * (v.y|0)))|0;
}

function vec2i_dot(a = def_vec2i, b = def_vec2i) {
  return (((a.x|0) * (b.x|0)) + ((a.y|0) * (b.y|0)))|0;
}

function vec2i_cross(a = def_vec2i, b = def_vec2i) {
  return (((a.x|0) * (b.y|0)) - ((a.x|0) * (b.y|0)))|0;
}

function vec2i_cross3(a = def_vec2i, b = def_vec2i, c = def_vec2i) {
  return (
    (((b.x|0) - (a.x|0)) * ((c.y|0) - (a.y|0))) -
    (((b.y|0) - (a.y|0)) * ((c.x|0) - (a.x|0))) );
}

//#endregion

//#region magnitude and normalize

function vec2i_mag(v = def_vec2i) {
  return int_sqrt(vec2i_mag2(v)|0)|0;
}
function vec2i_norm(v = def_vec2i) {
  return vec2i_divScalar(v, vec2i_mag(v)|0)|0;
}
function vec2i_inorm(v = def_vec2i) {
  return vec2i_idivScalar(v, vec2i_mag(v)|0)|0;
}

//#endregion

//#region rotation

function vec2i_angleEx(v = def_vec2i) {
  return (int_MULTIPLIER * Math.atan2((v.y|0), (v.x|0)))|0;
}

function vec2i_rotn90(v = def_vec2i) {
  return {
    x: v.y|0,
    y: (-(v.x|0))|0,
  };
}
function vec2i_irotn90(v = def_vec2i) {
  const t = v.x|0;
  v.x = v.y|0;
  v.y = (-(t))|0;
  return v|0;
}

function vec2i_rot90(v = def_vec2i) {
  return {
    x: (-(v.y|0))|0,
    y: v.x|0,
  };
}
const vec2i_perp = vec2i_rot90;

function vec2i_irot90(v = def_vec2i) {
  const t = v.y|0;
  v.x = (-(t))|0;
  v.y = (v.x|0);
  return v|0;
}
const vec2i_iperp = vec2f_irot90;

//#endregion

function float_sqrt(n = 0.0) {
  n = +n;
  return +Math.sqrt(+n);
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
const float_sqrtFive = +Math.sqrt(5);
function float_fib2(n = 0.0) {
  n = +n;
  const fh = +(1.0 / +float_sqrtFive * +Math.pow(+(+(1.0 + float_sqrtFive ) / 2.0), +n));
  const sh = +(1.0 / +float_sqrtFive * +Math.pow(+(+(1.0 - float_sqrtFive ) / 2.0), +n));
  return +Math.round(fh - sh);
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
  return +Math.min(+Math.max(+value, +Math.min(+min, +max)), +Math.max(+min, +max));
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
  return +Math.min(+Math.max(+value, +min), +max);
}

function float_inRange(value = 0.0, min = 0.0, max = 0.0) {
  return +(+value >= +Math.min(+min, +max) && +value <= +Math.max(+min, +max));
}

function float_intersectsRange(smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +(+Math.max(+smin, +smax) >= +Math.min(+dmin, +dmax) && 
           +Math.min(+smin, +smax) <= +Math.max(+dmin, +dmax));
}

function float_intersectsRect(ax = 0.0, ay = 0.0, aw = 0.0, ah = 0.0, bx = 0.0, by = 0.0, bw = 0.0, bh = 0.0) {
  return +(+(+float_intersectsRange(+ax, +(+ax + +aw), +bx, +(+bx + +bw)) > 0.0 &&
             +float_intersectsRange(+ay, +(+ay + +ah), +by, +(+by + +bh)) > 0.0));
}

function float_mag2(dx = 0.0, dy = 0.0) {
  return +(+(+dx * +dx) + +(+dy * +dy));
}

function float_hypot(dx = 0.0, dy = 0.0) {
  return +Math.sqrt(+(+(+dx * +dx) + +(+dy * +dy)));
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

function float_atan2(y = 0.0, x = 0.0) {
  return +Math.atan2(+y, +x);
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

//#endregion

function vec2f(x = 0.0, y = 0.0) { return { x: +x, y: +y } }
//#region neg

function vec2f_neg(v = def_vec2f) {
  return {
    x: +(-(+v.x)),
    y: +(-(+v.y)),
  }
}
function vec2f_ineg(v = def_vec2f) {
  v.x = +(-(+v.x));
  v.y = +(-(+v.y));
  return v;
}

//#endregion

//#region add

function vec2f_add(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x + +b.x),
    y: +(+a.y + +b.y),
  }
}
function vec2f_addScalar(v = def_vec2f, scalar = 0.0) {
  return {
    x: +(+v.x + +scalar),
    y: +(+v.y + +scalar),
  }
}
function vec2f_iadd(a = def_vec2f, b = def_vec2f) {
  a.x += +(+b.x);
  a.y += +(+b.y);
  return a;
}
function vec2f_iaddScalar(v = def_vec2f, scalar = 0.0) {
  v.x += +scalar;
  v.y += +scalar;
  return v;
}

//#endregion

//#region sub

function vec2f_sub(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x - +b.x),
    y: +(+a.y - +b.y),
  }
}
function vec2f_subScalar(a = def_vec2f, scalar = 0.0) {
  return {
    x: +(+a.x - +scalar),
    y: +(+a.y - +scalar),
  }
}
function vec2f_isub(a = def_vec2f, b = def_vec2f) {
  a.x -= +(+b.x);
  a.y -= +(+b.y);
  return a;
}
function vec2f_isubScalar(v = def_vec2f, scalar = 0.0) {
  v.x -= +scalar;
  v.y -= +scalar;
  return v;
}

//#endregion

//#region mul

function vec2f_mul(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x * +b.x),
    y: +(+a.y * +b.y),
  }
}
function vec2f_mulScalar(v = def_vec2f, scalar = 0.0) {
  return {
    x: +(+v.x * +scalar),
    y: +(+v.y * +scalar),
  }
}
function vec2f_imul(a = def_vec2f, b = def_vec2f) {
  a.x *= +(+b.x);
  a.y *= +(+b.y);
  return a;
}
function vec2f_imulScalar(v = def_vec2f, scalar = 0.0) {
  v.x *= +scalar;
  v.y *= +scalar;
  return v;
}

//#endregion

//#region div

function vec2f_div(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x / +b.x),
    y: +(+a.y / +b.y),
  }  
}
function vec2f_divScalar(v = def_vec2f, scalar = 0.0) {
  return {
    x: +(+v.x / +scalar),
    y: +(+v.y / +scalar),
  }
}

function vec2f_idiv(a = def_vec2f, b = def_vec2f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  return a;
}
function vec2f_idivScalar$1(v = def_vec2f, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  return v;
}


//#endregion

//#region mag2, dot and cross products

function vec2f_mag2(v = def_vec2f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y));
}
function vec2f_dot(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y));
}

/**
 * Returns the cross-product of two vectors
 *
 * @param {vec2f} vector A 
 * @param {vec2f} vector B
 * @returns {double} The cross product of two vectors
 */
function vec2f_cross(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * + +b.y) - +(+a.x * + +b.y));
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
 * @param {vec2f} vector A
 * @param {vec2f} vector B
 * @param {vec2f} vector C
 * @returns {double} The cross product of three vectors
 * 
 */
function vec2f_cross3(a = def_vec2f, b = def_vec2f, c = def_vec2f) {
  return +(
    +(+(+b.x - +a.x) * +(+c.y - +a.y)) -
    +(+(+b.y - +a.y) * +(+c.x - +a.x)) );
}

//#endregion

//#region magnitude and normalize

function vec2f_mag(v = def_vec2f) {
  return +Math.sqrt(+vec2f_mag2(v));
}
function vec2f_norm(v = def_vec2f) {
  return vec2f_divScalar(v, +vec2f_mag(v));
}
function vec2f_inorm(v = def_vec2f) {
  return vec2f_idivScalar$1(v, +vec2f_mag(v));
}

//#endregion

//#region rotation

/**
 * Returns the angle in radians of its vector
 *
 * Math.atan2(dy, dx) === Math.asin(dy/Math.sqrt(dx*dx + dy*dy))
 * 
 * @param {} v Vector
 */
function vec2f_angle(v = def_vec2f) {
  return +Math.atan2(+v.y, +v.x);
}

function vec2f_rotn90(v = def_vec2f) {
  return {
    x: +(+v.y),
    y: +(-(+v.x)),
  };
}
function vec2f_irotn90(v = def_vec2f) {
  const t = +v.x;
  v.x = +(+v.y);
  v.y = +(-(+t));
  return v;
}

function vec2f_rot90(v = def_vec2f) {
  return {
    x: +(-(+v.y)),
    y: +(+v.x),
  };
}
const vec2f_perp = vec2f_rot90;

function vec2f_irot90$1(v = def_vec2f) {
  const t = +v.y;
  v.x = +(-(+t));
  v.y = +(+v.x);
  return v;
}
const vec2f_iperp = vec2f_irot90$1;

/**
 * Rotates a vector by the specified angle in radians
 * 
 * @param {vec2f} v vector 
 * @param {float} r  angle in radians
 * @returns {vec2f} transformed output vector
 */
function vec2f_rotate(v = def_vec2f, r = 0.0) {
  return {
    x: +(+(+v.x * +Math.cos(+r)) - +(+v.y * +Math.sin(+r))),
    y: +(+(+v.x * +Math.sin(+r)) + +(+v.y * +Math.cos(+r))),
  }
}
function vec2f_irotate(v = def_vec2f, r = 0.0) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+(+vx * +Math.cos(+r)) - +(+vy * +Math.sin(+r)));
  v.y = +(+(+vx * +Math.sin(+r)) + +(+vy * +Math.cos(+r)));
  return v;
}

function vec2f_rotateAbout(v = def_vec2f, r = 0.0, p = def_vec2f) {
  return {
    x: +(+p.x + +(+(+v.x - +p.x) * +Math.cos(+r)) - +(+(+v.y - +p.y) * +Math.sin(+r))),
    y: +(+p.y + +(+(+v.x - +p.x) * +Math.sin(+r)) + +(+(+v.y - +p.y) * +Math.cos(+r))),
  }
}
function vec2f_irotateAbout(v = def_vec2f, r = 0.0, p = def_vec2f) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+p.x + +(+(+vx - +p.x) * +Math.cos(+r)) - +(+(+vy - +p.y) * +Math.sin(+r)));
  v.y = +(+p.y + +(+(+vx - +p.x) * +Math.sin(+r)) + +(+(+vy - +p.y) * +Math.cos(+r)));
  return v;
}

/**
 * Rotates a vector by the specified angle in radians
 * 
 * @param {vec2f} v vector 
 * @param {float} r  angle in radians
 * @returns {vec2f} transformed output vector
 */
function vec2f_rotateEx(v = def_vec2f, r = 0.0, sin = Math.sin, cos = Math.cos) {
  return {
    x: +(+(+v.x * +cos(+r)) - +(+v.y * +sin(+r))),
    y: +(+(+v.x * +sin(+r)) + +(+v.y * +cos(+r))),
  }
}
function vec2f_irotateEx(v = def_vec2f, r = 0.0, sin = Math.sin, cos = Math.cos) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+(+vx * +cos(+r)) - +(+vy * +sin(+r)));
  v.y = +(+(+vx * +sin(+r)) + +(+vy * +cos(+r)));
  return v;
}

function vec2f_rotateAboutEx(v = def_vec2f, r = 0.0, p = def_vec2f, sin = Math.sin, cos = Math.cos) {
  return {
    x: +(+p.x + +(+(+v.x - +p.x) * +cos(+r)) - +(+(+v.y - +p.y) * +sin(+r))),
    y: +(+p.y + +(+(+v.x - +p.x) * +sin(+r)) + +(+(+v.y - +p.y) * +cos(+r))),
  }
}
function vec2f_irotateAboutEx(v = def_vec2f, r = 0.0, p = def_vec2f, sin = Math.sin, cos = Math.cos) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+p.x + +(+(+vx - +p.x) * +cos(+r)) - +(+(+vy - +p.y) * +sin(+r)));
  v.y = +(+p.y + +(+(+vx - +p.x) * +sin(+r)) + +(+(+vy - +p.y) * +cos(+r)));
  return v;
}

//#endregion

function vec3f(x = 0.0, y = 0.0 , z = 0.0) {
  return { x: +x, y: +y, z: +z };
}

function vec3f_toVec2(v = def_vec3f) {
  return { x: +v.x, y: +v.y };
}

function vec3f_fromVec2(v = def_vec2f) {
  return { x: +v.x, y: +v.y, z: 0.0 };
}

function vec3f_dub(v = def_vec3f) {
  return { x: +v.x, y: +v.y, z: +v.z };
}

//#region div

function vec3f_div(a = def_vec3f, b = def_vec3f) {
  return {
    x: +(+a.x / +b.x),
    y: +(+a.y / +b.y),
    z: +(+a.z / +b.z),
  }  
}
function vec3f_divScalar(v = def_vec3f, scalar = 0.0) {
  return {
    x: +(+v.x / +scalar),
    y: +(+v.y / +scalar),
    z: +(+v.z / +scalar),
  }
}

function vec3f_idiv(a = def_vec3f, b = def_vec3f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  a.z /= +(+b.z);
  return a;
}
function vec3f_idivScalar(v = def_vec3f, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  v.z /= +scalar;
  return v;
}

//#endregion

//#region magnitude and normalize

function vec3f_mag2(v = def_vec3f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y) + +(+v.z * +v.z));
}

function vec3f_mag(v = def_vec3f) {
  return +Math.sqrt(+vec3f_mag2(v));
}
function vec3f_norm(v = def_vec3f) {
  return vec3f_divScalar(v, +vec3f_mag(v));
}
function vec3f_inorm(v = def_vec3f) {
  return vec2f_idivScalar(v, +vec3f_mag(v));
}

//#endregion

function vec3f_crossABAB(a = def_vec3f, b = def_vec3f
  ) {
  return {
    x: +(+(+a.y * +b.z) - +(+a.z * +b.y)),
    y: +(+(+a.z * +b.x) - +(+a.x * +b.z)),
    z: +(+(+a.x * +b.y) - +(+a.y * +b.x)),
  }
}

export { float_PI_A, float_PI_B, float_PIh, float_PIx2, float_atan2, float_clamp, float_clampu, float_cosHp, float_cosLp, float_cosMp, float_cross, float_dot, float_fib, float_fib2, float_hypot, float_inRange, float_intersectsRange, float_intersectsRect, float_isqrt, float_lerp, float_mag2, float_map, float_norm, float_sinLp, float_sinLpEx, float_sinMp, float_sinMpEx, float_sqrt, float_sqrtFive, float_toDegrees, float_toRadian, float_wrapRadians, int_MULTIPLIER, int_PI, int_PI2, int_PI_A, int_PI_B, int_clamp, int_clampu, int_cross, int_dot, int_fib, int_hypot, int_hypotEx, int_inRange, int_intersectsRange, int_intersectsRect, int_lerp, int_mag2, int_map, int_norm, int_sinLp, int_sinLpEx, int_sqrt$1 as int_sqrt, int_sqrtEx, int_toDegreesEx, int_toRadianEx, int_wrapRadians, vec2f, vec2f_add, vec2f_addScalar, vec2f_angle, vec2f_cross, vec2f_cross3, vec2f_div, vec2f_divScalar, vec2f_dot, vec2f_iadd, vec2f_iaddScalar, vec2f_idiv, vec2f_idivScalar$1 as vec2f_idivScalar, vec2f_imul, vec2f_imulScalar, vec2f_ineg, vec2f_inorm, vec2f_iperp, vec2f_irot90$1 as vec2f_irot90, vec2f_irotate, vec2f_irotateAbout, vec2f_irotateAboutEx, vec2f_irotateEx, vec2f_irotn90, vec2f_isub, vec2f_isubScalar, vec2f_mag, vec2f_mag2, vec2f_mul, vec2f_mulScalar, vec2f_neg, vec2f_norm, vec2f_perp, vec2f_rot90, vec2f_rotate, vec2f_rotateAbout, vec2f_rotateAboutEx, vec2f_rotateEx, vec2f_rotn90, vec2f_sub, vec2f_subScalar, vec2i, vec2i_add, vec2i_addScalar, vec2i_angleEx, vec2i_cross, vec2i_cross3, vec2i_div, vec2i_divScalar, vec2i_dot, vec2i_iadd, vec2i_iaddScalar, vec2i_idiv, vec2i_idivScalar, vec2i_imul, vec2i_imulScalar, vec2i_ineg, vec2i_inorm, vec2i_iperp, vec2i_irot90, vec2i_irotn90, vec2i_isub, vec2i_isubScalar, vec2i_mag, vec2i_mag2, vec2i_mul, vec2i_mulScalar, vec2i_neg, vec2i_norm, vec2i_perp, vec2i_rot90, vec2i_rotn90, vec2i_sub, vec2i_subScalar, vec3f, vec3f_crossABAB, vec3f_div, vec3f_divScalar, vec3f_dub, vec3f_fromVec2, vec3f_idiv, vec3f_idivScalar, vec3f_inorm, vec3f_mag, vec3f_mag2, vec3f_norm, vec3f_toVec2 };
