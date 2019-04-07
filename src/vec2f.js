import { def_vec3f } from "./vec3f";

export const def_vec2f = Object.seal({ x: 0.0, y: 0.0 });

export function vec2f(x = 0.0, y = 0.0) { return { x: +x, y: +y } };

//#region neg

export function vec2f_neg(v = def_vec2f) {
  return {
    x: +(-(+v.x)),
    y: +(-(+v.y)),
  }
}
export function vec2f_ineg(v = def_vec2f) {
  v.x = +(-(+v.x));
  v.y = +(-(+v.y));
  return v;
}

//#endregion

//#region add

export function vec2f_add(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x + +b.x),
    y: +(+a.y + +b.y),
  }
}
export function vec2f_addScalar(v = def_vec2f, scalar = 0.0) {
  return {
    x: +(+v.x + +scalar),
    y: +(+v.y + +scalar),
  }
}
export function vec2f_iadd(a = def_vec2f, b = def_vec2f) {
  a.x += +(+b.x);
  a.y += +(+b.y);
  return a;
}
export function vec2f_iaddScalar(v = def_vec2f, scalar = 0.0) {
  v.x += +scalar;
  v.y += +scalar;
  return v;
}

//#endregion

//#region sub

export function vec2f_sub(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x - +b.x),
    y: +(+a.y - +b.y),
  }
}
export function vec2f_subScalar(a = def_vec2f, scalar = 0.0) {
  return {
    x: +(+a.x - +scalar),
    y: +(+a.y - +scalar),
  }
}
export function vec2f_isub(a = def_vec2f, b = def_vec2f) {
  a.x -= +(+b.x);
  a.y -= +(+b.y);
  return a;
}
export function vec2f_isubScalar(v = def_vec2f, scalar = 0.0) {
  v.x -= +scalar;
  v.y -= +scalar;
  return v;
}

//#endregion

//#region mul

export function vec2f_mul(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x * +b.x),
    y: +(+a.y * +b.y),
  }
}
export function vec2f_mulScalar(v = def_vec2f, scalar = 0.0) {
  return {
    x: +(+v.x * +scalar),
    y: +(+v.y * +scalar),
  }
}
export function vec2f_imul(a = def_vec2f, b = def_vec2f) {
  a.x *= +(+b.x);
  a.y *= +(+b.y);
  return a;
}
export function vec2f_imulScalar(v = def_vec2f, scalar = 0.0) {
  v.x *= +scalar;
  v.y *= +scalar;
  return v;
}

//#endregion

//#region div

export function vec2f_div(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x / +b.x),
    y: +(+a.y / +b.y),
  }  
}
export function vec2f_divScalar(v = def_vec2f, scalar = 0.0) {
  return {
    x: +(+v.x / +scalar),
    y: +(+v.y / +scalar),
  }
}

export function vec2f_idiv(a = def_vec2f, b = def_vec2f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  return a;
}
export function vec2f_idivScalar(v = def_vec2f, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  return v;
}


//#endregion

//#region mag2, dot and cross products

export function vec2f_mag2(v = def_vec2f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y));
}
export function vec2f_dot(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y));
}

/**
 * Returns the cross-product of two vectors
 *
 * @param {vec2f} vector A 
 * @param {vec2f} vector B
 * @returns {double} The cross product of two vectors
 */
export function vec2f_cross(a = def_vec2f, b = def_vec2f) {
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
export function vec2f_cross3(a = def_vec2f, b = def_vec2f, c = def_vec2f) {
  return +(
    +(+(+b.x - +a.x) * +(+c.y - +a.y)) -
    +(+(+b.y - +a.y) * +(+c.x - +a.x)) );
}

//#endregion

//#region magnitude and normalize

export function vec2f_mag(v = def_vec2f) {
  return +Math.sqrt(+vec2f_mag2(v));
}
export function vec2f_norm(v = def_vec2f) {
  return vec2f_divScalar(v, +vec2f_mag(v));
}
export function vec2f_inorm(v = def_vec2f) {
  return vec2f_idivScalar(v, +vec2f_mag(v));
}

//#endregion

//#region rotation

export function vec2f_angle(v = def_vec2f) {
  return +Math.atan2(+v.y, +v.x);
}

export function vec2f_rotn90(v = def_vec2f) {
  return {
    x: +(+v.y),
    y: +(-(+v.x)),
  };
}
export function vec2f_irotn90(v = def_vec2f) {
  const t = +v.x;
  v.x = +(+v.y);
  v.y = +(-(+t));
  return v;
}

export function vec2f_rot90(v = def_vec2f) {
  return {
    x: +(-(+v.y)),
    y: +(+v.x),
  };
}
export const vec2f_perp = vec2f_rot90;

export function vec2f_irot90(v = def_vec2f) {
  const t = +v.y;
  v.x = +(-(+t));
  v.y = +(+v.x);
  return v;
}
export const vec2f_iperp = vec2f_irot90;

/**
 * Rotates a vector by the specified angle in radians
 * 
 * @param {vec2f} v vector 
 * @param {float} r  angle in radians
 * @returns {vec2f} transformed output vector
 */
export function vec2f_rotate(v = def_vec2f, r = 0.0) {
  return {
    x: +(+(+v.x * +Math.cos(+r)) - +(+v.y * +Math.sin(+r))),
    y: +(+(+v.x * +Math.sin(+r)) + +(+v.y * +Math.cos(+r))),
  }
}
export function vec2f_irotate(v = def_vec2f, r = 0.0) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+(+vx * +Math.cos(+r)) - +(+vy * +Math.sin(+r)));
  v.y = +(+(+vx * +Math.sin(+r)) + +(+vy * +Math.cos(+r)));
  return v;
}

export function vec2f_rotateAbout(v = def_vec2f, r = 0.0, p = def_vec2f) {
  return {
    x: +(+p.x + +(+(+v.x - +p.x) * +Math.cos(+r)) - +(+(+v.y - +p.y) * +Math.sin(+r))),
    y: +(+p.y + +(+(+v.x - +p.x) * +Math.sin(+r)) + +(+(+v.y - +p.y) * +Math.cos(+r))),
  }
}
export function vec2f_irotateAbout(v = def_vec2f, r = 0.0, p = def_vec2f) {
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
export function vec2f_rotateEx(v = def_vec2f, r = 0.0, sin = Math.sin, cos = Math.cos) {
  return {
    x: +(+(+v.x * +cos(+r)) - +(+v.y * +sin(+r))),
    y: +(+(+v.x * +sin(+r)) + +(+v.y * +cos(+r))),
  }
}
export function vec2f_irotateEx(v = def_vec2f, r = 0.0, sin = Math.sin, cos = Math.cos) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+(+vx * +cos(+r)) - +(+vy * +sin(+r)));
  v.y = +(+(+vx * +sin(+r)) + +(+vy * +cos(+r)));
  return v;
}

export function vec2f_rotateAboutEx(v = def_vec2f, r = 0.0, p = def_vec2f, sin = Math.sin, cos = Math.cos) {
  return {
    x: +(+p.x + +(+(+v.x - +p.x) * +cos(+r)) - +(+(+v.y - +p.y) * +sin(+r))),
    y: +(+p.y + +(+(+v.x - +p.x) * +sin(+r)) + +(+(+v.y - +p.y) * +cos(+r))),
  }
}
export function vec2f_irotateAboutEx(v = def_vec2f, r = 0.0, p = def_vec2f, sin = Math.sin, cos = Math.cos) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+p.x + +(+(+vx - +p.x) * +cos(+r)) - +(+(+vy - +p.y) * +sin(+r)));
  v.y = +(+p.y + +(+(+vx - +p.x) * +sin(+r)) + +(+(+vy - +p.y) * +cos(+r)));
  return v;
}

//#endregion

