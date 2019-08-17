import { isArrayishType, isObjectishType } from './isDataType';

export function isBoolOrNumber(obj) {
  return (obj === true || obj === false)
    || (obj != null && obj.constructor === Number);
}

export function isBoolOrArray(obj) {
  return (obj === true || obj === false)
      || isArrayishType(obj);
}

export function isStringOrArray(obj) {
  return obj != null
    && (obj.constructor === String
      || isArrayishType(obj));
}

export function isBoolOrObject(obj) {
  return (obj === true || obj === false)
      || isObjectishType(obj);
}

export function isStringOrObject(obj) {
  return obj != null
    && (obj.constructor === String
      || isObjectishType(obj));
}
