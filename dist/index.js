function float_norm(value = 0.0, min = 0.0, max = 0.0) {
  return +(+(+value - +min) / +(+max - +min));
}

function float_lerp(norm = 0.0, min = 0.0, max = 0.0) {
  return +(+(+max - +min) * +(+norm + +min));
}

function float_map(value = 0.0, smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +float_lerp(+float_norm(+value, +smin, +smax), +dmin, +dmax);
}

/**
 * Clamps a value between a checked boudary.
 * and can therefor handle swapped min/max arguments
 * 
 * @param {float} value input value
 * @param {float} min minimum bounds
 * @param {float} max maximum bounds
 * @returns {float} clamped value 
 */
function float_clamp(value = 0.0, min = 0.0, max = 0.0) {
  return +Math.min(+Math.max(+value, +Math.min(+min, +max)), +Math.max(+min, +max));
}
/**
 * Clamps a value between an unchecked boundary
 * this function needs min < max!!
 * (see float_clamp for a checked boundary)
 * 
 * @param {float} value input value
 * @param {float} min minimum bounds
 * @param {float} max maximum bounds
 * @returns {float} clamped value 
 */
function float_uclamp(value = 0.0, min = 0.0, max = 0.0) {
  return +Math.min(+Math.max(+value, +min), +max);
}

function float_inRange(value = 0.0, min = 0.0, max = 0.0) {
  return +(+value >= +Math.min(+min, +max) && +value <= +Math.max(+min, +max));
}

function float_rangeIntersect(smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +(+Math.max(+smin, +smax) >= +Math.min(+dmin, +dmax) && 
       +Math.min(+smin, +smax) <= +Math.max(+dmin, +dmax));
}

function float_rectIntersect(ax = 0.0, ay = 0.0, aw = 0.0, ah = 0.0, bx = 0.0, by = 0.0, bw = 0.0, bh = 0.0) {
  return +(+(+float_rangeIntersect(+ax, +(+ax + +aw), +bx, +(+bx + +bw)) > 0.0 &&
       +float_rangeIntersect(+ay, +(+ay + +ah), +by, +(+by + +bh)) > 0.0) > 0.0);
}


function float_mag2(dx = 0.0, dy = 0.0) {
  return +(+(+dx * +dx) + +(+dy * +dy));
}

function float_hypot(dx = 0.0, dy = 0.0) {
  return +Math.sqrt(+(+(+dx * +dx) + +(+dy * +dy)));
}

/**
 * 
 * We can calculate the Dot Product of two vectors this way:
 * 
 *    a · b = |a| × |b| × cos(θ)
 * 
 * or in this implementation as:
 * 
 *    a · b = ax × bx + ay × by
 * 
 * When two vectors are at right angles to each other the dot product is zero.
 * 
 * @param {float} ax vector A x velocity 
 * @param {float} ay vector A y velocity
 * @param {float} bx vector B x velocity
 * @param {float} by vector B y velocity
 * @returns {float} scalar of the dot product
 */
function float_dot(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
  return +(+(+ax * +bx) + +(+ay * +by));
}

/**
 * 
 * The Cross Product Magnitude
 * a × b of two vectors is another vector that is at right angles to both:
 * The magnitude (length) of the cross product equals the area of a parallelogram with vectors a and b for sides:
 * 
 * We can calculate the Cross Product this way:
 * 
 *    a × b = |a| |b| sin(θ) n
 * 
 * or as
 * 
 *    a × b = ax × by - bx × ay 
 * 
 * Another useful property of the cross product is,
 * that its magnitude is related to the sine of
 * the angle between the two vectors:
 *  
 *    | a x b | = |a| . |b| . sine(theta)
 *
 * or
 *
 *    sine(theta) = | a x b | / (|a| . |b|)
 *
 * So, in implementation 1 above, if a and b are known in advance to be unit vectors then the result of that function is exactly that sine() value.
 * @param {float} ax 
 * @param {float} ay 
 * @param {float} bx 
 * @param {float} by 
 */
function float_cross(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
  return +(+(+ax * +by) - +(+bx * +ay));
}

//#region trigonometry

Math.PIx2 = Math.PI * 2; // 6.28318531
Math.PIh = Math.PI / 2; // 1.57079632
Math.PI_1 = 4 / Math.PI; // 1.27323954
Math.PI_2 = 4 / (Math.PI * Math.PI); // 0.405284735

function float_toRadian(degrees = 0.0) {
  return +(+degrees * +Math.PI / 180.0);
}

function float_toDegrees(radians = 0.0) {
  return +(+radians * 180.0 / +Math.PI);
}

function float_wrapRadians(r = 0.0) {
  if (+r > Math.PI) return +(+r - +Math.PIx2);
  else if (+r < -Math.PI) return +(+r + +Math.PIx2);
  return +r;
}

function float_sinLpEx(r = 0.0) {
  r = +r;
  return +((r < 0.0)
    ? +(+Math.PI_1 * +r + +Math.PI_2 * +r * +r)
    : +(+Math.PI_1 * +r - +Math.PI_2 * +r * +r));
}

function float_sinLp(r = 0.0) {
  //always wrap input angle between -PI and PI
  return +float_sinLpEx(+float_wrapRadians(+r));
}

function float_cosLp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float_sinLp(+(+r + +Math.PIh));
}

function float_sinMpEx(r = 0.0) {
  r = +r;
  const sin = +((r < 0.0)
    ? +(Math.PI_1 * r + Math.PI_2 * r * r)
    : +(Math.PI_1 * r - Math.PI_2 * r * r));
  return +((sin < 0.0)
    ? +(0.225 * (sin * -sin - sin) + sin)
    : +(0.225 * (sin *  sin - sin) + sin));
}

function float_sinMp(r = 0.0) {
  return +float_sinHpEx(+float_wrapRadians(+r));
}
function float_cosMp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +float_sinHp(+(+r + +Math.PIh));
}

//#endregion

var Float = /*#__PURE__*/Object.freeze({
  float_norm: float_norm,
  float_lerp: float_lerp,
  float_map: float_map,
  float_clamp: float_clamp,
  float_uclamp: float_uclamp,
  float_inRange: float_inRange,
  float_rangeIntersect: float_rangeIntersect,
  float_rectIntersect: float_rectIntersect,
  float_mag2: float_mag2,
  float_hypot: float_hypot,
  float_dot: float_dot,
  float_cross: float_cross,
  float_toRadian: float_toRadian,
  float_toDegrees: float_toDegrees,
  float_wrapRadians: float_wrapRadians,
  float_sinLpEx: float_sinLpEx,
  float_sinLp: float_sinLp,
  float_cosLp: float_cosLp,
  float_sinMpEx: float_sinMpEx,
  float_sinMp: float_sinMp,
  float_cosMp: float_cosMp
});

const def_vec3f = Object.seal({ x: 0.0, y: 0.0, z: 0.0 });

function vec3f(x = 0.0, y = 0.0 , z = 0.0) {
  return { x: +x, y: +y, z: +z };
}

function vec3f_toVec2(v = def_vec3f) {
  return { x: +v.x, y: +v.y };
}

function vec3f_fromVec2(v = def_vec2f) {
  return { x: +v.x, y: +v.y, z: 0.0 };
}

function vec3f_dub(v = def_vec3f) {
  return { x: +v.x, y: +v.y, z: +v.z };
}

//#region div

function vec3f_div(a = def_vec3f, b = def_vec3f) {
  return {
    x: +(+a.x / +b.x),
    y: +(+a.y / +b.y),
    z: +(+a.z / +b.z),
  }  
}
function vec3f_divScalar(v = def_vec3f, scalar = 0.0) {
  return {
    x: +(+v.x / +scalar),
    y: +(+v.y / +scalar),
    z: +(+v.z / +scalar),
  }
}

function vec3f_idiv(a = def_vec3f, b = def_vec3f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  a.z /= +(+b.z);
  return a;
}
function vec3f_idivScalar(v = def_vec3f, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  v.z /= +scalar;
  return v;
}

//#endregion

//#region magnitude and normalize

function vec3f_mag2(v = def_vec3f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y) + +(+v.z * +v.z));
}

function vec3f_mag(v = def_vec3f) {
  return +Math.sqrt(+vec3f_mag2(v));
}
function vec3f_norm(v = def_vec3f) {
  return vec3f_divScalar(v, +vec3f_mag(v));
}
function vec3f_inorm(v = def_vec3f) {
  return vec2f_idivScalar(v, +vec3f_mag(v));
}

//#endregion

function vec3f_crossABAB(a = def_vec3f, b = def_vec3f
  ) {
  return {
    x: +(+(+a.y * +b.z) - +(+a.z * +b.y)),
    y: +(+(+a.z * +b.x) - +(+a.x * +b.z)),
    z: +(+(+a.x * +b.y) - +(+a.y * +b.x)),
  }
}

var vec3f$1 = /*#__PURE__*/Object.freeze({
  def_vec3f: def_vec3f,
  vec3f: vec3f,
  vec3f_toVec2: vec3f_toVec2,
  vec3f_fromVec2: vec3f_fromVec2,
  vec3f_dub: vec3f_dub,
  vec3f_div: vec3f_div,
  vec3f_divScalar: vec3f_divScalar,
  vec3f_idiv: vec3f_idiv,
  vec3f_idivScalar: vec3f_idivScalar,
  vec3f_mag2: vec3f_mag2,
  vec3f_mag: vec3f_mag,
  vec3f_norm: vec3f_norm,
  vec3f_inorm: vec3f_inorm,
  vec3f_crossABAB: vec3f_crossABAB
});

const def_vec2f = Object.seal({ x: 0.0, y: 0.0 });

function vec2f(x = 0.0, y = 0.0) { return { x: +x, y: +y } }
//#region neg

function vec2f_neg(v = def_vec2f) {
  return {
    x: +(-(+v.x)),
    y: +(-(+v.y)),
  }
}
function vec2f_ineg(v = def_vec2f) {
  v.x = +(-(+v.x));
  v.y = +(-(+v.y));
  return v;
}

//#endregion

//#region add

function vec2f_add(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x + +b.x),
    y: +(+a.y + +b.y),
  }
}
function vec2f_addScalar(v = def_vec2f, scalar = 0.0) {
  return {
    x: +(+v.x + +scalar),
    y: +(+v.y + +scalar),
  }
}
function vec2f_iadd(a = def_vec2f, b = def_vec2f) {
  a.x += +(+b.x);
  a.y += +(+b.y);
  return a;
}
function vec2f_iaddScalar(v = def_vec2f, scalar = 0.0) {
  v.x += +scalar;
  v.y += +scalar;
  return v;
}

//#endregion

//#region sub

function vec2f_sub(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x - +b.x),
    y: +(+a.y - +b.y),
  }
}
function vec2f_subScalar(a = def_vec2f, scalar = 0.0) {
  return {
    x: +(+a.x - +scalar),
    y: +(+a.y - +scalar),
  }
}
function vec2f_isub(a = def_vec2f, b = def_vec2f) {
  a.x -= +(+b.x);
  a.y -= +(+b.y);
  return a;
}
function vec2f_isubScalar(v = def_vec2f, scalar = 0.0) {
  v.x -= +scalar;
  v.y -= +scalar;
  return v;
}

//#endregion

//#region mul

function vec2f_mul(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x * +b.x),
    y: +(+a.y * +b.y),
  }
}
function vec2f_mulScalar(v = def_vec2f, scalar = 0.0) {
  return {
    x: +(+v.x * +scalar),
    y: +(+v.y * +scalar),
  }
}
function vec2f_imul(a = def_vec2f, b = def_vec2f) {
  a.x *= +(+b.x);
  a.y *= +(+b.y);
  return a;
}
function vec2f_imulScalar(v = def_vec2f, scalar = 0.0) {
  v.x *= +scalar;
  v.y *= +scalar;
  return v;
}

//#endregion

//#region div

function vec2f_div(a = def_vec2f, b = def_vec2f) {
  return {
    x: +(+a.x / +b.x),
    y: +(+a.y / +b.y),
  }  
}
function vec2f_divScalar(v = def_vec2f, scalar = 0.0) {
  return {
    x: +(+v.x / +scalar),
    y: +(+v.y / +scalar),
  }
}

function vec2f_idiv(a = def_vec2f, b = def_vec2f) {
  a.x /= +(+b.x);
  a.y /= +(+b.y);
  return a;
}
function vec2f_idivScalar$1(v = def_vec2f, scalar = 0.0) {
  v.x /= +scalar;
  v.y /= +scalar;
  return v;
}


//#endregion

//#region mag2, dot and cross products

function vec2f_mag2(v = def_vec2f) {
  return +(+(+v.x * +v.x) + +(+v.y * +v.y));
}
function vec2f_dot(a = def_vec2f, b = def_vec2f) {
  return +(+(+a.x * +b.x) + +(+a.y * +b.y));
}

/**
 * Returns the cross-product of two vectors
 *
 * @param {vec2f} vector A 
 * @param {vec2f} vector B
 * @returns {double} The cross product of two vectors
 */
function vec2f_cross(a = def_vec2f, b = def_vec2f) {
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
function vec2f_cross3(a = def_vec2f, b = def_vec2f, c = def_vec2f) {
  return +(
    +(+(+b.x - +a.x) * +(+c.y - +a.y)) -
    +(+(+b.y - +a.y) * +(+c.x - +a.x)) );
}

//#endregion

//#region magnitude and normalize

function vec2f_mag(v = def_vec2f) {
  return +Math.sqrt(+vec2f_mag2(v));
}
function vec2f_norm(v = def_vec2f) {
  return vec2f_divScalar(v, +vec2f_mag(v));
}
function vec2f_inorm(v = def_vec2f) {
  return vec2f_idivScalar$1(v, +vec2f_mag(v));
}

//#endregion

//#region rotation

function vec2f_angle(v = def_vec2f) {
  return +Math.atan2(+v.y, +v.x);
}

function vec2f_rotn90(v = def_vec2f) {
  return {
    x: +(+v.y),
    y: +(-(+v.x)),
  };
}
function vec2f_irotn90(v = def_vec2f) {
  const t = +v.x;
  v.x = +(+v.y);
  v.y = +(-(+t));
  return v;
}

function vec2f_rot90(v = def_vec2f) {
  return {
    x: +(-(+v.y)),
    y: +(+v.x),
  };
}
const vec2f_perp = vec2f_rot90;

function vec2f_irot90(v = def_vec2f) {
  const t = +v.y;
  v.x = +(-(+t));
  v.y = +(+v.x);
  return v;
}
const vec2f_iperp = vec2f_irot90;

/**
 * Rotates a vector by the specified angle in radians
 * 
 * @param {vec2f} v vector 
 * @param {float} r  angle in radians
 * @returns {vec2f} transformed output vector
 */
function vec2f_rotate(v = def_vec2f, r = 0.0) {
  return {
    x: +(+(+v.x * +Math.cos(+r)) - +(+v.y * +Math.sin(+r))),
    y: +(+(+v.x * +Math.sin(+r)) + +(+v.y * +Math.cos(+r))),
  }
}
function vec2f_irotate(v = def_vec2f, r = 0.0) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+(+vx * +Math.cos(+r)) - +(+vy * +Math.sin(+r)));
  v.y = +(+(+vx * +Math.sin(+r)) + +(+vy * +Math.cos(+r)));
  return v;
}

function vec2f_rotateAbout(v = def_vec2f, r = 0.0, p = def_vec2f) {
  return {
    x: +(+p.x + +(+(+v.x - +p.x) * +Math.cos(+r)) - +(+(+v.y - +p.y) * +Math.sin(+r))),
    y: +(+p.y + +(+(+v.x - +p.x) * +Math.sin(+r)) + +(+(+v.y - +p.y) * +Math.cos(+r))),
  }
}
function vec2f_irotateAbout(v = def_vec2f, r = 0.0, p = def_vec2f) {
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
function vec2f_rotateEx(v = def_vec2f, r = 0.0, sin = Math.sin, cos = Math.cos) {
  return {
    x: +(+(+v.x * +cos(+r)) - +(+v.y * +sin(+r))),
    y: +(+(+v.x * +sin(+r)) + +(+v.y * +cos(+r))),
  }
}
function vec2f_irotateEx(v = def_vec2f, r = 0.0, sin = Math.sin, cos = Math.cos) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+(+vx * +cos(+r)) - +(+vy * +sin(+r)));
  v.y = +(+(+vx * +sin(+r)) + +(+vy * +cos(+r)));
  return v;
}

function vec2f_rotateAboutEx(v = def_vec2f, r = 0.0, p = def_vec2f, sin = Math.sin, cos = Math.cos) {
  return {
    x: +(+p.x + +(+(+v.x - +p.x) * +cos(+r)) - +(+(+v.y - +p.y) * +sin(+r))),
    y: +(+p.y + +(+(+v.x - +p.x) * +sin(+r)) + +(+(+v.y - +p.y) * +cos(+r))),
  }
}
function vec2f_irotateAboutEx(v = def_vec2f, r = 0.0, p = def_vec2f, sin = Math.sin, cos = Math.cos) {
  const vx = +v.x;
  const vy = +v.y;
  v.x = +(+p.x + +(+(+vx - +p.x) * +cos(+r)) - +(+(+vy - +p.y) * +sin(+r)));
  v.y = +(+p.y + +(+(+vx - +p.x) * +sin(+r)) + +(+(+vy - +p.y) * +cos(+r)));
  return v;
}

//#endregion

var vec2f$1 = /*#__PURE__*/Object.freeze({
  def_vec2f: def_vec2f,
  vec2f: vec2f,
  vec2f_neg: vec2f_neg,
  vec2f_ineg: vec2f_ineg,
  vec2f_add: vec2f_add,
  vec2f_addScalar: vec2f_addScalar,
  vec2f_iadd: vec2f_iadd,
  vec2f_iaddScalar: vec2f_iaddScalar,
  vec2f_sub: vec2f_sub,
  vec2f_subScalar: vec2f_subScalar,
  vec2f_isub: vec2f_isub,
  vec2f_isubScalar: vec2f_isubScalar,
  vec2f_mul: vec2f_mul,
  vec2f_mulScalar: vec2f_mulScalar,
  vec2f_imul: vec2f_imul,
  vec2f_imulScalar: vec2f_imulScalar,
  vec2f_div: vec2f_div,
  vec2f_divScalar: vec2f_divScalar,
  vec2f_idiv: vec2f_idiv,
  vec2f_idivScalar: vec2f_idivScalar$1,
  vec2f_mag2: vec2f_mag2,
  vec2f_dot: vec2f_dot,
  vec2f_cross: vec2f_cross,
  vec2f_cross3: vec2f_cross3,
  vec2f_mag: vec2f_mag,
  vec2f_norm: vec2f_norm,
  vec2f_inorm: vec2f_inorm,
  vec2f_angle: vec2f_angle,
  vec2f_rotn90: vec2f_rotn90,
  vec2f_irotn90: vec2f_irotn90,
  vec2f_rot90: vec2f_rot90,
  vec2f_perp: vec2f_perp,
  vec2f_irot90: vec2f_irot90,
  vec2f_iperp: vec2f_iperp,
  vec2f_rotate: vec2f_rotate,
  vec2f_irotate: vec2f_irotate,
  vec2f_rotateAbout: vec2f_rotateAbout,
  vec2f_irotateAbout: vec2f_irotateAbout,
  vec2f_rotateEx: vec2f_rotateEx,
  vec2f_irotateEx: vec2f_irotateEx,
  vec2f_rotateAboutEx: vec2f_rotateAboutEx,
  vec2f_irotateAboutEx: vec2f_irotateAboutEx
});

var index = {
  ...Float,
  ...vec2f$1,
  ...vec3f$1
};

export default index;
