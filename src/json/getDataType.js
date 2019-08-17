import {
  isStrictBooleanType,
  isStrictIntegerType,
  isStrictNumberType,
  isStrictStringType,
  isStrictArrayType,
  isStrictObjectType,
  isNumberishType,
  isIntegerishType,
  isObjectishType,
  isArrayishType,
} from './isDataType';

//#region strict
export function getStrictObject(obj, def) {
  return isStrictObjectType(obj) ? obj : def;
}

export function getStrictArray(obj, def) {
  return isStrictArrayType(obj) ? obj : def;
}

export function getStrictArrayMinItems(obj, len, def) {
  return isStrictArrayType(obj) && obj.length > len ? obj: def;
}

export function getStrictString(obj, def) {
  return isStrictStringType(obj) ? obj : def;
}

export function getStrictNumber(obj, def) {
  return isStrictNumberType(obj) ? obj : def; // TODO: performance check for isNaN and Number!!!
}

export function getStrictInteger(obj, def = undefined) {
  return isStrictIntegerType(obj) ? obj : def;
}

export function getStrictBoolean(obj, def = undefined) {
  return isStrictBooleanType(obj) ? obj : def;
}
//#endregion

//#region ishes
export function getObjectishType(obj, def) {
  return isObjectishType(obj) ? obj : def;
}

export function getArrayishType(obj, def) {
  return isArrayishType(obj) ? obj : def;
}

export function getNumberishType(obj, def) {
  return isNumberishType(obj) ? Number(obj) : def;
}

export function getIntegerishType(obj, def) {
  return isIntegerishType(obj) ? Number(obj) : def;
}

export function getBooleanishType(obj, def) {
  return obj === true || obj === 'true'
    ? true
    : obj === false || obj === 'false'
      ? false
      : def;
}
//#endregion
