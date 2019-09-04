import {
  isArrayishType, isStrictStringType, isStrictArrayType, isStrictObjectOfType,
} from './isDataType';

import {
  isBoolOrNumber,
  isBoolOrArray,
  isBoolOrObject,
  isStringOrArray,
  isStringOrObject,
} from './isDataTypeExtra';
import { Array_getUnique } from '../helpers/Array';

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

export function getArrayUnique(obj, def) {
  return isStrictArrayType(obj)
    ? Array_getUnique(obj)
    : isStrictObjectOfType(obj, Set)
      ? Array.from(obj)
      : def;
}

export function getStringOrArrayUnique(obj, def) {
  return isStrictStringType(obj)
    ? obj
    : isStrictArrayType(obj)
      ? Array_getUnique(obj)
      : isStrictObjectOfType(obj, Set)
        ? Array.from(obj)
        : def;
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

export function getMapOfArray(obj, def) {
  return isStrictObjectOfType(obj, Map)
    ? obj
    : isStrictArrayType(obj)
      ? new Map(obj)
      : def;
}
