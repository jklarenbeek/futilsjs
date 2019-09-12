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

var math = {
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

var math$1 = {
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

// import {
//   performance as perf,
// } from 'perf_hooks';


const isBrowser = typeof window !== 'undefined';

const performance = isBrowser
  ? window.performance
  : {
    now: function performanceNow(start) {
      if (!start) return process.hrtime();
      const end = process.hrtime(start);
      return Math.round((end[0] * 1000) + (end[1] / 1000000));
    },
  };


/**
 * @example
 *  const fns_all = [ isNumberType_asNumber, isNumberType_asParseFloat ];
 *  const test_stringi = ['12345', '54321', '12358', '85321'];
 *  const test_stringf = ['12.345', '54.321', '12.358', '85.321'];
 *  const test_nan = ['abcde', 'edcba', 'abceh', 'hecba'];
 *  const test_number = [13.234, 21.123, 34.456, 55.223];
 *  const test_integer = [13, 21, 34, 55];
 *  const pref_idx = getPerformanceIndexOfUnaryBool(fns_all, [ test_number, test_integer ]);
 *  const pref_fn = pref_idx >= 0 ? fns_all[pref_idx] : undefined;
 *
 * @param {*} functionList
 * @param {*} testList
 */
function getPerformanceIndexOfUnaryBool(functionList, testList) {
  let index = -1;
  let start = 0.0;
  let end = 0.0;
  let delta = 0.0;
  // eslint-disable-next-line no-unused-vars
  let tmp = false;

  // eslint-disable-next-line func-names
  let fn = function () { };

  for (let i = 0; i < functionList.length; ++i) {
    fn = functionList[i];
    end = 0.0;
    for (let j = 0; j < testList.length; ++j) {
      const test = testList[j];
      start = performance.now();
      for (let k = 0; k < 1000; ++k) {
        tmp |= fn(test % k);
      }
      end += performance.now() - start;
    }
    end /= testList.length;

    if (delta > end) {
      delta = end;
      index = i;
    }
  }
  return index;
}

//#region isNumberType

function isNumberType_asType(obj) {
  // eslint-disable-next-line no-restricted-globals
  return obj != null && typeof obj === 'number';
}

function isNumberType_asNaN(obj) {
  // eslint-disable-next-line no-restricted-globals
  return isNaN(obj) === false;
}

function isNumberType_asNumber(obj) {
  return (Number(obj) || false) !== false;
}

function isNumberType_asParseInt(obj) {
  // eslint-disable-next-line radix
  const n = parseInt(obj);
  // eslint-disable-next-line no-self-compare
  return n === n;
}

function isNumberType_asParseFloat(obj) {
  // eslint-disable-next-line radix
  const n = parseFloat(obj);
  // eslint-disable-next-line no-self-compare
  return n === n; // we equal NaN with NaN here.
}

function isNumberType_asMathRound(obj) {
  const n = Math.round(obj);
  // eslint-disable-next-line no-self-compare
  return n === n; // we equal NaN with NaN here.
}

function isNumberType_asCastFloat(obj) {
  // eslint-disable-next-line no-self-compare
  return +obj === +obj; // we equal NaN with NaN here.
}

const isNumberType = (function calibrate(doit = false) {
  if (!doit) return isNumberType_asNumber;
  const floats = [Math.PI, 13.234, 21.123, 34.456, 55.223];
  const integers = [13, 21, 34, 55, 108];
  const fns = [
    isNumberType_asType,
    isNumberType_asNaN,
    isNumberType_asNumber,
    isNumberType_asParseInt,
    isNumberType_asParseFloat,
    isNumberType_asMathRound,
    isNumberType_asCastFloat,
  ];
  const idx = getPerformanceIndexOfUnaryBool(fns, [floats, integers]);
  return fns[idx];
})(false);

//#endregion

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

var base = {
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

var vec2 = {
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

var base$1 = {
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

var vec2$1 = {
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
    if (x instanceof vec3f64) {
      this.x = +x.x;
      this.y = +x.y;
      this.z = +x.z;
    }
    else if (x instanceof vec2f64) {
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
function vec3f64_add(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+a.x + +b.x),
    +(+a.y + +b.y),
    +(+a.z + +b.z),
  );
}

function vec3f64_adds(a = def_vec3f64, scalar = 0.0) {
  return new vec3f64(
    +(+a.x + +scalar),
    +(+a.y + +scalar),
    +(+a.z + +scalar),
  );
}

function vec3f64_sub(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+a.x - +b.x),
    +(+a.y - +b.y),
    +(+a.z - +b.z),
  );
}

function vec3f64_subs(a = def_vec3f64, scalar = 0.0) {
  return new vec3f64(
    +(+a.x - +scalar),
    +(+a.y - +scalar),
    +(+a.z - +scalar),
  );
}

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

function vec3f64_mul(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+a.x * +b.x),
    +(+a.y * +b.y),
    +(+a.z * +b.z),
  );
}
function vec3f64_muls(v = def_vec3f64, scalar = 0.0) {
  return new vec3f64(
    +(+v.x * +scalar),
    +(+v.y * +scalar),
    +(+v.z * +scalar),
  );
}

//#endregion

//#region flat vec3f impure primitive operators
function vec3f64_iadd(a = def_vec3f64, b = def_vec3f64) {
  a.x += +(+b.x);
  a.y += +(+b.y);
  a.z += +(+b.z);
  return a;
}
function vec3f64_iadds(v = def_vec3f64, scalar = 0.0) {
  v.x += +scalar;
  v.y += +scalar;
  v.z += +scalar;
  return v;
}

function vec3f64_isub(a = def_vec3f64, b = def_vec3f64) {
  a.x -= +(+b.x);
  a.y -= +(+b.y);
  a.z -= +(+b.z);
  return a;
}
function vec3f64_isubs(v = def_vec3f64, scalar = 0.0) {
  v.x -= +scalar;
  v.y -= +scalar;
  v.z -= +scalar;
  return v;
}

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

function vec3f64_imul(a = def_vec3f64, b = def_vec3f64) {
  a.x *= +(+b.x);
  a.y *= +(+b.y);
  a.z *= +(+b.z);
  return a;
}
function vec3f64_imuls(v = def_vec3f64, scalar = 0.0) {
  v.x *= +scalar;
  v.y *= +scalar;
  v.z *= +scalar;
  return v;
}

//#endregion

//#region flat vec3f pure advanced operators

function vec3f64_mag2(v = def_vec3f64) {
  return +vec3f64_dot(v, v);
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

function vec3f64_dot(a = def_vec3f64, b = def_vec3f64) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y) + +(+a.z * +b.z));
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

var vec3 = {
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
  dot: vec3f64_dot,
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

var shape = {
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

//#region core
function isFnEx(typeName) {
  return typeName === 'function';
}

function isFn(obj) {
  return typeof obj === 'function';
}

function isScalarTypeEx(typeName, vms = false) {
  switch (typeName) {
    case 'number':
    case 'string':
    case 'boolean':
    case 'integer':
    case 'bigint':
      return true;
    case 'regex':
      return vms;
    default:
      return false;
  }
}

function isScalarType(data, vms = false) {
  return data != null && isScalarTypeEx(typeof data, vms);
}

function isComplexType(data) {
  return data != null && typeof data === 'object';
}

function isNullValue(data) {
  return data !== undefined && data === null;
}

function isObjectOfType(data, type) {
  return data != null && data.constructor === type;
}
//#endregion

//#region scalars
function isBooleanType(data) {
  return data === true || data === false;
}

function isBoolishType(data) {
  return data === true
    || data === false
    || data === 'true'
    || data === 'false';
}

function isNumberType$1(data) {
  return typeof data === 'number';
}

function isNumbishType(data) {
  return !Number.isNaN(Number(data));
}

function isIntegerType(data) {
  return Number.isInteger(data);
}

function isIntishType(data) {
  return Number.isInteger(Number(data));
}

function isBigIntType(data) {
  // eslint-disable-next-line valid-typeof
  return typeof data === 'bigint';
}

function isStringType(data) {
  return typeof data === 'string';
}

function isDateType(data) {
  return isObjectOfType(data, Date);
}

function isDateishType(data) {
  return isDateType(data)
    || !Number.isNaN(Date.parse(data));
}
//#endregion

//#region array and set
function isTypedArray(data) {
  return data != null
    && (data.constructor === Int8Array
      || data.constructor === Uint8Array
      || data.constructor === Uint8ClampedArray
      || data.constructor === Int16Array
      || data.constructor === Uint16Array
      || data.constructor === Int32Array
      || data.constructor === Uint32Array
      // eslint-disable-next-line no-undef
      || data.constructor === BigInt64Array
      // eslint-disable-next-line no-undef
      || data.constructor === BigUint64Array);
}

function isArrayType(data) {
  return isObjectOfType(data, Array);
}

function isArrayTyped(data) {
  return isArrayType(data)
      || isTypedArray(data);
}

function isSetType(data) {
  return isObjectOfType(data, Set);
}

function isArrayOrSetType(data) {
  return data != null
    && (data.constructor === Array
      || data.constructor === Set);
}

function isArrayOrSetTyped(data) {
  return data != null
    && (data.constructor === Array
      || data.constructor === Set
      || isTypedArray(data));
}
//#endregion

//#region object and map
function isObjectType(data) {
  return isComplexType(data)
    && !(data instanceof Array
      || data.constructor === Map
      || data.constructor === Set);
}

function isObjectTyped(data) {
  return isObjectType(data)
    && !isTypedArray(data);
}

function isMapType(data) {
  return isObjectOfType(data, Map);
}

function isObjectOrMapType(data) {
  return isComplexType(data)
    && !(data instanceof Array
      || data.constructor === Set);
}

function isObjectOrMapTyped(data) {
  return isComplexType(data)
    && !(data instanceof Array
      || data.constructor === Set
      || isTypedArray(data));
}

function isRegExpType(data) {
  return isObjectOfType(data, RegExp);
}

//#endregion

//#region mixed types
function isBoolOrNumbishType(obj) {
  return isBooleanType(obj)
    || isNumbishType(obj);
}

function isBoolOrArrayTyped(obj) {
  return isBooleanType(obj)
    || isArrayTyped(obj);
}

function isStringOrArrayTyped(obj) {
  return isStringType(obj)
    || isArrayTyped(obj);
}

function isBoolOrObjectType(obj) {
  return isBooleanType(obj)
    || isObjectType(obj);
}

function isStringOrObjectType(obj) {
  return isStringType(obj)
    || isObjectType(obj);
}

function isStringOrDateType(data) {
  return (data != null
    && (data.constructor === String
      || data.constructor === Date));
}
//#endregion

function isUniqueArray(array) {
  const len = array.length;
  return getUniqueArray(array).length === len;
}

function getUniqueArray(array) {
  const filtered = array.filter((el, index, a) => index === a.indexOf(el));
  return filtered;
  // return Array.from(new Set(array));
}

function forEachItem(array, fn) {
  for (let i = 0; i < array.length; ++i)
    fn(array[i], i, array);
}

function isEveryItem(array, test) {
  for (let i = 0; i < array.length; ++i) {
    if (!test(array[i], i, array)) return false;
  }
  return true;
}

// e3Merge from https://jsperf.com/merge-two-arrays-keeping-only-unique-values/22
function mergeUniqueArray(target = [], source = []) {
  target = [...target];

  const hash = {}; // TODO: this will fail in some situations! (use new Map() instead)

  let i = target.length;
  while (i--) {
    hash[target[i]] = 1;
  }

  for (i = 0; i < source.length; ++i) {
    const e = source[i];
    // eslint-disable-next-line no-unused-expressions
    hash[e] || target.push(e);
  }
  return target;
}

function collapseShallowArray(array) {
  const result = [];
  let cursor = 0;

  const lenx = array.length;
  let itemx = null;
  let ix = 0;


  let leny = 0;
  let itemy = null;
  let iy = 0;

  // fill the children array with the array argument
  for (ix = 0; ix < lenx; ++ix) {
    itemx = array[ix];
    if (itemx == null) continue;
    if (itemx.constructor === Array) {
      // fill the result array with the
      // items of this next loop. We do
      // not go any deeper.
      leny = itemx.length;
      for (iy = 0; iy < leny; ++iy) {
        itemy = itemx[iy];
        if (itemy == null) continue;
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

function getIntersectArray(...arrays) {
  // https://codeburst.io/optimizing-array-analytics-in-javascript-part-two-search-intersection-and-cross-products-79b4a6d68da0
  // if we process the arrays from shortest to longest
  // then we will identify failure points faster, i.e.
  // when one item is not in all arrays
  const ordered = arrays.length === 1
    ? arrays
    : arrays.sort((a1, a2) => a1.length - a2.length);
  const shortest = ordered[0];
  const set = new Set(); // used for bookeeping, Sets are faster
  const result = []; // the intersection, conversion from Set is slow

  // for each item in the shortest array
  for (let i = 0; i < shortest.length; ++i) {
    const item = shortest[i];
    // see if item is in every subsequent array
    let every = true; // don't use ordered.every ... it is slow
    for (let j = 1; j < ordered.length; ++j) {
      if (ordered[j].includes(item)) continue;
      every = false;
      break;
    }
    // ignore if not in every other array, or if already captured
    if (!every || set.has(item)) continue;
    // otherwise, add to bookeeping set and the result
    set.add(item);
    result[result.length] = item;
  }
  return result;
}

function getFastIntersectArray(...arrays) {
  // https://github.com/lovasoa/fast_array_intersect
  const ret = [];
  const obj = {};

  let nShortest = arrays[0].length;
  let shortest = 0;

  let i = 0;
  let j = 0;
  for (i = 0; i < arrays.length; i++) {
    const n = arrays[i].length;
    if (n < nShortest) {
      shortest = i;
      nShortest = n;
    }
  }

  for (i = 0; i < arrays.length; i++) {
    const islast = i === (arrays.length - 1);
    // Read the shortest array first.
    // Read the first array instead of the shortest
    const n = (i === shortest) ? 0 : (i || shortest);

    const subarr = arrays[n];
    const len = subarr.length;
    for (j = 0; j < len; j++) {
      const elem = subarr[j];
      if (obj[elem] === i - 1) {
        if (islast) {
          ret.push(elem);
          obj[elem] = 0;
        } else {
          obj[elem] = i;
        }
      } else if (i === 0) {
        obj[elem] = 0;
      }
    }
  }
  return ret;
}

//#region scalar types
function getScalarNormalised(value, defaultValue = undefined, nullable = false) {
  return value == null
    ? nullable
      ? value
      : defaultValue
    : isScalarType(value)
      ? value
      : defaultValue;
}

function getTypeExclusiveBound(getType, inclusive, exclusive) {
  const includes = getType(inclusive);
  const excludes = exclusive === true
    ? includes
    : getType(exclusive);
  return (excludes === undefined)
    ? [includes, undefined]
    : [undefined, excludes];
}

function getBooleanType(obj, def = undefined) {
  return isBooleanType(obj) ? obj : def;
}

function getBoolishType(obj, def = undefined) {
  return obj === true || obj === 'true'
    ? true
    : obj === false || obj === 'false'
      ? false
      : def;
}

function getNumberType(obj, def = undefined) {
  return isNumberType$1(obj) ? obj : def;
}

function getNumbishType(obj, def = undefined) {
  return isNumbishType(obj) ? Number(obj) : def;
}

function getNumberExclusiveBound(inclusive, exclusive) {
  const includes = isBigIntType(inclusive)
    ? inclusive
    : getNumbishType(inclusive);
  const excludes = exclusive === true
    ? includes
    : isBigIntType(exclusive)
      ? exclusive
      : getNumbishType(exclusive);
  return (excludes !== undefined)
    ? [undefined, excludes]
    : [includes, undefined];
}

function getIntegerType(obj, def = undefined) {
  return isIntegerType(obj) ? obj : def;
}

function getIntishType(obj, def = undefined) {
  return isIntishType(obj) ? Number(obj) : def;
}

function getStringType(obj, def = undefined) {
  return isStringType(obj) ? obj : def;
}

function getBigIntType(obj, def = undefined) {
  return isBigIntType(obj) ? obj : def;
}

function getBigIntishType(obj, def = undefined) {
  return isBigIntType(obj)
    ? obj
    : getIntishType(obj, def);
}

function getDateType(obj, def = undefined) {
  return (isDateType(obj) && obj) || def;
}

function getDateishType(str, def = undefined) {
  const date = Date.parse(str);
  return !Number.isNaN(date) ? new Date(date) : def;
}

//#endregion

//#region array and set types
function getArrayType(obj, def = undefined) {
  return isArrayType(obj) ? obj : def;
}

function getArrayTypeMinItems(obj, len, def = undefined) {
  return (isArrayType(obj) && obj.length >= len && obj) || def;
}

function getArrayTyped(obj, def = undefined) {
  return isArrayTyped(obj) ? obj : def;
}

function getArrayTypedMinItems(obj, len, def = undefined) {
  return (isArrayTyped(obj) && obj.length >= len && obj) || def;
}

function getSetType(obj, def = undefined) {
  return isSetType(obj) ? obj : def;
}

function getSetTypeOfArray(obj, def = undefined) {
  return isSetType(obj)
    ? obj
    : isArrayType(obj)
      ? new Set(obj)
      : def;
}

function getArrayTypeOfSet(obj, def = undefined) {
  return isArrayType(obj)
    ? getUniqueArray(obj)
    : isSetType(obj)
      ? Array.from(obj)
      : def;
}

function getArrayOrSetType(obj, def = undefined) {
  return isArrayType(obj) || isSetType(obj)
    ? obj
    : def;
}

function getArrayOrSetTypeLength(obj = undefined) {
  return isSetType(obj)
    ? obj.size
    : isArrayType(obj)
      ? obj.length
      : 0;
}

function getArrayOrSetTypeMinItems(obj, len, def = undefined) {
  return getArrayOrSetTypeLength(obj) >= len
    ? obj
    : def;
}

function getArrayOrSetTypeUnique(obj, def = undefined) {
  return isArrayType(obj)
    ? getUniqueArray(obj)
    : isSetType(obj)
      ? obj
      : def;
}

//#endregion

//#region object and map types
function getObjectType(obj, def = undefined) {
  return isObjectType(obj) ? obj : def;
}

function getObjectTyped(obj, def = undefined) {
  return isObjectTyped(obj) ? obj : def;
}

function getMapType(obj, def = undefined) {
  return isMapType(obj) ? obj : def;
}

function getMapTypeOfArray(obj, def = undefined) {
  return isMapType(obj)
    ? obj
    : isArrayType(obj)
      ? new Map(obj)
      : def;
}

function getObjectOrMapType(obj, def = undefined) {
  return isObjectOrMapType(obj) ? obj : def;
}

function getObjectOrMapTyped(obj, def = undefined) {
  return isObjectOrMapTyped(obj) ? obj : def;
}

//#endregion

//#region mixed types
function getBoolOrNumbishType(obj, def = undefined) {
  return isBoolOrNumbishType(obj) ? obj : def;
}

function getBoolOrArrayTyped(obj, def = undefined) {
  return isBoolOrArrayTyped(obj) ? obj : def;
}

function getBoolOrObjectType(obj, def = undefined) {
  return isBoolOrObjectType(obj) ? obj : def;
}

function getStringOrObjectType(obj, def = undefined) {
  return isStringOrObjectType(obj) ? obj : def;
}

function getStringOrArrayTyped(obj, def = undefined) {
  return isStringOrArrayTyped(obj) ? obj : def;
}

function getStringOrArrayTypedUnique(obj, def = undefined) {
  return isStringType(obj)
    ? obj
    : isArrayTyped(obj)
      ? getUniqueArray(obj)
      : def;
}
//#endregion

function trueThat(whatever = true) {
  const that = true;
  return whatever === true || that;
}

function falseThat(boring = true) {
  return false ;
}

function undefThat(whatever = undefined) {
  return whatever !== undefined
    ? undefined
    : whatever;
}

function fallbackFn(compiled, fallback = trueThat) {
  if (isFn(compiled)) return compiled;
  // eslint-disable-next-line no-unused-vars
  return isFn(fallback)
    ? fallback
    : trueThat;
}

function addFunctionToArray(arr = [], fn) {
  if (fn == null) return arr;
  if (isFn(fn))
    arr.push(fn);
  else if (fn.constructor === Array) {
    for (let i = 0; i < fn.length; ++i) {
      if (isFn(fn[i]))
        arr.push(fn[i]);
    }
  }
  return arr;
}

function createIsDataTypeHandler(type, format, isstrict = false) {
  if (type === 'object') {
    return isstrict
      ? isObjectTyped
      : isObjectType;
  }
  else if (type === 'array') {
    return isstrict
      ? isArrayType
      : isArrayTyped;
  }
  else if (type === 'set') {
    return isSetType;
  }
  else if (type === 'map') {
    return isMapType;
  }
  else if (type === 'tuple') {
    return isArrayType;
  }
  else if (type === 'regex') {
    return isRegExpType;
  }
  else {
    switch (type) {
      case 'null': return isNullValue;
      case 'boolean': return isBooleanType;
      case 'integer': return isIntegerType;
      case 'bigint': return isBigIntType;
      case 'number': return isNumberType$1;
      case 'string': return isStringType;
      default: break;
    }
  }
  return undefined;
}

function createIsObjectOfTypeHandler(fn) {
  // eslint-disable-next-line no-undef-init
  let usefull = undefined;
  if (isFn(fn)) {
    usefull = function isObjectOfTypeFn(data) {
      return isObjectOfType(data, fn);
    };
  }
  else if (fn instanceof Array) {
    const types = [];
    for (let i = 0; i < fn.length; ++i) {
      const type = fn[i];
      const tn = typeof type;
      if (tn === 'string') {
        types.push('data.constructor===' + type);
      }
      else if (tn === 'function') {
        types.push('data.constructor===' + type.name);
      }
    }
    if (types > 0) {
      // eslint-disable-next-line no-new-func
      usefull = new Function(
        'data',
        'return data!=null && (' + types.join('||') + ')',
      );
    }
  }
  else if (typeof fn === 'string') {
    // eslint-disable-next-line no-new-func
    usefull = new Function(
      'data',
      'return data!=null && data.constructor===' + fn,
    );
  }
  return usefull;
}

function forOfObject(obj, fn) {
  if (isComplexType(obj)) {
    if (obj.constructor === Map) {
      for (const [k, v] of obj)
        fn(v, k, obj);
    }
    else {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; ++i) {
        const k = keys[i];
        fn(obj[k], k, obj);
      }
    }
  }
}

function getObjectItem(obj, key) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? obj.get(key)
      : obj[key]
    : undefined;
}

function setObjectItem(obj, key, value) {
  if (isComplexType(obj)) {
    if (obj.constructor === Map)
      obj.set(key, value);
    else
      obj[key] = value;
  }
}

function getObjectAllKeys(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? Array.from(obj.keys())
      : Object.keys(obj)
    : undefined;
}

function getObjectAllValues(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? Array.from(obj.values())
      : Object.values(obj)
    : undefined;
}

function getObjectFirstKey(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? obj.keys().next().value
      : Object.keys(obj)[0]
    : undefined;
}

function getObjectFirstItem(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? obj.values().next().value
      : Object.values(obj)[0]
    : undefined;
}

function getObjectCountItems(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? obj.size
      : Object.keys(obj).length
    : 0;
}

function isObjectEmpty(obj) {
  return getObjectCountItems(obj) === 0;
}

function equalsDeep(target, source) {
  if (target === source) return true;
  if (target == null) return false;
  if (source == null) return false;
  if (isBooleanType(target)) return false;
  if (isBooleanType(source)) return false;

  if (isFn(target))
    return target.toString() === source.toString();

  if (isScalarType(target))
    return false;

  if (target.constructor !== source.constructor)
    return false;

  if (target.constructor === Object) {
    const tks = Object.keys(target);
    const sks = Object.keys(source);
    if (tks.length !== sks.length)
      return false;
    for (let i = 0; i < tks.length; ++i) {
      const key = tks[i];
      if (!equalsDeep(target[key], source[key]))
        return false;
    }
    return true;
  }

  if (target.constructor === Array) {
    if (target.length !== source.length)
      return false;
    for (let i = 0; i < target.length; ++i) {
      if (!equalsDeep(target[i], source[i]))
        return false;
    }
    return true;
  }

  if (target.constructor === Map) {
    if (target.size !== source.size)
      return false;
    for (const [key, value] of target) {
      if (source.has(key) === false)
        return false;
      if (!equalsDeep(value, source[key]))
        return false;
    }
    return true;
  }

  if (target.constructor === Set) {
    if (target.size !== source.size)
      return false;
    for (const value of target) {
      if (source.has(value) === false)
        return false;
    }
    return true;
  }

  if (target.constructor === RegExp) {
    return target.toString() === source.toString();
  }

  if (isTypedArray(target)) {
    if (target.length !== source.length)
      return false;
    for (let i = 0; i < target.length; ++i) {
      if (target[i] !== source[i])
        return false;
    }
    return true;
  }

  // we could test for instance of Array, Map and Set in order
  // to differentiate between types of equality.. but we dont.
  const tkeys = Object.keys(target);
  const skeys = Object.keys(source);
  if (tkeys.length !== skeys.length) return false;
  if (tkeys.length === 0) return true;
  for (let i = 0; i < tkeys.length; ++i) {
    const key = tkeys[i];
    if (!equalsDeep(target[key], source[key]))
      return false;
  }
  return true;
}

function cloneObject(target, source) {
  return { ...target, ...source };
}

function cloneDeep(target, force = false) {
  if (!isComplexType(target)) return target;

  if (target.constructor === Object) {
    const obj = {};
    const tkeys = Object.keys(target);
    if (tkeys.length === 0) return obj;
    for (let i = 0; i < tkeys.length; ++i) {
      const tkey = tkeys[i];
      obj[tkey] = cloneDeep(target[tkey]);
    }
    return obj;
  }

  if (target.constructor === Array) {
    const arr = new Array(target.length);
    for (let i = 0; i < arr.length; ++i) {
      arr[i] = cloneDeep(target[i]);
    }
    return arr;
  }

  if (target.constructor === Map) {
    return new Map(target); // TODO this is not gonna work for object values
  }

  if (target.constructor === Set) {
    return new Set(target); // TODO neither does this
  }

  if (target.constructor === RegExp) {
    return force
      ? new RegExp(target.toString())
      : target;
  }

  if (isTypedArray(target)) {
    // hmmm, isnt there a faster way?
    const arr = new target.constructor(target.length);
    for (let i = 0; i < arr.length; ++i) {
      arr[i] = target[i];
    }
    return arr;
  }

  const tobj = {};
  const tks = Object.keys(target);
  for (let i = 0; i < tks.length; ++i) {
    const tk = tks[i];
    tobj[tk] = cloneDeep(target[tk]);
  }

  // TODO: change prototype of new object to target!

  return tobj;
}

/** obsolete */
function mergeObjects(target, ...rest) {
  const ln = rest.length;

  let i = 0;
  for (; i < ln; i++) {
    const object = rest[i];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        if (value == null) continue;
        if (value.constructor !== Array) {
          const sourceKey = target[key];
          mergeObjects(sourceKey, value);
        }
        else {
          target[key] = value;
        }
      }
    }
  }
  return target;
}

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

/* eslint-disable class-methods-use-this */

function createStorageCache() {
  const cache = {};
  class StorageCache {
    getCache(key) {
      if (!cache[key]) {
        cache[key] = localStorage[key];
      }
      return cache[key];
    }

    setCache(key, value) {
      cache[key] = value;
    }

    syncCache() {
      const keys = Object.keys(cache);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        localStorage[key] = cache[key];
      }
    }
  }
  return StorageCache;
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
    if (name.constructor !== String) throw new Error('ERROR: new VNode without a nodeName');
    this.nodeName = name;
    this.key = attributes.key;
    this.attributes = attributes;
    this.children = children;
  }
}

function getVNodeKey(node) {
  return node ? node.key : null;
}

function getVNodeName(node) {
  return node ? node.nodeName : null;
}

function getVNodeAttr(node) {
  return node ? node.attributes : null;
}

function VN(name, attributes, ...rest) {
  attributes = attributes || {};
  const children = collapseShallowArray(rest);
  return isFn(name)
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

function Path_getValue(path, source) {
  let i = 0;
  const l = path.length;
  while (i < l) {
    source = source[path[i++]];
  }
  return source;
}

function Path_setValue(path, value, source) {
  const target = {};
  if (path.length) {
    target[path[0]] = path.length > 1
      ? Path_setValue(path.slice(1), value, source[path[0]])
      : value;
    return cloneObject(source, target);
  }
  return value;
}


function app(state, actions, view, container) {
  const map = [].map;
  let rootElement = (container && container.children[0]) || null;
  let _oldNode = rootElement && recycleElement(rootElement);
  const lifecycle = [];
  let skipRender = false;
  let isRecycling = true;
  let globalState = cloneObject(state);
  const wiredActions = wireStateToActions([], globalState, cloneObject(actions));

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
    if (isFn(node))
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

  function wireStateToActions(path, myState, myActions) {
    // action proxy for each action in myActions.
    function createActionProxy(action) {
      return function actionProxy(data) {
        const slice = Path_getValue(path, globalState);

        let result = action(data);
        if (isFn(result)) {
          result = result(slice, myActions);
        }

        if (result && result !== slice && !result.then) {
          globalState = Path_setValue(
            path,
            cloneObject(slice, result),
            globalState,
          );
          scheduleRender();
        }

        return result;
      };
    }

    // eslint-disable-next-line guard-for-in
    for (const key in myActions) {
      const act = myActions[key];
      if (isFn(act)) {
        myActions[key] = createActionProxy(act);
      }
      else {
        // wire slice/namespace of state to actions
        wireStateToActions(
          path.concat(key),
          (myState[key] = cloneObject(myState[key])),
          (myActions[key] = cloneObject(myActions[key])),
        );
      }
    }

    return myActions;
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
        const lval = cloneObject(oldValue, value);
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
    for (const name in cloneObject(oldAttributes, attributes)) {
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

          const oldKey = getVNodeKey(oldChildren[i]);
          if (oldKey != null) {
            oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
          }
        }

        let i = 0;
        let k = 0;
        const l = children.length;
        while (k < l) {
          const oldKey = getVNodeKey(oldChildren[i]);
          const newKey = getVNodeKey((children[k] = resolveNode(children[k])));

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
          if (getVNodeKey(oldChildren[i]) == null) {
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

const CONST_TIME_INSERTDATE = '1970-01-01T';

function isLeapYear(year) {
  // https://tools.ietf.org/html/rfc3339#appendix-C
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

const CONST_RFC3339_DAYS = Object.freeze(
  [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
);

// full-date from http://tools.ietf.org/html/rfc3339#section-5.6
const CONST_RFC3339_REGEX_ISDATE = /^(\d\d\d\d)-([0-1]\d)-([0-3]\d)z?$/i;

function isDateOnlyInRange(year, month, day) {
  return month >= 1
    && month <= 12
    && day >= 1
    && day <= (month === 2 && isLeapYear(year)
      ? 29
      : CONST_RFC3339_DAYS[month]);
}

function isDateOnlyRFC3339(str) {
  if (!isStringType(str)) return false;
  const m = str.match(CONST_RFC3339_REGEX_ISDATE);
  return m != null
    && isDateOnlyInRange(m[1]|0, m[2]|0, m[3]|0);
}

function getDateTypeOfDateOnlyRFC3339(str, def = undefined) {
  return isDateOnlyRFC3339(str)
    ? new Date(Date.parse(str))
    : def;
}

// full-date from http://tools.ietf.org/html/rfc3339#section-5.6
const CONST_RFC3339_REGEX_ISTIME = /^(\d\d):(\d\d):(\d\d)(\.\d{1,6})?(z|(([+-])(\d\d):(\d\d)))$/i;

function isTimeOnlyInRange(hrs = 0, min = 0, sec = 0, tzh = 0, tzm = 0) {
  return ((hrs === 23 && min === 59 && sec === 60)
    || (hrs >= 0 && hrs <= 23
      && min >= 0 && min <= 59
      && sec >= 0 && sec <= 59))
    && (tzh >= 0 && tzh <= 23
      && tzm >= 0 && tzm <= 59);
}

function isTimeOnlyRFC3339(str) {
  if (!isStringType(str)) return false;
  const m = str.match(CONST_RFC3339_REGEX_ISTIME);
  return m != null
    && isTimeOnlyInRange(m[1]|0, m[2]|0, m[3]|0, m[8]|0, m[9]|0);
}

function getDateTypeOfTimeOnlyRFC3339(str, def = undefined) {
  return isTimeOnlyRFC3339(str)
    ? new Date(Date.parse(CONST_TIME_INSERTDATE + str))
    : def;
}

function isDateTimeRFC3339(str) {
  // http://tools.ietf.org/html/rfc3339#section-5.6
  if (!isStringType(str)) return false;
  const dateTime = str.split(/t|\s/i);
  return dateTime.length === 2
    && isDateOnlyRFC3339(dateTime[0])
    && isTimeOnlyRFC3339(dateTime[1]);
}

function getDateTypeOfDateTimeRFC3339(str, def = undefined) {
  return isDateTimeRFC3339(str)
    ? new Date(Date.parse(str))
    : def;
}

/* eslint-disable function-paren-newline */

function compileFormatMinimumByType(parseType, schemaObj, jsonSchema) {
  const [min, emin] = getTypeExclusiveBound(
    parseType,
    jsonSchema.formatMinimum,
    jsonSchema.formatExclusiveMinimum);

  if (emin != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatExclusiveMinimum',
      emin,
      parseType);
    if (addError == null) return undefined;

    return function isFormatExclusiveMinimum(data) {
      return (data != null && data > emin) || addError(data);
    };
  }
  else if (min) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatMinimum',
      min,
      parseType);
    if (addError == null) return undefined;

    return function isFormatMinimum(data) {
      return (data != null && data >= min) || addError(data);
    };
  }

  return undefined;
}

function compileFormatMaximumByType(parseType, schemaObj, jsonSchema) {
  const [max, emax] = getTypeExclusiveBound(
    parseType,
    jsonSchema.formatMaximum,
    jsonSchema.formatExclusiveMaximum);

  if (emax != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatExclusiveMaximum',
      emax,
      parseType);
    if (addError == null) return undefined;

    return function isFormatExclusiveMaximum(data) {
      return (data != null && data < emax) || addError(data);
    };
  }
  else if (max != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatMaximum',
      max,
      parseType);
    if (addError == null) return undefined;

    return function isFormatMaximum(data) {
      return (data != null && data <= max) || addError(data);
    };
  }
  return undefined;
}

function compileFormatByType(name, parseType, schemaObj, jsonSchema) {
  if (jsonSchema.format !== name)
    return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'format',
    jsonSchema.format,
    compileDateTimeFormat);
  if (addError == null) return undefined;

  const validateMin = compileFormatMinimumByType(
    parseType,
    schemaObj,
    jsonSchema);
  const validateMax = compileFormatMaximumByType(
    parseType,
    schemaObj,
    jsonSchema);

  if (validateMin != null && validateMax != null) {
    return function validateFormatBetween(data) {
      if (isStringType(data)) {
        const date = parseType(data);
        return date == null
          ? addError(data)
          : validateMin(date)
            && validateMax(date);
      }
      else if (isDateType(data))
        return validateMin(data)
          && validateMax(data);
      else
        return data == null;
    };
  }
  if (validateMin != null) {
    return function validateFormatMinimum(data) {
      if (isStringType(data)) {
        const date = parseType(data);
        return date == null
          ? addError(data)
          : validateMin(date);
      }
      else if (isDateType(data))
        return validateMin(data);
      else
        return data == null;
    };
  }
  if (validateMax != null) {
    return function validateFormatMaximum(data) {
      if (isStringType(data))
        return validateMax(parseType(data));
      else if (isDateType(data))
        return validateMax(data);
      return true;
    };
  }

  return function validateDateTime(data) {
    if (isStringType(data)) {
      const date = parseType(data);
      return date == null
        ? addError(data)
        : true;
    }
    else return true;
  };
}

function compileDateTimeFormat(schemaObj, jsonSchema) {
  return compileFormatByType(
    'date-time',
    getDateTypeOfDateTimeRFC3339,
    schemaObj,
    jsonSchema);
}

function compileDateOnlyFormat(schemaObj, jsonSchema) {
  return compileFormatByType(
    'date',
    getDateTypeOfDateOnlyRFC3339,
    schemaObj,
    jsonSchema);
}

function compileTimeOnlyFormat(schemaObj, jsonSchema) {
  return compileFormatByType(
    'time',
    getDateTypeOfTimeOnlyRFC3339,
    schemaObj,
    jsonSchema);
}

const formatCompilers = {
  'date-time': compileDateTimeFormat,
  date: compileDateOnlyFormat,
  time: compileTimeOnlyFormat,
};

// Copyright Mathias Bynens <https://mathiasbynens.be/>

/** Highest positive signed 32-bit float value */
const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
const base$2 = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'
const regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
const errors = {
  // eslint-disable-next-line quote-props
  'overflow': 'Overflow: input needs wider integers to process',
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input',
};

/** Convenience shortcuts */
const baseMinusTMin = base$2 - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
  throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, fn) {
  const result = [];
  let length = array.length;
  while (length--) {
    result[length] = fn(array[length]);
  }
  return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
  const parts = string.split('@');
  let result = '';
  if (parts.length > 1) {
    // In email addresses, only the domain name should be punycoded. Leave
    // the local part (i.e. everything up to `@`) intact.
    result = parts[0] + '@';
    string = parts[1];
  }
  // Avoid `split(regex)` for IE8 compatibility. See #17.
  string = string.replace(regexSeparators, '\x2E');
  const labels = string.split('.');
  const encoded = map(labels, fn).join('.');
  return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
  const output = [];
  let counter = 0;
  const length = string.length;
  while (counter < length) {
    const value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      const extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) === 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
}

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
function digitToBasic(digit, flag) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26) - ((flag !== 0) << 5);
}

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
function adapt(delta, numPoints, firstTime) {
  let k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base$2) {
    delta = floor(delta / baseMinusTMin);
  }
  return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
}

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
function encode(str) {
  const output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  const input = ucs2decode(str);

  // Cache the length.
  const inputLength = input.length;

  // Initialize the state.
  let n = initialN;
  let delta = 0;
  let bias = initialBias;

  // Handle the basic code points.
  for (const currentValue of input) {
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  const basicLength = output.length;
  let handledCPCount = basicLength;

  // `handledCPCount` is the number of code points that have been handled;
  // `basicLength` is the number of basic code points.

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next
    // larger one:
    let m = maxInt;
    for (const currentValue of input) {
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
    // but guard against overflow.
    const handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
      error('overflow');
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (const currentValue of input) {
      if (currentValue < n && ++delta > maxInt) {
        error('overflow');
      }
      if (currentValue === n) {
        // Represent delta as a generalized variable-length integer.
        let q = delta;
        for (let k = base$2; /* no condition */; k += base$2) {
          const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) {
            break;
          }
          const qMinusT = q - t;
          const baseMinusT = base$2 - t;
          output.push(
            stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)),
          );
          q = floor(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q, 0)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
}

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
function toASCII(input) {
  return mapDomain(input, function iterateMapDomain(string) {
    return regexNonASCII.test(string)
      ? 'xn--' + encode(string)
      : string;
  });
}

/* eslint-disable max-len */

function createRegExp(pattern, force = false) {
  try {
    if (pattern != null) {
      if (pattern.constructor === RegExp) {
        return force === true
          ? new RegExp(pattern.toString())
          : pattern;
      }
      if (pattern.constructor === String) {
        if (pattern[0] === '/') {
          const e = pattern.lastIndexOf('/');
          if (e >= 0) {
            const r = pattern.substring(1, e);
            const g = pattern.substring(e + 1);
            return new RegExp(r, g);
          }
        }
        return new RegExp(pattern);
      }
      if (pattern.constructor === Array && pattern.length > 1) {
        return new RegExp(pattern[0], pattern[1]);
      }
    }
    return undefined;
  }
  catch (e) {
    return undefined;
  }
}

function isStringRegExp(str) {
  return createRegExp(str) != null;
}

const CONST_REGEXP_ALPHA = /^[a-zA-Z]+$/;
function isStringAlpha(str) {
  return CONST_REGEXP_ALPHA.test(str);
}
const CONST_REGEXP_ALPHANUMERIC = /^[a-zA-Z0-9]+$/;
function isStringAlphaNumeric(str) {
  return CONST_REGEXP_ALPHANUMERIC.test(str);
}

const CONST_REGEXP_IDENTIFIER = /^[-_a-zA-Z0-9]+$/; // NOT HAPPY WITH THIS!
function isStringIdentier(str) {
  return CONST_REGEXP_IDENTIFIER.test(str) && str.length <= 64;
}

const CONST_REGEXP_HEXADECIMAL = /^[a-fA-F0-9]+$/;
function isStringHexaDecimal(str) {
  return CONST_REGEXP_HEXADECIMAL.test(str);
}

const CONST_REGEXP_NUMERIC = /^[0-9]+$/;
function isStringNumeric(str) {
  return CONST_REGEXP_NUMERIC.test(str);
}

const CONST_REGEXP_HOSTNAME = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*$/i;
function isStringHostname(str) {
  // https://tools.ietf.org/html/rfc1034#section-3.5
  // https://tools.ietf.org/html/rfc1123#section-2
  return str.length <= 255 && CONST_REGEXP_HOSTNAME.test(str);
}

const CONST_REGEXP_ACEHOSTNAME = /^(?!-)(xn--)?[a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]{0,1}\.(?!-)(xn--)?([a-zA-Z0-9\-]{1,50}|[a-zA-Z0-9-]{1,30}\.[a-zA-Z]{2,})$/;
function isStringIdnHostname(str) {
  // https://stackoverflow.com/questions/47514123/domain-name-regex-including-idn-characters-c-sharp
  const punycode = toASCII(str);
  return CONST_REGEXP_ACEHOSTNAME.test(punycode);
}

const CONST_REGEXP_NOT_URI_FRAGMENT = /\/|:/;
// uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
const CONST_REGEXP_URI_FAST = /^(?:[a-z][a-z0-9+-.]*:)(?:\/?\/)?[^\s]*$/i;
const CONST_REGEXP_URI_FULL = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
function isStringUri(str, full = false) {
  // http://jmrware.com/articles/2009/uri_regexp/URI_regex.html + optional protocol + required "."
  return CONST_REGEXP_NOT_URI_FRAGMENT.test(str)
    && (full === true
      ? CONST_REGEXP_URI_FULL.test(str)
      : CONST_REGEXP_URI_FAST.test(str));
}

const CONST_REGEXP_URIREF_FAST = /^(?:(?:[a-z][a-z0-9+-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i;
const CONST_REGEXP_URIREF_FULL = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
function isStringUriRef(str, full = false) {
  return full === true
    ? CONST_REGEXP_URIREF_FULL.test(str)
    : CONST_REGEXP_URIREF_FAST.test(str);
}

// uri-template: https://tools.ietf.org/html/rfc6570
// eslint-disable-next-line no-control-regex
const CONST_REGEXP_URITEMPLATE = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i;
function isStringUriTemplate(str) {
  return CONST_REGEXP_URITEMPLATE.test(str);
}

// For the source: https://gist.github.com/dperini/729294
// For test cases: https://mathiasbynens.be/demo/url-regex
// @todo Delete current URL in favour of the commented out URL rule when this issue is fixed https://github.com/eslint/eslint/issues/7983.
// URL = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)(?:\.(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
// eslint-disable-next-line no-control-regex
const CONST_REGEXP_URL = /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-?)*(?:[0-9KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[KSa-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i;
function isStringUrl(str) {
  return CONST_REGEXP_URL.test(str);
}

// email (sources from jsen validator):
// http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
// http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'willful violation')
const CONST_REGEXP_EMAIL_FAST = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;
const CONST_REGEXP_EMAIL_FULL = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
function isStringEmail(str, full = false) {
  return full === true
    && CONST_REGEXP_EMAIL_FULL.test(str)
    || CONST_REGEXP_EMAIL_FAST.test(str);
}

const CONST_REGEXP_IDNEMAIL = /^[^@]+@[^@]+\.[^@]+$/;
function isStringIdnEmail(str) {
  return CONST_REGEXP_IDNEMAIL.test(str);
}

// optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
const CONST_REGEXP_IPV4 = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
function isStringIPv4(str) {
  return CONST_REGEXP_IPV4.test(str);
}

// optimized http://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses
const CONST_REGEXP_IPV6 = /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i;
function isStringIPv6(str) {
  return CONST_REGEXP_IPV6.test(str);
}

// uuid: http://tools.ietf.org/html/rfc4122
const CONST_REGEXP_UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
function isStringUUID(str) {
  return CONST_REGEXP_UUID.test(str);
}

// JSON-pointer: https://tools.ietf.org/html/rfc6901
const CONST_REGEXP_JSON_POINTER = /^(?:\/(?:[^~/]|~0|~1)*)*$/;
function isStringJSONPointer(str) {
  return CONST_REGEXP_JSON_POINTER.test(str);
}

// uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
const CONST_REGEXP_JSON_POINTER_URI_FRAGMENT = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i;
function isStringJSONPointerUriFragment(str) {
  return CONST_REGEXP_JSON_POINTER_URI_FRAGMENT.test(str);
}

// relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
const CONST_REGEXP_RELATIVE_JSON_POINTER = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;
function isStringRelativeJSONPointer(str) {
  return CONST_REGEXP_RELATIVE_JSON_POINTER.test(str);
}

/* eslint-disable function-paren-newline */

function createStringFormatCompiler(formatName, isFormatTest) {
  return function compileStringFormat(schemaObj, jsonSchema) {
    if (jsonSchema.format !== formatName) return undefined;

    const addError = schemaObj.createSingleErrorHandler(
      'format',
      formatName,
    );
    if (addError == null) return undefined;

    return function validateStringFormat(data) {
      return isStringType(data)
        ? isFormatTest(data)
          || addError(data)
        : true;
    };
  };
}

function isStringUpperCase(str) {
  return str === str.toUpperCase();
}

function isStringLowerCase(str) {
  return str === str.toLowerCase();
}

const formatCompilers$1 = {
  'alpha': createStringFormatCompiler(
    'alpha', isStringAlpha),
  'alphanumeric': createStringFormatCompiler(
    'alphanumeric', isStringAlphaNumeric),
  'identifier': createStringFormatCompiler(
    'identifier', isStringIdentier),
  'hexadecimal': createStringFormatCompiler(
    'hexadecimal', isStringHexaDecimal),
  'numeric': createStringFormatCompiler(
    'numeric', isStringNumeric),
  'uppercase': createStringFormatCompiler(
    'uppercase', isStringUpperCase),
  'lowercase': createStringFormatCompiler(
    'lowercase', isStringLowerCase),
  'regex': createStringFormatCompiler(
    'regex', isStringRegExp),
  'uri': createStringFormatCompiler(
    'uri', isStringUri),
  'uri-reference': createStringFormatCompiler(
    'uri-reference', isStringUriRef),
  'uri-template': createStringFormatCompiler(
    'uri-template', isStringUriTemplate),
  'url': createStringFormatCompiler(
    'url', isStringUrl),
  'email': createStringFormatCompiler(
    'email', isStringEmail),
  'hostname': createStringFormatCompiler(
    'hostname', isStringHostname),
  'idn-email': createStringFormatCompiler(
    'idn-email', isStringIdnEmail),
  'idn-hostname': createStringFormatCompiler(
    'idn-hostname', isStringIdnHostname),
  'ipv4': createStringFormatCompiler(
    'ipv4', isStringIPv4),
  'ipv6': createStringFormatCompiler(
    'ipv6', isStringIPv6),
  'uuid': createStringFormatCompiler(
    'uuid', isStringUUID),
  'json-pointer': createStringFormatCompiler(
    'json-pointer', isStringJSONPointer),
  'json-pointer-uri-fragment': createStringFormatCompiler(
    'json-pointer-uri-fragment', isStringJSONPointerUriFragment),
  'relative-json-pointer': createStringFormatCompiler(
    'relative-json-pointer', isStringRelativeJSONPointer),
};

/* eslint-disable no-console */

function getDefaultFormatCompilers() {
  return {
    ...formatCompilers,
    ...formatCompilers$1,
  };
}

function createFormatNumberCompiler(name, format) {
  if (isComplexType(format)) {
    // TODO: isNumeric
    if (['integer', 'bigint', 'number'].includes(format.type)) {
      const rix = Number(format.minimum) || false;
      const rax = Number(format.maximum) || false;

      const isDataType = format.type === 'integer'
        ? isIntegerType
        : format.type === 'bigint'
          ? isBigIntType
          : format.type === 'number'
            ? isNumberType$1
            : undefined;

      if (isDataType) {
        return function compileFormatNumber(schemaObj, jsonSchema) {
          const fix = Math.max(Number(jsonSchema.formatMinimum) || rix, rix);
          const _fie = jsonSchema.formatExclusiveMinimum === true
            ? fix
            : Number(jsonSchema.formatExclusiveMinimum) || false;
          const fie = fix !== false && _fie !== false
            ? Math.max(fix, _fie)
            : _fie;

          const fax = Math.min(Number(jsonSchema.formatMaximum) || rax, rax);
          const _fae = jsonSchema.formatExclusiveMaximum === true
            ? fax
            : Number(jsonSchema.formatExclusiveMaximum) || false;
          const fae = fax !== false && _fae !== false
            ? Math.max(fax, _fae)
            : _fae;

          if (fie && fae) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatExclusiveMinimum', 'formatExclusiveMaximum'],
              [fie, fae],
              compileFormatNumber,
            );
            return function betweenExclusive(data) {
              if (!isDataType(data)) return true;
              if (data > fie && data < fae) return true;
              return addError(data);
            };
          }
          else if (fie && fax) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatExclusiveMinimum', 'formatMaximum'],
              [fie, fax],
              compileFormatNumber,
            );
            return function betweenExclusiveMinimum(data) {
              if (!isDataType(data)) return true;
              if (data > fie && data <= fax) return true;
              return addError(data);
            };
          }
          else if (fae && fix) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatMinimum', 'formatExclusiveMaximum'],
              [fix, fae],
              compileFormatNumber,
            );
            return function betweenExclusiveMaximum(data) {
              if (!isDataType(data)) return true;
              if (data >= fix && data < fae) return true;
              return addError(data);
            };
          }
          else if (fix && fax) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatMinimum', 'formatMaximum'],
              [fie, fae],
              compileFormatNumber,
            );
            return function formatBetween(data) {
              if (!isDataType(data)) return true;
              if (data >= fix && data <= fax) return true;
              return addError(data);
            };
          }
          else if (fie) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatExclusiveMinimum',
              fie,
              compileFormatNumber,
            );
            return function formatExclusiveMinimum(data) {
              if (!isDataType(data)) return true;
              if (data > fie) return true;
              return addError(data);
            };
          }
          else if (fae) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatExclusiveMaximum',
              fae,
              compileFormatNumber,
            );
            return function formatExclusiveMaximum(data) {
              if (!isDataType(data)) return true;
              if (data < fae) return true;
              return addError(data);
            };
          }
          else if (fax) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatMaximum',
              fax,
              compileFormatNumber,
            );
            return function formatMaximum(data) {
              if (!isDataType(data)) return true;
              if (data <= fax) return true;
              return addError(data);
            };
          }
          else if (fix) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatMinimum',
              fix,
              compileFormatNumber,
            );
            return function formatMinimum(data) {
              if (!isDataType(data)) return true;
              if (data >= fix) return true;
              return addError(data);
            };
          }
          return undefined;
        };
      }
    }
  }
  return undefined;
}

function registerDefaultFormatCompilers() {
  const formatCompilers = getDefaultFormatCompilers();
  const keys = Object.keys(formatCompilers);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    const item = formatCompilers[key];
    registerFormatCompiler(key, item);
  }
}

const registeredSchemaFormatters = {};
function registerFormatCompiler(name, jsonSchema) {
  if (registeredSchemaFormatters[name] == null) {
    const r = typeof jsonSchema;
    if (r === 'function') {
      registeredSchemaFormatters[name] = jsonSchema;
      return true;
    }
    else {
      const fn = createFormatNumberCompiler(name, jsonSchema);
      if (fn) {
        registeredSchemaFormatters[name] = fn;
        return true;
      }
    }
  }
  return false;
}

function getSchemaFormatCompiler(name) {
  if (isStringType(name))
    return registeredSchemaFormatters[name];
  else
    return undefined;
}

function compileFormatBasic(schemaObj, jsonSchema) {
  if (!isStringType(jsonSchema.format)) return undefined;
  const compiler = getSchemaFormatCompiler(jsonSchema.format);
  if (compiler)
    return compiler(schemaObj, jsonSchema);
  else
    return falseThat;
}

/* eslint-disable function-paren-newline */

function compileConst(schemaObj, jsonSchema) {
  const constant = jsonSchema.const;
  if (constant === undefined) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'const',
    constant,
    compileConst);
  if (addError == null) return undefined;

  if (constant === null || isScalarType(constant)) {
    return function validatePrimitiveConst(data, dataRoot) {
      return constant === data || addError(data);
    };
  }
  else {
    return function validatePrimitiveConst(data, dataRoot) {
      return equalsDeep(constant, data) || addError(data);
    };
  }
}

function compileEnum(schemaObj, jsonSchema) {
  const enums = getArrayTypeMinItems(jsonSchema.enum, 1);
  if (enums == null) return undefined;

  let hasObjects = false;
  for (let i = 0; i < enums.length; ++i) {
    const e = enums[i];
    if (e != null && typeof e === 'object') {
      hasObjects = true;
      break;
    }
  }

  const addError = schemaObj.createSingleErrorHandler(
    'enum',
    enums,
    compileEnum);
  if (addError == null) return undefined;

  if (hasObjects === false) {
    return function validateEnumSimple(data, dataRoot) {
      return data === undefined
        ? true
        : enums.includes(data)
          ? true
          : addError(data);
    };
  }
  else {
    return function validateEnumDeep(data, dataRoot) {
      if (data === undefined) return true;
      if (data === null || typeof data !== 'object')
        return enums.includes(data)
          ? true
          : addError(data);

      for (let i = 0; i < enums.length; ++i) {
        if (equalsDeep(enums[i], data) === true)
          return true;
      }
      return addError(data);
    };
  }
}

function compileEnumBasic(schemaObj, jsonSchema) {
  return [
    compileConst(schemaObj, jsonSchema),
    compileEnum(schemaObj, jsonSchema),
  ];
}

/* eslint-disable function-paren-newline */

function compileNumberMaximum(schemaObj, jsonSchema) {
  const [max, emax] = getNumberExclusiveBound(
    jsonSchema.maximum,
    jsonSchema.exclusiveMaximum,
  );

  if (emax != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'exclusiveMaximum',
      emax,
      compileNumberMaximum);
    if (addError == null) return undefined;

    if (isBigIntType(emax)) {
      return function exclusiveMaximumBigInt(data) {
        return (isBigIntType(data) || isNumberType$1(data)) // are we forgiving?
          ? data < emax
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function exclusiveMaximum(data) {
        return isNumberType$1(data)
          ? data < emax
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
  }
  else if (max != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'maximum',
      max,
      compileNumberMaximum);
    if (addError == null) return undefined;

    if (isBigIntType(max)) {
      return function maximumBigInt(data) {
        return (isBigIntType(data) || isNumberType$1(data)) // are we that forgiving?
          ? data <= max
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function maximum(data) {
        return isNumberType$1(data)
          ? data <= max
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
  }
  return undefined;
}

function compileNumberMinimum(schemaObj, jsonSchema) {
  const [min, emin] = getNumberExclusiveBound(
    jsonSchema.minimum,
    jsonSchema.exclusiveMinimum,
  );

  if (emin != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'exclusiveMinimum',
      emin,
      compileNumberMinimum);
    if (addError == null) return undefined;

    if (isBigIntType(emin)) {
      return function exclusiveMinimumBigInt(data) {
        return (isBigIntType(data) || isNumberType$1(data))
          ? data > emin
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function exclusiveMinimum(data) {
        return isNumberType$1(data)
          ? data > emin
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
  }
  else if (min != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'minimum',
      min,
      compileNumberMinimum);
    if (addError == null) return undefined;

    if (isBigIntType(min)) {
      return function minimumBigInt(data) {
        return (isBigIntType(data) || isNumberType$1(data))
          ? data >= min
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function minimum(data) {
        return isNumberType$1(data)
          ? data >= min
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
  }
  return undefined;
}

function compileNumberMultipleOf(schemaObj, jsonSchema) {
  const mulOf = isBigIntType(jsonSchema.multipleOf)
    ? jsonSchema.multipleOf
    : getNumbishType(jsonSchema.multipleOf);

  if (mulOf == null) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'multipleOf',
    mulOf,
    compileNumberMultipleOf);
  if (addError == null) return undefined;

  if (isBigIntType(mulOf)) {
    return function multipleOfBigInt(data) {
      return isBigIntType(data)
        ? data % mulOf === BigInt(0)
          ? true
          : addError(data)
        : isNumberType$1(data)
          ? data % Number(mulOf) === 0
            ? true
            : addError(data)
          : true;
    };
  }
  else {
    return function multipleOf(data) {
      return isNumberType$1(data)
        ? data % mulOf === 0
          ? true
          : addError(data)
        : true;
    };
  }
}

function compileNumberBasic(schemaObj, jsonSchema) {
  return [
    compileNumberMinimum(schemaObj, jsonSchema),
    compileNumberMaximum(schemaObj, jsonSchema),
    compileNumberMultipleOf(schemaObj, jsonSchema),
  ];
}

function compileMinLength(schemaObj, jsonSchema) {
  const min = Math.max(getIntishType(jsonSchema.minLength, 0), 0);
  if (min === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler('minLength', min, compileMinLength);
  if (addError == null) return undefined;

  return function validateStringMinLength(data) {
    return isStringType(data)
      ? data.length >= min
        ? true
        : addError(data.length)
      : true;
  };
}

function compileMaxLength(schemaObj, jsonSchema) {
  const max = Math.max(getIntishType(jsonSchema.maxLength, 0), 0);
  if (max === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler('maxLength', max, compileMaxLength);
  if (addError == null) return undefined;

  return function validateStringMaxLength(data) {
    return isStringType(data)
      ? data.length <= max
        ? true
        : addError(data.length)
      : true;
  };
}

function compileStringPattern(schemaObj, jsonSchema) {
  const ptrn = jsonSchema.pattern;
  const re = createRegExp(ptrn);
  if (re == null) return undefined;

  const addError = schemaObj.createSingleErrorHandler('pattern', ptrn, compileStringPattern);
  if (addError == null) return undefined;

  return function validateStringPattern(data) {
    return isStringType(data)
      ? re.test(data)
        ? true
        : addError(data)
      : true;
  };
}

function compileStringBasic(schemaObj, jsonSchema) {
  return [
    compileMinLength(schemaObj, jsonSchema),
    compileMaxLength(schemaObj, jsonSchema),
    compileStringPattern(schemaObj, jsonSchema),
  ];
}

/* eslint-disable function-paren-newline */

function compileMaxPropertiesLength(schemaObj, jsonSchema) {
  const maxprops = getIntishType(jsonSchema.maxProperties);
  if (!(maxprops > 0)) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'maxProperties',
    maxprops,
    compileMaxPropertiesLength);
  if (addError == null) return undefined;

  return function maxPropertiesLength(length) {
    return length <= maxprops
      ? true
      : addError(length);
  };
}

function compileMinPropertiesLength(schemaObj, jsonSchema) {
  const minprops = getIntishType(jsonSchema.minProperties);
  if (!(minprops > 0)) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'minProperties',
    minprops,
    compileMinPropertiesLength);
  if (addError == null) return undefined;

  return function minPropertiesLength(length) {
    return length >= minprops
      ? true
      : addError(length);
  };
}

function compileCheckBounds(schemaObj, jsonSchema) {
  const xp = compileMaxPropertiesLength(schemaObj, jsonSchema);
  const mp = compileMinPropertiesLength(schemaObj, jsonSchema);
  if (xp && mp) {
    return function validatePropertiesLength(length) {
      return xp(length) && mp(length);
    };
  }
  return xp || mp;
}

function compileDefaultPropertyBounds(checkBounds) {
  if (!isFn(checkBounds)) return undefined;
  return function propertiesLengthDefault(data) {
    return !isObjectOrMapType(data)
      ? true
      : data.constructor === Map
        ? checkBounds(data.size)
        : checkBounds(Object.keys(data).length);
  };
}

function compileRequiredProperties(schemaObj, jsonSchema, checkBounds) {
  const required = getArrayType(jsonSchema.required);
  if (required == null) return undefined;

  const mapProps = getMapTypeOfArray(jsonSchema.properties);
  const objProps = getObjectType(jsonSchema.properties);

  const requiredKeys = required.length !== 0
    ? required
    : mapProps != null
      ? Array.from(mapProps.keys())
      : objProps != null
        ? Object.keys(objProps)
        : [];

  if (requiredKeys.length === 0) return undefined;

  checkBounds = checkBounds || trueThat;

  const addError = schemaObj.createSingleErrorHandler(
    'requiredProperties',
    required,
    compileRequiredProperties);
  if (addError == null) return undefined;

  return function requiredProperties(data) {
    if (!isObjectOrMapType(data)) return true;

    let valid = true;
    if (data.constructor === Map) {
      for (let i = 0; i < requiredKeys.length; ++i) {
        if (data.has(requiredKeys[i]) === false) {
          valid = addError(requiredKeys[i], data);
        }
      }
      return checkBounds(data.size) && valid;
    }

    const dataKeys = Object.keys(data);
    for (let i = 0; i < requiredKeys.length; ++i) {
      if (dataKeys.includes(requiredKeys[i]) === false) {
        valid = addError(requiredKeys[i], data);
      }
    }
    return checkBounds(dataKeys.length) && valid;
  };
}

function compileRequiredPatterns(schemaObj, jsonSchema) {
  const required = getArrayType(jsonSchema.patternRequired);
  if (required == null || required.length === 0) return undefined;

  // produce an array of regexp objects to validate members.
  const patterns = [];
  for (let i = 0; i < required.length; ++i) {
    const pattern = createRegExp(required[i]);
    if (pattern) patterns.push(pattern);
  }
  if (patterns.length === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'patternRequired',
    patterns,
    compileRequiredPatterns);
  if (addError == null) return undefined;

  return function patternRequired(data) {
    if (!isObjectOrMapType(data)) return true;

    const dataKeys = data.constructor === Map
      ? Array.from(data.keys())
      : Object.keys(data);

    let valid = true;
    for (let i = 0; i < patterns.length; ++i) {
      const pattern = patterns[i];
      let found = false;
      for (let j = 0; j < dataKeys.length; ++j) {
        const dk = dataKeys[j];
        if (dk != null && pattern.test(dk)) {
          found = true;
          dataKeys[j] = undefined;
          break;
        }
      }
      if (!found)
        valid = addError(data, pattern);
    }
    return valid;
  };
}

function compileDependencyArray(schemaObj, member, key, items) {
  if (items.length === 0) return undefined;

  const addError = schemaObj.createPairErrorHandler(member, key, items, compileDependencyArray);
  if (addError == null) return undefined;

  return function validateDependencyArray(data) {
    if (!isObjectOrMapType(data)) return true;
    let valid = true;
    if (data.constructor === Map) {
      for (let i = 0; i < items.length; ++i) {
        if (data.has(items[i]) === false) {
          addError(items[i]);
          valid = false;
        }
      }
    }
    else {
      const keys = Object.keys(data);
      for (let i = 0; i < items.length; ++i) {
        if (keys.includes(items[i]) === false) {
          addError(items[i]);
          valid = false;
        }
      }
    }
    return valid;
  };
}

function compileDependencies(schemaObj, jsonSchema) {
  const dependencies = getObjectType(jsonSchema.dependencies);
  if (dependencies == null) return undefined;

  const depKeys = Object.keys(dependencies);
  if (depKeys.length === 0) return undefined;

  const member = schemaObj.createMember('dependencies', compileDependencies);
  if (member == null) return undefined;

  const validators = {};
  for (let i = 0; i < depKeys.length; ++i) {
    const key = depKeys[i];
    const item = dependencies[key];
    if (isArrayType(item)) {
      const validator = compileDependencyArray(schemaObj, member, key, item);
      if (validator != null) validators[key] = validator;
    }
    else if (isBoolOrObjectType(item)) {
      const validator = schemaObj.createPairValidator(member, key, item, compileDependencies);
      if (validator != null) validators[key] = validator;
    }
  }

  const valKeys = Object.keys(validators);
  if (valKeys.length === 0) return undefined;

  return function validateDependencies(data, dataRoot) {
    if (!isObjectOrMapType(data)) return true;
    let valid = true;
    let errors = 0;
    if (data.constructor === Map) {
      for (let i = 0; i < valKeys.length; ++i) {
        if (errors > 32) break;
        const key = valKeys[i];
        if (data.has(key)) {
          const validator = validators[key];
          if (validator(data, dataRoot) === false) {
            valid = false;
            errors++;
          }
        }
      }
    }
    else {
      for (let i = 0; i < valKeys.length; ++i) {
        if (errors > 32) break;
        const key = valKeys[i];
        if (data.hasOwnProperty(key)) {
          const validator = validators[key];
          if (validator(data, dataRoot) === false) {
            valid = false;
            errors++;
          }
        }
      }
    }
    return valid;
  };
}

function compileObjectBasic(schemaObj, jsonSchema) {
  const checkBounds = compileCheckBounds(schemaObj, jsonSchema);
  return [
    compileRequiredProperties(schemaObj, jsonSchema, checkBounds)
      || compileDefaultPropertyBounds(checkBounds),
    compileRequiredPatterns(schemaObj, jsonSchema),
    compileDependencies(schemaObj, jsonSchema),
  ];
}

function compileObjectPropertyNames(schemaObj, propNames) {
  if (propNames == null) return undefined;

  const validator = schemaObj.createSingleValidator(
    'propertyNames',
    propNames,
    compileObjectPropertyNames);
  if (validator == null) return undefined;

  return validator;
}

function createObjectPropertyValidators(schemaObj, properties) {
  if (properties == null) return undefined;

  const keys = Object.keys(properties);
  if (keys.length === 0) return undefined;

  const member = schemaObj.createMember('properties', compileObjectPropertyItem);
  if (member == null) return undefined;

  const children = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const child = properties[key];
    const validator = schemaObj.createPairValidator(member, key, child);
    if (validator != null)
      children[key] = validator;
  }
  return (Object.keys(children).length > 0)
    ? children
    : undefined;
}

function compileObjectPropertyItem(children) {
  if (children == null) return undefined;

  return function validatePropertyItem(key, data, dataRoot) {
    const validator = children[key];
    return validator != null
      ? validator(data[key], dataRoot)
      : undefined;
  };
}

function compileObjectPatternItem(schemaObj, entries) {
  if (entries == null) return undefined;

  const entryKeys = Object.keys(entries);
  if (entryKeys.length === 0) return undefined;

  const patterns = {};
  for (let i = 0; i < entryKeys.length; ++i) {
    const key = entryKeys[i];
    const pattern = createRegExp(key);
    if (pattern != null)
      patterns[key] = pattern;
  }

  const patternKeys = Object.keys(patterns);
  if (patternKeys.length === 0) return undefined;

  const member = schemaObj.createMember('patternProperties', compileObjectPatternItem);
  if (member == null) return undefined;

  const validators = {};
  for (let i = 0; i < patternKeys.length; ++i) {
    const key = patternKeys[i];
    const child = entries[key];
    const validator = schemaObj.createPairValidator(member, key, child);
    if (validator != null)
      validators[key] = validator;
  }

  const validatorKeys = Object.keys(validators);
  if (validatorKeys.length === 0) return undefined;

  return function validatePatternItem(propertyKey, data, dataRoot) {
    for (let i = 0; i < validatorKeys.length; ++i) {
      const key = validatorKeys[i];
      const pattern = patterns[key];
      if (pattern.test(propertyKey)) {
        const validate = validators[key];
        return validate(data[propertyKey], dataRoot);
      }
    }
    return undefined;
  };
}

function compileObjectAdditionalProperty(schemaObj, additional) {
  if (additional === true) return undefined;

  if (additional === false) {
    const addError = schemaObj.createSingleErrorHandler(
      'additionalProperties',
      false,
      compileObjectAdditionalProperty);
    if (addError == null) return undefined;

    // eslint-disable-next-line no-unused-vars
    return function noAdditionalProperties(dataKey, data, dataRoot) {
      return addError(dataKey, data);
    };
  }

  const validator = schemaObj.createSingleValidator(
    'additionalProperties',
    additional,
    compileObjectAdditionalProperty);
  if (validator == null) return undefined;

  return function validateAdditionalProperty(key, data, dataRoot) {
    return validator(data[key], dataRoot);
  };
}

function compileObjectChildren(schemaObj, jsonSchema) {
  const properties = getObjectType(jsonSchema.properties);
  const ptrnProps = getObjectType(jsonSchema.patternProperties);
  const propNames = getObjectType(jsonSchema.propertyNames);
  const addlProps = getBoolOrObjectType(jsonSchema.additionalProperties, true);

  const validatorChildren = createObjectPropertyValidators(schemaObj, properties);
  const patternValidator = compileObjectPatternItem(schemaObj, ptrnProps);
  const nameValidator = compileObjectPropertyNames(schemaObj, propNames);
  const additionalValidator = compileObjectAdditionalProperty(schemaObj, addlProps);

  if (patternValidator == null
    && nameValidator == null
    && additionalValidator == null) {
    if (validatorChildren == null) return undefined;

    const childrenKeys = Object.keys(validatorChildren);
    return function validateProperties(data, dataRoot) {
      if (isObjectType(data)) {
        const dataKeys = Object.keys(data);
        if (dataKeys.length === 0) return true;
        let valid = true;
        for (let i = 0; i < childrenKeys.length; ++i) {
          const key = childrenKeys[i];
          if (dataKeys.includes(key)) {
            const validator = validatorChildren[key];
            valid = validator(data[key], dataRoot) && valid;
          }
        }
        return valid;
      }
      return true;
    };
  }

  const propertyValidator = compileObjectPropertyItem(validatorChildren);

  const validateProperty = fallbackFn(propertyValidator, undefThat);
  const validatePattern = fallbackFn(patternValidator, undefThat);
  const validateName = fallbackFn(nameValidator, trueThat);
  const validateAdditional = fallbackFn(additionalValidator, trueThat);

  return function validateObjectChildren(data, dataRoot) {
    if (isObjectType(data)) {
      const dataKeys = Object.keys(data);
      let valid = true;
      let errors = 0;
      for (let i = 0; i < dataKeys.length; ++i) {
        if (errors > 32) break; // TODO: get max list errors from config
        const dataKey = dataKeys[i];

        let result = validateProperty(dataKey, data, dataRoot);
        if (result != null) {
          if (result === false) {
            valid = false;
            errors++;
          }
          continue;
        }

        result = validatePattern(dataKey, data, dataRoot);
        if (result != null) {
          if (result === false) {
            valid = false;
            errors++;
          }
          continue;
        }

        if (validateName(dataKey) === false) {
          valid = false;
          errors++;
          continue;
        }

        result = validateAdditional(dataKey, data, dataRoot);
        if (result === false) {
          valid = false;
          errors++;
        }
      }
      return valid;
    }
    return true;
  };
}

/* eslint-disable no-unused-vars */

function compileMinItems(schemaObj, jsonSchema) {
  const min = getIntishType(jsonSchema.minItems);
  if (!(min > 0)) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'minItems',
    min,
    compileMinItems);
  if (addError == null) return undefined;

  return function minItems(data) {
    return !isArrayOrSetTyped(data)
      ? true
      : getArrayOrSetTypeLength(data) >= min
        ? true
        : addError(data);
  };
}

function compileMaxItems(schemaObj, jsonSchema) {
  const max = getIntishType(jsonSchema.maxItems);
  if (!(max > 0)) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'maxItems',
    max,
    compileMaxItems);
  if (addError == null) return undefined;

  return function maxItems(data) {
    return !isArrayOrSetTyped(data)
      ? true
      : getArrayOrSetTypeLength(data) <= max
        ? true
        : addError(data);
  };
}

function compileArrayUniqueness(schemaObj, jsonSchema) {
  const unique = getBoolishType(jsonSchema.uniqueItems);
  if (unique !== true) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'uniqueItems',
    unique,
    compileArrayUniqueness);
  if (addError == null) return undefined;

  return function validateUniqueItems(data) {
    return !isArrayTyped(data)
      ? true
      : isUniqueArray(data)
        ? true
        : addError(data);
  };
}

function compileArrayBasic(schemaObj, jsonSchema) {
  return [
    compileMinItems(schemaObj, jsonSchema),
    compileMaxItems(schemaObj, jsonSchema),
    compileArrayUniqueness(schemaObj, jsonSchema),
  ];
}

function compileArrayItemsBoolean(schemaObj, jsonSchema) {
  const items = getBoolishType(jsonSchema.items);
  if (items === true) return trueThat;
  if (items !== false) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'items',
    false,
    compileArrayItemsBoolean);
  if (addError == null) return undefined;

  return function validateArrayItemsFalse(data) {
    return !isArrayTyped(data)
      ? true
      : data.length === 0
        ? true
        : addError(data);
  };
}

function compileArrayContainsBoolean(schemaObj, jsonSchema) {
  const contains = getBoolishType(jsonSchema.contains);
  if (contains === true) {
    const addError = schemaObj.createSingleErrorHandler(
      'contains',
      true,
      compileArrayContainsBoolean);
    if (addError == null) return undefined;

    return function validateArrayContainsTrue(data, dataRoot) {
      return !isArrayTyped(data)
        ? true
        : data.length > 0
          ? true
          : addError(data);
    };
  }
  if (contains === false) {
    const addError = schemaObj.createSingleErrorHandler(
      'contains',
      false,
      compileArrayContainsBoolean);
    if (addError == null) return undefined;

    return function validateArrayContainsFalse(data, dataRoot) {
      return !isArrayTyped(data)
        ? true
        : addError(data);
    };
  }
  return undefined;
}

function compileArrayItems(schemaObj, jsonSchema) {
  const items = getObjectType(jsonSchema.items);
  if (items == null) return undefined;

  return schemaObj.createSingleValidator(
    'items',
    items,
    compileArrayItems);
}

function compileTupleItems(schemaObj, jsonSchema) {
  const items = getArrayTypeMinItems(jsonSchema.items, 1); // TODO: possible bug?
  if (items == null) return undefined;

  const additional = getBoolOrObjectType(jsonSchema.additionalItems, true);

  const member = schemaObj.createMember('items', compileTupleItems);
  const validators = new Array(items.length);
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    if (item === true) validators[i] = trueThat;
    else if (item === false) validators[i] = falseThat;
    else {
      const validator = schemaObj.createPairValidator(member, i, item);
      validators[i] = validator;
    }
  }

  if (additional === true || additional === false) {
    return function validateTupleItemBool(data, dataRoot, i) {
      if (i < validators.length) {
        const validator = validators[i];
        if (validator != null) {
          return validator(data, dataRoot);
        }
        return true; // TODO: if a validator is not present, we return true?
      }
      return additional;
    };
  }

  const validateAdditional = schemaObj.createSingleValidator(
    'additionalItems',
    additional,
    compileTupleItems);

  return function validateTupleItemSchema(data, dataRoot, i) {
    if (i < validators.length) {
      const validator = validators[i];
      if (validator != null) {
        return validator(data, dataRoot);
      }
    }
    return validateAdditional(data, dataRoot);
  };
}

function compileArrayContains(schemaObj, jsonSchema) {
  const contains = getObjectType(jsonSchema.contains);
  if (contains == null) return undefined;

  return schemaObj.createSingleValidator(
    'contains',
    contains,
    compileArrayContains);
}

function compileChildValidators(schemaObj, jsonSchema) {
  const validateItem = compileArrayItems(schemaObj, jsonSchema)
    || compileTupleItems(schemaObj, jsonSchema);
  const validateContains = compileArrayContains(schemaObj, jsonSchema);
  if (validateItem == null
    && validateContains == null)
    return undefined;

  const maxItems = getIntishType(jsonSchema.maxItems, 0);

  return function validateArrayChildren(data, dataRoot) {
    if (isArrayTyped(data)) {
      let valid = true;
      let contains = false;
      let errors = 0;
      const len = maxItems > 0
        ? Math.min(maxItems, data.length)
        : data.length;

      for (let i = 0; i < len; ++i) {
        if (errors > 32) break;
        const obj = data[i];
        if (validateItem) {
          if (validateItem(obj, dataRoot, i) === false) {
            valid = false;
            errors++;
            continue;
          }
        }
        if (validateContains) {
          if (contains === false && validateContains(obj, dataRoot) === true) {
            if (validateItem == null) return true;
            contains = true;
          }
        }
      }
      return valid && (validateContains == null || contains === true);
    }
    return true;
  };
}

function compileArrayChildren(schemaObj, jsonSchema) {
  return [
    compileArrayItemsBoolean(schemaObj, jsonSchema),
    compileArrayContainsBoolean(schemaObj, jsonSchema),
    compileChildValidators(schemaObj, jsonSchema),
  ];
}

function compileAllOf(schemaObj, jsonSchema) {
  const allOf = getArrayType(jsonSchema.allOf);
  if (allOf == null) return undefined;

  const member = schemaObj.createMember('allOf', compileAllOf);
  const validators = [];
  for (let i = 0; i < allOf.length; ++i) {
    const child = allOf[i];
    if (child === true)
      validators.push(trueThat);
    else if (child === false)
      validators.push(falseThat);
    else {
      const validator = schemaObj.createPairValidator(member, i, child);
      if (isFn(validator))
        validators.push(validator);
    }
  }

  if (validators.length === 0) return undefined;

  return function validateAllOf(data, dataRoot) { // TODO: addError??
    if (data !== undefined) {
      for (let i = 0; i < validators.length; ++i) {
        const validator = validators[i];
        if (validator(data, dataRoot) === false) return false;
      }
    }
    return true;
  };
}

function compileAnyOf(schemaObj, jsonSchema) {
  const anyOf = getArrayType(jsonSchema.anyOf);
  if (anyOf == null) return undefined;

  const member = schemaObj.createMember('anyOf', compileAnyOf);
  const validators = [];
  for (let i = 0; i < anyOf.length; ++i) {
    const child = anyOf[i];
    if (child === true)
      validators.push(trueThat);
    else if (child === false)
      validators.push(falseThat);
    else {
      const validator = schemaObj.createPairValidator(member, i, child);
      if (isFn(validator))
        validators.push(validator);
    }
  }

  if (validators.length === 0) return undefined;

  return function validateAnyOf(data, dataRoot) { // TODO: addError??
    if (data !== undefined) {
      for (let i = 0; i < validators.length; ++i) {
        const validator = validators[i];
        if (validator(data, dataRoot) === true) return true;
      }
      return false;
    }
    return true;
  };
}

function compileOneOf(schemaObj, jsonSchema) {
  const oneOf = getArrayType(jsonSchema.oneOf);
  if (oneOf == null) return undefined;

  const member = schemaObj.createMember('oneOf', compileOneOf);
  const validators = [];
  for (let i = 0; i < oneOf.length; ++i) {
    const child = oneOf[i];
    if (child === true)
      validators.push(trueThat);
    else if (child === false)
      validators.push(falseThat);
    else {
      const validator = schemaObj.createPairValidator(member, i, child);
      if (isFn(validator))
        validators.push(validator);
    }
  }

  if (validators.length === 0) return undefined;

  return function validateOneOf(data, dataRoot) { // TODO: addError??
    let found = false;
    for (let i = 0; i < validators.length; ++i) {
      const validator = validators[i];
      if (validator(data, dataRoot) === true) {
        if (found === true) return false;
        found = true;
      } // TODO: else how to silent this error?
    }
    return found;
  };
}

function compileNotOf(schemaObj, jsonSchema) {
  const notOf = getBoolOrObjectType(jsonSchema.not);
  if (notOf == null) return undefined;
  if (notOf === true) return falseThat;
  if (notOf === false) return trueThat;

  const validate = schemaObj.createSingleValidator('not', notOf, compileNotOf);
  if (!validate) return undefined;

  return function validateNotOf(data, dataRoot) { // TODO: addError??
    if (data === undefined) return true;
    return validate(data, dataRoot) === false; // TODO: howto silent this error???
    // NOTE: we can push the context on schemaObj = schemaObj.pushSchemaContext()?
  };
}

function compileCombineSchema(schemaObj, jsonSchema) {
  const compilers = [];
  function addCompiler(compiler) {
    if (isFn(compiler))
      compilers.push(compiler);
  }

  addCompiler(compileAllOf(schemaObj, jsonSchema));
  addCompiler(compileAnyOf(schemaObj, jsonSchema));
  addCompiler(compileOneOf(schemaObj, jsonSchema));
  addCompiler(compileNotOf(schemaObj, jsonSchema));

  if (compilers.length === 0) return undefined;
  if (compilers.length === 1) return compilers[0];
  if (compilers.length === 2) {
    const first = compilers[0];
    const second = compilers[1];
    return function validateCombinaSchemaPair(data, dataRoot) {
      return first(data, dataRoot) && second(data, dataRoot);
    };
  }
  else {
    return function validateCombineSchema(data, dataRoot) {
      for (let i = 0; i < compilers.length; ++i) {
        const compiler = compilers[i];
        if (compiler(data, dataRoot) === false) return false;
      }
      return true;
    };
  }
}

function compileConditionSchema(schemaObj, jsonSchema) {
  const jsif = getObjectType(jsonSchema.if);
  const jsthen = getObjectType(jsonSchema.then);
  const jselse = getObjectType(jsonSchema.else);
  if (jsif == null) return undefined;
  if (jsthen == null && jselse == null) return undefined;

  const validateIf = schemaObj.createSingleValidator('if', jsif, compileConditionSchema);
  const tmpThen = schemaObj.createSingleValidator('then', jsthen, compileConditionSchema);
  const tmpElse = schemaObj.createSingleValidator('else', jselse, compileConditionSchema);
  if (validateIf == null) return undefined;
  if (tmpThen == null && tmpElse == null) return undefined;

  const validateThen = fallbackFn(tmpThen);
  const validateElse = fallbackFn(tmpElse);
  return function validateCondition(data, dataRoot) {
    if (validateIf(data))
      return validateThen(data, dataRoot);
    else
      return validateElse(data, dataRoot);
  };
}

/* eslint-disable function-paren-newline */

function compileTypeSimple(schemaObj, jsonSchema) {
  const type = getStringType(jsonSchema.type);
  if (type == null) return undefined;

  const isDataType = createIsDataTypeHandler(type);
  if (!isDataType) return undefined;

  const addError = schemaObj.createSingleErrorHandler('type', type, compileTypeSimple);
  if (!addError) return undefined;

  return function validateTypeSimple(data) {
    return isDataType(data)
      ? true
      : addError(data);
  };
}

function compileTypeArray(schemaObj, jsonSchema) {
  const schemaType = getArrayTypeOfSet(jsonSchema.type);
  if (schemaType == null) return undefined;

  // collect all testable data types
  const types = [];
  const names = [];
  for (let i = 0; i < schemaType.length; ++i) {
    const type = schemaType[i];
    const callback = createIsDataTypeHandler(type);
    if (callback) {
      types.push(callback);
      names.push(type);
    }
  }

  // if non has been found exit
  if (types.length === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler('type', names, compileTypeArray);
  if (!addError) return undefined;

  // if one has been found create a validator
  if (types.length === 1) {
    const one = types[0];
    return function validateOneType(data) {
      return one(data)
        ? true
        : addError(data);
    };
  }
  else if (types.length === 2) {
    const one = types[0];
    const two = types[1];
    return function validateTwoTypes(data) {
      return one(data) || two(data)
        ? true
        : addError(data);
    };
  }
  else if (types.length === 3) {
    const one = types[0];
    const two = types[1];
    const three = types[2];
    return function validateThreeTypes(data) {
      return one(data) || two(data) || three(data)
        ? true
        : addError(data);
    };
  }
  else {
    return function validateAllTypes(data) {
      for (let i = 0; i < types.length; ++i) {
        if (types[i](data) === true) return true;
      }
      return addError(data);
    };
  }
}

function compileTypeBasic(schemaObj, jsonSchema) {
  const fnType = compileTypeSimple(schemaObj, jsonSchema)
    || compileTypeArray(schemaObj, jsonSchema);

  const required = getBoolOrArrayTyped(jsonSchema.required, false);
  const nullable = getBoolishType(jsonSchema.nullable);

  const addRequiredError = required !== false
    ? schemaObj.createSingleErrorHandler(
      'required',
      true,
      compileTypeBasic)
    : undefined;

  const addNullableError = nullable != null
    ? schemaObj.createSingleErrorHandler(
      'nullable',
      nullable,
      compileTypeBasic)
    : undefined;

  if (addRequiredError == null) {
    if (fnType) {
      if (addNullableError != null) {
        return function validateTypeNullable(data) {
          return data === undefined
            ? true
            : data === null
              ? nullable
                ? true
                : addNullableError(data)
              : fnType(data);
        };
      }

      return function validateTypeBasic(data) {
        return data === undefined
          ? true
          : fnType(data);
      };
    }

    if (addNullableError != null) {
      return function validateNotNullable(data) {
        return data === null
          ? nullable
            ? true
            : addNullableError(data)
          : true;
      };
    }

    return undefined;
  }

  if (fnType) {
    if (addNullableError != null) {
      return function validateRequiredTypeNullable(data) {
        return data === undefined
          ? addRequiredError(data)
          : data === null
            ? nullable
              ? true
              : addNullableError(data)
            : fnType(data);
      };
    }

    return function validateRequiredType(data) {
      return data === undefined
        ? addRequiredError(data)
        : fnType(data);
    };
  }

  if (addNullableError != null) {
    return function validateRequiredNonNullableData(data) {
      return data === undefined
        ? addRequiredError(data)
        : data === null
          ? nullable
            ? true
            : addNullableError(data)
          : true;
    };
  }

  return function validateRequiredNullableData(data) {
    return data === undefined
      ? addRequiredError(data)
      : true;
  };
}

function compileSchemaObject(schemaObj, jsonSchema) {
  if (jsonSchema === true) return trueThat;
  if (jsonSchema === false) return falseThat;
  if (!isObjectTyped(jsonSchema)) return falseThat;
  if (Object.keys(jsonSchema).length === 0) return trueThat;

  const fnType = compileTypeBasic(schemaObj, jsonSchema);

  const validators = [];
  addFunctionToArray(validators, compileFormatBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileEnumBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileNumberBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileStringBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileObjectBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileArrayBasic(schemaObj, jsonSchema));

  addFunctionToArray(validators, compileObjectChildren(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileArrayChildren(schemaObj, jsonSchema));

  addFunctionToArray(validators, compileCombineSchema(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileConditionSchema(schemaObj, jsonSchema));

  if (validators.length === 0) return fnType
    || trueThat; // same as empty schema

  if (validators.length === 1) {
    const first = validators[0];
    if (fnType != null) return function validateSingleSchemaObjectType(data, dataRoot) {
      return fnType(data, dataRoot) === true
        ? first(data, dataRoot)
        : false;
    };
    return first;
  }

  if (validators.length === 2) {
    const first = validators[0];
    const second = validators[1];
    if (fnType != null) return function validatePairSchemaObjectType(data, dataRoot) {
      return fnType(data, dataRoot) === true
        ? first(data, dataRoot) && second(data, dataRoot)
        : false;
    };

    return function validatePairSchemaObject(data, dataRoot) {
      return first(data, dataRoot) && second(data, dataRoot);
    };
  }

  if (validators.length === 3) {
    const first = validators[0];
    const second = validators[1];
    const thirth = validators[2];
    if (fnType != null) return function validateTernarySchemaObjectType(data, dataRoot) {
      return fnType(data, dataRoot) === true
        ? first(data, dataRoot)
          && second(data, dataRoot)
          && thirth(data, dataRoot)
        : false;
    };

    return function validateTernarySchemaObject(data, dataRoot) {
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot);
    };
  }

  if (validators.length === 4) {
    const first = validators[0];
    const second = validators[1];
    const thirth = validators[2];
    const fourth = validators[3];
    if (fnType != null) return function validateQuaternarySchemaObjectType(data, dataRoot) {
      return fnType(data, dataRoot) === true
        ? first(data, dataRoot)
          && second(data, dataRoot)
          && thirth(data, dataRoot)
          && fourth(data, dataRoot)
        : false;
    };

    return function validateQuaternarySchemaObject(data, dataRoot) {
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot)
        && fourth(data, dataRoot);
    };
  }

  if (fnType != null) return function validateAllSchemaObjectType(data, dataRoot) {
    if (fnType(data, dataRoot) === false) return false;
    for (let i = 0; i < validators.length; ++i) {
      if (validators[i](data, dataRoot) === false) return false;
    }
    return true;
  };

  return function validateAllSchemaObject(data, dataRoot) {
    for (let i = 0; i < validators.length; ++i) {
      if (validators[i](data, dataRoot) === false) return false;
    }
    return true;
  };
}

const JSONPointer_pathSeparator = '/';

function JSONPointer_concatPath(parent, key, ...extra) {
  if (extra.length > 0) {
    const all = [parent, key, ...extra];
    return all.join(JSONPointer_pathSeparator);
  }
  return parent + JSONPointer_pathSeparator + key;
}

// /* eslint-disable eqeqeq */
// import { String_trimLeft } from './types-String';


// export const JSONPointer_pathSeparator = '/';
// export const JSONPointer_fragmentSeparator = '#';

// export function JSONPointer_addFolder(pointer, folder) {
//   const isvalid = typeof pointer === 'string'
//     && (typeof folder === 'number'
//       || typeof folder === 'string');

//   if (isvalid) {
//     folder = String(folder);
//     if (folder.charAt(0) === '/') {
//       folder = folder.substring(1);
//     }
//     return pointer + JSONPointer_pathSeparator + folder;
//   }
// }

// export function JSONPointer_addRelativePointer(pointer, relative) {
//   const isvalid = typeof pointer === 'string'
//     && (typeof relative === 'number'
//       || typeof relative === 'string');

//   if (isvalid) {
//     if (pointer.charAt(0) === '/') {
//       if (typeof relative === 'string') {
//         const idx = String_indexOfEndInteger(0, relative);
//         if (idx > 0) {
//           const tokens = pointer.split('/');
//           tokens.shift();

//           const depth = tokens.length - Number(relative.substring(0, idx));
//           if (depth > 0) {
//             const parent = '/' + tokens.splice(0, depth).join('/');
//             const rest = relative.substring(idx);
//             return parent + JSONPointer_pathSeparator + rest;
//           }
//         }
//         else if (relative.charAt(0) === '/') {
//           return pointer + relative;
//         }
//         else {
//           return pointer + JSONPointer_pathSeparator + relative;
//         }
//       }
//       else { // typeof relative === 'number'
//         return pointer + JSONPointer_pathSeparator + String(relative);
//       }
//     }
//   }
//   return undefined;
// }

// export function JSONPointer_traverseFilterObjectBF(obj, id = '$ref', callback) {
//   const qarr = [];

//   // traverse tree breath first
//   let current = obj;
//   while (typeof current === 'object') {
//     if (current.constructor === Array) {
//       for (let i = 0; i < current.length; ++i) {
//         const child = current[i];
//         if (typeof child === 'object') {
//           qarr.push(child);
//         }
//       }
//     }
//     else {
//       const keys = Object.keys(current);
//       for (let i = 0; i < keys.length; ++i) {
//         const key = keys[i];
//         if (key == id) {
//           callback(current);
//           continue;
//         }
//         const child = obj[key];
//         if (typeof child === 'object') {
//           qarr.push(child);
//         }
//       }
//     }
//     current = qarr.shift();
//   }
// }

// function JSONPointer_createGetFunction(dst, id, next) {
//   id = Number(id) || decodeURIComponent(id) || '';
//   if (next) {
//     const f = JSONPointer_compileGetPointer(next);
//     if (f) {
//       if (dst === 0 || dst === 1) { // BUG: dst === 0?
//         return function JSONPointer_resursiveGetFunction(obj) {
//           return typeof obj === 'object'
//             ? f(obj[id])
//             : f(obj);
//         };
//       }
//       else if (dst > 1) { // WARNING
//         // TODO: probably doesnt work!
//         return function JSONPointer_traverseGetFunction(obj) {
//           const qarr = [];
//           JSONPointer_traverseFilterObjectBF(obj, id,
//             function JSONPointer_traverseGetFunctionCallback(o) {
//               qarr.push(f(o[id]));
//             });
//           return qarr;
//         };
//       }
//     }
//   }

//   if (dst > 1) return function JSONPointer_defaultTraverseGetFunction(obj) {
//     const qarr = [];
//     JSONPointer_traverseFilterObjectBF(obj, id,
//       function JSONPointer_defaultTraverseGetFunctionCallback(o) {
//         qarr.push(o[id]);
//       });
//     return qarr;
//   };
//   else return function JSONPointer_defaultGetFunction(obj) {
//     return (typeof obj === 'object') ? obj[id] : obj;
//   };
// }

// export function JSONPointer_compileGetPointer(path) {
//   path = typeof path === 'string' ? path : '';
//   if (path === '') return function JSONPointer_compileGetRootFunction(obj) {
//     return obj;
//   };

//   const token = String_trimLeft(path, JSONPointer_pathSeparator);
//   const dist = path.length - token.length;
//   const arr = [];
//   let csr = 0;

//   for (let i = 0; i < token.length; ++i) {
//     const c = token[i];
//     if (c === '/' && csr === 0) {
//       const j = arr.length > 0 ? arr[0][0] : i;
//       const ct = token.substring(0, j);
//       const nt = token.substring(i);
//       return JSONPointer_createGetFunction(dist, ct, nt);
//     }
//     else if (c === '[') { // TODO: handle index and conditionals
//       arr[csr] = [i, -1];
//       csr++;
//     }
//     else if (c === ']') {
//       csr--; // TODO: add check < 0
//       arr[csr][1] = i;
//     }
//   }

//   const j = arr.length > 0 ? arr[0][0] : token.length;
//   const ct = token.substring(0, j);
//   return JSONPointer_createGetFunction(dist, ct, null);
// }

// export function String_indexOfEndInteger(start = 0, search) {
//   if (typeof start === 'string') {
//     search = start;
//     start = 0;
//   }

//   if (typeof search === 'string') {
//     let i = start;
//     for (; i < search.length; ++i) {
//       if ((Number(search[i]) || false) === false) {
//         if ((i - start) > 0) {
//           return i;
//         }
//         else {
//           return -1;
//         }
//       }
//     }
//     if (i > 0) return i;
//   }
//   return -1;
// }

// export function JSONPointer_resolveRelative(pointer, relative) {
//   const idx = String_indexOfEndInteger(0, relative);
//   if (idx >= 0) {
//     const depth = relative.substring(0, idx);
//     const rest = relative.substring(idx);
//     const parent = JSONPointer_resolveRelative(pointer, Number(depth));
//     return JSONPointer_addFolder(parent, rest);
//   }
//   return pointer;
// }

// export class JSONPointer {
//   constructor(baseUri, basePointer, relative) {
//     if (!basePointer) {
//       basePointer = baseUri;
//       baseUri = null;
//     }
//     if (baseUri && !relative) {
//       if (Number(basePointer[0]) || false) {
//         relative = basePointer;
//         basePointer = baseUri;
//         baseUri = null;
//       }
//     }

//     basePointer = typeof pointer !== 'string'
//       ? ''
//       : basePointer;

//     // trim whitespace left.
//     basePointer = basePointer.replace(/^\s+/, '');

//     // check if there is a baseUri and fragment in the pointer
//     const baseIdx = basePointer.indexOf(JSONPointer_fragmentSeparator);
//     // rewrite baseUri and json pointer if so
//     if (baseIdx > 0) baseUri = basePointer.substring(0, baseIdx);
//     if (baseIdx >= 0) basePointer = basePointer.substring(baseIdx + 1);

//     if (!relative) {

//     }
//     // setup basic flags
//     this.isFragment = baseIdx >= 0;
//     this.isAbsolute = basePointer[0] === JSONPointer_pathSeparator;

//     // setup pointer
//     this.baseUri = baseUri;
//     this.basePointer = basePointer;

//     this.pointer = pointer;
//     this.relative = relative;
//     this.absolute = absolute;
//     this.get = JSONPointer_compileGetPointer(basePointer);
//   }

//   toString() {
//     return (this.baseUri || '')
//       + (this.isFragment ? JSONPointer_fragmentSeparator : '')
//       + this.pointer;
//   }
// }

class SchemaError {
  constructor(timeStamp, member, key, value, rest) {
    this.timeStamp = timeStamp;
    this.member = member;
    this.key = key;
    this.value = value;
    this.rest = rest;
  }
}

class SchemaRoot {
  constructor(baseUri, json) {
    this.baseUri = baseUri;
    this.json = json;
    this.firstSchema = new SchemaObject(this, '', '');
    this.errors = [];
  }

  addErrorSingle(member, value, rest) {
    this.errors.push(new SchemaError(
      performance.now(),
      member,
      null,
      value,
      rest,
    ));
    return false;
  }

  addErrorPair(member, key, value, rest) {
    this.errors.push(new SchemaError(
      performance.now(),
      member,
      key,
      value,
      rest,
    ));
    return false;
  }

  validate(data) {
    // clear all errors
    while (this.errors.pop());
    // call compiled validator
    return this.firstSchema.validate(data, data);
  }
}

class SchemaObject {
  constructor(schemaRoot, schemaPath, meta) {
    this.schemaRoot = schemaRoot;
    this.schemaPath = schemaPath;
    this.metaData = meta;
    this.validateFn = falseThat;
    this.members = [];
  }

  get errors() {
    return this.schemaRoot.errors;
  }

  get addErrorSingle() {
    return this.schemaRoot.addErrorSingle;
  }

  get addErrorPair() {
    return this.schemaRoot.addErrorPair;
  }

  get validate() {
    return this.validateFn;
  }

  createMember(key, ...rest) {
    const member = new SchemaMember(
      this,
      key,
      null,
      rest,
    );
    return member;
  }

  createSingleErrorHandler(key, expected, ...rest) {
    const self = this;
    const member = new SchemaMember(
      self,
      key,
      expected,
      rest,
    );

    if (isStringType(key)) {
      self.members.push(key);
      return function addErrorSingle(data, ...meta) {
        return self.addErrorSingle(member, data, meta);
      };
    }
    else if (isArrayType(key)) {
      self.members.push(...key);
      return function addErrorPair(dataKey, data, ...meta) {
        return self.addErrorPair(member, dataKey, data, meta);
      };
    }

    return undefined;
  }

  createPairErrorHandler(member, key, expected, ...rest) {
    const self = this;
    const submember = new SchemaMember(
      self,
      JSONPointer_concatPath(member.memberKey, key),
      expected,
      rest,
    );

    if (!isStringType(key)) return undefined;

    self.members.push(submember.memberKey);
    return function addErrorPair(dataKey, data, ...meta) {
      return self.addErrorPair(submember, dataKey, data, meta);
    };
  }

  createSingleValidator(key, child, ...rest) {
    const self = this;
    if (!isStringType(key)) return undefined;
    if (!isBoolOrObjectType(child)) return undefined;

    const childObj = new SchemaObject(
      self.schemaRoot,
      JSONPointer_concatPath(self.schemaPath, key),
      rest,
    );
    const validator = compileSchemaObject(childObj, child);
    childObj.validateFn = validator;
    return validator;
  }

  createPairValidator(member, key, child, ...rest) {
    const self = this;
    const valid = member instanceof SchemaMember
      && (isStringType(key)
        || isIntegerType(key))
      && isBoolOrObjectType(child);
    if (!valid) return undefined;

    const childObj = new SchemaObject(
      self.schemaRoot,
      JSONPointer_concatPath(self.schemaPath, member.schemaKey, key),
      rest,
    );
    const validator = compileSchemaObject(childObj, child);
    childObj.validateFn = validator;
    return validator;
  }
}

class SchemaMember {
  constructor(schemaObject, memberKey, expectedValue, options) {
    this.schemaObject = schemaObject;
    this.memberKey = memberKey;
    this.expectedValue = expectedValue;
    this.options = options;
  }
}

const registeredDocuments = {};

function compileJSONSchema(baseUri, json) {
  baseUri = getStringType(baseUri, '');
  // TODO: test if valid baseUri
  if (registeredDocuments.hasOwnProperty(baseUri)) {
    return false;
  }

  // create a new schema root
  const root = new SchemaRoot(baseUri, json);

  // compile the first schema object
  const first = root.firstSchema;
  first.validateFn = compileSchemaObject(first, json);

  registeredDocuments[baseUri] = root;

  return true;
}

function getJSONSchema(baseUri) {
  baseUri = getStringType(baseUri, '');
  if (registeredDocuments.hasOwnProperty(baseUri)) {
    return registeredDocuments[baseUri];
  }
  return undefined;
}

export { VN, VNode, addCssClass, addFunctionToArray, app, circle2f64, circle2f64_POINTS, cloneDeep, cloneObject, collapseCssClass, collapseShallowArray, collapseToString, compileJSONSchema, copyAttributes, createIsDataTypeHandler, createIsObjectOfTypeHandler, createStorageCache, def_vec2f64, def_vec2i32, def_vec3f64, equalsDeep, base$1 as f64, fallbackFn, falseThat, fetchImage, float64_clamp, float64_clampu, float64_cosHp, float64_cosLp, float64_cosMp, float64_cross, float64_dot, float64_fib, float64_fib2, float64_gcd, float64_hypot, float64_hypot2, float64_inRange, float64_intersectsRange, float64_intersectsRect, float64_isqrt, float64_lerp, float64_map, float64_norm, float64_phi, float64_sinLp, float64_sinLpEx, float64_sinMp, float64_sinMpEx, float64_sqrt, float64_theta, float64_toDegrees, float64_toRadian, float64_wrapRadians, math$1 as fm64, forEachItem, forOfObject, getArrayOrSetType, getArrayOrSetTypeLength, getArrayOrSetTypeMinItems, getArrayOrSetTypeUnique, getArrayType, getArrayTypeMinItems, getArrayTypeOfSet, getArrayTyped, getArrayTypedMinItems, getBigIntType, getBigIntishType, getBoolOrArrayTyped, getBoolOrNumbishType, getBoolOrObjectType, getBooleanType, getBoolishType, getDateType, getDateishType, getFastIntersectArray, getIntegerType, getIntersectArray, getIntishType, getJSONSchema, getMapType, getMapTypeOfArray, getNumberExclusiveBound, getNumberType, getNumbishType, getObjectAllKeys, getObjectAllValues, getObjectCountItems, getObjectFirstItem, getObjectFirstKey, getObjectItem, getObjectOrMapType, getObjectOrMapTyped, getObjectType, getObjectTyped, getScalarNormalised, getSetType, getSetTypeOfArray, getStringOrArrayTyped, getStringOrArrayTypedUnique, getStringOrObjectType, getStringType, getTypeExclusiveBound, getUniqueArray, getVNodeAttr, getVNodeKey, getVNodeName, h, hasCssClass, base as i32, int32_clamp, int32_clampu, int32_clampu_u8a, int32_clampu_u8b, int32_cross, int32_dot, int32_fib, int32_hypot, int32_hypotEx, int32_inRange, int32_intersectsRange, int32_intersectsRect, int32_lerp, int32_mag2, int32_map, int32_norm, int32_random, int32_sinLp, int32_sinLpEx, int32_sqrt, int32_sqrtEx, int32_toDegreesEx, int32_toRadianEx, int32_wrapRadians, isArrayOrSetType, isArrayOrSetTyped, isArrayType, isArrayTyped, isBigIntType, isBoolOrArrayTyped, isBoolOrNumbishType, isBoolOrObjectType, isBooleanType, isBoolishType, isComplexType, isDateType, isDateishType, isEveryItem, isFn, isFnEx, isIntegerType, isIntishType, isMapType, isNullValue, isNumberType$1 as isNumberType, isNumbishType, isObjectEmpty, isObjectOfType, isObjectOrMapType, isObjectOrMapTyped, isObjectType, isObjectTyped, isRegExpType, isScalarType, isScalarTypeEx, isSetType, isStringOrArrayTyped, isStringOrDateType, isStringOrObjectType, isStringType, isTypedArray, isUniqueArray, mathf64_EPSILON, mathf64_PI, mathf64_PI1H, mathf64_PI2, mathf64_PI41, mathf64_PI42, mathf64_SQRTFIVE, mathf64_abs, mathf64_asin, mathf64_atan2, mathf64_ceil, mathf64_cos, mathf64_floor, mathf64_max, mathf64_min, mathf64_pow, mathf64_random, mathf64_round, mathf64_sin, mathf64_sqrt, mathi32_MULTIPLIER, mathi32_PI, mathi32_PI1H, mathi32_PI2, mathi32_PI41, mathi32_PI42, mathi32_abs, mathi32_asin, mathi32_atan2, mathi32_ceil, mathi32_floor, mathi32_max, mathi32_min, mathi32_round, mathi32_sqrt, mergeObjects, mergeUniqueArray, math as mi32, myRegisterPaint, path2f64, point2f64, point2f64_POINTS, rectangle2f64, rectangle2f64_POINTS, registerDefaultFormatCompilers, registerFormatCompiler, removeCssClass, shape as s2f64, segm2f64, segm2f64_M, segm2f64_Z, segm2f64_c, segm2f64_h, segm2f64_l, segm2f64_q, segm2f64_s, segm2f64_t, segm2f64_v, setObjectItem, shape2f64, toggleCssClass, trapezoid2f64, trapezoid2f64_POINTS, triangle2f64, triangle2f64_POINTS, triangle2f64_intersectsRect, triangle2f64_intersectsTriangle, triangle2i64_intersectsRect, trueThat, undefThat, vec2$1 as v2f64, vec2 as v2i32, vec3 as v3f64, vec2f64, vec2f64_about, vec2f64_add, vec2f64_addms, vec2f64_adds, vec2f64_ceil, vec2f64_cross, vec2f64_cross3, vec2f64_dist, vec2f64_dist2, vec2f64_div, vec2f64_divs, vec2f64_dot, vec2f64_eq, vec2f64_eqs, vec2f64_eqstrict, vec2f64_floor, vec2f64_iabout, vec2f64_iadd, vec2f64_iaddms, vec2f64_iadds, vec2f64_iceil, vec2f64_idiv, vec2f64_idivs, vec2f64_ifloor, vec2f64_iinv, vec2f64_imax, vec2f64_imin, vec2f64_imul, vec2f64_imuls, vec2f64_ineg, vec2f64_inv, vec2f64_iperp, vec2f64_irot90, vec2f64_irotate, vec2f64_irotn90, vec2f64_iround, vec2f64_isub, vec2f64_isubs, vec2f64_iunit, vec2f64_lerp, vec2f64_mag, vec2f64_mag2, vec2f64_max, vec2f64_min, vec2f64_mul, vec2f64_muls, vec2f64_neg, vec2f64_new, vec2f64_phi, vec2f64_rot90, vec2f64_rotate, vec2f64_rotn90, vec2f64_round, vec2f64_sub, vec2f64_subs, vec2f64_theta, vec2f64_unit, vec2i32, vec2i32_add, vec2i32_adds, vec2i32_angleEx, vec2i32_cross, vec2i32_cross3, vec2i32_div, vec2i32_divs, vec2i32_dot, vec2i32_iadd, vec2i32_iadds, vec2i32_idiv, vec2i32_idivs, vec2i32_imul, vec2i32_imuls, vec2i32_ineg, vec2i32_inorm, vec2i32_iperp, vec2i32_irot90, vec2i32_irotn90, vec2i32_isub, vec2i32_isubs, vec2i32_mag, vec2i32_mag2, vec2i32_mul, vec2i32_muls, vec2i32_neg, vec2i32_new, vec2i32_norm, vec2i32_perp, vec2i32_phiEx, vec2i32_rot90, vec2i32_rotn90, vec2i32_sub, vec2i32_subs, vec2i32_thetaEx, vec3f64, vec3f64_add, vec3f64_adds, vec3f64_crossABAB, vec3f64_div, vec3f64_divs, vec3f64_dot, vec3f64_iadd, vec3f64_iadds, vec3f64_idiv, vec3f64_idivs, vec3f64_imul, vec3f64_imuls, vec3f64_isub, vec3f64_isubs, vec3f64_iunit, vec3f64_mag, vec3f64_mag2, vec3f64_mul, vec3f64_muls, vec3f64_new, vec3f64_sub, vec3f64_subs, vec3f64_unit, workletState, wrapVN };
//# sourceMappingURL=index.js.map
