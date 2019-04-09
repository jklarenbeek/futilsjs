import { int_MULTIPLIER } from "./int";
import { def_vec2i } from './vector';

export function vec2i(x = 0, y = 0) {
  return { x: x|0, y: y|0 } 
};

//#region neg

export function vec2i_neg(v = def_vec2i) {
  return {
    x: (-(v.x|0))|0,
    y: (-(v.y|0))|0,
  }
}
export function vec2i_ineg(v = def_vec2i) {
  v.x = (-(v.x|0))|0;
  v.y = (-(v.y|0))|0;
  return v;
}

//#endregion

//#region add

export function vec2i_add(a = def_vec2i, b = def_vec2i) {
  return {
    x: ((a.x|0) + (b.x|0))|0,
    y: ((a.y|0) + (b.y|0))|0,
  }
}
export function vec2i_addScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return {
    x: ((v.x|0) + scalar)|0,
    y: ((v.y|0) + scalar)|0,
  }
}
export function vec2i_iadd(a = def_vec2i, b = def_vec2i) {
  a.x += (b.x|0)|0;
  a.y += (b.y|0)|0;
  return a;
}
export function vec2i_iaddScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x += scalar;
  v.y += scalar;
  return v;
}

//#endregion

//#region sub

export function vec2i_sub(a = def_vec2i, b = def_vec2i) {
  return {
    x: ((a.x|0) - (b.x|0))|0,
    y: ((a.y|0) - (b.y|0))|0,
  }
}
export function vec2i_subScalar(a = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return {
    x: ((a.x|0) - scalar)|0,
    y: ((a.y|0) - scalar)|0,
  }
}
export function vec2i_isub(a = def_vec2i, b = def_vec2i) {
  a.x -= (b.x|0)|0;
  a.y -= (b.y|0)|0;
  return a;
}
export function vec2i_isubScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x -= scalar;
  v.y -= scalar;
  return v;
}

//#endregion

//#region mul

export function vec2i_mul(a = def_vec2i, b = def_vec2i) {
  return {
    x: ((a.x|0) * (b.x|0))|0,
    y: ((a.y|0) * (b.y|0))|0,
  }
}
export function vec2i_mulScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return {
    x: ((v.x|0) * scalar)|0,
    y: ((v.y|0) * scalar)|0,
  }
}
export function vec2i_imul(a = def_vec2i, b = def_vec2i) {
  a.x *= (b.x|0)|0;
  a.y *= (b.y|0)|0;
  return a;
}
export function vec2i_imulScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x *= scalar;
  v.y *= scalar;
  return v;
}

//#endregion

//#region div

export function vec2i_div(a = def_vec2i, b = def_vec2i) {
  return {
    x: ((a.x|0) / (b.x|0))|0,
    y: ((a.y|0) / (b.y|0))|0,
  }  
}
export function vec2i_divScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  return {
    x: ((v.x|0) / scalar)|0,
    y: ((v.y|0) / scalar)|0,
  }
}

export function vec2i_idiv(a = def_vec2i, b = def_vec2i) {
  a.x /= b.x|0;
  a.y /= b.y|0;
  return a;
}
export function vec2i_idivScalar(v = def_vec2i, scalar = 0) {
  scalar = scalar|0;
  v.x /= scalar;
  v.y /= scalar;
  return v;
}


//#endregion

//#region mag2, dot and cross products

export function vec2i_mag2(v = def_vec2i) {
  return (((v.x|0) * (v.x|0)) + ((v.y|0) * (v.y|0)))|0;
}

export function vec2i_dot(a = def_vec2i, b = def_vec2i) {
  return (((a.x|0) * (b.x|0)) + ((a.y|0) * (b.y|0)))|0;
}

export function vec2i_cross(a = def_vec2i, b = def_vec2i) {
  return (((a.x|0) * (b.y|0)) - ((a.x|0) * (b.y|0)))|0;
}

export function vec2i_cross3(a = def_vec2i, b = def_vec2i, c = def_vec2i) {
  return (
    (((b.x|0) - (a.x|0)) * ((c.y|0) - (a.y|0))) -
    (((b.y|0) - (a.y|0)) * ((c.x|0) - (a.x|0))) );
}

//#endregion

//#region magnitude and normalize

export function vec2i_mag(v = def_vec2i) {
  return int_sqrt(vec2i_mag2(v)|0)|0;
}
export function vec2i_norm(v = def_vec2i) {
  return vec2i_divScalar(v, vec2i_mag(v)|0)|0;
}
export function vec2i_inorm(v = def_vec2i) {
  return vec2i_idivScalar(v, vec2i_mag(v)|0)|0;
}

//#endregion

//#region rotation

export function vec2i_angleEx(v = def_vec2i) {
  return (int_MULTIPLIER * Math.atan2((v.y|0), (v.x|0)))|0;
}

export function vec2i_rotn90(v = def_vec2i) {
  return {
    x: v.y|0,
    y: (-(v.x|0))|0,
  };
}
export function vec2i_irotn90(v = def_vec2i) {
  const t = v.x|0;
  v.x = v.y|0;
  v.y = (-(t))|0;
  return v|0;
}

export function vec2i_rot90(v = def_vec2i) {
  return {
    x: (-(v.y|0))|0,
    y: v.x|0,
  };
}
export const vec2i_perp = vec2i_rot90;

export function vec2i_irot90(v = def_vec2i) {
  const t = v.y|0;
  v.x = (-(t))|0;
  v.y = (v.x|0);
  return v|0;
}
export const vec2i_iperp = vec2f_irot90;

//#endregion
