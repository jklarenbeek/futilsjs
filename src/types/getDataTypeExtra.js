import {
  isArrayishType,
} from './isDataType';

import {
  isBoolOrNumber,
  isBoolOrArray,
  isBoolOrObject,
  isStringOrArray,
  isStringOrObject,
} from './isDataTypeExtra';

export function getBoolOrNumber(obj, def = undefined) {
  return isBoolOrNumber(obj) ? obj : def;
}

export function getBoolOrArray(obj, def) {
  return isBoolOrArray(obj) ? obj : def;
}

export function getBoolOrObject(obj, def) {
  return isBoolOrObject(obj) ? obj : def;
}

export function getStringOrObject(obj, def) {
  return isStringOrObject(obj) ? obj : def;
}

export function getStringOrArray(obj, def) {
  return isStringOrArray(obj) ? obj : def;
}

export function getArrayOrSetLength(data) {
  return data.constructor === Set
    ? data.size
    : isArrayishType(data)
      ? data.length
      : 0;
}

export function getArrayMinItems(obj, len, def) {
  return isArrayishType(obj) && obj.length >= len
    ? obj
    : def;
}
