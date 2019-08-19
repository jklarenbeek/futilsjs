import { mathf64_sqrt } from './float64-math';

import { vec2f64 } from './float64-vec2';

export class vec3f64 {
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

export const def_vec3f64 = Object.freeze(Object.seal(vec3f64_new()));

//#region flat vec3f pure primitive operators
export function vec3f64_add(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+a.x + +b.x),
    +(+a.y + +b.y),
    +(+a.z + +b.z),
  );
}

export function vec3f64_adds(a = def_vec3f64, scalar = 0.0) {
  return new vec3f64(
    +(+a.x + +scalar),
    +(+a.y + +scalar),
    +(+a.z + +scalar),
  );
}

export function vec3f64_sub(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+a.x - +b.x),
    +(+a.y - +b.y),
    +(+a.z - +b.z),
  );
}

export function vec3f64_subs(a = def_vec3f64, scalar = 0.0) {
  return new vec3f64(
    +(+a.x - +scalar),
    +(+a.y - +scalar),
    +(+a.z - +scalar),
  );
}

export function vec3f64_div(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+a.x / +b.x),
    +(+a.y / +b.y),
    +(+a.z / +b.z),
  );
}
export function vec3f64_divs(v = def_vec3f64, scalar = 0.0) {
  return new vec3f64(
    +(+v.x / +scalar),
    +(+v.y / +scalar),
    +(+v.z / +scalar),
  );
}

export function vec3f64_mul(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+a.x * +b.x),
    +(+a.y * +b.y),
    +(+a.z * +b.z),
  );
}
export function vec3f64_muls(v = def_vec3f64, scalar = 0.0) {
  return new vec3f64(
    +(+v.x * +scalar),
    +(+v.y * +scalar),
    +(+v.z * +scalar),
  );
}

//#endregion

//#region flat vec3f impure primitive operators
export function vec3f64_iadd(a = def_vec3f64, b = def_vec3f64) {
  a.x += +(+b.x);
  a.y += +(+b.y);
  a.z += +(+b.z);
  return a;
}
export function vec3f64_iadds(v = def_vec3f64, scalar = 0.0) {
  v.x += +scalar;
  v.y += +scalar;
  v.z += +scalar;
  return v;
}

export function vec3f64_isub(a = def_vec3f64, b = def_vec3f64) {
  a.x -= +(+b.x);
  a.y -= +(+b.y);
  a.z -= +(+b.z);
  return a;
}
export function vec3f64_isubs(v = def_vec3f64, scalar = 0.0) {
  v.x -= +scalar;
  v.y -= +scalar;
  v.z -= +scalar;
  return v;
}

export function vec3f64_idiv(a = def_vec3f64, b = def_vec3f64) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  a.z /= +(+b.z);
  return a;
}
export function vec3f64_idivs(v = def_vec3f64, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  v.z /= +scalar;
  return v;
}

export function vec3f64_imul(a = def_vec3f64, b = def_vec3f64) {
  a.x *= +(+b.x);
  a.y *= +(+b.y);
  a.z *= +(+b.z);
  return a;
}
export function vec3f64_imuls(v = def_vec3f64, scalar = 0.0) {
  v.x *= +scalar;
  v.y *= +scalar;
  v.z *= +scalar;
  return v;
}

//#endregion

//#region flat vec3f pure advanced operators

export function vec3f64_mag2(v = def_vec3f64) {
  return +vec3f64_dot(v, v);
}

export function vec3f64_mag(v = def_vec3f64) {
  return +mathf64_sqrt(+vec3f64_mag2(v));
}

export function vec3f64_unit(v = def_vec3f64) {
  return vec3f64_divs(v, +vec3f64_mag(v));
}

export function vec3f64_iunit(v = def_vec3f64) {
  return vec3f64_idivs(v, +vec3f64_mag(v));
}

export function vec3f64_dot(a = def_vec3f64, b = def_vec3f64) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y) + +(+a.z * +b.z));
}

export function vec3f64_crossABAB(a = def_vec3f64, b = def_vec3f64) {
  return new vec3f64(
    +(+(+a.y * +b.z) - +(+a.z * +b.y)),
    +(+(+a.z * +b.x) - +(+a.x * +b.z)),
    +(+(+a.x * +b.y) - +(+a.y * +b.x)),
  );
}

//#endregion

export function vec3f64_new(x = 0.0, y = 0.0, z = 0.0) { return new vec3f64(+x, +y, +z); }

export default {
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
