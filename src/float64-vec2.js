/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
import {
  mathf64_sqrt as sqrt,
  mathf64_sin as sin,
  mathf64_cos as cos,
  mathf64_atan2 as atan2,
  mathf64_asin as asin,
  mathf64_abs as abs,
  mathf64_ceil as ceil,
  mathf64_floor as floor,
  mathf64_round as round,
  mathf64_min as min,
  mathf64_max as max,
  mathf64_EPSILON as EPSILON,
} from './float64-math';

export class vec2f64 {
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
  return +sqrt(+this.mag2());
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
  return +atan2(+this.y, +this.x);
}
vec2f64.prototype.theta = _vec2f64__theta;
vec2f64.prototype.angle = _vec2f64__theta;
vec2f64.prototype.phi = function _vec2__phi() {
  return +asin(+this.y / +this.mag());
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
    +(+(+this.x * +cos(+radians)) - +(+this.y * +sin(+radians))),
    +(+(+this.x * +sin(+radians)) + +(+this.y * +cos(+radians))),
  );
};
vec2f64.prototype.about = function _vec2f64__about(vector = def_vec2f64, radians = 0.0) {
  return new vec2f64(
    +(+vector.x + +(+(+(+this.x - +vector.x) * +cos(+radians))
      - +(+(+this.y - +vector.y) * +sin(+radians)))),
    +(+vector.y + +(+(+(+this.x - +vector.x) * +sin(+radians))
      + +(+(+this.y - +vector.y) * +cos(+radians)))),
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
  this.x = +(+(+this.x * +cos(+radians)) - +(+this.y * +sin(+radians)));
  this.y = +(+(+this.x * +sin(+radians)) + +(+this.y * +cos(+radians)));
  return this;
};
vec2f64.prototype.iabout = function _vec2f64__iabout(vector = def_vec2f64, radians = 0.0) {
  this.x = +(+vector.x + +(+(+(+this.x - +vector.x) * +cos(+radians))
    - +(+(+this.y - +vector.y) * +sin(+radians))));
  this.y = +(+vector.y + +(+(+(+this.x - +vector.x) * +sin(+radians))
    + +(+(+this.y - +vector.y) * +cos(+radians))));
  return this;
};

//#endregion

//#endregion

//#region -- functional implementation --

//#region flat vec2f pure primitive operators

export function vec2f64_neg(v = def_vec2f64) {
  return new vec2f64(
    +(-(+v.x)),
    +(-(+v.y)),
  );
}
export function vec2f64_add(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +(+a.x + +b.x),
    +(+a.y + +b.y),
  );
}
export function vec2f64_adds(v = def_vec2f64, scalar = 0.0) {
  return new vec2f64(
    +(+v.x + +scalar),
    +(+v.y + +scalar),
  );
}
export function vec2f64_addms(a = def_vec2f64, b = def_vec2f64, scalar = 1.0) {
  return new vec2f64(
    +(+a.x + +(+b.x * +scalar)),
    +(+a.y + +(+b.y * +scalar)),
  );
}

export function vec2f64_sub(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +(+a.x - +b.x),
    +(+a.y - +b.y),
  );
}
export function vec2f64_subs(a = def_vec2f64, scalar = 0.0) {
  return new vec2f64(
    +(+a.x - +scalar),
    +(+a.y - +scalar),
  );
}

export function vec2f64_mul(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +(+a.x * +b.x),
    +(+a.y * +b.y),
  );
}
export function vec2f64_muls(v = def_vec2f64, scalar = 1.0) {
  return new vec2f64(
    +(+v.x * +scalar),
    +(+v.y * +scalar),
  );
}

export function vec2f64_div(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +(+a.x / +b.x),
    +(+a.y / +b.y),
  );
}
export function vec2f64_divs(v = def_vec2f64, scalar = 1.0) {
  return new vec2f64(
    +(+v.x / +scalar),
    +(+v.y / +scalar),
  );
}
export function vec2f64_inv(v = def_vec2f64) {
  return new vec2f64(
    1.0 / +v.x,
    1.0 / +v.y,
  );
}

export function vec2f64_ceil(v = def_vec2f64) {
  return new vec2f64(
    +ceil(+v.x),
    +ceil(+v.y),
  );
}
export function vec2f64_floor(v = def_vec2f64) {
  return new vec2f64(
    +floor(+v.x),
    +floor(+v.y),
  );
}
export function vec2f64_round(v = def_vec2f64) {
  return new vec2f64(
    +round(+v.x),
    +round(+v.y),
  );
}

export function vec2f64_min(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +min(+a.x, +b.x),
    +min(+a.y, +b.y),
  );
}
export function vec2f64_max(a = def_vec2f64, b = def_vec2f64) {
  return new vec2f64(
    +max(+a.x, +b.x),
    +max(+a.y, +b.y),
  );
}

//#endregion

//#region flat vec2f impure primitive operators
export function vec2f64_ineg(v = def_vec2f64) {
  v.x = +(-(+v.x));
  v.y = +(-(+v.y));
  return v;
}
export function vec2f64_iadd(a = def_vec2f64, b = def_vec2f64) {
  a.x += +b.x;
  a.y += +b.y;
  return a;
}
export function vec2f64_iadds(v = def_vec2f64, scalar = 0.0) {
  v.x += +scalar;
  v.y += +scalar;
  return v;
}
export function vec2f64_iaddms(a = def_vec2f64, b = def_vec2f64, scalar = 1.0) {
  a.x = +(+a.x + +(+b.x * +scalar));
  a.y = +(+a.y + +(+b.y * +scalar));
  return a;
}
export function vec2f64_isub(a = def_vec2f64, b = def_vec2f64) {
  a.x -= +(+b.x);
  a.y -= +(+b.y);
  return a;
}
export function vec2f64_isubs(v = def_vec2f64, scalar = 0.0) {
  v.x -= +scalar;
  v.y -= +scalar;
  return v;
}

export function vec2f64_imul(a = def_vec2f64, b = def_vec2f64) {
  a.x *= +(+b.x);
  a.y *= +(+b.y);
  return a;
}
export function vec2f64_imuls(v = def_vec2f64, scalar = 1.0) {
  v.x *= +scalar;
  v.y *= +scalar;
  return v;
}

export function vec2f64_idiv(a = def_vec2f64, b = def_vec2f64) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  return a;
}
export function vec2f64_idivs(v = def_vec2f64, scalar = 1.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  return v;
}
export function vec2f64_iinv(v = def_vec2f64) {
  v.x = 1.0 / +v.x;
  v.y = 1.0 / +v.y;
  return v;
}

export function vec2f64_iceil(v = def_vec2f64) {
  v.x = +ceil(+v.x);
  v.y = +ceil(+v.y);
  return v;
}
export function vec2f64_ifloor(v = def_vec2f64) {
  v.x = +floor(+v.x);
  v.y = +floor(+v.y);
  return v;
}
export function vec2f64_iround(v = def_vec2f64) {
  v.x = +round(+v.x);
  v.y = +round(+v.y);
  return v;
}

export function vec2f64_imin(a = def_vec2f64, b = def_vec2f64) {
  a.x = +min(+a.x, +b.x);
  a.y = +min(+a.y, +b.y);
  return a;
}
export function vec2f64_imax(a = def_vec2f64, b = def_vec2f64) {
  a.x = +max(+a.x, +b.x);
  a.y = +max(+a.y, +b.y);
  return a;
}

//#endregion

//#region flat vec2f boolean products
export function vec2f64_eqstrict(a = def_vec2f64, b = def_vec2f64) {
  return a.x === b.x && a.y === b.y;
}
export const vec2f64_eqs = vec2f64_eqstrict;
export function vec2f64_eq(a = def_vec2f64, b = def_vec2f64) {
  const ax = +a.x, ay = +a.y, bx = +b.x, by = +b.y;
  return (abs(ax - bx)
    <= EPSILON * max(1.0, abs(ax), abs(bx))
    && abs(ay - by)
    <= EPSILON * max(1.0, abs(ay), abs(by))
  );
}

//#endregion

//#region flat vec2f vector products

export function vec2f64_mag2(v = def_vec2f64) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y));
}
export function vec2f64_mag(v = def_vec2f64) {
  return +sqrt(+vec2f64_mag2(v));
}
export function vec2f64_dist2(a = def_vec2f64, b = def_vec2f64) {
  const dx = +(+b.x - +a.x), dy = +(+b.y - +a.y);
  return +(+(+dx * +dx) + +(+dy * +dy));
}
export function vec2f64_dist(a = def_vec2f64, b = def_vec2f64) {
  return +sqrt(+vec2f64_dist2(a, b));
}

export function vec2f64_dot(a = def_vec2f64, b = def_vec2f64) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y));
}
export function vec2f64_cross(a = def_vec2f64, b = def_vec2f64) {
  return +(+(+a.x * +b.y) - +(+a.y * +b.x));
}
export function vec2f64_cross3(a = def_vec2f64, b = def_vec2f64, c = def_vec2f64) {
  return +(
    +(+(+b.x - +a.x) * +(+c.y - +a.y))
    - +(+(+b.y - +a.y) * +(+c.x - +a.x))
  );
}

export function vec2f64_theta(v = def_vec2f64) {
  return +atan2(+v.y, +v.x);
}
export function vec2f64_phi(v = def_vec2f64) {
  return +asin(+v.y / +vec2f64_mag(v));
}

//#endregion

//#region flat vec2f pure advanced vector functions
export function vec2f64_unit(v = def_vec2f64) {
  const mag2 = +vec2f64_mag2();
  return vec2f64_divs(
    v,
    +(mag2 > 0 ? 1.0 / +sqrt(mag2) : 1),
  );
}

export function vec2f64_lerp(v = 0.0, a = def_vec2f64, b = def_vec2f64) {
  const ax = +a.x, ay = +ay.y;
  return new vec2f64(
    +(ax + +v * (+b.x - ax)),
    +(ay + +v * (+b.y - ay)),
  );
}

export function vec2f64_rotn90(v = def_vec2f64) {
  return new vec2f64(
    +v.y,
    +(-(+v.x)),
  );
}
export function vec2f64_rot90(v = def_vec2f64) {
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
export function vec2f64_rotate(v = def_vec2f64, radians = 0.0) {
  return new vec2f64(
    +(+(+v.x * +cos(+radians)) - +(+v.y * +sin(+radians))),
    +(+(+v.x * +sin(+radians)) + +(+v.y * +cos(+radians))),
  );
}
export function vec2f64_about(a = def_vec2f64, b = def_vec2f64, radians = 0.0) {
  return new vec2f64(
    +(+b.x
      + +(+(+(+a.x - +b.x) * +cos(+radians))
      - +(+(+a.y - +b.y) * +sin(+radians)))),
    +(+b.y
      + +(+(+(+a.x - +b.x) * +sin(+radians))
      + +(+(+a.y - +b.y) * +cos(+radians)))),
  );
}


//#endregion

//#region flat vec2f impure advanced vector functions

export function vec2f64_iunit(v = def_vec2f64) {
  return vec2f64_idivs(+vec2f64_mag(v));
}

export function vec2f64_irotn90(v = def_vec2f64) {
  v.x = +v.y;
  v.y = +(-(+v.x));
  return v;
}
export function vec2f64_irot90(v = def_vec2f64) {
  v.x = +(-(+v.y));
  v.y = +v.x;
  return v;
}
export const vec2f64_iperp = vec2f64_irot90;

export function vec2f64_irotate(v = def_vec2f64, radians = 0.0) {
  v.x = +(+(+v.x * +cos(+radians)) - +(+v.y * +sin(+radians)));
  v.y = +(+(+v.x * +sin(+radians)) + +(+v.y * +cos(+radians)));
  return v;
}
export function vec2f64_iabout(a = def_vec2f64, b = def_vec2f64, radians = 0.0) {
  a.x = +(+b.x + +(+(+(+a.x - +b.x) * +cos(+radians))
    - +(+(+a.y - +b.y) * +sin(+radians))));
  a.y = +(+b.y + +(+(+(+a.x - +b.x) * +sin(+radians))
    + +(+(+a.y - +b.y) * +cos(+radians))));
  return a;
}

//#endregion

//#endregion

export const def_vec2f64 = Object.freeze(Object.seal(vec2f64_new()));
export function vec2f64_new(x = 0.0, y = 0.0) { return new vec2f64(+x, +y); }

export default {
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
