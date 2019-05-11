
import {
  mathf_sqrt,
  mathf_sin,
  mathf_cos,
  mathf_atan2,
  mathf_asin
} from './float';

export const def_vec2f = Object.freeze(new vec2f());

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
    return +mathf_atan2(+this.y, +this.x);
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
    this.y = +(+vector.y + +(+(+(+this.x - +vector.x) * +mathf_sin(+radians)) + +(+(+this.y - +vector.y) * +mathf_cos(+radians))))
    return this;
  }


  //#endregion
}

//#region flat vec2f pure primitive operators

export function vec2f_neg(v = def_vec2f) {
  return new vec2f(
    +(-(+v.x)),
    +(-(+v.y))
  );
}
export function vec2f_add(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x + +b.x),
    +(+a.y + +b.y)
  );
}
export function vec2f_adds(v = def_vec2f, scalar = 0.0) {
  return new vec2f(
    +(+v.x + +scalar),
    +(+v.y + +scalar)
  );
}
export function vec2f_addms(a = def_vec2f, b = def_vec2f, scalar = 1.0) {
  return new vec2f(
    +(+a.x + +(+b.x * +scalar)),
    +(+a.y + +(+b.y * +scalar))
  );
}

export function vec2f_sub(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x - +b.x),
    +(+a.y - +b.y)
  );
}
export function vec2f_subs(a = def_vec2f, scalar = 0.0) {
  return new vec2f(
    +(+a.x - +scalar),
    +(+a.y - +scalar)
  );
}

export function vec2f_mul(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x * +b.x),
    +(+a.y * +b.y)
  );
}
export function vec2f_muls(v = def_vec2f, scalar = 1.0) {
  return new vec2f(
    +(+v.x * +scalar),
    +(+v.y * +scalar)
  );
}

export function vec2f_div(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +(+a.x / +b.x),
    +(+a.y / +b.y)
  );
}
export function vec2f_divs(v = def_vec2f, scalar = 1.0) {
  return new vec2f(
    +(+v.x / +scalar),
    +(+v.y / +scalar)
  );
}

export function vec2f_ceil(v = def_vec2f) {
  return new vec2f(
    +mathf_ceil(+v.x),
    +mathf_ceil(+v.y)
  );
}
export function vec2f_floor(v = def_vec2f) {
  return new vec2f(
    +mathf_floor(+v.x),
    +mathf_floor(+v.y)
  );
}
export function vec2f_round(v = def_vec2f) {
  return new vec2f(
    +mathf_round(+v.x),
    +mathf_round(+v.y)
  );
}

export function vec2f_min(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +mathf_min(+a.x, +b.x),
    +mathf_min(+a.y, +b.y)
  );
}
export function vec2f_max(a = def_vec2f, b = def_vec2f) {
  return new vec2f(
    +mathf_max(+a.x, +b.x),
    +mathf_max(+a.y, +b.y)
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

export function vec2f_iceil(v = def_vec2f) {
  v.x = +mathf_ceil(+v.x);
  v.y = +mathf_ceil(+v.y);
  return v;
}
export function vec2f_ifloor(v = def_vec2f) {
  v.x = +mathf_floor(+v.x),
  v.y = +mathf_floor(+v.y)
  return v;
}
export function vec2f_iround(v = def_vec2f) {
  v.x = +mathf_round(+v.x),
  v.y = +mathf_round(+v.y)
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

//#region flat vec2f vector products

export function vec2f_mag2(v = def_vec2f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y));
}
export function vec2f_mag(v = def_vec2f) {
  return +mathf_sqrt(+vec2f_mag2(v));
}

export function vec2f_dot(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y));
}
export function vec2f_cross(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * +b.y) - +(+a.y * +b.x));
}
export function vec2f_cross3(a = def_vec2f, b = def_vec2f, c = def_vec2f) {
  return +(
    +(+(+b.x - +a.x) * +(+c.y - +a.y)) -
    +(+(+b.y - +a.y) * +(+c.x - +a.x)) );
}

export function vec2f_theta(v = def_vec2f) {
  return +Math.atan2(+v.y, +v.x);
}
export const vec2f_angle = vec2f_theta;
export function vec2f_phi(v = def_vec2f) {
  return +Math.asin(+v.y / +vec2f_mag(v));
}

//#endregion

//#region flat vec2f pure advanced vector functions
export function vec2f_unit(v = def_vec2f) {
  return vec2f_divs(v, +vec2f_mag(v));
}

export function vec2f_rotn90(v = def_vec2f) {
  return new vec2f(
    +v.y,
    +(-(+v.x))
  );
}
export function vec2f_rot90(v = def_vec2f) {
  return new vec2f(
    +(-(+v.y)),
    +v.x
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
    +(+(+v.x * +mathf_sin(+radians)) + +(+v.y * +mathf_cos(+radians)))
  );
}
export function vec2f_about(a = def_vec2f, b = def_vec2f, radians = 0.0) {
  return new vec2f(
    +(+vector.x + +(+(+(+a.x - +b.x) * +mathf_cos(+radians)) - +(+(+a.y - +b.y) * +mathf_sin(+radians)))),
    +(+vector.y + +(+(+(+a.x - +b.x) * +mathf_sin(+radians)) + +(+(+a.y - +b.y) * +mathf_cos(+radians))))
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
  a.x = +(+b.x + +(+(+(+a.x - +b.x) * +mathf_cos(+radians)) - +(+(+a.y - +b.y) * +mathf_sin(+radians)))),
  a.y = +(+b.y + +(+(+(+a.x - +b.x) * +mathf_sin(+radians)) + +(+(+a.y - +b.y) * +mathf_cos(+radians))))
  return a;
}

//#endregion


export function vec2f_new(x = 0.0, y = 0.0) { return new vec2f(+x, +y); }
