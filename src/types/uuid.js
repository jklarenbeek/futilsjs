
let random_seed = Math.random() * Number.MAX_SAFE_INTEGER;
const random_precision = 10000 + Math.random() * 10000;
export function random() {
  const x = Math.sin(random_seed++) * random_precision;
  return x - Math.floor(x);
}

const uuid1_formatStr = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
const uuid1_formatLen = uuid1_formatStr.split(/[xy]/).length;
const uuid1_dec2hex = '0123456789ABCDEF';

export function uuid1_v1() {
  return uuid1_formatStr.replace(/[xy]/g,
    function uuid1Replace(c) {
      const r = random() * 16 | 0;
      const v = c === 'x'
        ? r
        : (r & 0x3 | 0x8);
      return uuid1_dec2hex[v];
    });
}

export function uuid1_v2() {
  const nums = window.crypto.getRandomValues(
    new Uint8Array(uuid1_formatLen - 1),
  );

  let i = 0;
  return uuid1_formatStr.replace(/[xy]/g,
    function uuid2Replace(c) {
      const r = nums[i] % 16;
      const v = (c === 'x')
        ? r
        : (r & 0x3 | 0x8);
      ++i;
      return uuid1_dec2hex[v];
    });
}

export function uuid1_v4() {
  let result = '';
  for (let i = 1; i <= 36; ++i) {
    switch (i) {
      case 9: case 14: case 19: case 24:
        result += '-';
        break;
      case 15:
        result += '4';
        break;
      case 20:
        result += uuid1_dec2hex[(random()*4|0 + 8)];
        break;
      default:
        result += uuid1_dec2hex[(random()*15|0)];
        break;
    }
  }
  return result;
}

export const uuid1 = uuid1_v4;
