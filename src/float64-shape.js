/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
import {
  vec2f64 as vec2f,
  def_vec2f64 as def_vec2f,
} from './float64-vec2';


//#region basic svg object
//#endregion

//#region vec2d basic shapes

export class shape2f {
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

export const point2f_POINTS = 1;
export class point2f extends shape2f {
  constructor(p1 = def_vec2f) {
    super();
    this.p1 = p1;
  }

  gP1() {
    return this.p1;
  }

  pointCount() {
    return point2f_POINTS;
  }
}

export const circle2f_POINTS = 1;
export class circle2f extends shape2f {
  constructor(p1 = def_vec2f, r = 1.0) {
    super();
    this.p1 = p1;
    this.radius = +r;
  }

  gP1() {
    return this.p1;
  }

  pointCount() {
    return circle2f_POINTS;
  }
}

export const rectangle2f_POINTS = 2;
export class rectangle2f extends shape2f {
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
    return rectangle2f_POINTS;
  }
}

// TODO: argument initialiser to def_triangle2f

export const triangle2f_POINTS = 3;
export class triangle2f extends shape2f {
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
    return triangle2f_POINTS;
  }

  //#region intersects other shape

  intersectsRect(rectangle = rectangle2f, normal = 1.0) {
    return triangle2f_intersectsRect(
      this.p1,
      this.p2,
      this.p3,
      rectangle.p1,
      rectangle.p2,
      +normal,
    );
  }

  intersectsTangle(triangle = triangle2f) {
    return triangle2f_intersectsTangle(
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
export function triangle2f_intersectsRect(
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
export function triangle2f_intersectsTangle(
  l1 = def_vec2f, l2 = def_vec2f, l3 = def_vec2f,
  r1 = def_vec2f, r2 = def_vec2f, r3 = def_vec2f,
) {
  const lnorm = +(
    +(+(+l2.x - +l1.x) * +(+l3.y - +l1.y))
    - +(+(+l2.y - +l1.y) * +(+l3.x - +l1.x)));
  const rnorm = +(
    +(+(+r2.x - +r1.x) * +(+r3.y - +r1.y))
    - +(+(+r2.y - +r1.y) * +(+r3.x - +r1.x)));

  return !(triangle2f_intersectsRect(r1, r2, r3, l1, l2, lnorm)
    || triangle2f_intersectsRect(r1, r2, r3, l2, l3, lnorm)
    || triangle2f_intersectsRect(r1, r2, r3, l3, l1, lnorm)
    || triangle2f_intersectsRect(l1, l2, l3, r1, r2, rnorm)
    || triangle2f_intersectsRect(l1, l2, l3, r2, r3, rnorm)
    || triangle2f_intersectsRect(l1, l2, l3, r3, r1, rnorm));
}

export const trapezoid2f_POINTS = 4;
export class trapezoid2f extends shape2f {
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
    return rectangle2f_POINTS;
  }
}


//#endregion

//#region svg path segments

export class segm2f {
  constructor(abs = true) {
    this.abs = (typeof abs === 'boolean')
      ? abs // is the coordinate absolute or relative?
      : true;
  }

  gAbs() {
    return this.abs;
  }

  isValidPrecursor(segment) {
    return (segment === undefined || segment === null)
      || ((segment instanceof segm2f) && !(segment instanceof segm2f_Z));
  }
}

export class segm2f_M extends segm2f {
  constructor(abs = true, x = 0.0, y = 0.0) {
    super(abs);
    this.p1 = (x instanceof vec2f)
      ? x
      : new vec2f(+x, +y);
  }

  gP1() {
    return this.p1;
  }
}

export class segm2f_v extends segm2f {
  constructor(abs = false, y = 0.0) {
    super(abs);
    this.y = (y instanceof vec2f)
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
export class segm2f_h extends segm2f {
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
export class segm2f_l extends segm2f {
  constructor(abs = false, p1 = def_vec2f, y = 0.0) {
    super(abs);
    this.p1 = (p1 instanceof vec2f)
      ? p1
      : new vec2f(+p1, +y);
  }
}

export class segm2f_q extends segm2f {
  constructor(abs = false, p1 = def_vec2f, p2 = def_vec2f, x2 = 0.0, y2 = 0.0) {
    super(abs);
    if (p1 instanceof vec2f) {
      this.p1 = p1;
      if (p2 instanceof vec2f) {
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
export class segm2f_t extends segm2f {
  constructor(abs = false, p1 = def_vec2f, y = 0.0) {
    super(abs);
    this.p1 = (p1 instanceof vec2f)
      ? p1
      : new vec2f(+p1, +y);
  }

  hasValidPrecursor(segment) {
    return (segment instanceof segm2f_t)
      || (segment instanceof segm2f_q);
  }
}

export class segm2f_c extends segm2f {
  constructor(abs = false) {
    super(abs);
    // TODO
  }
}

export class segm2f_s extends segm2f {
  constructor(abs = false) {
    super(abs);
    // TODO
  }

  hasValidPrecursor(segment) {
    return (segment instanceof segm2f_s)
      || (segment instanceof segm2f_c);
  }
}

export class segm2f_Z extends segm2f {
  constructor() {
    super(true);
  }

  hasValidPrecursor(segment) {
    return !(segment instanceof segm2f_Z);
  }
}
//#endregion

//#region svg path object path2f
export class path2f extends shape2f {
  constructor(abs = false, list = []) {
    super(abs);
    this.list = list;
  }

  isClosed() {
    const list = this.list;
    const len = list.length;
    return (len > 0 && (list[len - 1] instanceof segm2f_Z));
  }

  add(segment) {
    if (segment instanceof segm2f) {
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
    const segm = new segm2f_M(abs, x, y);
    return this.add(segm);
  }

  vertical(abs, y) {
    const segm = new segm2f_v(abs, y);
    return this.add(segm);
  }

  horizontal(abs, x) {
    const segm = new segm2f_h(abs, x);
    return this.add(segm);
  }

  line(abs, x, y) {
    const segm = new segm2f_l(abs, x, y);
    return this.add(segm);
  }

  close() {
    const segm = new segm2f_Z();
    return this.add(segm);
  }
}

//#endregion