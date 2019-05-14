import { vec2f } from './vec2f';
import { mathf_sqrt } from './float';


export class vec3f {
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

  gP1() {
    return new vec2f(+this.x, +this.y);
  }

  clone() {
    return Object.create(this);
  }
}

export const def_vec3f = Object.freeze(Object.seal(new vec3f()));

//#region flat vec3f pure primitive operators

export function vec3f_div(a = def_vec3f, b = def_vec3f) {
  return new vec3f(
    +(+a.x / +b.x),
    +(+a.y / +b.y),
    +(+a.z / +b.z),
  );
}
export function vec3f_divs(v = def_vec3f, scalar = 0.0) {
  return new vec3f(
    +(+v.x / +scalar),
    +(+v.y / +scalar),
    +(+v.z / +scalar),
  );
}

//#endregion

//#region flat vec3f impure primitive operators

export function vec3f_idiv(a = def_vec3f, b = def_vec3f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  a.z /= +(+b.z);
  return a;
}
export function vec3f_idivs(v = def_vec3f, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  v.z /= +scalar;
  return v;
}

//#endregion

//#region flat vec3f pure advanced operators

export function vec3f_mag2(v = def_vec3f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y) + +(+v.z * +v.z));
}
export function vec3f_mag(v = def_vec3f) {
  return +mathf_sqrt(+vec3f_mag2(v));
}
export function vec3f_unit(v = def_vec3f) {
  return vec3f_divs(v, +vec3f_mag(v));
}
export function vec3f_iunit(v = def_vec3f) {
  return vec3f_idivs(v, +vec3f_mag(v));
}

export function vec3f_crossABAB(a = def_vec3f, b = def_vec3f) {
  return new vec3f(
    +(+(+a.y * +b.z) - +(+a.z * +b.y)),
    +(+(+a.z * +b.x) - +(+a.x * +b.z)),
    +(+(+a.x * +b.y) - +(+a.y * +b.x)),
  );
}

//#endregion
