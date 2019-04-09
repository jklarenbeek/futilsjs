import { def_vec2f } from './vector';

export function vec3f(x = 0.0, y = 0.0 , z = 0.0) {
  return { x: +x, y: +y, z: +z };
}

export function vec3f_toVec2(v = def_vec3f) {
  return { x: +v.x, y: +v.y };
}

export function vec3f_fromVec2(v = def_vec2f) {
  return { x: +v.x, y: +v.y, z: 0.0 };
}

export function vec3f_dub(v = def_vec3f) {
  return { x: +v.x, y: +v.y, z: +v.z };
}

//#region div

export function vec3f_div(a = def_vec3f, b = def_vec3f) {
  return {
    x: +(+a.x / +b.x),
    y: +(+a.y / +b.y),
    z: +(+a.z / +b.z),
  }  
}
export function vec3f_divScalar(v = def_vec3f, scalar = 0.0) {
  return {
    x: +(+v.x / +scalar),
    y: +(+v.y / +scalar),
    z: +(+v.z / +scalar),
  }
}

export function vec3f_idiv(a = def_vec3f, b = def_vec3f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  a.z /= +(+b.z);
  return a;
}
export function vec3f_idivScalar(v = def_vec3f, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  v.z /= +scalar;
  return v;
}

//#endregion

//#region magnitude and normalize

export function vec3f_mag2(v = def_vec3f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y) + +(+v.z * +v.z));
}

export function vec3f_mag(v = def_vec3f) {
  return +Math.sqrt(+vec3f_mag2(v));
}
export function vec3f_norm(v = def_vec3f) {
  return vec3f_divScalar(v, +vec3f_mag(v));
}
export function vec3f_inorm(v = def_vec3f) {
  return vec2f_idivScalar(v, +vec3f_mag(v));
}

//#endregion

export function vec3f_crossABAB(a = def_vec3f, b = def_vec3f
  ) {
  return {
    x: +(+(+a.y * +b.z) - +(+a.z * +b.y)),
    y: +(+(+a.z * +b.x) - +(+a.x * +b.z)),
    z: +(+(+a.x * +b.y) - +(+a.y * +b.x)),
  }
}
