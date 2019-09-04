import {
  isNumberishType,
  isArrayishType,
  isObjectishType,
} from './isDataType';

export function isBoolOrNumber(obj) {
  return (obj === true || obj === false)
    || (isNumberishType(obj));
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

export function isArrayOrSet(data) {
  return (data != null
    && (isArrayishType(data)
      || data.constructor === Set));
}

export function isMapOrObjectish(data) {
  return !(data == null
    || typeof data !== 'object'
    || data.constructor === Array
    || data.constructor === Set);
}

export function isStringOrDate(data) {
  return (data != null && (data.constructor === String || data.constructor === Date));
}
