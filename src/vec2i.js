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

export function vec2i_thetaEx(v = def_vec2i) {
  return (int_MULTIPLIER * Math.atan2((v.y|0), (v.x|0)))|0;
}
export const vec2i_angleEx = vec2i_thetaEx;

export function vec2i_phiEx(v= def_vec2i) {
  return (int_MULTIPLIER * Math.asin((v.y|0) / vec2i_mag(v)));
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
export function vec2i_triangleIntersect(v1, v2, v3, r1, r2) {
  /*
    This function borrowed faithfully from a wonderfl (:3) discussion on
    calculating triangle collision with AABBs on the following blog:
    http://sebleedelisle.com/2009/05/super-fast-trianglerectangle-intersection-test/
  
    This particular optimization best suits my purposes and was contributed
    to the discussion by someone from http://lab9.fr/
    */
  
    const l = r1.x|0;
    const r = r2.x|0;
    const t = r1.y|0;
    const b = r2.y|0;
  
    const x0 = v1.x|0;
    const y0 = v1.y|0;
    const x1 = v2.x|0;
    const y1 = v2.y|0;
    const x2 = v3.x|0;
    const y2 = v3.y|0;
  
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
    if (i2 != 0)
    {
        m = ((y2 - y0) / (x2 - x0))|0;
        c = (y0 -(m * x0))|0;
        if (i2 & 1) { s = m * l + c; if ( s > t && s < b) return true; }
        if (i2 & 2) { s = (t - c) / m; if ( s > l && s < r) return true; }
        if (i2 & 4) { s = m * r + c; if ( s > t && s < b) return true; }
        if (i2 & 8) { s = (b - c) / m; if ( s > l && s < r) return true; }
    }
  
    return false;
  }
