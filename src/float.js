
export function Float_norm(value = 0.0, min = 0.0, max = 0.0) {
  return +(+(+value - +min) / +(+max - +min));
}

export function Float_lerp(norm = 0.0, min = 0.0, max = 0.0) {
  return +(+(+max - +min) * +(+norm + +min));
}

export function Float_map(value = 0.0, smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +Float_lerp(+Float_norm(+value, +smin, +smax), +dmin, +dmax);
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
export function Float_clamp(value = 0.0, min = 0.0, max = 0.0) {
  return +Math.min(+Math.max(+value, +Math.min(+min, +max)), +Math.max(+min, +max));
}
/**
 * Clamps a value between an unchecked boundary
 * this function needs min < max!!
 * (see Float_clamp for a checked boundary)
 * 
 * @param {float} value input value
 * @param {float} min minimum bounds
 * @param {float} max maximum bounds
 * @returns {float} clamped value 
 */
export function Float_uclamp(value = 0.0, min = 0.0, max = 0.0) {
  return +Math.min(+Math.max(+value, +min), +max);
}

export function Float_inRange(value = 0.0, min = 0.0, max = 0.0) {
  return +(+value >= +Math.min(+min, +max) && +value <= +Math.max(+min, +max));
}

export function Float_rangeIntersect(smin = 0.0, smax = 0.0, dmin = 0.0, dmax = 0.0) {
  return +(+Math.max(+smin, +smax) >= +Math.min(+dmin, +dmax) && 
       +Math.min(+smin, +smax) <= +Math.max(+dmin, +dmax));
}

export function Float_rectIntersect(ax = 0.0, ay = 0.0, aw = 0.0, ah = 0.0, bx = 0.0, by = 0.0, bw = 0.0, bh = 0.0) {
  return +(+(+Float_rangeIntersect(+ax, +(+ax + +aw), +bx, +(+bx + +bw)) > 0.0 &&
       +Float_rangeIntersect(+ay, +(+ay + +ah), +by, +(+by + +bh)) > 0.0) > 0.0);
}


export function Float_mag2(dx = 0.0, dy = 0.0) {
  return +(+(+dx * +dx) + +(+dy * +dy));
}

export function Float_hypot(dx = 0.0, dy = 0.0) {
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
export function Float_dot(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
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
export function Float_cross(ax = 0.0, ay = 0.0, bx = 0.0, by = 0.0) {
  return +(+(+ax * +by) - +(+bx * +ay));
}

//#region trigonometry

Math.PIx2 = Math.PI * 2; // 6.28318531
Math.PIh = Math.PI / 2; // 1.57079632
Math.PI_1 = 4 / Math.PI; // 1.27323954
Math.PI_2 = 4 / (Math.PI * Math.PI); // 0.405284735

export function Float_toRadian(degrees = 0.0) {
  return +(+degrees * +Math.PI / 180.0);
}

export function Float_toDegrees(radians = 0.0) {
  return +(+radians * 180.0 / +Math.PI);
}

export function Float_wrapRadians(r = 0.0) {
  if (+r > Math.PI) return +(+r - +Math.PIx2);
  else if (+r < -Math.PI) return +(+r + +Math.PIx2);
  return +r;
}

export function Float_sinLpEx(r = 0.0) {
  r = +r;
  return +((r < 0.0)
    ? +(+Math.PI_1 * +r + +Math.PI_2 * +r * +r)
    : +(+Math.PI_1 * +r - +Math.PI_2 * +r * +r));
}

export function Float_sinLp(r = 0.0) {
  //always wrap input angle between -PI and PI
  return +Float_sinLpEx(+Float_wrapRadians(+r));
}

export function Float_cosLp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +Float_sinLp(+(+r + +Math.PIh));
}

export function Float_sinMpEx(r = 0.0) {
  r = +r;
  const sin = +((r < 0.0)
    ? +(Math.PI_1 * r + Math.PI_2 * r * r)
    : +(Math.PI_1 * r - Math.PI_2 * r * r));
  return +((sin < 0.0)
    ? +(0.225 * (sin * -sin - sin) + sin)
    : +(0.225 * (sin *  sin - sin) + sin));
}

export function Float_sinMp(r = 0.0) {
  return +Float_sinHpEx(+Float_wrapRadians(+r));
}
export function Float_cosMp(r = 0.0) {
  //compute cosine: sin(x + PI/2) = cos(x)
  return +Float_sinHp(+(+r + +Math.PIh));
}

//#endregion
