/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */

import {
  mathf_sqrt,
  mathf_sin,
  mathf_cos,
  mathf_atan2,
  mathf_asin,
  mathf_abs,
  mathf_ceil,
  mathf_floor,
  mathf_round,
  mathf_min,
  mathf_max,
  mathf_EPSILON,
} from './float';

export class vec2f {
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
}

export const def_vec2f = Object.freeze(Object.seal(vec2f_new()));

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
 * which is a scalar, the sign of that scalar will tell you wether point c
 * lies to the left or right of vector ab
 *
 * @param {vec2f} vector B
 * @param {vec2f} vector C
 * @returns {double} The cross product of three vectors
 *
 */
vec2f.prototype.cross3 = function _vec2f__cross3(vector2 = def_vec2f, vector3 = def_vec2f) {
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
function _vec2f__theta() {
  return +mathf_atan2(+this.y, +this.x);
}
vec2f.prototype.theta = _vec2f__theta;
vec2f.prototype.angle = _vec2f__theta;
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
function _vec2f__rot90() {
  return new vec2f(+(-(+this.y)), +this.x);
}
vec2f.prototype.rot90 = _vec2f__rot90;
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
    +(+(+this.x * +mathf_sin(+radians)) + +(+this.y * +mathf_cos(+radians))),
  );
};
vec2f.prototype.about = function _vec2f__about(vector = def_vec2f, radians = 0.0) {
  return new vec2f(
    +(+vector.x + +(+(+(+this.x - +vector.x) * +mathf_cos(+radians))
      - +(+(+this.y - +vector.y) * +mathf_sin(+radians)))),
    +(+vector.y + +(+(+(+this.x - +vector.x) * +mathf_sin(+radians))
      + +(+(+this.y - +vector.y) * +mathf_cos(+radians)))),
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
function _vec2f__irot90() {
  this.x = +(-(+this.y));
  this.y = +this.x;
  return this;
}
vec2f.prototype.irot90 = _vec2f__irot90;
vec2f.prototype.iperp = _vec2f__irot90;

vec2f.prototype.irotate = function _vec2f__irotate(radians = 0.0) {
  this.x = +(+(+this.x * +mathf_cos(+radians)) - +(+this.y * +mathf_sin(+radians)));
  this.y = +(+(+this.x * +mathf_sin(+radians)) + +(+this.y * +mathf_cos(+radians)));
  return this;
};
vec2f.prototype.iabout = function _vec2f__iabout(vector = def_vec2f, radians = 0.0) {
  this.x = +(+vector.x + +(+(+(+this.x - +vector.x) * +mathf_cos(+radians))
    - +(+(+this.y - +vector.y) * +mathf_sin(+radians))));
  this.y = +(+vector.y + +(+(+(+this.x - +vector.x) * +mathf_sin(+radians))
    + +(+(+this.y - +vector.y) * +mathf_cos(+radians))));
  return this;
};

//#endregion

//#region flat vec2f pure primitive operators

export function vec2f_neg(v = def_vec2f) {
  return new vec2f(
    +(-(+v.x)),
    +(-(+v.y)),
  );
}
export function vec2f_add(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x + +b.x),
    +(+a.y + +b.y),
  );
}
export function vec2f_adds(v = def_vec2f, scalar = 0.0) {
  return new vec2f(
    +(+v.x + +scalar),
    +(+v.y + +scalar),
  );
}
export function vec2f_addms(a = def_vec2f, b = def_vec2f, scalar = 1.0) {
  return new vec2f(
    +(+a.x + +(+b.x * +scalar)),
    +(+a.y + +(+b.y * +scalar)),
  );
}

export function vec2f_sub(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x - +b.x),
    +(+a.y - +b.y),
  );
}
export function vec2f_subs(a = def_vec2f, scalar = 0.0) {
  return new vec2f(
    +(+a.x - +scalar),
    +(+a.y - +scalar),
  );
}

export function vec2f_mul(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x * +b.x),
    +(+a.y * +b.y),
  );
}
export function vec2f_muls(v = def_vec2f, scalar = 1.0) {
  return new vec2f(
    +(+v.x * +scalar),
    +(+v.y * +scalar),
  );
}

export function vec2f_div(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x / +b.x),
    +(+a.y / +b.y),
  );
}
export function vec2f_divs(v = def_vec2f, scalar = 1.0) {
  return new vec2f(
    +(+v.x / +scalar),
    +(+v.y / +scalar),
  );
}
export function vec2f_inv(v = def_vec2f) {
  return new vec2f(
    1.0 / +v.x,
    1.0 / +v.y,
  );
}

export function vec2f_ceil(v = def_vec2f) {
  return new vec2f(
    +mathf_ceil(+v.x),
    +mathf_ceil(+v.y),
  );
}
export function vec2f_floor(v = def_vec2f) {
  return new vec2f(
    +mathf_floor(+v.x),
    +mathf_floor(+v.y),
  );
}
export function vec2f_round(v = def_vec2f) {
  return new vec2f(
    +mathf_round(+v.x),
    +mathf_round(+v.y),
  );
}

export function vec2f_min(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +mathf_min(+a.x, +b.x),
    +mathf_min(+a.y, +b.y),
  );
}
export function vec2f_max(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +mathf_max(+a.x, +b.x),
    +mathf_max(+a.y, +b.y),
  );
}

//#endregion

//#region flat vec2f impure primitive operators
export function vec2f_ineg(v = def_vec2f) {
  v.x = +(-(+v.x));
  v.y = +(-(+v.y));
  return v;
}
export function vec2f_iadd(a = def_vec2f, b = def_vec2f) {
  a.x += +b.x;
  a.y += +b.y;
  return a;
}
export function vec2f_iadds(v = def_vec2f, scalar = 0.0) {
  v.x += +scalar;
  v.y += +scalar;
  return v;
}
export function vec2f_iaddms(a = def_vec2f, b = def_vec2f, scalar = 1.0) {
  a.x = +(+a.x + +(+b.x * +scalar));
  a.y = +(+a.y + +(+b.y * +scalar));
  return a;
}
export function vec2f_isub(a = def_vec2f, b = def_vec2f) {
  a.x -= +(+b.x);
  a.y -= +(+b.y);
  return a;
}
export function vec2f_isubs(v = def_vec2f, scalar = 0.0) {
  v.x -= +scalar;
  v.y -= +scalar;
  return v;
}

export function vec2f_imul(a = def_vec2f, b = def_vec2f) {
  a.x *= +(+b.x);
  a.y *= +(+b.y);
  return a;
}
export function vec2f_imuls(v = def_vec2f, scalar = 1.0) {
  v.x *= +scalar;
  v.y *= +scalar;
  return v;
}

export function vec2f_idiv(a = def_vec2f, b = def_vec2f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  return a;
}
export function vec2f_idivs(v = def_vec2f, scalar = 1.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  return v;
}
export function vec2f_iinv(v = def_vec2f) {
  v.x = 1.0 / +v.x;
  v.y = 1.0 / +v.y;
  return v;
}

export function vec2f_iceil(v = def_vec2f) {
  v.x = +mathf_ceil(+v.x);
  v.y = +mathf_ceil(+v.y);
  return v;
}
export function vec2f_ifloor(v = def_vec2f) {
  v.x = +mathf_floor(+v.x);
  v.y = +mathf_floor(+v.y);
  return v;
}
export function vec2f_iround(v = def_vec2f) {
  v.x = +mathf_round(+v.x);
  v.y = +mathf_round(+v.y);
  return v;
}

export function vec2f_imin(a = def_vec2f, b = def_vec2f) {
  a.x = +mathf_min(+a.x, +b.x);
  a.y = +mathf_min(+a.y, +b.y);
  return a;
}
export function vec2f_imax(a = def_vec2f, b = def_vec2f) {
  a.x = +mathf_max(+a.x, +b.x);
  a.y = +mathf_max(+a.y, +b.y);
  return a;
}

//#endregion

//#region flat vec2f boolean products
export function vec2f_eqstrict(a = def_vec2f, b = def_vec2f) {
  return a.x === b.x && a.y === b.y;
}
export const vec2f_eqs = vec2f_eqstrict;
export function vec2f_eq(a = def_vec2f, b = def_vec2f) {
  const ax = +a.x, ay = +a.y, bx = +b.x, by = +b.y;
  return (mathf_abs(ax - bx) <= mathf_EPSILON * mathf_max(1.0, mathf_abs(ax), mathf_abs(bx))
    && mathf_abs(ay - by) <= mathf_EPSILON * mathf_max(1.0, mathf_abs(ay), mathf_abs(by))
  );
}

//#endregion

//#region flat vec2f vector products

export function vec2f_mag2(v = def_vec2f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y));
}
export function vec2f_mag(v = def_vec2f) {
  return +mathf_sqrt(+vec2f_mag2(v));
}
export function vec2f_dist2(a = def_vec2f, b = def_vec2f) {
  const dx = +(+b.x - +a.x), dy = +(+b.y - +a.y);
  return +(+(+dx * +dx) + +(+dy * +dy));
}
export function vec2f_dist(a = def_vec2f, b = def_vec2f) {
  return +mathf_sqrt(+vec2f_dist2(a, b));
}

export function vec2f_dot(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y));
}
export function vec2f_cross(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * +b.y) - +(+a.y * +b.x));
}
export function vec2f_cross3(a = def_vec2f, b = def_vec2f, c = def_vec2f) {
  return +(
    +(+(+b.x - +a.x) * +(+c.y - +a.y))
    - +(+(+b.y - +a.y) * +(+c.x - +a.x))
  );
}

export function vec2f_theta(v = def_vec2f) {
  return +mathf_atan2(+v.y, +v.x);
}
export const vec2f_angle = vec2f_theta;
export function vec2f_phi(v = def_vec2f) {
  return +mathf_asin(+v.y / +vec2f_mag(v));
}

//#endregion

//#region flat vec2f pure advanced vector functions
export function vec2f_unit(v = def_vec2f) {
  const mag2 = +vec2f_mag2();
  return vec2f_divs(
    v,
    +(mag2 > 0 ? 1.0 / +mathf_sqrt(mag2) : 1),
  );
}

export function vec2f_lerp(v = 0.0, a = def_vec2f, b = def_vec2f) {
  const ax = +a.x, ay = +ay.y;
  return new vec2f(
    +(ax + +v * (+b.x - ax)),
    +(ay + +v * (+b.y - ay)),
  );
}

export function vec2f_rotn90(v = def_vec2f) {
  return new vec2f(
    +v.y,
    +(-(+v.x)),
  );
}
export function vec2f_rot90(v = def_vec2f) {
  return new vec2f(
    +(-(+v.y)),
    +v.x,
  );
}
export const vec2f_perp = vec2f_rot90;

/**
 * Rotates a vector by the specified angle in radians
 *
 * @param {float} r  angle in radians
 * @returns {vec2f} transformed output vector
 */
export function vec2f_rotate(v = def_vec2f, radians = 0.0) {
  return new vec2f(
    +(+(+v.x * +mathf_cos(+radians)) - +(+v.y * +mathf_sin(+radians))),
    +(+(+v.x * +mathf_sin(+radians)) + +(+v.y * +mathf_cos(+radians))),
  );
}
export function vec2f_about(a = def_vec2f, b = def_vec2f, radians = 0.0) {
  return new vec2f(
    +(+b.x
      + +(+(+(+a.x - +b.x) * +mathf_cos(+radians))
      - +(+(+a.y - +b.y) * +mathf_sin(+radians)))),
    +(+b.y
      + +(+(+(+a.x - +b.x) * +mathf_sin(+radians))
      + +(+(+a.y - +b.y) * +mathf_cos(+radians)))),
  );
}


//#endregion

//#region flat vec2f impure advanced vector functions

export function vec2f_iunit(v = def_vec2f) {
  return vec2f_idivs(+vec2f_mag(v));
}

export function vec2f_irotn90(v = def_vec2f) {
  v.x = +v.y;
  v.y = +(-(+v.x));
  return v;
}
export function vec2f_irot90(v = def_vec2f) {
  v.x = +(-(+v.y));
  v.y = +v.x;
  return v;
}
export const vec2f_iperp = vec2f_irot90;

export function vec2f_irotate(v = def_vec2f, radians = 0.0) {
  v.x = +(+(+v.x * +mathf_cos(+radians)) - +(+v.y * +mathf_sin(+radians)));
  v.y = +(+(+v.x * +mathf_sin(+radians)) + +(+v.y * +mathf_cos(+radians)));
  return v;
}
export function vec2f_iabout(a = def_vec2f, b = def_vec2f, radians = 0.0) {
  a.x = +(+b.x + +(+(+(+a.x - +b.x) * +mathf_cos(+radians))
    - +(+(+a.y - +b.y) * +mathf_sin(+radians))));
  a.y = +(+b.y + +(+(+(+a.x - +b.x) * +mathf_sin(+radians))
    + +(+(+a.y - +b.y) * +mathf_cos(+radians))));
  return a;
}

//#endregion


export function vec2f_new(x = 0.0, y = 0.0) { return new vec2f(+x, +y); }
