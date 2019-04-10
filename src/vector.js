export const def_vec2i = Object.seal({ x: 0, y: 0 });
export const def_vec2f = Object.seal({ x: 0.0, y: 0.0 });
export const def_vec3f = Object.seal({ x: 0.0, y: 0.0, z: 0.0 });


/**
 * just some notes
 * 
 * 
const fastSin_B = 1.2732395; // 4/pi
const fastSin_C = -0.40528473; // -4 / (pi²)
export function fastSin(value) {
  // See  for graph and equations
  // https://www.desmos.com/calculator/8nkxlrmp7a
  // logic explained here : http://devmaster.net/posts/9648/fast-and-accurate-sine-cosine			
      
  return (value > 0)
    ? fastSin_B * value - fastSin_C * value * value
    : fastSin_B * value + fastSin_C * value * value;
}

export function fastSin2(a) {
  let b, c;
  return a *= 5214
    , c = a << 17
    , a -= 8192
    , a <<= 18
    , a >>= 18
    , a = a * a >> 12
    , b = 19900 - (3516 * a >> 14)
    , b = 4096 - (a * b >> 16)
    , 0 > c && (b = -b)
    , 2.44E-4 * b;
};
  
export function fastSin3(a) {
  a *= 5214;
  let b = a << 17;
  a = a - 8192 << 18 >> 18;
  a = a * a >> 12;
  a = 4096 - (a * (19900 - (3516 * a >> 14)) >> 16);
  0 > b && (a = -a);
  return 2.44E-4 * a
};


 */