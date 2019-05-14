const PRIMITIVES = ['boolean', 'integer', 'number', 'string'];

function isPureObject(obj) {
  return (obj !== undefined
    && obj !== null
    && obj.constructor !== Array
    && typeof obj === 'object');
}

function sanitizePrimitiveValue(value, nullable) {
  if (nullable) {
    if (!value) return null;
    if (!PRIMITIVES.includes(typeof value)) return null;
    return value;
  }
  else {
    if (!value) return undefined;
    if (!PRIMITIVES.includes(typeof value)) return undefined;
    return value;
  }
}

function checkIfValueDisabled(value, nullable, disabled) {
  if (disabled) return true;
  if (typeof value === 'undefined') return true;

  if (nullable && value === null) return false;
  return !PRIMITIVES.includes(typeof value);
}

function getFirstObjectItem(items) {
  for (const item in items) {
    if (!items.hasOwnProperty(item)) continue;
    return item;
  }
  return undefined;
}

function recursiveDeepCopy(o) {
  if (typeof o !== 'object') {
    return o;
  }
  if (!o) {
    return o;
  }

  if (o instanceof Array) {
    const newO = [];
    for (let i = 0; i < o.length; i += 1) {
      newO[i] = recursiveDeepCopy(o[i]);
    }
    return newO;
  }
  else {
    const newO = {};
    const keys = Reflect.ownKeys(o);
    for (const i in keys) {
      newO[i] = recursiveDeepCopy(o[i]);
    }
    return newO;
  }
}

function mergeObjects(target) {
  const ln = arguments.length;
  const mergeFn = mergeObjects;

  let i = 1;
  for (; i < ln; i++) {
    const object = arguments[i];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        if (value && value.constructor === Object) {
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
  function reference_equals(a, b) {
    const object_references = [];

    function _reference_equals(a, b) {
      let l = object_references.length;

      while (l--) {
        if (object_references[l--] === b) {
          return object_references[l] === a;
        }
      }
      object_references.push(a, b);
      return null;
    }

    return _reference_equals(a, b);
  }


  function _equals(a, b) {
    // They should have the same toString() signature
    const s = toString.call(a);
    if (s !== toString.call(b)) return false;

    switch (s) {
      default: // Boolean, Date, String
        return a.valueOf() === b.valueOf();

      case '[object Number]':
        // Converts Number instances into primitive values
        // This is required also for NaN test bellow
        a = +a;
        b = +b;

        // return a ?         // a is Non-zero and Non-NaN
        //     a === b
        //   :                // a is 0, -0 or NaN
        //     a === a ?      // a is 0 or -0
        //     1/a === 1/b    // 1/0 !== 1/-0 because Infinity !== -Infinity
        //   : b !== b;        // NaN, the only Number not equal to itself!
        // ;

        return a
          ? a === b
          // eslint-disable-next-line no-self-compare
          : a === a
            ? 1 / a === 1 / b
            // eslint-disable-next-line no-self-compare
            : b !== b;

      case '[object RegExp]':
        return a.source === b.source
          && a.global === b.global
          && a.ignoreCase === b.ignoreCase
          && a.multiline === b.multiline
          && a.lastIndex === b.lastIndex;

      case '[object Function]':
        return false; // functions should be strictly equal because of closure context

      case '[object Array]': {
        const r = reference_equals(a, b);
        if ((cyclic && r) !== null) return r; // intentionally duplicated bellow for [object Object]

        let l = a.length;
        if (l !== b.length) return false;
        // Both have as many elements

        while (l--) {
          const x = a[l];
          const y = b[l];
          if (x === y && x !== 0 || _equals(x, y)) continue;

          return false;
        }

        return true;
      }

      case '[object Object]': {
        const r = reference_equals(a, b);
        if ((cyclic && r) !== null) return r; // intentionally duplicated from above for [object Array]

        if (enforce_properties_order) {
          const properties = [];

          for (const p in a) {
            if (a.hasOwnProperty(p)) {
              properties.push(p);
              const x = a[p];
              const y = b[p];
              if (x === y && x !== 0 || _equals(x, y)) continue;
              return false;
            }
          }

          // Check if 'b' has as the same properties as 'a' in the same order
          let l = 0; // counter of own properties
          for (const p in b) {
            if (b.hasOwnProperty(p) && properties[l] !== p) return false;
            l++;
          }
        }
        else {
          let l = 0;
          for (const p in a) {
            if (a.hasOwnProperty(p)) {
              ++l;
              const x = a[p];
              const y = b[p];
              if (x === y && x !== 0 || _equals(x, y)) continue;

              return false;
            }
          }
          // Check if 'b' has as not more own properties than 'a'
          for (const p in b) {
            if (b.hasOwnProperty(p) && --l < 0) return false;
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

const mathi_sqrt = Math.sqrt;
const mathi_round = Math.round;
const mathi_floor = Math.floor;
const mathi_min = Math.min;
const mathi_max = Math.max;

const int_MULTIPLIER = 10000;

const int_PI = (Math.PI * int_MULTIPLIER)|0;
const int_PI2 = (int_PI * 2)|0;
const int_PI_A = ((4 / Math.PI) * int_MULTIPLIER)|0;
const int_PI_B = ((4 / (Math.PI * Math.PI)) * int_MULTIPLIER)|0;

let random_seed = performance.now();
function int_random() {
  const x = Math.sin(random_seed++) * int_MULTIPLIER;
  return x - Math.floor(x);
}

function int_sqrtEx(n = 0) {
  n = n|0;
  return (int_MULTIPLIER * mathi_sqrt(n))|0;
}

function int_sqrt(n = 0) {
  n = n|0;
  return mathi_sqrt(n)|0;
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
  // return int_lerp(int_norm(value, smin, smax), dmin, dmax) | 0;
  return mathi_round((value - smin) * (dmax - dmin) / (smax - smin) + dmin)|0;
}

function int_clamp(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return mathi_min(mathi_max(value, mathi_min(min, max)), mathi_max(min, max))|0;
}
function int_clampu(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  // return mathi_min(mathi_max(value, min), max)|0;
  return mathi_max(min, mathi_min(value, max))|0;
}
function int_clampu_u8a(value = 0) {
  value = value | 0;
  return -((255 - value & (value - 255) >> 31) - 255 & (255 - value & (value - 255) >> 31) - 255 >> 31);
}
function int_clampu_u8b(value = 0) {
  value = value | 0;
  value &= -(value >= 0);
  return value | ~-!(value & -256);
}

function int_inRange(value = 0, min = 0, max = 0) {
  value = value|0; min = min|0; max = max|0;
  return ((value >= mathi_min(min, max)) &&
          (value <= mathi_max(min, max)))|0;
}

function int_intersectsRange(smin = 0, smax = 0, dmin = 0, dmax = 0) {
  smin = smin|0; smax = smax|0; dmin = dmin|0; dmax = dmax|0;
  return ((mathi_max(smin, smax) >= mathi_min(dmin, dmax)) &&
          (mathi_min(smin, smax) <= mathi_max(dmin, dmax)))|0;
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

const mathf_abs = Math.abs;

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

const mathf_random = Math.max;

const mathf_EPSILON = 0.000001;
const mathf_PI = Math.PI;

function float_gcd(a=0.0, b=0.0) {
  a = +a; b = +b;
  // For example, a 1024x768 monitor has a GCD of 256. When you divide both values by that you get 4x3 or 4:3.
  return +((b === 0.0) ? +a : +float_gcd(b, a % b));
}

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
const mathf_SQRTFIVE = +mathf_sqrt(5);
function float_fib2(value = 0.0) {
  value = +value;
  const fh = +(1.0 / +mathf_SQRTFIVE * +mathf_pow(+(+(1.0 + mathf_SQRTFIVE ) / 2.0), +value));
  const sh = +(1.0 / +mathf_SQRTFIVE * +mathf_pow(+(+(1.0 - mathf_SQRTFIVE ) / 2.0), +value));
  return +mathf_round$1(+(fh - sh));
}

function float_norm(value = 0.0, min = 0.0, max = 0.0) {
  value = +value; min = +min; max = +max;
  return +((value - min) / (max - min));
}

function float_lerp(norm = 0.0, min = 0.0, max = 0.0) {
  norm = +norm; min = +min; max = +max;
  return +((max - min) * (norm + min));
}

function float_map(value = 0.0, smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  value = +value; smin = +smin; smax = +smax; dmin = +dmin; dmax = +dmax;
  return +float_lerp(+float_norm(value, smin, smax), dmin, dmax);
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

const def_vec2f = Object.freeze(vec2f_new());

class vec2f {
  constructor(x = 0.0, y = 0.0) {
    this.x = +x;
    this.y = +y;
  }
  gX() { return +this.x; };
  gY() { return +this.y; };
}

//#region class pure primitive vector operators

vec2f.prototype.neg = function _vec2f__neg() {
  return new vec2f(+(-(+this.x)), +(-(+this.y)));
};

vec2f.prototype.add = function _vec2f__add(vector = def_vec2f) {
  return new vec2f(+(+this.x + +vector.x), +(+this.y + +vector.y));
};
vec2f.prototype.adds = function _vec2f__adds(scalar = 0.0) {
  return new vec2f(+(+this.x + +scalar), +(+this.y + +scalar));
};

vec2f.prototype.sub = function _vec2f__sub(vector = def_vec2f) {
  return new vec2f(+(+this.x - +vector.x), +(+this.y - +vector.y));
};
vec2f.prototype.subs = function _vec2f__subs(scalar = 0.0) {
  return new vec2f(+(+this.x - +scalar), +(+this.y - +scalar));
};

vec2f.prototype.mul = function _vec2f__mul(vector = def_vec2f) {
  return new vec2f(+(+this.x * +vector.x), +(+this.y * +vector.y));
};
vec2f.prototype.muls = function _vec2f__muls(scalar = 0.0) {
  return new vec2f(+(+this.x * +scalar), +(+this.y * +scalar));
};

vec2f.prototype.div = function _vec2f__div(vector = def_vec2f) {
  return new vec2f(+(+this.x / +vector.x), +(+this.y / +vector.y));
};
vec2f.prototype.divs = function _vec2f__divs(scalar = 0.0) {
  return new vec2f(+(+this.x / +scalar), +(+this.y / +scalar));
};

//#endregion
  
//#region class impure primitive vector operators
vec2f.prototype.ineg = function _vec2f__ineg() {
  this.x = +(-(+this.x));
  this.y = +(-(+this.y));
  return this;
};

vec2f.prototype.iadd = function _vec2f__iadd(vector = def_vec2f) {
  this.x += +vector.x;
  this.y += +vector.y;
  return this;
};
vec2f.prototype.iadds = function _vec2f__iadds(value = 0.0) {
  this.x += +value;
  this.y += +value;
  return this;
};

vec2f.prototype.isub = function _vec2f__isub(vector = def_vec2f) {
  this.x -= +vector.x;
  this.y -= +vector.y;
  return this;
};
vec2f.prototype.isubs = function _vec2f__isubs(value = 0.0) {
  this.x -= +value;
  this.y -= +value;
  return this;
};

vec2f.prototype.imul = function _vec2f__imul(vector = def_vec2f) {
  this.x *= +vector.x;
  this.y *= +vector.y;
  return this;
};
vec2f.prototype.imuls = function _vec2f__imuls(value = 0.0) {
  this.x *= +value;
  this.y *= +value;
  return this;
};

vec2f.prototype.idiv = function _vec2f__idiv(vector = def_vec2f) {
  this.x /= +vector.x;
  this.y /= +vector.y;
  return this;
};
vec2f.prototype.idivs = function _vec2f__idivs(value = 0.0) {
  this.x /= +value;
  this.y /= +value;
  return this;
};

//#endregion

//#region class vector products
vec2f.prototype.mag2 = function _vec2f__mag2() {
  return +(+(+this.x * +this.x) + +(+this.y * +this.y));
};
vec2f.prototype.mag = function _vec2f__mag() {
  return +mathf_sqrt(+this.mag2());
};

vec2f.prototype.dot = function _vec2f__dot(vector = def_vec2f) {
  return +(+(+this.x * +vector.x) + +(+this.y * +vector.y));
};

/**
 * Returns the cross-product of two vectors
 *
 * @param {vec2f} vector B
 * @returns {double} The cross product of two vectors
 */
vec2f.prototype.cross = function _vec2f__cross(vector = def_vec2f) {
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
 * which is a scalar, the sign of that scalar will tell you wether point c lies to the left or right of vector ab
 * 
 * @param {vec2f} vector B
 * @param {vec2f} vector C
 * @returns {double} The cross product of three vectors
 * 
 */
vec2f.prototype.cross3 = function _vec2f__cross3(vector2 = def_vec2f, vector3 = def_vec2f) {
  return +(
    +(+(+vector2.x - +this.x) * +(+vector3.y - +this.y)) -
    +(+(+vector2.y - +this.y) * +(+vector3.x - +this.x)) );
};

/**
 * Returns the angle in radians of its vector
 *
 * Math.atan2(dy, dx) === Math.asin(dy/Math.sqrt(dx*dx + dy*dy))
 * 
 * @param {} v Vector
 */
vec2f.prototype.theta = function _vec2__theta() {
  return +mathf_atan2$1(+this.y, +this.x);
};
vec2f.prototype.angle = _vec2__theta;
vec2f.prototype.phi = function _vec2__phi() {
  return +mathf_asin(+this.y / +this.mag());
};

//#endregion

//#region class pure advanced vector functions
vec2f.prototype.unit = function _vec2f__unit() {
  return this.divs(+this.mag());
};

vec2f.prototype.rotn90 = function _vec2f__rotn90() {
  return new vec2f(+this.y, +(-(+this.x)));
};
vec2f.prototype.rot90 = function _vec2f__rot90() {
  return new vec2f(+(-(+this.y)), +this.x);
};
vec2f.prototype.perp = _vec2f__rot90;

/**
 * Rotates a vector by the specified angle in radians
 * 
 * @param {float} r  angle in radians
 * @returns {vec2f} transformed output vector
 */
vec2f.prototype.rotate = function _vec2f__rotate(radians = 0.0) {
  return new vec2f(
    +(+(+this.x * +mathf_cos(+radians)) - +(+this.y * +mathf_sin(+radians))),
    +(+(+this.x * +mathf_sin(+radians)) + +(+this.y * +mathf_cos(+radians)))
  );
};
vec2f.prototype.about = function _vec2f__about(vector = def_vec2f, radians = 0.0) {
  return new vec2f(
    +(+vector.x + +(+(+(+this.x - +vector.x) * +mathf_cos(+radians)) - +(+(+this.y - +vector.y) * +mathf_sin(+radians)))),
    +(+vector.y + +(+(+(+this.x - +vector.x) * +mathf_sin(+radians)) + +(+(+this.y - +vector.y) * +mathf_cos(+radians))))
  );
};

//#endregion

//#region class impure advanced vector functions
vec2f.prototype.iunit = function _vec2f__iunit() {
  return this.idivs(+this.mag());
};

vec2f.prototype.irotn90 = function _vec2f__irotn90() {
  this.x = +this.y;
  this.y = +(-(+this.x));
  return this;
};
vec2f.prototype.irot90 = function _vec2f__irot90() {
  this.x = +(-(+this.y));
  this.y = +this.x;
  return this;
};
vec2f.prototype.iperp = _vec2f__irot90;

vec2f.prototype.irotate = function _vec2f__irotate(radians = 0.0) {
  this.x = +(+(+this.x * +mathf_cos(+radians)) - +(+this.y * +mathf_sin(+radians)));
  this.y = +(+(+this.x * +mathf_sin(+radians)) + +(+this.y * +mathf_cos(+radians)));
  return this;
};
vec2f.prototype.iabout = function _vec2f__iabout(vector = def_vec2f, radians = 0.0) {
  this.x = +(+vector.x + +(+(+(+this.x - +vector.x) * +mathf_cos(+radians)) - +(+(+this.y - +vector.y) * +mathf_sin(+radians)))),
  this.y = +(+vector.y + +(+(+(+this.x - +vector.x) * +mathf_sin(+radians)) + +(+(+this.y - +vector.y) * +mathf_cos(+radians))));
  return this;
};

//#endregion

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
function vec2f_inv(v = def_vec2f) {
  return new vec2f(
    1.0 / +v.x,
    1.0 / +v.y
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
function vec2f_iaddms(a = def_vec2f, b = def_vec2f, scalar = 1.0) {
  a.x = +(+a.x + +(+b.x * +scalar));
  a.y = +(+a.y + +(+b.y * +scalar));
  return a;
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
function vec2f_iinv(v = def_vec2f) {
  v.x = 1.0 / +v.x;
  v.y = 1.0 / +v.y;
  return v
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

//#region flat vec2f boolean products
function vec2f_eqstrict(a = def_vec2f, b = def_vec2f) {
  return a.x === b.x && a.y === b.y;
}
const vec2f_eqs = vec2f_eqstrict;
function vec2f_eq(a = def_vec2f, b = def_vec2f) {
  const ax = +a.x, ay = +a.y, bx = +b.x, by = +b.y;
  return (mathf_abs(ax - bx) <= mathf_EPSILON * mathf_max(1.0, mathf_abs(ax), mathf_abs(bx))
      && mathf_abs(ay - by) <= mathf_EPSILON * mathf_max(1.0, mathf_abs(ay), mathf_abs(by))
    );
}

//#endregion

//#region flat vec2f vector products

function vec2f_mag2(v = def_vec2f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y));
}
function vec2f_mag(v = def_vec2f) {
  return +mathf_sqrt(+vec2f_mag2(v));
}
function vec2f_dist2(a = def_vec2f, b = def_vec2f) {
  const dx = +(+b.x - +a.x), dy = +(+b.y - +a.y);
  return +(+(+dx * +dx) + +(+dy * +dy));
}
function vec2f_dist(a = def_vec2f, b = def_vec2f) {
  return +mathf_sqrt(+vec2f_dist2(a, b));
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
  return +math_atan2(+v.y, +v.x);
}
const vec2f_angle = vec2f_theta;
function vec2f_phi(v = def_vec2f) {
  return +math_asin(+v.y / +vec2f_mag(v));
}

//#endregion

//#region flat vec2f pure advanced vector functions
function vec2f_unit(v = def_vec2f) {
  const mag = +vec2f_mag2();
  return vec2f_divs(v,
    +(mag > 0 ? 1.0 / +mathf_sqrt(mag2) : 1)
  );
}

function vec2f_lerp(v = 0.0, a = def_vec2f, b = def_vec2f) {
  const ax = +a.x, ay = +ay.y;
  return new vec2f(
    +(ax + +v * (+b.x - ax)),
    +(ay + +v * (+b.y - ay))
  );
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
  return new Promise(function(resolve, reject) {
    if (typeof htmlElement === 'string') {
      htmlElement = htmlElement.replace(/[\s\"\']+/g, '');
      htmlElement = htmlElement.replace(/^url\(/, '');
      htmlElement = htmlElement.replace(/\)$/, '');
      const img = new Image();
      img.onload = function() { resolve(img); };
      img.onerror = function(err) { reject(err);};
      img.src = htmlElement;
    }
    else if (typeof htmlElement !== 'object') ;
    else if (htmlElement instanceof HTMLImageElement) {
      if (htmlElement.complete) {
        resolve(htmlElement);
      }
      else {
        htmlElement.onload = function() { resolve(htmlElement); };
        htmlElement.onerror = function(err) { reject(err); };
      }
    }
    else if (htmlElement instanceof Promise) {
      htmlElement
        .then(function(imageElement) { 
          if (imageElement instanceof HTMLImageElement)
            resolve(imageElement); 
          else
            reject('ERR: fetchImage: Promise of first argument must resolve in HTMLImageElement!');
        })
        .catch(function(err) { reject(err); });
    }
    else if (htmlElement instanceof SVGSVGElement) {
      if ("foreignObject" == htmlElement.firstElementChild.nodeName) {
        let width = htmlElement.clientWidth;
        let height = htmlElement.clientHeight;
        
        width = htmlElement.firstElementChild.firstElementChild.clientWidth;
        height = htmlElement.firstElementChild.firstElementChild.clientHeight;
        // set the svg element size to match our canvas size.
        htmlElement.setAttribute('width',  width);
        htmlElement.setAttribute('height', height);
        // now copy a string of the complete element and its children
        const svg = htmlElement.outerHTML;

        const blob = new Blob([svg], {type: 'image/svg+xml'});
        const url = window.URL.createObjectURL(blob);
        
        const img = new Image();
        img.onload = function() {
          window.URL.revokeObjectURL(url);
          resolve(img);
        };
        img.onerror = function(err) {
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

      const svg = ('<svg xmlns="http://www.w3.org/2000/svg"' +
          ' width="' + width + '"' +
          ' height="' + height + '">' +
        '<foreignObject width="100%" height="100%">' + 
          htmlElement.outerHTML + 
        '</foreignObject>' +
        '</svg>');
      
      const blob = new Blob([svg], {type: 'image/svg+xml'});
      const url = window.URL.createObjectURL(blob);
      
      const img = new Image();
      img.onload = function() {
        window.URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function(err) {
        window.URL.revokeObjectURL(url);
        reject(err);
      };
      // trigger render of object url.
      img.src = url;
    }  
    else {
      reject('ERR: fetchImage: first argument MUST be of type url, HTMLElement or Promise!');
      return;
    }
  })
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

//#region basic svg object
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
  isValidPrecursor(segment) {
    return (segment === undefined || segment === null)
      || ((segment instanceof segm2f) && !(segment instanceof segm2f_Z));
  }
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
  hasValidPrecursor(segment) {
    return (segment instanceof segm2f_t)
      || (segment instanceof segm2f_q);
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
  hasValidPrecursor(segment) {
    return (segment instanceof segm2f_s)
      || (segment instanceof segm2f_c);
  }

}

class segm2f_Z extends segm2f {
  constructor() {
    super(true);
  }
  hasValidPrecursor(segment) {
    return !(segment instanceof segm2f_Z);
  }
}
//#endregion

//#region svg path object path2f
class path2f extends shape2f {
  constructor(list = []) {
    this.list = list;
  }
  isClosed() {
    const list = this.list;
    const len = list.length;
    return (len > 0 && (list[len - 1] instanceof segm2f_Z));
  }
  add(segment) {
    const list = this.list;
    const len = list.length;
    if (segment.hasValidPrecursor(len > 0 ? list[len - 1] : null)) {
      list[len] = segment;
      return true;
    }
    return false;
  }
  move(abs, x, y) {
    const segm = new segm2f_M(abs, x, y);
    return add(segm);
  }
  vertical(abs, y) {
    const segm = new segm2f_v(abs, y);
    return add(segm);
  }
  horizontal(abs, x) {
    const segm = new segm2f_h(abs, x);
    return add(segm);
  }
  line(abs, x, y) {
    const segm = new segm2f_l(abs, x, y);
    return add(segm);
  }
  close() {
    const segm = new seqm2f_Z();
    return add(segm);
  }

}
//#endregion

// a dummy function to mimic the CSS-Paint-Api-1 specification
const myRegisteredPaint__store__ = {};
const myRegisterPaint = typeof registerPaint !== 'undefined'
  ? registerPaint
  : (function () {
    return function __registerPaint__(name, paintClass) {
      if (!myRegisteredPaint__store__.hasOwnProperty(name)) {
        myRegisteredPaint__store__[name] = paintClass;
      }
    }        
  })();


const workletState = Object.freeze({ init:0, loading:1, preparing:2, running:3, exiting:4, ended:5 });

class vnode {
  constructor(name, attributes, children) {
    this.key = attributes.key;
    this.attributes = attributes;
    this.nodeName = name;
    this.children = children;
  }
}

/* eslint-disable func-names */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable padded-blocks */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-use-before-define */
function h(name, attributes = {}, ...rest) {
  // the jsx transpiler sets null on the attributes parameter
  // when no parameter is defined, instead of 'undefined'.
  // therefor the default operator doesn't kick in,
  attributes = attributes || {}; //  and do we need this kind of stuff.

  const children = [];
  let ic = 0;

  const lenx = rest.length;
  let itemx = null;
  let ix = 0;


  let leny = 0;
  let itemy = null;
  let iy = 0;

  // fill the children array with the rest parameters
  while (ix < lenx) {
    itemx = rest[ix];
    ix++;
    if (itemx === undefined || itemx === null || itemx === false || itemx === true) continue;
    else if (itemx.pop) {
      // this is an array so fill the children array with the items of this one
      // we do not go any deeper!
      leny = itemx.length;
      iy = 0;
      while (iy < leny) {
        itemy = itemx[iy];
        iy++;
        if (itemy === undefined || itemy === null || itemy === false || itemy === true) continue;
        children[ic++] = itemy;
      }
    }
    else {
      children[ic++] = itemx;
    }
  }

  return typeof name === 'function'
    ? name(attributes, children)
    : new vnode(name, attributes, children);
}

function _h(name, attributes, ...rest) {
  const children = [];
  let length = arguments.length;

  while (rest.length) {
    const node = rest.pop();
    if (node && node.pop) {
      for (length = node.length; length--;) {
        rest.push(node[length]);
      }
    }
    else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  attributes = attributes || {};
  return typeof name === 'function'
    ? name(attributes, children)
    : new vnode(name, attributes, children);
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
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 // Node.TEXT_NODE
          ? element.nodeValue
          : recycleElement(element);
      }),
    };
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

  function wireStateToActions(path, state, actions) {

    function createActionProxy(key, action) {
      actions[key] = function actionProxy(data) {
        const slice = get(path, globalState);

        let result = action(data);
        if (typeof result === 'function') {
          result = result(slice, actions);
        }

        if (result && result !== slice && !result.then) {
          globalState = set(path, clone(slice, result), globalState);
          scheduleRender(globalState);
        }

        return result;
      };
    }

    for (const key in actions) {
      if (typeof actions[key] === 'function') {
        createActionProxy(key, actions[key]);
      }
      else {
        // wire slice/namespace of state to actions
        wireStateToActions(
          path.concat(key),
          (state[key] = clone(state[key])),
          (actions[key] = clone(actions[key])));
      }
    }

    return actions;
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

        for (const i in clone(oldValue, value)) {
          const style = value == null || value[i] == null ? '' : value[i];
          if (i[0] === '-') {
            element.style.setProperty(i, style);
          }
          else {
            element.style[i] = style;
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
    const element = typeof node === 'string' || typeof node === 'number'
      ? document.createTextNode(node)
      : (isSvg || node.nodeName === 'svg')
        ? document.createElementNS(
          'http://www.w3.org/2000/svg',
          node.nodeName)
        : document.createElement(node.nodeName);

    const attributes = node.attributes;
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function () {
          attributes.oncreate(element);
        });
      }

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i] = resolveNode(node.children[i]);
        element.appendChild(createElement(child, isSvg));
      }

      for (const name in attributes) {
        const value = attributes[name];
        updateAttribute(element, name, value, null, isSvg);
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
          isSvg);
      }
    }

    const cb = isRecycling ? attributes.oncreate : attributes.onupdate;
    if (cb) {
      lifecycle.push(function () {
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
          (isSvg = isSvg || node.nodeName === 'svg'));

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
                isSvg);
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

        for (const i in oldKeyed) {
          if (!newKeyed[i]) {
            removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
          }
        }
      }
    }
    return element;
  }
}

// #region html text elements
const h1 = (attr, children) => h('h1', attr, children);
const h2 = (attr, children) => h('h2', attr, children);
const h3 = (attr, children) => h('h3', attr, children);
const h4 = (attr, children) => h('h4', attr, children);
const h5 = (attr, children) => h('h5', attr, children);
const h6 = (attr, children) => h('h6', attr, children);
const p = (attr, children) => h('p', attr, children);

const i = (attr, children) => h('i', attr, children);
const b = (attr, children) => h('b', attr, children);
const u = (attr, children) => h('u', attr, children);
const s = (attr, children) => h('s', attr, children);
const q = (attr, children) => h('q', attr, children);
const pre = (attr, children) => h('pre', attr, children);
const sub = (attr, children) => h('sub', attr, children);
const sup = (attr, children) => h('sup', attr, children);
const wbr = (attr, children) => h('wbr', attr, children);
const blockquote = (attr, children) => h('blockquote', attr, children);

const bdi = (attr, children) => h('bdi', attr, children);
const bdo = (attr, children) => h('bdo', attr, children);
// #endregion

// #region html semantic text elements
const cite = (attr, children) => h('cite', attr, children);
const abbr = (attr, children) => h('abbr', attr, children);
const dfn = (attr, children) => h('dfn', attr, children);

const del = (attr, children) => h('del', attr, children);
const ins = (attr, children) => h('ins', attr, children);
const mark = (attr, children) => h('mark', attr, children);

const time = (attr, children) => h('time', attr, children);
const data = (attr, children) => h('data', attr, children);
// #endregion

// #region html phrase elements
const em = (attr, children) => h('em', attr, children);
const code = (attr, children) => h('code', attr, children);
const strong = (attr, children) => h('strong', attr, children);
const kbd = (attr, children) => h('kbd', attr, children);
const variable = (attr, children) => h('var', attr, children);
// #endregion

// #region html common elements (non-semantic)
const div = (attr, children) => h('div', attr, children);
const span = (attr, children) => h('span', attr, children);
const hr = (attr, children) => h('hr', attr, children);
// #endregion

// #region html widget elements
const progress = (attr, children) => h('progress', attr, children);
const meter = (attr, children) => h('meter', attr, children);
// #endregion

// #region html semantic layout elements
const main = (attr, children) => h('main', attr, children);
const header = (attr, children) => h('header', attr, children);
const nav = (attr, children) => h('nav', attr, children);
const article = (attr, children) => h('article', attr, children);
const section = (attr, children) => h('section', attr, children);
const aside = (attr, children) => h('aside', attr, children);
const footer = (attr, children) => h('footer', attr, children);

const details = (attr, children) => h('details', attr, children);
const summary = (attr, children) => h('summary', attr, children);

const figure = (attr, children) => h('figure', attr, children);
const figcaption = (attr, children) => h('figcaption', attr, children);
// #endregion

// #region table elements
// note: sort of in order of sequence
const table = (attr, children) => h('table', attr, children);
const caption = (attr, children) => h('caption', attr, children);
const colgroup = (attr, children) => h('colgroup', attr, children);
const col = (attr, children) => h('col', attr, children);

const thead = (attr, children) => h('thead', attr, children);
const tbody = (attr, children) => h('tbody', attr, children);
const tfooter = (attr, children) => h('tfooter', attr, children);

const tr = (attr, children) => h('tr', attr, children);
const th = (attr, children) => h('th', attr, children);
const td = (attr, children) => h('td', attr, children);
// #endregion

// #region html list elements
const ul = (attr, children) => h('ul', attr, children);
const ol = (attr, children) => h('ol', attr, children);
const li = (attr, children) => h('li', attr, children);

const dl = (attr, children) => h('dl', attr, children);
const dt = (attr, children) => h('dt', attr, children);
const dd = (attr, children) => h('dd', attr, children);
// #endregion

// #region html multimedia elements
const img = (attr, children) => h('img', attr, children);
const map = (attr, children) => h('map', attr, children);
const area = (attr, children) => h('area', attr, children);

const audio = (attr, children) => h('audio', attr, children);
const picture = (attr, children) => h('picture', attr, children);
const video = (attr, children) => h('video', attr, children);

const source = (attr, children) => h('source', attr, children);
const track = (attr, children) => h('track', attr, children);

const object = (attr, children) => h('object', attr, children);
const param = (attr, children) => h('param', attr, children);

const embed = (attr, children) => h('embed', attr, children);
// #endregion

// #region simple html form elements
const fieldset = (attr, children) => h('fieldset', attr, children);
const legend = (attr, children) => h('legend', attr, children);

const label = (attr, children) => h('label', attr, children);
const output = (attr, children) => h('output', attr, children);

const input = (attr, children) => h('input', attr, children);
const button = (attr, children) => h('button', attr, children);

const datalist = (attr, children) => h('datalist', attr, children);

const select = (attr, children) => h('select', attr, children);
const option = (attr, children) => h('option', attr, children);
const optgroup = (attr, children) => h('optgroup', attr, children);
// #endregion

// #region html input type elements
const defaultInputType = 'text';
const inputTypes = {
  hidden: (attr, children) => h('input', { ...attr, type: 'hidden' }, children),
  submit: (attr, children) => h('input', { ...attr, type: 'submit' }, children),
  image: (attr, children) => h('input', { ...attr, type: 'image' }, children),

  text: (attr, children) => h('input', { ...attr, type: 'text' }, children),
  number: (attr, children) => h('input', { ...attr, type: 'number' }, children),
  password: (attr, children) => h('input', { ...attr, type: 'password' }, children),

  checkbox: (attr, children) => h('input', { ...attr, type: 'checkbox' }, children),
  radio: (attr, children) => h('input', { ...attr, type: 'radio' }, children),


  file: (attr, children) => h('input', { ...attr, type: 'file' }, children),

  email: (attr, children) => h('input', { ...attr, type: 'email' }, children),
  tel: (attr, children) => h('input', { ...attr, type: 'tel' }, children),
  url: (attr, children) => h('input', { ...attr, type: 'url' }, children),

  range: (attr, children) => h('input', { ...attr, type: 'range' }, children),

  color: (attr, children) => h('input', { ...attr, type: 'color' }, children),

  date: (attr, children) => h('input', { ...attr, type: 'date' }, children),
  'datetime-local': (attr, children) => h('input', { ...attr, type: 'datetime-local' }, children),
  month: (attr, children) => h('input', { ...attr, type: 'month' }, children),
  week: (attr, children) => h('input', { ...attr, type: 'week' }, children),
  time: (attr, children) => h('input', { ...attr, type: 'time' }, children),
};

// #endregion

export { PRIMITIVES, _h, abbr, addCssClass, app, area, article, aside, audio, b, bdi, bdo, blockquote, button, caption, checkIfValueDisabled, circle2f, circle2f_POINTS, cite, clone, code, col, colgroup, collapseCssClass, collapseToString, copyAttributes, data, datalist, dd, deepEquals, def_vec2f, def_vec2i, def_vec3f, defaultInputType, del, details, dfn, div, dl, dt, em, embed, fetchImage, fieldset, figcaption, figure, float_PI_A, float_PI_B, float_PIh, float_PIx2, float_angle, float_clamp, float_clampu, float_cosHp, float_cosLp, float_cosMp, float_cross, float_dot, float_fib, float_fib2, float_gcd, float_hypot, float_hypot2, float_inRange, float_intersectsRange, float_intersectsRect, float_isqrt, float_lerp, float_map, float_norm, float_phi, float_sinLp, float_sinLpEx, float_sinMp, float_sinMpEx, float_sqrt, float_theta, float_toDegrees, float_toRadian, float_wrapRadians, footer, getFirstObjectItem, h, h1, h2, h3, h4, h5, h6, hasCssClass, header, hr, i, img, input, inputTypes, ins, int_MULTIPLIER, int_PI, int_PI2, int_PI_A, int_PI_B, int_clamp, int_clampu, int_clampu_u8a, int_clampu_u8b, int_cross, int_dot, int_fib, int_hypot, int_hypotEx, int_inRange, int_intersectsRange, int_intersectsRect, int_lerp, int_mag2, int_map, int_norm, int_random, int_sinLp, int_sinLpEx, int_sqrt, int_sqrtEx, int_toDegreesEx, int_toRadianEx, int_wrapRadians, isPureObject, kbd, label, legend, li, main, map, mark, mathf_EPSILON, mathf_PI, mathf_SQRTFIVE, mathf_abs, mathf_asin, mathf_atan2$1 as mathf_atan2, mathf_ciel, mathf_cos, mathf_floor$1 as mathf_floor, mathf_max$1 as mathf_max, mathf_min$1 as mathf_min, mathf_pow, mathf_random, mathf_round$1 as mathf_round, mathf_sin, mathf_sqrt, mathi_floor, mathi_max, mathi_min, mathi_round, mathi_sqrt, mergeArrays, mergeObjects, meter, myRegisterPaint, nav, object, ol, optgroup, option, output, p, param, path2f, picture, point2f, point2f_POINTS, pre, progress, q, rectangle2f, rectangle2f_POINTS, recursiveDeepCopy, removeCssClass, s, sanitizePrimitiveValue, section, segm2f, segm2f_M, segm2f_Z, segm2f_c, segm2f_h, segm2f_l, segm2f_q, segm2f_s, segm2f_t, segm2f_v, select, shape2f, source, span, strong, sub, summary, sup, table, tbody, td, tfooter, th, thead, time, toggleCssClass, tr, track, triangle2f, triangle2f_POINTS, triangle2f_intersectsRect, triangle2f_intersectsTangle, triangle2i_intersectsRect, u, ul, variable, vec2f, vec2f_about, vec2f_add, vec2f_addms, vec2f_adds, vec2f_angle, vec2f_ceil, vec2f_cross, vec2f_cross3, vec2f_dist, vec2f_dist2, vec2f_div, vec2f_divs, vec2f_dot, vec2f_eq, vec2f_eqs, vec2f_eqstrict, vec2f_floor, vec2f_iabout, vec2f_iadd, vec2f_iaddms, vec2f_iadds, vec2f_iceil, vec2f_idiv, vec2f_idivs$1 as vec2f_idivs, vec2f_ifloor, vec2f_iinv, vec2f_imax, vec2f_imin, vec2f_imul, vec2f_imuls, vec2f_ineg, vec2f_inv, vec2f_iperp, vec2f_irot90$1 as vec2f_irot90, vec2f_irotate, vec2f_irotn90, vec2f_iround, vec2f_isub, vec2f_isubs, vec2f_iunit, vec2f_lerp, vec2f_mag, vec2f_mag2, vec2f_max, vec2f_min, vec2f_mul, vec2f_muls, vec2f_neg, vec2f_new, vec2f_perp, vec2f_phi, vec2f_rot90, vec2f_rotate, vec2f_rotn90, vec2f_round, vec2f_sub, vec2f_subs, vec2f_theta, vec2f_unit, vec2i, vec2i_add, vec2i_adds, vec2i_angleEx, vec2i_cross, vec2i_cross3, vec2i_div, vec2i_divs, vec2i_dot, vec2i_iadd, vec2i_iadds, vec2i_idiv, vec2i_idivs, vec2i_imul, vec2i_imuls, vec2i_ineg, vec2i_inorm, vec2i_iperp, vec2i_irot90, vec2i_irotn90, vec2i_isub, vec2i_isubs, vec2i_mag, vec2i_mag2, vec2i_mul, vec2i_muls, vec2i_neg, vec2i_norm, vec2i_perp, vec2i_phiEx, vec2i_rot90, vec2i_rotn90, vec2i_sub, vec2i_subs, vec2i_thetaEx, vec3f, vec3f_crossABAB, vec3f_div, vec3f_divs, vec3f_idiv, vec3f_idivs, vec3f_iunit, vec3f_mag, vec3f_mag2, vec3f_unit, video, vnode, wbr, workletState };
