function isPrimitiveTypeEx(typeString) {
  return typeString === 'integer'
    || typeString === 'number'
    || typeString === 'string'
    || typeString === 'boolean';
}

function isPrimitiveType(obj) {
  const tp = typeof obj;
  return isPrimitiveTypeEx(tp);
}

function isPureObject(obj) {
  return (obj !== undefined
    && obj !== null
    && obj.constructor !== Array
    && typeof obj === 'object');
}

function sanitizePrimitiveValue(value, nullable) {
  if (nullable) {
    if (!value) return null;
    return isPrimitiveType(value) ? value : null;
  }
  if (!value) return undefined;
  return isPrimitiveType(value) ? value : undefined;
}

function checkIfValueDisabled(value, nullable, disabled) {
  if (disabled) return true;
  if (value === undefined) return true;
  if (nullable && value === null) return false;
  return !isPrimitiveType(value);
}

const mathi32_MULTIPLIER = 10000;

const mathi32_abs = Math.abs;
const mathi32_round = Math.round;
const mathi32_ceil = Math.ceil;
const mathi32_floor = Math.floor;
const mathi32_min = Math.min;
const mathi32_max = Math.max;

const mathi32_sqrt = Math.sqrt;
const mathi32_asin = Math.asin;
const mathi32_atan2 = Math.atan2;

const mathi32_PI = (Math.PI * mathi32_MULTIPLIER)|0;
const mathi32_PI2 = (mathi32_PI * 2)|0;
const mathi32_PI1H = (mathi32_PI / 2)|0;
const mathi32_PI41 = ((4 / Math.PI) * mathi32_MULTIPLIER)|0;
const mathi32_PI42 = ((4 / (Math.PI * Math.PI)) * mathi32_MULTIPLIER)|0;

var int32Math = {
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

const mathf64_abs = Math.abs;

const mathf64_sqrt = Math.sqrt;
const mathf64_pow = Math.pow;
const mathf64_sin = Math.sin;
const mathf64_cos = Math.cos;
const mathf64_atan2 = Math.atan2;
const mathf64_asin = Math.asin;

const mathf64_ceil = Math.ceil;
const mathf64_floor = Math.floor;
const mathf64_round = Math.round;
const mathf64_min = Math.min;
const mathf64_max = Math.max;

const mathf64_random = Math.random;

const mathf64_EPSILON = +0.000001;

const mathf64_SQRTFIVE = +mathf64_sqrt(5);

const mathf64_PI = +Math.PI;
const mathf64_PI2 = +(mathf64_PI * 2);
const mathf64_PI1H = +(mathf64_PI / 2);
const mathf64_PI41 = +(4 / mathf64_PI);
const mathf64_PI42 = +(4 / (mathf64_PI * mathf64_PI));

var float64Math = {
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

let random_seed = mathi32_abs(performance.now() ^ (+mathf64_random() * Number.MAX_SAFE_INTEGER));
function int32_random() {
  const x = (Math.sin(random_seed++) * mathi32_MULTIPLIER);
  return x - Math.floor(x);
}

function int32_sqrtEx(n = 0) {
  n = n|0;
  return (mathi32_MULTIPLIER * mathi32_sqrt(n))|0;
}

function int32_sqrt(n = 0) {
  n = n|0;
  return mathi32_sqrt(n)|0;
}

function int32_fib(n = 0) {
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

function int32_norm(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return ((value - min) / (max - min))|0;
}

function int32_lerp(norm = 0, min = 0, max = 0) {
  norm = norm|0; min = min|0; max = max|0;
  return ((max - min) * (norm + min))|0;
}

function int32_map(value = 0, smin = 0, smax = 0, dmin = 0, dmax = 0) {
  value = value|0; smin = smin|0; smax = smax|0; dmin = dmin|0; dmax = dmax|0;
  // return int32_lerp(int32_norm(value, smin, smax), dmin, dmax) | 0;
  return mathi32_round((value - smin) * (dmax - dmin) / (smax - smin) + dmin)|0;
}

function int32_clamp(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return mathi32_min(mathi32_max(value, mathi32_min(min, max)), mathi32_max(min, max))|0;
}
function int32_clampu(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  // return mathi32_min(mathi32_max(value, min), max)|0;
  return mathi32_max(min, mathi32_min(value, max))|0;
}
function int32_clampu_u8a(value = 0) {
  value = value | 0;
  return -((255 - value & (value - 255) >> 31)
    - 255 & (255 - value & (value - 255) >> 31)
    - 255 >> 31);
}
function int32_clampu_u8b(value = 0) {
  value = value | 0;
  value &= -(value >= 0);
  return value | ~-!(value & -256);
}

function int32_inRange(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return ((value >= mathi32_min(min, max))
    && (value <= mathi32_max(min, max)))|0;
}

function int32_intersectsRange(smin = 0, smax = 0, dmin = 0, dmax = 0) {
  smin = smin|0; smax = smax|0; dmin = dmin|0; dmax = dmax|0;
  return ((mathi32_max(smin, smax) >= mathi32_min(dmin, dmax))
    && (mathi32_min(smin, smax) <= mathi32_max(dmin, dmax)))|0;
}

function int32_intersectsRect(
  ax = 0, ay = 0, aw = 0, ah = 0,
  bx = 0, by = 0, bw = 0, bh = 0,
) {
  ax = ax|0; ay = ay|0; aw = aw|0; ah = ah|0; bx = bx|0; by = by|0; bw = bw|0; bh = bh|0;
  return ((int32_intersectsRange(ax | 0, (ax + aw) | 0, bx | 0, (bx + bw) | 0) > 0)
    && (int32_intersectsRange(ay|0, (ay + ah)|0, by|0, (by + bh)|0) > 0))|0;
}

function int32_mag2(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return ((dx * dx) + (dy * dy))|0;
}

function int32_hypot(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return int32_sqrt((dx * dx) + (dy * dy))|0;
}

function int32_hypotEx(dx = 0, dy = 0) {
  dx = dx|0; dy = dy|0;
  return int32_sqrtEx((dx * dx) + (dy * dy))|0;
}

function int32_dot(ax = 0, ay = 0, bx = 0, by = 0) {
  ax = ax|0; ay = ay|0; bx = bx|0; by = by|0;
  return ((ax * bx) + (ay * by))|0;
}

function int32_cross(ax = 0, ay = 0, bx = 0, by = 0) {
  ax = ax|0; ay = ay|0; bx = bx|0; by = by|0;
  return ((ax * by) - (bx * ay))|0;
}

//#region trigonometry

function int32_toRadianEx(degrees = 0) {
  degrees = degrees|0;
  return ((degrees * mathi32_PI) / 180)|0;
}

function int32_toDegreesEx(radians = 0) {
  radians = radians|0;
  return ((mathi32_MULTIPLIER * radians * 180) / mathi32_PI)|0;
}

function int32_wrapRadians(r = 0) {
  r = r|0;
  if (r > mathi32_PI) return (r - mathi32_PI2)|0;
  else if (r < -mathi32_PI) return (r + mathi32_PI2)|0;
  return r|0;
}

function int32_sinLpEx(r = 0) {
  r = r|0;
  return ((r < 0)
    ? (mathi32_PI41 * r + mathi32_PI42 * r * r)
    : (mathi32_PI41 * r - mathi32_PI42 * r * r))|0;
}

function int32_sinLp(r = 0) {
  r = r|0;
  //always wrap input angle between -PI and PI
  return int32_sinLpEx(int32_wrapRadians(r))|0;
}

var int32Base = {
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

class vec2i32 {
  constructor(x = 0, y = 0) {
    this.x = x|0;
    this.y = y|0;
  }
}

//#region flat vec2i pure primitive operators

function vec2i32_neg(v = def_vec2i32) {
  return new vec2i32(
    (-(v.x|0))|0,
    (-(v.y|0))|0,
  );
}
function vec2i32_add(a = def_vec2i32, b = def_vec2i32) {
  return new vec2i32(
    ((a.x|0) + (b.x|0))|0,
    ((a.y|0) + (b.y|0))|0,
  );
}
function vec2i32_adds(v = def_vec2i32, scalar = 0) {
  scalar = scalar|0;
  return new vec2i32(
    ((v.x|0) + scalar)|0,
    ((v.y|0) + scalar)|0,
  );
}

function vec2i32_sub(a = def_vec2i32, b = def_vec2i32) {
  return new vec2i32(
    ((a.x|0) - (b.x|0))|0,
    ((a.y|0) - (b.y|0))|0,
  );
}
function vec2i32_subs(a = def_vec2i32, scalar = 0) {
  scalar = scalar|0;
  return new vec2i32(
    ((a.x|0) - scalar)|0,
    ((a.y|0) - scalar)|0,
  );
}

function vec2i32_mul(a = def_vec2i32, b = def_vec2i32) {
  return new vec2i32(
    ((a.x|0) * (b.x|0))|0,
    ((a.y|0) * (b.y|0))|0,
  );
}
function vec2i32_muls(v = def_vec2i32, scalar = 0) {
  scalar = scalar|0;
  return new vec2i32(
    ((v.x|0) * scalar)|0,
    ((v.y|0) * scalar)|0,
  );
}

function vec2i32_div(a = def_vec2i32, b = def_vec2i32) {
  return new vec2i32(
    ((a.x|0) / (b.x|0))|0,
    ((a.y|0) / (b.y|0))|0,
  );
}
function vec2i32_divs(v = def_vec2i32, scalar = 0) {
  scalar = scalar|0;
  return new vec2i32(
    ((v.x|0) / scalar)|0,
    ((v.y|0) / scalar)|0,
  );
}


//#endregion

//#region flat vec2i impure primitive operators

function vec2i32_ineg(v = def_vec2i32) {
  v.x = (-(v.x|0))|0;
  v.y = (-(v.y|0))|0;
  return v;
}

function vec2i32_iadd(a = def_vec2i32, b = def_vec2i32) {
  a.x += (b.x|0)|0;
  a.y += (b.y|0)|0;
  return a;
}
function vec2i32_iadds(v = def_vec2i32, scalar = 0) {
  scalar = scalar|0;
  v.x += scalar|0;
  v.y += scalar|0;
  return v;
}

function vec2i32_isub(a = def_vec2i32, b = def_vec2i32) {
  a.x -= (b.x|0)|0;
  a.y -= (b.y|0)|0;
  return a;
}
function vec2i32_isubs(v = def_vec2i32, scalar = 0) {
  scalar = scalar|0;
  v.x -= scalar|0;
  v.y -= scalar|0;
  return v;
}

function vec2i32_imul(a = def_vec2i32, b = def_vec2i32) {
  a.x *= (b.x|0)|0;
  a.y *= (b.y|0)|0;
  return a;
}
function vec2i32_imuls(v = def_vec2i32, scalar = 0) {
  scalar = scalar|0;
  v.x *= scalar;
  v.y *= scalar;
  return v;
}

function vec2i32_idiv(a = def_vec2i32, b = def_vec2i32) {
  a.x /= b.x|0;
  a.y /= b.y|0;
  return a;
}
function vec2i32_idivs(v = def_vec2i32, scalar = 0) {
  scalar = scalar|0;
  v.x /= scalar;
  v.y /= scalar;
  return v;
}

//#endregion

//#region flat vec2i vector products

function vec2i32_mag2(v = def_vec2i32) {
  return (((v.x|0) * (v.x|0)) + ((v.y|0) * (v.y|0)))|0;
}
function vec2i32_mag(v = def_vec2i32) {
  return mathi32_sqrt(+vec2i32_mag2(v))|0;
}

function vec2i32_dot(a = def_vec2i32, b = def_vec2i32) {
  return (((a.x|0) * (b.x|0)) + ((a.y|0) * (b.y|0)))|0;
}
function vec2i32_cross(a = def_vec2i32, b = def_vec2i32) {
  return (((a.x|0) * (b.y|0)) - ((a.y|0) * (b.x|0)))|0;
}

function vec2i32_cross3(a = def_vec2i32, b = def_vec2i32, c = def_vec2i32) {
  return ((((b.x | 0) - (a.x | 0)) * ((c.y | 0) - (a.y | 0)))
    - (((b.y|0) - (a.y|0)) * ((c.x|0) - (a.x|0))));
}

function vec2i32_thetaEx(v = def_vec2i32) {
  return (mathi32_MULTIPLIER * mathi32_atan2((v.y|0), (v.x|0)))|0;
}
const vec2i32_angleEx = vec2i32_thetaEx;

function vec2i32_phiEx(v= def_vec2i32) {
  return (mathi32_MULTIPLIER * mathi32_asin((v.y|0) / vec2i32_mag(v)));
}


//#endregion

//#region flat vec2i pure advanced vector functions

function vec2i32_norm(v = def_vec2i32) {
  return vec2i32_divs(v, vec2i32_mag(v)|0)|0;
}

function vec2i32_rotn90(v = def_vec2i32) {
  return new vec2i32(
    v.y|0,
    (-(v.x|0))|0,
  );
}
function vec2i32_rot90(v = def_vec2i32) {
  return {
    x: (-(v.y|0))|0,
    y: v.x|0,
  };
}
const vec2i32_perp = vec2i32_rot90;


//#endregion

//#region rotation
function vec2i32_inorm(v = def_vec2i32) {
  return vec2i32_idivs(v, vec2i32_mag(v)|0)|0;
}

function vec2i32_irotn90(v = def_vec2i32) {
  const t = v.x|0;
  v.x = v.y|0;
  v.y = (-(t))|0;
  return v;
}

function vec2i32_irot90(v = def_vec2i32) {
  const t = v.y|0;
  v.x = (-(t))|0;
  v.y = (v.x|0);
  return v;
}
const vec2i32_iperp = vec2i32_irot90;

//#endregion

//#region shapes

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

const def_vec2i32 = Object.freeze(Object.seal(new vec2i32()));
function vec2i32_new(x = 0, y = 0) { return new vec2i32(x|0, y|0); }

var int32Vec2 = {
  Vec2: vec2i32,
  defVec2: def_vec2i32,
  newVec2: vec2i32_new,

  neg: vec2i32_neg,
  add: vec2i32_add,
  adds: vec2i32_adds,
  sub: vec2i32_sub,
  subs: vec2i32_subs,
  mul: vec2i32_mul,
  muls: vec2i32_muls,
  div: vec2i32_div,
  divs: vec2i32_divs,

  ineg: vec2i32_ineg,
  iadd: vec2i32_iadd,
  iadds: vec2i32_iadds,
  isub: vec2i32_isub,
  isubs: vec2i32_isubs,
  imul: vec2i32_imul,
  imuls: vec2i32_imuls,
  idiv: vec2i32_idiv,
  idivs: vec2i32_idivs,

  mag2: vec2i32_mag2,
  mag: vec2i32_mag,
  dot: vec2i32_dot,
  cross: vec2i32_cross,
  cross3: vec2i32_cross3,
  thetaEx: vec2i32_thetaEx,
  angleEx: vec2i32_thetaEx,
  phiEx: vec2i32_phiEx,
  norm: vec2i32_norm,
  rotn90: vec2i32_rotn90,
  rot90: vec2i32_rot90,
  perp: vec2i32_rot90,

  inorm: vec2i32_inorm,
  irotn90: vec2i32_irotn90,
  irot90: vec2i32_irot90,
  iperp: vec2i32_iperp,
};

function float64_gcd(a=0.0, b=0.0) {
  a = +a; b = +b;
  // For example, a 1024x768 monitor has a GCD of 256.
  // When you divide both values by that you get 4x3 or 4: 3.
  return +((b === 0.0) ? +a : +float64_gcd(b, a % b));
}

function float64_sqrt(n = 0.0) {
  return +mathf64_sqrt(+n);
}

function float64_hypot2(dx = 0.0, dy = 0.0) {
  return +(+(+dx * +dx) + +(+dy * +dy));
}

function float64_hypot(dx = 0.0, dy = 0.0) {
  return +mathf64_sqrt(+(+(+dx * +dx) + +(+dy * +dy)));
}

const float64_isqrt = (function float64_isqrt_oncompile() {
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

function float64_fib(n = 0.0) {
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
function float64_fib2(value = 0.0) {
  value = +value;
  const fh = +(1.0 / +mathf64_SQRTFIVE * +mathf64_pow(+(+(1.0 + mathf64_SQRTFIVE) / 2.0), +value));
  const sh = +(1.0 / +mathf64_SQRTFIVE * +mathf64_pow(+(+(1.0 - mathf64_SQRTFIVE) / 2.0), +value));
  return +mathf64_round(+(fh - sh));
}

function float64_norm(value = 0.0, min = 0.0, max = 0.0) {
  value = +value; min = +min; max = +max;
  return +((value - min) / (max - min));
}

function float64_lerp(norm = 0.0, min = 0.0, max = 0.0) {
  norm = +norm; min = +min; max = +max;
  return +((max - min) * (norm + min));
}

function float64_map(value = 0.0, smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
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
function float64_clamp(value = 0.0, min = 0.0, max = 0.0) {
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
function float64_clampu(value = 0.0, min = 0.0, max = 0.0) {
  return +mathf64_min(+mathf64_max(+value, +min), +max);
}

function float64_inRange(value = 0.0, min = 0.0, max = 0.0) {
  return +(+value >= +mathf64_min(+min, +max) && +value <= +mathf64_max(+min, +max));
}

function float64_intersectsRange(smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +(+mathf64_max(+smin, +smax) >= +mathf64_min(+dmin, +dmax)
    && +mathf64_min(+smin, +smax) <= +mathf64_max(+dmin, +dmax));
}

function float64_intersectsRect(
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
function float64_dot(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
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
function float64_cross(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
  return +(+(+ax * +by) - +(+bx * +ay));
}

//#region trigonometry

function float64_toRadian(degrees = 0.0) {
  return +(+degrees * +Math.PI / 180.0);
}

function float64_toDegrees(radians = 0.0) {
  return +(+radians * 180.0 / +Math.PI);
}

function float64_wrapRadians(r = 0.0) {
  r = +r;
  if (+r > Math.PI) return +(+r - +mathf64_PI2);
  else if (+r < -Math.PI) return +(+r + +mathf64_PI2);
  return +r;
}

function float64_sinLpEx(r = 0.0) {
  r = +r;
  return +((r < 0.0)
    ? +(+mathf64_PI41 * +r + +mathf64_PI42 * +r * +r)
    : +(+mathf64_PI41 * +r - +mathf64_PI42 * +r * +r));
}

function float64_sinLp(r = 0.0) {
  //always wrap input angle between -PI and PI
  return +float64_sinLpEx(+float64_wrapRadians(+r));
}

function float64_cosLp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float64_sinLp(+(+r + +mathf64_PI1H));
}

function float64_cosHp(r = 0.0) {
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

function float64_sinMpEx(r = 0.0) {
  r = +r;
  const sin = +((r < 0.0)
    ? +(mathf64_PI41 * r + mathf64_PI42 * r * r)
    : +(mathf64_PI41 * r - mathf64_PI42 * r * r));
  return +((sin < 0.0)
    ? +(0.225 * (sin * -sin - sin) + sin)
    : +(0.225 * (sin * sin - sin) + sin));
}

function float64_sinMp(r = 0.0) {
  return +float64_sinMpEx(+float64_wrapRadians(+r));
}
function float64_cosMp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float64_sinMp(+(+r + +mathf64_PI1H));
}

function float64_theta(x = 0.0, y = 0.0) {
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

function float64_phi(y = 0.0, length = 0.0) {
  return +mathf64_asin(+y / +length);
}

//#endregion

var float64Base = {
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

/* eslint-disable one-var-declaration-per-line */

class vec2f64 {
  constructor(x = 0.0, y = 0.0) {
    this.x = +x;
    this.y = +y;
  }
}

//#region -- object oriented implementation --

//#region class pure primitive vector operators

vec2f64.prototype.neg = function _vec2f64__neg() {
  return new vec2f64(+(-(+this.x)), +(-(+this.y)));
};

vec2f64.prototype.add = function _vec2f64__add(vector = def_vec2f64) {
  return new vec2f64(+(+this.x + +vector.x), +(+this.y + +vector.y));
};
vec2f64.prototype.adds = function _vec2f64__adds(scalar = 0.0) {
  return new vec2f64(+(+this.x + +scalar), +(+this.y + +scalar));
};

vec2f64.prototype.sub = function _vec2f64__sub(vector = def_vec2f64) {
  return new vec2f64(+(+this.x - +vector.x), +(+this.y - +vector.y));
};
vec2f64.prototype.subs = function _vec2f64__subs(scalar = 0.0) {
  return new vec2f64(+(+this.x - +scalar), +(+this.y - +scalar));
};

vec2f64.prototype.mul = function _vec2f64__mul(vector = def_vec2f64) {
  return new vec2f64(+(+this.x * +vector.x), +(+this.y * +vector.y));
};
vec2f64.prototype.muls = function _vec2f64__muls(scalar = 0.0) {
  return new vec2f64(+(+this.x * +scalar), +(+this.y * +scalar));
};

vec2f64.prototype.div = function _vec2f64__div(vector = def_vec2f64) {
  return new vec2f64(+(+this.x / +vector.x), +(+this.y / +vector.y));
};
vec2f64.prototype.divs = function _vec2f64__divs(scalar = 0.0) {
  return new vec2f64(+(+this.x / +scalar), +(+this.y / +scalar));
};

//#endregion

//#region class impure primitive vector operators
vec2f64.prototype.ineg = function _vec2f64__ineg() {
  this.x = +(-(+this.x));
  this.y = +(-(+this.y));
  return this;
};

vec2f64.prototype.iadd = function _vec2f64__iadd(vector = def_vec2f64) {
  this.x += +vector.x;
  this.y += +vector.y;
  return this;
};
vec2f64.prototype.iadds = function _vec2f64__iadds(value = 0.0) {
  this.x += +value;
  this.y += +value;
  return this;
};

vec2f64.prototype.isub = function _vec2f64__isub(vector = def_vec2f64) {
  this.x -= +vector.x;
  this.y -= +vector.y;
  return this;
};
vec2f64.prototype.isubs = function _vec2f64__isubs(value = 0.0) {
  this.x -= +value;
  this.y -= +value;
  return this;
};

vec2f64.prototype.imul = function _vec2f64__imul(vector = def_vec2f64) {
  this.x *= +vector.x;
  this.y *= +vector.y;
  return this;
};
vec2f64.prototype.imuls = function _vec2f64__imuls(value = 0.0) {
  this.x *= +value;
  this.y *= +value;
  return this;
};

vec2f64.prototype.idiv = function _vec2f64__idiv(vector = def_vec2f64) {
  this.x /= +vector.x;
  this.y /= +vector.y;
  return this;
};
vec2f64.prototype.idivs = function _vec2f64__idivs(value = 0.0) {
  this.x /= +value;
  this.y /= +value;
  return this;
};

//#endregion

//#region class vector products
vec2f64.prototype.mag2 = function _vec2f64__mag2() {
  return +(+(+this.x * +this.x) + +(+this.y * +this.y));
};
vec2f64.prototype.mag = function _vec2f64__mag() {
  return +mathf64_sqrt(+this.mag2());
};

vec2f64.prototype.dot = function _vec2f64__dot(vector = def_vec2f64) {
  return +(+(+this.x * +vector.x) + +(+this.y * +vector.y));
};

/**
 * Returns the cross-product of two vectors
 *
 * @param {vec2f64} vector B
 * @returns {double} The cross product of two vectors
 */
vec2f64.prototype.cross = function _vec2f64__cross(vector = def_vec2f64) {
  return +(+(+this.x * +vector.y) - +(+this.y * +vector.x));
};

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
 * which is a scalar, the sign of that scalar will tell you wether point c
 * lies to the left or right of vector ab
 *
 * @param {vec2f64} vector B
 * @param {vec2f64} vector C
 * @returns {double} The cross product of three vectors
 *
 */
vec2f64.prototype.cross3 = function _vec2f64__cross3(vector2 = def_vec2f64, vector3 = def_vec2f64) {
  return +(
    +(+(+vector2.x - +this.x) * +(+vector3.y - +this.y))
    - +(+(+vector2.y - +this.y) * +(+vector3.x - +this.x)));
};

/**
 * Returns the angle in radians of its vector
 *
 * Math.atan2(dy, dx) === Math.asin(dy/Math.sqrt(dx*dx + dy*dy))
 *
 * @param {} v Vector
 */
function _vec2f64__theta() {
  return +mathf64_atan2(+this.y, +this.x);
}
vec2f64.prototype.theta = _vec2f64__theta;
vec2f64.prototype.angle = _vec2f64__theta;
vec2f64.prototype.phi = function _vec2__phi() {
  return +mathf64_asin(+this.y / +this.mag());
};

//#endregion

//#region class pure advanced vector functions
vec2f64.prototype.unit = function _vec2f64__unit() {
  return this.divs(+this.mag());
};

vec2f64.prototype.rotn90 = function _vec2f64__rotn90() {
  return new vec2f64(+this.y, +(-(+this.x)));
};
function _vec2f64__rot90() {
  return new vec2f64(+(-(+this.y)), +this.x);
}
vec2f64.prototype.rot90 = _vec2f64__rot90;
vec2f64.prototype.perp = _vec2f64__rot90;

/**
 * Rotates a vector by the specified angle in radians
 *
 * @param {float} r  angle in radians
 * @returns {vec2f64} transformed output vector
 */
vec2f64.prototype.rotate = function _vec2f64__rotate(radians = 0.0) {
  return new vec2f64(
    +(+(+this.x * +mathf64_cos(+radians)) - +(+this.y * +mathf64_sin(+radians))),
    +(+(+this.x * +mathf64_sin(+radians)) + +(+this.y * +mathf64_cos(+radians))),
  );
};
vec2f64.prototype.about = function _vec2f64__about(vector = def_vec2f64, radians = 0.0) {
  return new vec2f64(
    +(+vector.x + +(+(+(+this.x - +vector.x) * +mathf64_cos(+radians))
      - +(+(+this.y - +vector.y) * +mathf64_sin(+radians)))),
    +(+vector.y + +(+(+(+this.x - +vector.x) * +mathf64_sin(+radians))
      + +(+(+this.y - +vector.y) * +mathf64_cos(+radians)))),
  );
};

//#endregion

//#region class impure advanced vector functions
vec2f64.prototype.iunit = function _vec2f64__iunit() {
  return this.idivs(+this.mag());
};

vec2f64.prototype.irotn90 = function _vec2f64__irotn90() {
  this.x = +this.y;
  this.y = +(-(+this.x));
  return this;
};
function _vec2f64__irot90() {
  this.x = +(-(+this.y));
  this.y = +this.x;
  return this;
}
vec2f64.prototype.irot90 = _vec2f64__irot90;
vec2f64.prototype.iperp = _vec2f64__irot90;

vec2f64.prototype.irotate = function _vec2f64__irotate(radians = 0.0) {
  this.x = +(+(+this.x * +mathf64_cos(+radians)) - +(+this.y * +mathf64_sin(+radians)));
  this.y = +(+(+this.x * +mathf64_sin(+radians)) + +(+this.y * +mathf64_cos(+radians)));
  return this;
};
vec2f64.prototype.iabout = function _vec2f64__iabout(vector = def_vec2f64, radians = 0.0) {
  this.x = +(+vector.x + +(+(+(+this.x - +vector.x) * +mathf64_cos(+radians))
    - +(+(+this.y - +vector.y) * +mathf64_sin(+radians))));
  this.y = +(+vector.y + +(+(+(+this.x - +vector.x) * +mathf64_sin(+radians))
    + +(+(+this.y - +vector.y) * +mathf64_cos(+radians))));
  return this;
};

//#endregion

//#endregion

//#region -- functional implementation --

//#region flat vec2f pure primitive operators

function vec2f64_neg(v = def_vec2f64) {
  return new vec2f64(
    +(-(+v.x)),
    +(-(+v.y)),
  );
}
function vec2f64_add(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +(+a.x + +b.x),
    +(+a.y + +b.y),
  );
}
function vec2f64_adds(v = def_vec2f64, scalar = 0.0) {
  return new vec2f64(
    +(+v.x + +scalar),
    +(+v.y + +scalar),
  );
}
function vec2f64_addms(a = def_vec2f64, b = def_vec2f64, scalar = 1.0) {
  return new vec2f64(
    +(+a.x + +(+b.x * +scalar)),
    +(+a.y + +(+b.y * +scalar)),
  );
}

function vec2f64_sub(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +(+a.x - +b.x),
    +(+a.y - +b.y),
  );
}
function vec2f64_subs(a = def_vec2f64, scalar = 0.0) {
  return new vec2f64(
    +(+a.x - +scalar),
    +(+a.y - +scalar),
  );
}

function vec2f64_mul(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +(+a.x * +b.x),
    +(+a.y * +b.y),
  );
}
function vec2f64_muls(v = def_vec2f64, scalar = 1.0) {
  return new vec2f64(
    +(+v.x * +scalar),
    +(+v.y * +scalar),
  );
}

function vec2f64_div(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +(+a.x / +b.x),
    +(+a.y / +b.y),
  );
}
function vec2f64_divs(v = def_vec2f64, scalar = 1.0) {
  return new vec2f64(
    +(+v.x / +scalar),
    +(+v.y / +scalar),
  );
}
function vec2f64_inv(v = def_vec2f64) {
  return new vec2f64(
    1.0 / +v.x,
    1.0 / +v.y,
  );
}

function vec2f64_ceil(v = def_vec2f64) {
  return new vec2f64(
    +mathf64_ceil(+v.x),
    +mathf64_ceil(+v.y),
  );
}
function vec2f64_floor(v = def_vec2f64) {
  return new vec2f64(
    +mathf64_floor(+v.x),
    +mathf64_floor(+v.y),
  );
}
function vec2f64_round(v = def_vec2f64) {
  return new vec2f64(
    +mathf64_round(+v.x),
    +mathf64_round(+v.y),
  );
}

function vec2f64_min(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +mathf64_min(+a.x, +b.x),
    +mathf64_min(+a.y, +b.y),
  );
}
function vec2f64_max(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +mathf64_max(+a.x, +b.x),
    +mathf64_max(+a.y, +b.y),
  );
}

//#endregion

//#region flat vec2f impure primitive operators
function vec2f64_ineg(v = def_vec2f64) {
  v.x = +(-(+v.x));
  v.y = +(-(+v.y));
  return v;
}
function vec2f64_iadd(a = def_vec2f64, b = def_vec2f64) {
  a.x += +b.x;
  a.y += +b.y;
  return a;
}
function vec2f64_iadds(v = def_vec2f64, scalar = 0.0) {
  v.x += +scalar;
  v.y += +scalar;
  return v;
}
function vec2f64_iaddms(a = def_vec2f64, b = def_vec2f64, scalar = 1.0) {
  a.x = +(+a.x + +(+b.x * +scalar));
  a.y = +(+a.y + +(+b.y * +scalar));
  return a;
}
function vec2f64_isub(a = def_vec2f64, b = def_vec2f64) {
  a.x -= +(+b.x);
  a.y -= +(+b.y);
  return a;
}
function vec2f64_isubs(v = def_vec2f64, scalar = 0.0) {
  v.x -= +scalar;
  v.y -= +scalar;
  return v;
}

function vec2f64_imul(a = def_vec2f64, b = def_vec2f64) {
  a.x *= +(+b.x);
  a.y *= +(+b.y);
  return a;
}
function vec2f64_imuls(v = def_vec2f64, scalar = 1.0) {
  v.x *= +scalar;
  v.y *= +scalar;
  return v;
}

function vec2f64_idiv(a = def_vec2f64, b = def_vec2f64) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  return a;
}
function vec2f64_idivs(v = def_vec2f64, scalar = 1.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  return v;
}
function vec2f64_iinv(v = def_vec2f64) {
  v.x = 1.0 / +v.x;
  v.y = 1.0 / +v.y;
  return v;
}

function vec2f64_iceil(v = def_vec2f64) {
  v.x = +mathf64_ceil(+v.x);
  v.y = +mathf64_ceil(+v.y);
  return v;
}
function vec2f64_ifloor(v = def_vec2f64) {
  v.x = +mathf64_floor(+v.x);
  v.y = +mathf64_floor(+v.y);
  return v;
}
function vec2f64_iround(v = def_vec2f64) {
  v.x = +mathf64_round(+v.x);
  v.y = +mathf64_round(+v.y);
  return v;
}

function vec2f64_imin(a = def_vec2f64, b = def_vec2f64) {
  a.x = +mathf64_min(+a.x, +b.x);
  a.y = +mathf64_min(+a.y, +b.y);
  return a;
}
function vec2f64_imax(a = def_vec2f64, b = def_vec2f64) {
  a.x = +mathf64_max(+a.x, +b.x);
  a.y = +mathf64_max(+a.y, +b.y);
  return a;
}

//#endregion

//#region flat vec2f boolean products
function vec2f64_eqstrict(a = def_vec2f64, b = def_vec2f64) {
  return a.x === b.x && a.y === b.y;
}
const vec2f64_eqs = vec2f64_eqstrict;
function vec2f64_eq(a = def_vec2f64, b = def_vec2f64) {
  const ax = +a.x, ay = +a.y, bx = +b.x, by = +b.y;
  return (mathf64_abs(ax - bx)
    <= mathf64_EPSILON * mathf64_max(1.0, mathf64_abs(ax), mathf64_abs(bx))
    && mathf64_abs(ay - by)
    <= mathf64_EPSILON * mathf64_max(1.0, mathf64_abs(ay), mathf64_abs(by))
  );
}

//#endregion

//#region flat vec2f vector products

function vec2f64_mag2(v = def_vec2f64) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y));
}
function vec2f64_mag(v = def_vec2f64) {
  return +mathf64_sqrt(+vec2f64_mag2(v));
}
function vec2f64_dist2(a = def_vec2f64, b = def_vec2f64) {
  const dx = +(+b.x - +a.x), dy = +(+b.y - +a.y);
  return +(+(+dx * +dx) + +(+dy * +dy));
}
function vec2f64_dist(a = def_vec2f64, b = def_vec2f64) {
  return +mathf64_sqrt(+vec2f64_dist2(a, b));
}

function vec2f64_dot(a = def_vec2f64, b = def_vec2f64) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y));
}
function vec2f64_cross(a = def_vec2f64, b = def_vec2f64) {
  return +(+(+a.x * +b.y) - +(+a.y * +b.x));
}
function vec2f64_cross3(a = def_vec2f64, b = def_vec2f64, c = def_vec2f64) {
  return +(
    +(+(+b.x - +a.x) * +(+c.y - +a.y))
    - +(+(+b.y - +a.y) * +(+c.x - +a.x))
  );
}

function vec2f64_theta(v = def_vec2f64) {
  return +mathf64_atan2(+v.y, +v.x);
}
function vec2f64_phi(v = def_vec2f64) {
  return +mathf64_asin(+v.y / +vec2f64_mag(v));
}

//#endregion

//#region flat vec2f pure advanced vector functions
function vec2f64_unit(v = def_vec2f64) {
  const mag2 = +vec2f64_mag2();
  return vec2f64_divs(
    v,
    +(mag2 > 0 ? 1.0 / +mathf64_sqrt(mag2) : 1),
  );
}

function vec2f64_lerp(v = 0.0, a = def_vec2f64, b = def_vec2f64) {
  const ax = +a.x, ay = +ay.y;
  return new vec2f64(
    +(ax + +v * (+b.x - ax)),
    +(ay + +v * (+b.y - ay)),
  );
}

function vec2f64_rotn90(v = def_vec2f64) {
  return new vec2f64(
    +v.y,
    +(-(+v.x)),
  );
}
function vec2f64_rot90(v = def_vec2f64) {
  return new vec2f64(
    +(-(+v.y)),
    +v.x,
  );
}

/**
 * Rotates a vector by the specified angle in radians
 *
 * @param {float} r  angle in radians
 * @returns {vec2f} transformed output vector
 */
function vec2f64_rotate(v = def_vec2f64, radians = 0.0) {
  return new vec2f64(
    +(+(+v.x * +mathf64_cos(+radians)) - +(+v.y * +mathf64_sin(+radians))),
    +(+(+v.x * +mathf64_sin(+radians)) + +(+v.y * +mathf64_cos(+radians))),
  );
}
function vec2f64_about(a = def_vec2f64, b = def_vec2f64, radians = 0.0) {
  return new vec2f64(
    +(+b.x
      + +(+(+(+a.x - +b.x) * +mathf64_cos(+radians))
      - +(+(+a.y - +b.y) * +mathf64_sin(+radians)))),
    +(+b.y
      + +(+(+(+a.x - +b.x) * +mathf64_sin(+radians))
      + +(+(+a.y - +b.y) * +mathf64_cos(+radians)))),
  );
}


//#endregion

//#region flat vec2f impure advanced vector functions

function vec2f64_iunit(v = def_vec2f64) {
  return vec2f64_idivs(+vec2f64_mag(v));
}

function vec2f64_irotn90(v = def_vec2f64) {
  v.x = +v.y;
  v.y = +(-(+v.x));
  return v;
}
function vec2f64_irot90(v = def_vec2f64) {
  v.x = +(-(+v.y));
  v.y = +v.x;
  return v;
}
const vec2f64_iperp = vec2f64_irot90;

function vec2f64_irotate(v = def_vec2f64, radians = 0.0) {
  v.x = +(+(+v.x * +mathf64_cos(+radians)) - +(+v.y * +mathf64_sin(+radians)));
  v.y = +(+(+v.x * +mathf64_sin(+radians)) + +(+v.y * +mathf64_cos(+radians)));
  return v;
}
function vec2f64_iabout(a = def_vec2f64, b = def_vec2f64, radians = 0.0) {
  a.x = +(+b.x + +(+(+(+a.x - +b.x) * +mathf64_cos(+radians))
    - +(+(+a.y - +b.y) * +mathf64_sin(+radians))));
  a.y = +(+b.y + +(+(+(+a.x - +b.x) * +mathf64_sin(+radians))
    + +(+(+a.y - +b.y) * +mathf64_cos(+radians))));
  return a;
}

//#endregion

//#endregion

const def_vec2f64 = Object.freeze(Object.seal(vec2f64_new()));
function vec2f64_new(x = 0.0, y = 0.0) { return new vec2f64(+x, +y); }

var float64Vec2 = {
  Vec2: vec2f64,
  defVec2: def_vec2f64,
  newVec2: vec2f64_new,

  neg: vec2f64_neg,
  add: vec2f64_add,
  adds: vec2f64_adds,
  addms: vec2f64_addms,
  sub: vec2f64_sub,
  subs: vec2f64_subs,
  mul: vec2f64_mul,
  muls: vec2f64_muls,
  div: vec2f64_div,
  divs: vec2f64_divs,
  inv: vec2f64_inv,
  ceil: vec2f64_ceil,
  floor: vec2f64_floor,
  round: vec2f64_round,
  min: vec2f64_min,
  max: vec2f64_max,

  ineg: vec2f64_ineg,
  iadd: vec2f64_iadd,
  iadds: vec2f64_iadds,
  iaddms: vec2f64_iaddms,
  isub: vec2f64_isub,
  isubs: vec2f64_isubs,
  imul: vec2f64_imul,
  imuls: vec2f64_imuls,
  idiv: vec2f64_idiv,
  idivs: vec2f64_idivs,
  iinv: vec2f64_iinv,
  iceil: vec2f64_iceil,
  ifloor: vec2f64_ifloor,
  iround: vec2f64_iround,
  imin: vec2f64_imin,
  imax: vec2f64_imax,

  eqstrict: vec2f64_eqstrict,
  eq: vec2f64_eq,

  mag2: vec2f64_mag2,
  mag: vec2f64_mag,
  dist2: vec2f64_dist2,
  dist: vec2f64_dist,
  dot: vec2f64_dot,
  cross: vec2f64_cross,
  cross3: vec2f64_cross3,
  theta: vec2f64_theta,
  angle: vec2f64_theta,
  phi: vec2f64_phi,

  unit: vec2f64_unit,
  lerp: vec2f64_lerp,
  rotn90: vec2f64_rotn90,
  rot90: vec2f64_rot90,
  perp: vec2f64_rot90,
  rotate: vec2f64_rotate,
  about: vec2f64_about,

};

class vec3f64 {
  constructor(x = 0.0, y = 0.0, z = 0.0) {
    if (x instanceof vec2f64) {
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
}

const def_vec3f64 = Object.freeze(Object.seal(vec3f64_new()));

//#region flat vec3f pure primitive operators

function vec3f64_div(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+a.x / +b.x),
    +(+a.y / +b.y),
    +(+a.z / +b.z),
  );
}
function vec3f64_divs(v = def_vec3f64, scalar = 0.0) {
  return new vec3f64(
    +(+v.x / +scalar),
    +(+v.y / +scalar),
    +(+v.z / +scalar),
  );
}

//#endregion

//#region flat vec3f impure primitive operators

function vec3f64_idiv(a = def_vec3f64, b = def_vec3f64) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  a.z /= +(+b.z);
  return a;
}
function vec3f64_idivs(v = def_vec3f64, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  v.z /= +scalar;
  return v;
}

//#endregion

//#region flat vec3f pure advanced operators

function vec3f64_mag2(v = def_vec3f64) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y) + +(+v.z * +v.z));
}
function vec3f64_mag(v = def_vec3f64) {
  return +mathf64_sqrt(+vec3f64_mag2(v));
}
function vec3f64_unit(v = def_vec3f64) {
  return vec3f64_divs(v, +vec3f64_mag(v));
}
function vec3f64_iunit(v = def_vec3f64) {
  return vec3f64_idivs(v, +vec3f64_mag(v));
}

function vec3f64_crossABAB(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+(+a.y * +b.z) - +(+a.z * +b.y)),
    +(+(+a.z * +b.x) - +(+a.x * +b.z)),
    +(+(+a.x * +b.y) - +(+a.y * +b.x)),
  );
}

//#endregion

function vec3f64_new(x = 0.0, y = 0.0, z = 0.0) { return new vec3f64(+x, +y, +z); }

var float64Vec3 = {
  Vec3: vec3f64,
  defVec3: def_vec3f64,
  newVec3: vec3f64_new,

  div: vec3f64_div,
  divs: vec3f64_divs,
  idiv: vec3f64_idiv,
  idivs: vec3f64_idivs,

  mag2: vec3f64_mag2,
  mag: vec3f64_mag,
  unit: vec3f64_unit,
  iunit: vec3f64_iunit,
  crossABAB: vec3f64_crossABAB,

};

/* eslint-disable lines-between-class-members */


//#region basic svg object
//#endregion

//#region vec2d basic shapes

class shape2f64 {
  getP1X() { return this.gP1() ? this.gP1().x : Number.NaN; }
  getP1Y() { return this.gP1() ? this.gP1().y : Number.NaN; }
  getP2X() { return this.gP2() ? this.gP2().x : Number.NaN; }
  getP2Y() { return this.gP2() ? this.gP2().y : Number.NaN; }
  getP3X() { return this.gP3() ? this.gP3().x : Number.NaN; }
  getP3Y() { return this.gP3() ? this.gP3().y : Number.NaN; }
  getP4X() { return this.gP4() ? this.gP4().x : Number.NaN; }
  getP4Y() { return this.gP4() ? this.gP4().y : Number.NaN; }
  pointCount() { return 0.0; }
}

const point2f64_POINTS = 1;
class point2f64 extends shape2f64 {
  constructor(p1 = def_vec2f64) {
    super();
    this.p1 = p1;
  }

  gP1() {
    return this.p1;
  }

  pointCount() {
    return point2f64_POINTS;
  }
}

const circle2f64_POINTS = 1;
class circle2f64 extends shape2f64 {
  constructor(p1 = def_vec2f64, r = 1.0) {
    super();
    this.p1 = p1;
    this.radius = +r;
  }

  gP1() {
    return this.p1;
  }

  pointCount() {
    return circle2f64_POINTS;
  }
}

const rectangle2f64_POINTS = 2;
class rectangle2f64 extends shape2f64 {
  constructor(p1 = def_vec2f64, p2 = def_vec2f64) {
    super();
    this.p1 = p1;
    this.p2 = p2;
  }

  gP1() {
    return this.p1;
  }

  gP2() {
    return this.p2;
  }

  pointCount() {
    return rectangle2f64_POINTS;
  }
}

// TODO: argument initialiser to def_triangle2f

const triangle2f64_POINTS = 3;
class triangle2f64 extends shape2f64 {
  constructor(p1 = def_vec2f64, p2 = def_vec2f64, p3 = def_vec2f64) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
  }

  gP1() {
    return this.p1;
  }

  gP2() {
    return this.p2;
  }

  gP3() {
    return this.p3;
  }

  pointCount() {
    return triangle2f64_POINTS;
  }

  //#region intersects other shape

  intersectsRect(rectangle = rectangle2f64, normal = 1.0) {
    return triangle2f64_intersectsRect(
      this.p1,
      this.p2,
      this.p3,
      rectangle.p1,
      rectangle.p2,
      +normal,
    );
  }

  intersectsTriangle(triangle = triangle2f64) {
    return triangle2f64_intersectsTriangle(
      this.p1,
      this.p2,
      this.p3,
      triangle.p1,
      triangle.p2,
      triangle.p3,
    );
  }
  //#endregion
}

/**
 * Tests if triangle intersects with rectangle
 *
 * @param {rectangle2f} rectangle
 * @param {*} normal
 */
function triangle2f64_intersectsRect(
  l1 = def_vec2f64, l2 = def_vec2f64, l3 = def_vec2f64,
  r1 = def_vec2f64, r2 = def_vec2f64, normal = 1.0,
) {
  normal = +normal;
  const dx = +(+r2.x - +r1.x);
  const dy = +(+r2.y - +r1.y);
  return !(
    (((+l1.x - +r1.x) * +dy - (+l1.y - +r1.y) * +dx) * +normal < 0)
    || (((+l2.x - +r1.x) * +dy - (+l2.y - +r1.y) * +dx) * +normal < 0)
    || (((+l3.x - +r1.x) * +dy - (+l3.y - +r1.y) * +dx) * +normal < 0));
}
function triangle2f64_intersectsTriangle(
  l1 = def_vec2f64, l2 = def_vec2f64, l3 = def_vec2f64,
  r1 = def_vec2f64, r2 = def_vec2f64, r3 = def_vec2f64,
) {
  const lnorm = +(
    +(+(+l2.x - +l1.x) * +(+l3.y - +l1.y))
    - +(+(+l2.y - +l1.y) * +(+l3.x - +l1.x)));
  const rnorm = +(
    +(+(+r2.x - +r1.x) * +(+r3.y - +r1.y))
    - +(+(+r2.y - +r1.y) * +(+r3.x - +r1.x)));

  return !(triangle2f64_intersectsRect(r1, r2, r3, l1, l2, lnorm)
    || triangle2f64_intersectsRect(r1, r2, r3, l2, l3, lnorm)
    || triangle2f64_intersectsRect(r1, r2, r3, l3, l1, lnorm)
    || triangle2f64_intersectsRect(l1, l2, l3, r1, r2, rnorm)
    || triangle2f64_intersectsRect(l1, l2, l3, r2, r3, rnorm)
    || triangle2f64_intersectsRect(l1, l2, l3, r3, r1, rnorm));
}

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
function triangle2i64_intersectsRect(v1, v2, v3, r1, r2) {
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

  const b0 = (((x0 > l) ? 1 : 0)
    | (((y0 > t) ? 1 : 0) << 1)
    | (((x0 > r) ? 1 : 0) << 2)
    | (((y0 > b) ? 1 : 0) << 3))|0;
  if (b0 === 3) return true;

  const b1 = ((x1 > l) ? 1 : 0)
    | (((y1 > t) ? 1 : 0) << 1)
    | (((x1 > r) ? 1 : 0) << 2)
    | (((y1 > b) ? 1 : 0) << 3)|0;
  if (b1 === 3) return true;

  const b2 = ((x2 > l) ? 1 : 0)
    | (((y2 > t) ? 1 : 0) << 1)
    | (((x2 > r) ? 1 : 0) << 2)
    | (((y2 > b) ? 1 : 0) << 3)|0;
  if (b2 === 3) return true;

  let c = 0;
  let m = 0;
  let s = 0;

  const i0 = (b0 ^ b1)|0;
  if (i0 !== 0) {
    m = ((y1-y0) / (x1-x0))|0;
    c = (y0 -(m * x0))|0;
    if (i0 & 1) {
      s = m * l + c;
      if (s > t && s < b) return true;
    }
    if (i0 & 2) {
      s = (t - c) / m;
      if (s > l && s < r) return true;
    }
    if (i0 & 4) {
      s = m * r + c;
      if (s > t && s < b) return true;
    }
    if (i0 & 8) {
      s = (b - c) / m;
      if (s > l && s < r) return true;
    }
  }

  const i1 = (b1 ^ b2)|0;
  if (i1 !== 0) {
    m = ((y2 - y1) / (x2 - x1))|0;
    c = (y1 -(m * x1))|0;
    if (i1 & 1) {
      s = m * l + c;
      if (s > t && s < b) return true;
    }
    if (i1 & 2) {
      s = (t - c) / m;
      if (s > l && s < r) return true;
    }
    if (i1 & 4) {
      s = m * r + c;
      if (s > t && s < b) return true;
    }
    if (i1 & 8) {
      s = (b - c) / m;
      if (s > l && s < r) return true;
    }
  }

  const i2 = (b0 ^ b2)|0;
  if (i2 !== 0) {
    m = ((y2 - y0) / (x2 - x0))|0;
    c = (y0 -(m * x0))|0;
    if (i2 & 1) {
      s = m * l + c;
      if (s > t && s < b) return true;
    }
    if (i2 & 2) {
      s = (t - c) / m;
      if (s > l && s < r) return true;
    }
    if (i2 & 4) {
      s = m * r + c;
      if (s > t && s < b) return true;
    }
    if (i2 & 8) {
      s = (b - c) / m;
      if (s > l && s < r) return true;
    }
  }

  return false;
}


const trapezoid2f64_POINTS = 4;
class trapezoid2f64 extends shape2f64 {
  constructor(p1 = def_vec2f64, p2 = def_vec2f64, p3 = def_vec2f64, p4 = def_vec2f64) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
  }

  gP1() {
    return this.p1;
  }

  gP2() {
    return this.p2;
  }

  gP3() {
    return this.p3;
  }

  gP4() {
    return this.p4;
  }

  pointCount() {
    return trapezoid2f64_POINTS;
  }
}


//#endregion

//#region svg path segments

class segm2f64 {
  constructor(abs = true) {
    // is the coordinate absolute or relative?
    this.abs = (abs === false || abs === true)
      ? abs
      : (typeof abs === 'number')
        ? abs > 0 ? true : false
        : true;
  }

  gAbs() {
    return this.abs;
  }

  isValidPrecursor(segment) {
    return (segment === undefined || segment === null)
      || ((segment instanceof segm2f64) && (segment.constructor !== segm2f64_Z));
  }
}

class segm2f64_M extends segm2f64 {
  constructor(abs = true, x = 0.0, y = 0.0) {
    super(abs);
    this.p1 = (x.constructor === vec2f64)
      ? x
      : new vec2f64(+x, +y);
  }

  gP1() {
    return this.p1;
  }
}

class segm2f64_v extends segm2f64 {
  constructor(abs = false, y = 0.0) {
    super(abs);
    this.y = (y.constructor === vec2f64)
      ? this.y = y.y
      : y;
  }

  gY() {
    return +this.y;
  }

  gP1() {
    return new vec2f64(0.0, +this.y);
  }
}
class segm2f64_h extends segm2f64 {
  constructor(abs = false, x = 0.0) {
    super(abs);
    this.x = +x;
  }

  gX() {
    return +this.x;
  }

  gP1() {
    return new vec2f64(+this.x, 0.0);
  }
}
class segm2f64_l extends segm2f64 {
  constructor(abs = false, p1 = def_vec2f64, y = 0.0) {
    super(abs);
    this.p1 = (p1.constructor === vec2f64)
      ? p1
      : new vec2f64(+p1, +y);
  }
}

class segm2f64_q extends segm2f64 {
  constructor(abs = false, p1 = def_vec2f64, p2 = def_vec2f64, x2 = 0.0, y2 = 0.0) {
    super(abs);
    if (p1.constructor === vec2f64) {
      this.p1 = p1;
      if (p2.constructor === vec2f64) {
        this.p2 = p2;
      }
      else {
        this.p2 = new vec2f64(+p2, +x2);
      }
    }
    else {
      this.p1 = new vec2f64(+p1, +p2);
      this.p2 = new vec2f64(+x2, +y2);
    }
  }

  gP1() {
    return this.p1;
  }

  gP2() {
    return this.p2;
  }
}
class segm2f64_t extends segm2f64 {
  constructor(abs = false, p1 = def_vec2f64, y = 0.0) {
    super(abs);
    this.p1 = (p1.constructor === vec2f64)
      ? p1
      : new vec2f64(+p1, +y);
  }

  hasValidPrecursor(segment) {
    return (segment.constructor === segm2f64_t)
      || (segment.constructor === segm2f64_q);
  }
}

class segm2f64_c extends segm2f64 {
  constructor(abs = false) {
    super(abs);
    // TODO
  }
}

class segm2f64_s extends segm2f64 {
  constructor(abs = false) {
    super(abs);
    // TODO
  }

  hasValidPrecursor(segment) {
    return (segment.constructor === segm2f64_s)
      || (segment.constructor === segm2f64_c);
  }
}

class segm2f64_Z extends segm2f64 {
  constructor() {
    super(true);
  }

  hasValidPrecursor(segment) {
    return !(segment.constructor === segm2f64_Z);
  }
}
//#endregion

//#region svg path object path2f
class path2f64 extends shape2f64 {
  constructor(abs = false, list = []) {
    super(abs);
    this.list = list;
  }

  isClosed() {
    const list = this.list;
    const len = list.length;
    return (len > 0 && (list[len - 1].constructor === segm2f64_Z));
  }

  add(segment) {
    if (segment instanceof segm2f64) {
      const list = this.list;
      const len = list.length;
      if (segment.hasValidPrecursor(len > 0 ? list[len - 1] : null)) {
        list[len] = segment;
        return true;
      }
    }
    return false;
  }

  move(abs, x, y) {
    const segm = new segm2f64_M(abs, x, y);
    return this.add(segm);
  }

  vertical(abs, y) {
    const segm = new segm2f64_v(abs, y);
    return this.add(segm);
  }

  horizontal(abs, x) {
    const segm = new segm2f64_h(abs, x);
    return this.add(segm);
  }

  line(abs, x, y) {
    const segm = new segm2f64_l(abs, x, y);
    return this.add(segm);
  }

  close() {
    const segm = new segm2f64_Z();
    return this.add(segm);
  }
}

//#endregion

var float64Shape = {
  Shape: shape2f64,
  Point: point2f64,
  Circle: circle2f64,
  Rectangle: rectangle2f64,
  Triangle: triangle2f64,
  Trapezoid: trapezoid2f64,
  Path: path2f64,
  PSM: segm2f64_M,
  PSv: segm2f64_v,
  PSh: segm2f64_h,
  PSl: segm2f64_l,
  PSq: segm2f64_q,
  PSt: segm2f64_t,
  PSc: segm2f64_c,
  PSs: segm2f64_s,
  PSZ: segm2f64_Z,
};

/* eslint-disable prefer-rest-params */
function getAllObjectKeys(obj) {
  const arr = [];
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) arr.push(i);
  }
  return arr;
}

function getObjectFirstItem(obj) {
  for (const item in obj) {
    if (obj.hasOwnProperty(item)) {
      return item;
    }
  }
  return undefined;
}

function getObjectCountItems(obj) {
  let count = 0;
  for (const item in obj) {
    if (obj.hasOwnProperty(item)) {
      ++count;
    }
  }
  return count;
}

function isObjectEmpty(obj) {
  return getObjectFirstItem(obj) === undefined;
}

function clone(target, source) {
  const out = {};

  for (const t in target) {
    if (target.hasOwnProperty(t)) out[t] = target[t];
  }
  for (const s in source) {
    if (source.hasOwnProperty(s)) out[s] = source[s];
  }
  return out;
}

function cloneDeep(o) {
  if (typeof o !== 'object') {
    return o;
  }
  if (!o) {
    return o;
  }

  if (o.constructor === Array) {
    const newO = [];
    for (let i = 0; i < o.length; i += 1) {
      newO[i] = cloneDeep(o[i]);
    }
    return newO;
  }
  else {
    const newO = {};
    const keys = Reflect.ownKeys(o); // TODO: SLOW!!! OMG SLOW!!!
    for (const i in keys) {
      if (keys.hasOwnProperty(i)) {
        newO[i] = cloneDeep(o[i]);
      }
    }
    return newO;
  }
}

function mergeObjects(target, ...rest) {
  const ln = rest.length;
  const mergeFn = mergeObjects;

  let i = 0;
  for (; i < ln; i++) {
    const object = rest[i];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        if (value === undefined || value === null) continue;
        if (typeof value === 'object' && value.constructor !== Array) {
          const sourceKey = target[key];
          mergeFn(sourceKey, value);
        }
        else {
          target[key] = value;
        }
      }
    }
  }
  return target;
}

//#region Arrays

function getUniqueArray(array) {
  return array.filter((el, index, a) => index === a.indexOf(el));
  // return Array.from(new Set(array));
}

// e3Merge from https://jsperf.com/merge-two-arrays-keeping-only-unique-values/22
function mergeArrays(a, b) {
  const hash = {};
  let i = (a = a.slice(0)).length;

  while (i--) {
    hash[a[i]] = 1;
  }

  for (i = 0; i < b.length; i++) {
    const e = b[i];
    // eslint-disable-next-line no-unused-expressions
    hash[e] || a.push(e);
  }

  return a;
}

function collapseArrayIsToPrimitive(obj) {
  return (obj === undefined || obj === null || obj === false || obj === true);
}

function collapseArrayShallow(rest) {
  const result = [];
  let cursor = 0;

  const lenx = rest.length;
  let itemx = null;
  let ix = 0;


  let leny = 0;
  let itemy = null;
  let iy = 0;

  // fill the children array with the rest parameters
  for (ix = 0; ix < lenx; ++ix) {
    itemx = rest[ix];
    if (collapseArrayIsToPrimitive(itemx)) continue;
    if (typeof itemx === 'object' && itemx.constructor === Array) {
      // fill the result array with the
      // items of this next loop. We do
      // not go any deeper.
      leny = itemx.length;
      for (iy = 0; iy < leny; ++iy) {
        itemy = itemx[iy];
        if (collapseArrayIsToPrimitive(itemy)) continue;
        // whatever it is next, put it in!?
        result[cursor++] = itemy;
      }
    }
    else {
      // whatever it is next, put it in!?
      result[cursor++] = itemx;
    }
  }
  return result;
}

//#region
/* -----------------------------------------------------------------------------------------
    deepEquals( a, b [, enforce_properties_order, cyclic] )
    https://stackoverflow.com/a/6713782/4598221

    Returns true if a and b are deeply equal, false otherwise.

    Parameters:
      - a (Any type): value to compare to b
      - b (Any type): value compared to a

    Optional Parameters:
      - enforce_properties_order (Boolean): true to check if Object properties are provided
        in the same order between a and b

      - cyclic (Boolean): true to check for cycles in cyclic objects

    Implementation:
      'a' is considered equal to 'b' if all scalar values in a and b are strictly equal as
      compared with operator '===' except for these two special cases:
        - 0 === -0 but are not equal.
        - NaN is not === to itself but is equal.

      RegExp objects are considered equal if they have the same lastIndex, i.e. both regular
      expressions have matched the same number of times.

      Functions must be identical, so that they have the same closure context.

      "undefined" is a valid value, including in Objects

      106 automated tests.

      Provide options for slower, less-common use cases:

        - Unless enforce_properties_order is true, if 'a' and 'b' are non-Array Objects, the
          order of occurence of their attributes is considered irrelevant:
            { a: 1, b: 2 } is considered equal to { b: 2, a: 1 }

        - Unless cyclic is true, Cyclic objects will throw:
            RangeError: Maximum call stack size exceeded
*/
function deepEquals(a, b, enforce_properties_order, cyclic) {
  /* -----------------------------------------------------------------------------------------
    reference_equals( a, b )

    Helper function to compare object references on cyclic objects or arrays.

    Returns:
      - null if a or b is not part of a cycle, adding them to object_references array
      - true: same cycle found for a and b
      - false: different cycle found for a and b

    On the first call of a specific invocation of equal(), replaces self with inner function
    holding object_references array object in closure context.

    This allows to create a context only if and when an invocation of equal() compares
    objects or arrays.
  */
  function reference_equals(a1, b1) {
    const object_references = [];

    function _reference_equals(a2, b2) {
      let l = object_references.length;

      while (l--) {
        if (object_references[l--] === b2) {
          return object_references[l] === a2;
        }
      }
      object_references.push(a2, b2);
      return null;
    }

    return _reference_equals(a1, b1);
  }


  function _equals(a1, b1) {
    // They should have the same toString() signature
    const s = toString.call(a1);
    if (s !== toString.call(b1)) return false;

    switch (s) {
      default: // Boolean, Date, String
        return a1.valueOf() === b1.valueOf();

      case '[object Number]':
        // Converts Number instances into primitive values
        // This is required also for NaN test bellow
        a1 = +a1;
        b1 = +b1;

        // return a ?         // a is Non-zero and Non-NaN
        //     a === b
        //   :                // a is 0, -0 or NaN
        //     a === a ?      // a is 0 or -0
        //     1/a === 1/b    // 1/0 !== 1/-0 because Infinity !== -Infinity
        //   : b !== b;        // NaN, the only Number not equal to itself!
        // ;

        // eslint-disable-next-line no-nested-ternary
        return a1
          ? a1 === b1
          // eslint-disable-next-line no-self-compare
          : a1 === a1
            ? 1 / a1 === 1 / b1
            // eslint-disable-next-line no-self-compare
            : b1 !== b1;

      case '[object RegExp]':
        return a1.source === b1.source
          && a1.global === b1.global
          && a1.ignoreCase === b1.ignoreCase
          && a1.multiline === b1.multiline
          && a1.lastIndex === b1.lastIndex;

      case '[object Function]':
        return false; // functions should be strictly equal because of closure context

      case '[object Array]': {
        const r = reference_equals(a1, b1);
        if ((cyclic && r) !== null) return r; // intentionally duplicated bellow for [object Object]

        let l = a1.length;
        if (l !== b1.length) return false;
        // Both have as many elements

        while (l--) {
          const x = a1[l];
          const y = b1[l];
          if (x === y && x !== 0 || _equals(x, y)) continue;

          return false;
        }

        return true;
      }

      case '[object Object]': {
        const r = reference_equals(a1, b1);
        // intentionally duplicated from above for [object Array]
        if ((cyclic && r) !== null) return r;

        if (enforce_properties_order) {
          const properties = [];

          for (const p in a1) {
            if (a1.hasOwnProperty(p)) {
              properties.push(p);
              const x = a1[p];
              const y = b1[p];
              if (x === y && x !== 0 || _equals(x, y)) continue;
              return false;
            }
          }

          // Check if 'b' has as the same properties as 'a' in the same order
          let l = 0;
          for (const p in b1) {
            if (b1.hasOwnProperty(p)) {
              if (properties[l] !== p) return false;
              l++;
            }
          }
        }
        else {
          let l = 0;
          for (const p in a1) {
            if (a1.hasOwnProperty(p)) {
              ++l;
              const x = a1[p];
              const y = b1[p];
              if (x === y && x !== 0 || _equals(x, y)) continue;

              return false;
            }
          }
          // Check if 'b' has as not more own properties than 'a'
          for (const p in b1) {
            if (b1.hasOwnProperty(p) && --l < 0) return false;
          }
        }
        return true;
      }
    }
  }

  return a === b // strick equality should be enough unless zero
    && a !== 0 // because 0 === -0, requires test by _equals()
    || _equals(a, b); // handles not strictly equal or zero values
}

//#endregion

function copyAttributes(src, dst) {
  if (src.hasAttributes()) {
    const attr = src.attributes;
    const l = attr.length;
    for (let i = 0; i < l; ++i) {
      dst.setAttribute(attr[i].name, attr[i].value);
    }
  }
}

function fetchImage(htmlElement, clientWidth, clientHeight) {
  return new Promise(function fetchImage_Promise(resolve, reject) {
    if (typeof htmlElement === 'string') {
      htmlElement = htmlElement.replace(/[\s\"\']+/g, '');
      htmlElement = htmlElement.replace(/^url\(/, '');
      htmlElement = htmlElement.replace(/\)$/, '');
      const img = new Image();
      img.onload = function fetchImage_image_onload() { resolve(img); };
      img.onerror = function fetchImage_image_onerror(err) { reject(err); };
      img.src = htmlElement;
    }
    else if (typeof htmlElement !== 'object') {
      throw new Error('Where Am I??');
    }
    else if (htmlElement instanceof HTMLImageElement) {
      if (htmlElement.complete) {
        resolve(htmlElement);
      }
      else {
        htmlElement.onload = function fetchImage_htmlElement_onload() { resolve(htmlElement); };
        htmlElement.onerror = function fetchImage_htmlElement_onerror(err) { reject(err); };
      }
    }
    else if (htmlElement instanceof Promise) {
      htmlElement
        .then(function fetchImage_Promise_then(imageElement) {
          if (imageElement instanceof HTMLImageElement) {
            resolve(imageElement);
          }
          else {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('ERR: fetchImage: Promise of first argument must resolve in HTMLImageElement!');
          }
        })
        .catch(function fetchImage_Promise_catch(err) { reject(err); });
    }
    else if (htmlElement instanceof SVGSVGElement) {
      if (htmlElement.firstElementChild.nodeName === 'foreignObject') {
        let width = htmlElement.clientWidth;
        let height = htmlElement.clientHeight;

        width = htmlElement.firstElementChild.firstElementChild.clientWidth;
        height = htmlElement.firstElementChild.firstElementChild.clientHeight;
        // set the svg element size to match our canvas size.
        htmlElement.setAttribute('width', width);
        htmlElement.setAttribute('height', height);
        // now copy a string of the complete element and its children
        const svg = htmlElement.outerHTML;

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = window.URL.createObjectURL(blob);

        const img = new Image();
        img.onload = function fetchImage_SVGSVGElement_onload() {
          window.URL.revokeObjectURL(url);
          resolve(img);
        };
        img.onerror = function fetchImage_SVGSVGElement_onerror(err) {
          window.URL.revokeObjectURL(url);
          reject(err);
        };
        // trigger render of object url.
        img.src = url;
      }
    }
    else if (htmlElement instanceof HTMLElement) {
      let width = htmlElement.clientWidth;
      let height = htmlElement.clientHeight;

      width = clientWidth ? clientWidth : width;
      height = clientHeight ? clientHeight : height;

      width = width === 0 ? 300 : width;
      height = height === 0 ? 200 : height;

      const svg = ('<svg xmlns="http://www.w3.org/2000/svg"'
        + ' width="' + width + '"'
        + ' height="' + height + '">'
        + '<foreignObject width="100%" height="100%">'
        + htmlElement.outerHTML
        + '</foreignObject>'
        + '</svg>');

      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = window.URL.createObjectURL(blob);

      const img = new Image();
      img.onload = function fetchImage_HTMLElement_onload() {
        window.URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function fetchImage_HTMLElement_onerror(err) {
        window.URL.revokeObjectURL(url);
        reject(err);
      };
      // trigger render of object url.
      img.src = url;
    }
    else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('ERR: fetchImage: first argument MUST be of type url, HTMLElement or Promise!');
    }
  });
}

function collapseToString(source, matchRegEx) {
  let r = '';
  if (!source) {
    return r;
  }
  else if (typeof source !== 'object') {
    r = String(source).trim();

    if (!matchRegEx) return r;
    if (r === '') return r;

    const m = r.match(matchRegEx);
    if (!m) return '';
    if (m.length !== 1) return '';
    return r === m[0] && r;
  }
  else if (source.pop) {
    const al = source.length;
    let i = 0;
    for (; i < al; ++i) {
      const v = source[i];
      if (v) {
        r += collapseToString(v);
        r += ' ';
      }
    }
    return r.trim();
  }
  else {
    for (const j in source) {
      if (source.hasOwnProperty(j)) {
        r += collapseToString(source[j]);
        r += ' ';
      }
    }
    return r.trim();
  }
}

const matchClassName = /[a-zA-Z_][a-zA-Z0-9_-]*/g;
function collapseCssClass(...source) {
  if (!source) return '';
  const cl = source.length;
  if (cl === 0) return '';
  let i = 0;
  let r = '';
  for (; i < cl; ++i) {
    const a = source[i];
    if (a) {
      r += collapseToString(a, matchClassName);
      r += ' ';
    }
  }
  return r.trim();
}

const matchEmpty = [null, 0, -1, 0];
function matchCssClass(node, name) {
  if (!node || !name) return matchEmpty;

  name = String(name);
  const nl = name.length;
  if (nl === 0) return matchEmpty;

  const nodeClass = node.className;
  const cl = nodeClass.length;
  if (cl === 0) return matchEmpty;

  let i = -1;
  let n = 0;
  let c = '';
  for (i = nodeClass.indexOf(name); i < cl; i = nodeClass.indexOf(name, n)) {
    if (i === -1) return matchEmpty;
    n = i + nl;
    if (n === cl) break;
    c = nodeClass[n];
    if (c === ' ' || c === '\t') break;
    i = -1;
  }

  return (i === -1) ? matchEmpty : [nodeClass, cl, i, n];
}

function hasCssClass(node, name) {
  return matchCssClass(node, name) === matchEmpty;
}

function addCssClass(node, name) {
  const [nodeClass,, i] = matchCssClass(node, name);
  if (i === -1) {
    node.className = nodeClass.trim() + ' ' + name;
    return true;
  }
  return false;
}

function removeCssClass(node, name) {
  const [nodeClass, cl, i, n] = matchCssClass(node, name);
  if (i === -1) return false;

  const left = i > 0 ? nodeClass.slice(0, i).trim() : '';
  const right = n < cl ? nodeClass.slice(n).trim() : '';
  if (left === '') {
    node.className = right;
  }
  else if (right === '') {
    node.className = left;
  }
  else {
    node.className = left + ' ' + right;
  }
  return true;
}

function toggleCssClass(node, name) {
  if (!addCssClass(node, name)) return removeCssClass(node, name);
  return true;
}

/* eslint-disable no-undef */
// a dummy function to mimic the CSS-Paint-Api-1 specification
const myRegisteredPaint__store__ = {};
const myRegisterPaint = typeof registerPaint !== 'undefined'
  ? registerPaint
  : (function myRegisterPaint_initFunction() {
    return function myRegisterPaint_registerPaint__(name, paintClass) {
      if (!myRegisteredPaint__store__.hasOwnProperty(name)) {
        myRegisteredPaint__store__[name] = paintClass;
      }
    };
  })();

const workletState = Object.freeze(Object.seal({
  init: 0,
  loading: 1,
  preparing: 2,
  running: 3,
  exiting: 4,
  ended: 5,
}));

class VNode {
  constructor(name, attributes, children) {
    this.key = attributes.key;
    this.attributes = attributes;
    if (name.constructor !== String) throw new Error('ERROR: new VNode without a nodeName');
    this.nodeName = name;
    this.children = children;
  }
}

function VN(name, attributes, ...rest) {
  attributes = attributes || {};
  const children = collapseArrayShallow(rest);
  return typeof name === 'function'
    ? name(attributes, children)
    : new VNode(name, attributes, children);
}

const h = VN;

function wrapVN(name, type) {
  if (type === undefined) {
    return function wrapVN_common(attr, children) {
      return VN(name, attr, children);
    };
  }
  else {
    return function wrapVN_astype(attr, children) {
      return VN(name, { ...attr, type: type }, children);
    };
  }
  // return (attr, children) => h(name, attr, children);
}

/* eslint-disable object-shorthand */

function app(state, actions, view, container) {
  const map = [].map;
  let rootElement = (container && container.children[0]) || null;
  let _oldNode = rootElement && recycleElement(rootElement);
  const lifecycle = [];
  let skipRender = false;
  let isRecycling = true;
  let globalState = clone(state);
  const wiredActions = wireStateToActions([], globalState, clone(actions));

  scheduleRender();

  return wiredActions;

  function recycleElement(element) {
    return new VNode(
      element.nodeName.toLowerCase(),
      {},
      map.call(element.childNodes, function recycleElement_inner(el) {
        return el.nodeType === 3 // Node.TEXT_NODE
          ? el.nodeValue
          : recycleElement(el);
      }),
    );
  }

  function resolveNode(node) {
    if (typeof node === 'function')
      return resolveNode(node(globalState, wiredActions));
    else
      return node || '';
    // : node != null ? node : '';
  }

  function render() {
    skipRender = !skipRender;

    const node = resolveNode(view);

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, _oldNode, node);
      _oldNode = node;
    }

    isRecycling = false;

    while (lifecycle.length) lifecycle.pop()();
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true;
      setTimeout(render);
    }
  }

  function set(path, value, source) {
    const target = {};
    if (path.length) {
      target[path[0]] = path.length > 1
        ? set(path.slice(1), value, source[path[0]])
        : value;
      return clone(source, target);
    }
    return value;
  }

  function get(path, source) {
    let i = 0;
    const l = path.length;
    while (i < l) {
      source = source[path[i++]];
    }
    return source;
  }

  function wireStateToActions(path, myState, myActions) {
    function createActionProxy(key, action) {
      myActions[key] = function actionProxy(data) {
        const slice = get(path, globalState);

        let result = action(data);
        if (typeof result === 'function') {
          result = result(slice, myActions);
        }

        if (result && result !== slice && !result.then) {
          globalState = set(path, clone(slice, result), globalState);
          scheduleRender(globalState);
        }

        return result;
      };
    }

    for (const key in myActions) {
      if (typeof myActions[key] === 'function') {
        createActionProxy(key, myActions[key]);
      }
      else {
        // wire slice/namespace of state to actions
        wireStateToActions(
          path.concat(key),
          (myState[key] = clone(myState[key])),
          (myActions[key] = clone(myActions[key])),
        );
      }
    }

    return myActions;
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event);
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === 'style') {
      if (typeof value === 'string') {
        element.style.cssText = value;
      }
      else {
        if (typeof oldValue === 'string') {
          oldValue = element.style.cssText = '';
        }
        const lval = clone(oldValue, value);
        for (const i in lval) {
          if (lval.hasOwnProperty(i)) {
            const style = (value == null || value[i] == null) ? '' : value[i];
            if (i[0] === '-') {
              element.style.setProperty(i, style);
            }
            else {
              element.style[i] = style;
            }
          }
        }
      }
    }
    else if (name !== 'key') {
      if (name.indexOf('on') === 0) {
        name = name.slice(2);

        if (element.events) {
          if (!oldValue) oldValue = element.events[name];
        }
        else {
          element.events = {};
        }

        element.events[name] = value;

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener);
          }
        }
        else {
          element.removeEventListener(name, eventListener);
        }
      }
      else if (value != null && value !== false) {
        if (name === 'class') {
          const cls = collapseCssClass(value);
          if (cls !== '')
            element.className = collapseCssClass(value);
          else
            element.removeAttribute('class');
        }
        else if (name in element
          && name !== 'list'
          && name !== 'type'
          && name !== 'draggable'
          && name !== 'spellcheck'
          && name !== 'translate'
          && !isSvg) {
          element[name] = value == null ? '' : value;
        }
        else {
          element.setAttribute(name, value === true ? '' : value);
        }
      }
      else {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSvg) {
    const element = (typeof node === 'string' || typeof node === 'number')
      ? document.createTextNode(node)
      : (isSvg || node.nodeName === 'svg')
        ? document.createElementNS('http://www.w3.org/2000/svg', node.nodeName)
        : document.createElement(node.nodeName);

    const attributes = node.attributes;
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function hyperapp_lifecycle_createElement() {
          attributes.oncreate(element);
        });
      }

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i] = resolveNode(node.children[i]);
        element.appendChild(createElement(child, isSvg));
      }

      for (const name in attributes) {
        if (attributes.hasOwnProperty(name)) {
          const value = attributes[name];
          updateAttribute(element, name, value, null, isSvg);
        }
      }
    }

    return element;
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (const name in clone(oldAttributes, attributes)) {
      // eslint-disable-next-line operator-linebreak
      if (attributes[name] !==
        (name === 'value' || name === 'checked'
          ? element[name]
          : oldAttributes[name])) {
        updateAttribute(
          element,
          name,
          attributes[name],
          oldAttributes[name],
          isSvg,
        );
      }
    }

    const cb = isRecycling ? attributes.oncreate : attributes.onupdate;
    if (cb) {
      lifecycle.push(function hyperapp_updateElement_lifecycle() {
        cb(element, oldAttributes);
      });
    }
  }

  function removeChildren(element, node) {
    const attributes = node.attributes;
    if (attributes) {
      for (let i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    const cb = node.attributes && node.attributes.onremove;
    if (cb) {
      cb(element, done);
    }
    else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node !== oldNode) {
      if (oldNode == null || oldNode.nodeName !== node.nodeName) {
        const newElement = createElement(node, isSvg);
        parent.insertBefore(newElement, element);

        if (oldNode != null) {
          removeElement(parent, element, oldNode);
        }

        element = newElement;
      }
      else if (oldNode.nodeName == null) {
        element.nodeValue = node;
      }
      else {
        updateElement(
          element,
          oldNode.attributes,
          node.attributes,
          (isSvg = isSvg || node.nodeName === 'svg'),
        );

        const oldKeyed = {};
        const newKeyed = {};
        const oldElements = [];
        const oldChildren = oldNode.children;
        const children = node.children;

        for (let i = 0; i < oldChildren.length; i++) {
          oldElements[i] = element.childNodes[i];

          const oldKey = getKey(oldChildren[i]);
          if (oldKey != null) {
            oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
          }
        }

        let i = 0;
        let k = 0;
        const l = children.length;
        while (k < l) {
          const oldKey = getKey(oldChildren[i]);
          const newKey = getKey((children[k] = resolveNode(children[k])));

          if (newKeyed[oldKey]) {
            i++;
            continue;
          }

          if (newKey == null || isRecycling) {
            if (oldKey == null) {
              patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
              k++;
            }
            i++;
          }
          else {
            const keyedNode = oldKeyed[newKey] || [];

            if (oldKey === newKey) {
              patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
              i++;
            }
            else if (keyedNode[0]) {
              patch(
                element,
                element.insertBefore(keyedNode[0], oldElements[i]),
                keyedNode[1],
                children[k],
                isSvg,
              );
            }
            else {
              patch(element, oldElements[i], null, children[k], isSvg);
            }

            newKeyed[newKey] = children[k];
            k++;
          }
        }

        while (i < oldChildren.length) {
          if (getKey(oldChildren[i]) == null) {
            removeElement(element, oldElements[i], oldChildren[i]);
          }
          i++;
        }

        for (const ik in oldKeyed) {
          if (oldKeyed.hasOwnProperty(ik)) {
            if (!newKeyed[ik]) {
              removeElement(element, oldKeyed[ik][0], oldKeyed[ik][1]);
            }
          }
        }
      }
    }
    return element;
  }
}

export { VN, VNode, addCssClass, app, checkIfValueDisabled, circle2f64, circle2f64_POINTS, clone, cloneDeep, collapseArrayIsToPrimitive, collapseArrayShallow, collapseCssClass, collapseToString, copyAttributes, deepEquals, def_vec2f64, def_vec2i32, def_vec3f64, float64Base as f64, fetchImage, float64_clamp, float64_clampu, float64_cosHp, float64_cosLp, float64_cosMp, float64_cross, float64_dot, float64_fib, float64_fib2, float64_gcd, float64_hypot, float64_hypot2, float64_inRange, float64_intersectsRange, float64_intersectsRect, float64_isqrt, float64_lerp, float64_map, float64_norm, float64_phi, float64_sinLp, float64_sinLpEx, float64_sinMp, float64_sinMpEx, float64_sqrt, float64_theta, float64_toDegrees, float64_toRadian, float64_wrapRadians, float64Math as fm64, getAllObjectKeys, getObjectCountItems, getObjectFirstItem, getUniqueArray, h, hasCssClass, int32Base as i32, int32_clamp, int32_clampu, int32_clampu_u8a, int32_clampu_u8b, int32_cross, int32_dot, int32_fib, int32_hypot, int32_hypotEx, int32_inRange, int32_intersectsRange, int32_intersectsRect, int32_lerp, int32_mag2, int32_map, int32_norm, int32_random, int32_sinLp, int32_sinLpEx, int32_sqrt, int32_sqrtEx, int32_toDegreesEx, int32_toRadianEx, int32_wrapRadians, isObjectEmpty, isPrimitiveType, isPrimitiveTypeEx, isPureObject, mathf64_EPSILON, mathf64_PI, mathf64_PI1H, mathf64_PI2, mathf64_PI41, mathf64_PI42, mathf64_SQRTFIVE, mathf64_abs, mathf64_asin, mathf64_atan2, mathf64_ceil, mathf64_cos, mathf64_floor, mathf64_max, mathf64_min, mathf64_pow, mathf64_random, mathf64_round, mathf64_sin, mathf64_sqrt, mathi32_MULTIPLIER, mathi32_PI, mathi32_PI1H, mathi32_PI2, mathi32_PI41, mathi32_PI42, mathi32_abs, mathi32_asin, mathi32_atan2, mathi32_ceil, mathi32_floor, mathi32_max, mathi32_min, mathi32_round, mathi32_sqrt, mergeArrays, mergeObjects, int32Math as mi32, myRegisterPaint, path2f64, point2f64, point2f64_POINTS, rectangle2f64, rectangle2f64_POINTS, removeCssClass, float64Shape as s2f64, sanitizePrimitiveValue, segm2f64, segm2f64_M, segm2f64_Z, segm2f64_c, segm2f64_h, segm2f64_l, segm2f64_q, segm2f64_s, segm2f64_t, segm2f64_v, shape2f64, toggleCssClass, trapezoid2f64, trapezoid2f64_POINTS, triangle2f64, triangle2f64_POINTS, triangle2f64_intersectsRect, triangle2f64_intersectsTriangle, triangle2i64_intersectsRect, float64Vec2 as v2f64, int32Vec2 as v2i32, float64Vec3 as v3f64, vec2f64, vec2f64_about, vec2f64_add, vec2f64_addms, vec2f64_adds, vec2f64_ceil, vec2f64_cross, vec2f64_cross3, vec2f64_dist, vec2f64_dist2, vec2f64_div, vec2f64_divs, vec2f64_dot, vec2f64_eq, vec2f64_eqs, vec2f64_eqstrict, vec2f64_floor, vec2f64_iabout, vec2f64_iadd, vec2f64_iaddms, vec2f64_iadds, vec2f64_iceil, vec2f64_idiv, vec2f64_idivs, vec2f64_ifloor, vec2f64_iinv, vec2f64_imax, vec2f64_imin, vec2f64_imul, vec2f64_imuls, vec2f64_ineg, vec2f64_inv, vec2f64_iperp, vec2f64_irot90, vec2f64_irotate, vec2f64_irotn90, vec2f64_iround, vec2f64_isub, vec2f64_isubs, vec2f64_iunit, vec2f64_lerp, vec2f64_mag, vec2f64_mag2, vec2f64_max, vec2f64_min, vec2f64_mul, vec2f64_muls, vec2f64_neg, vec2f64_new, vec2f64_phi, vec2f64_rot90, vec2f64_rotate, vec2f64_rotn90, vec2f64_round, vec2f64_sub, vec2f64_subs, vec2f64_theta, vec2f64_unit, vec2i32, vec2i32_add, vec2i32_adds, vec2i32_angleEx, vec2i32_cross, vec2i32_cross3, vec2i32_div, vec2i32_divs, vec2i32_dot, vec2i32_iadd, vec2i32_iadds, vec2i32_idiv, vec2i32_idivs, vec2i32_imul, vec2i32_imuls, vec2i32_ineg, vec2i32_inorm, vec2i32_iperp, vec2i32_irot90, vec2i32_irotn90, vec2i32_isub, vec2i32_isubs, vec2i32_mag, vec2i32_mag2, vec2i32_mul, vec2i32_muls, vec2i32_neg, vec2i32_new, vec2i32_norm, vec2i32_perp, vec2i32_phiEx, vec2i32_rot90, vec2i32_rotn90, vec2i32_sub, vec2i32_subs, vec2i32_thetaEx, vec3f64, vec3f64_crossABAB, vec3f64_div, vec3f64_divs, vec3f64_idiv, vec3f64_idivs, vec3f64_iunit, vec3f64_mag, vec3f64_mag2, vec3f64_new, vec3f64_unit, workletState, wrapVN };
//# sourceMappingURL=index.js.map
