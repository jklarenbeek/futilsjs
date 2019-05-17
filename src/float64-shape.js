/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
import {
  vec2f64 as vec2f,
  def_vec2f64 as def_vec2f,
} from './float64-vec2';


//#region basic svg object
//#endregion

//#region vec2d basic shapes

export class shape2f64 {
  getP1X() { return this.gP1() ? this.gP1().x : Number.NaN; }
  getP1Y() { return this.gP1() ? this.gP1().y : Number.NaN; }
  getP2X() { return this.gP2() ? this.gP2().x : Number.NaN; }
  getP2Y() { return this.gP2() ? this.gP2().y : Number.NaN; }
  getP3X() { return this.gP3() ? this.gP3().x : Number.NaN; }
  getP3Y() { return this.gP3() ? this.gP3().y : Number.NaN; }
  getP4X() { return this.gP4() ? this.gP4().x : Number.NaN; }
  getP4Y() { return this.gP4() ? this.gP4().y : Number.NaN; }
  pointCount() { return 0.0; }
}

export const point2f64_POINTS = 1;
export class point2f64 extends shape2f64 {
  constructor(p1 = def_vec2f) {
    super();
    this.p1 = p1;
  }

  gP1() {
    return this.p1;
  }

  pointCount() {
    return point2f64_POINTS;
  }
}

export const circle2f64_POINTS = 1;
export class circle2f64 extends shape2f64 {
  constructor(p1 = def_vec2f, r = 1.0) {
    super();
    this.p1 = p1;
    this.radius = +r;
  }

  gP1() {
    return this.p1;
  }

  pointCount() {
    return circle2f64_POINTS;
  }
}

export const rectangle2f64_POINTS = 2;
export class rectangle2f64 extends shape2f64 {
  constructor(p1 = def_vec2f, p2 = def_vec2f) {
    super();
    this.p1 = p1;
    this.p2 = p2;
  }

  gP1() {
    return this.p1;
  }

  gP2() {
    return this.p2;
  }

  pointCount() {
    return rectangle2f64_POINTS;
  }
}

// TODO: argument initialiser to def_triangle2f

export const triangle2f64_POINTS = 3;
export class triangle2f64 extends shape2f64 {
  constructor(p1 = def_vec2f, p2 = def_vec2f, p3 = def_vec2f) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
  }

  gP1() {
    return this.p1;
  }

  gP2() {
    return this.p2;
  }

  gP3() {
    return this.p3;
  }

  pointCount() {
    return triangle2f64_POINTS;
  }

  //#region intersects other shape

  intersectsRect(rectangle = rectangle2f64, normal = 1.0) {
    return triangle2f64_intersectsRect(
      this.p1,
      this.p2,
      this.p3,
      rectangle.p1,
      rectangle.p2,
      +normal,
    );
  }

  intersectsTriangle(triangle = triangle2f64) {
    return triangle2f64_intersectsTriangle(
      this.p1,
      this.p2,
      this.p3,
      triangle.p1,
      triangle.p2,
      triangle.p3,
    );
  }
  //#endregion
}

/**
 * Tests if triangle intersects with rectangle
 *
 * @param {rectangle2f} rectangle
 * @param {*} normal
 */
export function triangle2f64_intersectsRect(
  l1 = def_vec2f, l2 = def_vec2f, l3 = def_vec2f,
  r1 = def_vec2f, r2 = def_vec2f, normal = 1.0,
) {
  normal = +normal;
  const dx = +(+r2.x - +r1.x);
  const dy = +(+r2.y - +r1.y);
  return !(
    (((+l1.x - +r1.x) * +dy - (+l1.y - +r1.y) * +dx) * +normal < 0)
    || (((+l2.x - +r1.x) * +dy - (+l2.y - +r1.y) * +dx) * +normal < 0)
    || (((+l3.x - +r1.x) * +dy - (+l3.y - +r1.y) * +dx) * +normal < 0));
}
export function triangle2f64_intersectsTriangle(
  l1 = def_vec2f, l2 = def_vec2f, l3 = def_vec2f,
  r1 = def_vec2f, r2 = def_vec2f, r3 = def_vec2f,
) {
  const lnorm = +(
    +(+(+l2.x - +l1.x) * +(+l3.y - +l1.y))
    - +(+(+l2.y - +l1.y) * +(+l3.x - +l1.x)));
  const rnorm = +(
    +(+(+r2.x - +r1.x) * +(+r3.y - +r1.y))
    - +(+(+r2.y - +r1.y) * +(+r3.x - +r1.x)));

  return !(triangle2f64_intersectsRect(r1, r2, r3, l1, l2, lnorm)
    || triangle2f64_intersectsRect(r1, r2, r3, l2, l3, lnorm)
    || triangle2f64_intersectsRect(r1, r2, r3, l3, l1, lnorm)
    || triangle2f64_intersectsRect(l1, l2, l3, r1, r2, rnorm)
    || triangle2f64_intersectsRect(l1, l2, l3, r2, r3, rnorm)
    || triangle2f64_intersectsRect(l1, l2, l3, r3, r1, rnorm));
}

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
export function triangle2i64_intersectsRect(v1, v2, v3, r1, r2) {
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

  const b0 = (((x0 > l) ? 1 : 0)
    | (((y0 > t) ? 1 : 0) << 1)
    | (((x0 > r) ? 1 : 0) << 2)
    | (((y0 > b) ? 1 : 0) << 3))|0;
  if (b0 === 3) return true;

  const b1 = ((x1 > l) ? 1 : 0)
    | (((y1 > t) ? 1 : 0) << 1)
    | (((x1 > r) ? 1 : 0) << 2)
    | (((y1 > b) ? 1 : 0) << 3)|0;
  if (b1 === 3) return true;

  const b2 = ((x2 > l) ? 1 : 0)
    | (((y2 > t) ? 1 : 0) << 1)
    | (((x2 > r) ? 1 : 0) << 2)
    | (((y2 > b) ? 1 : 0) << 3)|0;
  if (b2 === 3) return true;

  let c = 0;
  let m = 0;
  let s = 0;

  const i0 = (b0 ^ b1)|0;
  if (i0 !== 0) {
    m = ((y1-y0) / (x1-x0))|0;
    c = (y0 -(m * x0))|0;
    if (i0 & 1) {
      s = m * l + c;
      if (s > t && s < b) return true;
    }
    if (i0 & 2) {
      s = (t - c) / m;
      if (s > l && s < r) return true;
    }
    if (i0 & 4) {
      s = m * r + c;
      if (s > t && s < b) return true;
    }
    if (i0 & 8) {
      s = (b - c) / m;
      if (s > l && s < r) return true;
    }
  }

  const i1 = (b1 ^ b2)|0;
  if (i1 !== 0) {
    m = ((y2 - y1) / (x2 - x1))|0;
    c = (y1 -(m * x1))|0;
    if (i1 & 1) {
      s = m * l + c;
      if (s > t && s < b) return true;
    }
    if (i1 & 2) {
      s = (t - c) / m;
      if (s > l && s < r) return true;
    }
    if (i1 & 4) {
      s = m * r + c;
      if (s > t && s < b) return true;
    }
    if (i1 & 8) {
      s = (b - c) / m;
      if (s > l && s < r) return true;
    }
  }

  const i2 = (b0 ^ b2)|0;
  if (i2 !== 0) {
    m = ((y2 - y0) / (x2 - x0))|0;
    c = (y0 -(m * x0))|0;
    if (i2 & 1) {
      s = m * l + c;
      if (s > t && s < b) return true;
    }
    if (i2 & 2) {
      s = (t - c) / m;
      if (s > l && s < r) return true;
    }
    if (i2 & 4) {
      s = m * r + c;
      if (s > t && s < b) return true;
    }
    if (i2 & 8) {
      s = (b - c) / m;
      if (s > l && s < r) return true;
    }
  }

  return false;
}


export const trapezoid2f64_POINTS = 4;
export class trapezoid2f64 extends shape2f64 {
  constructor(p1 = def_vec2f, p2 = def_vec2f, p3 = def_vec2f, p4 = def_vec2f) {
    super();
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p4 = p4;
  }

  gP1() {
    return this.p1;
  }

  gP2() {
    return this.p2;
  }

  gP3() {
    return this.p3;
  }

  gP4() {
    return this.p4;
  }

  pointCount() {
    return trapezoid2f64_POINTS;
  }
}


//#endregion

//#region svg path segments

export class segm2f64 {
  constructor(abs = true) {
    // is the coordinate absolute or relative?
    this.abs = (abs === false || abs === true)
      ? abs
      : (typeof abs === 'number')
        ? abs > 0 ? true : false
        : true;
  }

  gAbs() {
    return this.abs;
  }

  isValidPrecursor(segment) {
    return (segment === undefined || segment === null)
      || ((segment instanceof segm2f64) && (segment.constructor !== segm2f64_Z));
  }
}

export class segm2f64_M extends segm2f64 {
  constructor(abs = true, x = 0.0, y = 0.0) {
    super(abs);
    this.p1 = (x.constructor === vec2f)
      ? x
      : new vec2f(+x, +y);
  }

  gP1() {
    return this.p1;
  }
}

export class segm2f64_v extends segm2f64 {
  constructor(abs = false, y = 0.0) {
    super(abs);
    this.y = (y.constructor === vec2f)
      ? this.y = y.y
      : y;
  }

  gY() {
    return +this.y;
  }

  gP1() {
    return new vec2f(0.0, +this.y);
  }
}
export class segm2f64_h extends segm2f64 {
  constructor(abs = false, x = 0.0) {
    super(abs);
    this.x = +x;
  }

  gX() {
    return +this.x;
  }

  gP1() {
    return new vec2f(+this.x, 0.0);
  }
}
export class segm2f64_l extends segm2f64 {
  constructor(abs = false, p1 = def_vec2f, y = 0.0) {
    super(abs);
    this.p1 = (p1.constructor === vec2f)
      ? p1
      : new vec2f(+p1, +y);
  }
}

export class segm2f64_q extends segm2f64 {
  constructor(abs = false, p1 = def_vec2f, p2 = def_vec2f, x2 = 0.0, y2 = 0.0) {
    super(abs);
    if (p1.constructor === vec2f) {
      this.p1 = p1;
      if (p2.constructor === vec2f) {
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
export class segm2f64_t extends segm2f64 {
  constructor(abs = false, p1 = def_vec2f, y = 0.0) {
    super(abs);
    this.p1 = (p1.constructor === vec2f)
      ? p1
      : new vec2f(+p1, +y);
  }

  hasValidPrecursor(segment) {
    return (segment.constructor === segm2f64_t)
      || (segment.constructor === segm2f64_q);
  }
}

export class segm2f64_c extends segm2f64 {
  constructor(abs = false) {
    super(abs);
    // TODO
  }
}

export class segm2f64_s extends segm2f64 {
  constructor(abs = false) {
    super(abs);
    // TODO
  }

  hasValidPrecursor(segment) {
    return (segment.constructor === segm2f64_s)
      || (segment.constructor === segm2f64_c);
  }
}

export class segm2f64_Z extends segm2f64 {
  constructor() {
    super(true);
  }

  hasValidPrecursor(segment) {
    return !(segment.constructor === segm2f64_Z);
  }
}
//#endregion

//#region svg path object path2f
export class path2f64 extends shape2f64 {
  constructor(abs = false, list = []) {
    super(abs);
    this.list = list;
  }

  isClosed() {
    const list = this.list;
    const len = list.length;
    return (len > 0 && (list[len - 1].constructor === segm2f64_Z));
  }

  add(segment) {
    if (segment instanceof segm2f64) {
      const list = this.list;
      const len = list.length;
      if (segment.hasValidPrecursor(len > 0 ? list[len - 1] : null)) {
        list[len] = segment;
        return true;
      }
    }
    return false;
  }

  move(abs, x, y) {
    const segm = new segm2f64_M(abs, x, y);
    return this.add(segm);
  }

  vertical(abs, y) {
    const segm = new segm2f64_v(abs, y);
    return this.add(segm);
  }

  horizontal(abs, x) {
    const segm = new segm2f64_h(abs, x);
    return this.add(segm);
  }

  line(abs, x, y) {
    const segm = new segm2f64_l(abs, x, y);
    return this.add(segm);
  }

  close() {
    const segm = new segm2f64_Z();
    return this.add(segm);
  }
}

//#endregion

export default {
  Shape: shape2f64,
  Point: point2f64,
  Circle: circle2f64,
  Rectangle: rectangle2f64,
  Triangle: triangle2f64,
  Trapezoid: trapezoid2f64,
  Path: path2f64,
  PSM: segm2f64_M,
  PSv: segm2f64_v,
  PSh: segm2f64_h,
  PSl: segm2f64_l,
  PSq: segm2f64_q,
  PSt: segm2f64_t,
  PSc: segm2f64_c,
  PSs: segm2f64_s,
  PSZ: segm2f64_Z,
};
