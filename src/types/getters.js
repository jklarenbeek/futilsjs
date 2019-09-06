import {
  isScalarType,
  isBooleanType,
  isNumberType,
  isNumbishType,
  isIntegerType,
  isIntishType,
  isStringType,
  isObjectType,
  isObjectTyped,
  isArrayType,
  isArrayTyped,
  isSetType,
  isBoolOrNumbishType,
  isBoolOrArrayTyped,
  isBoolOrObjectType,
  isStringOrObjectType,
  isStringOrArrayTyped,
  isMapType,
  isObjectOrMapType,
  isObjectOrMapTyped,
  isBigIntType,
} from './core';

import {
  getUniqueArray,
} from './arrays';

//#region scalar types
export function getSanitizedScalar(value, defaultValue = undefined, nullable = false) {
  return value == null
    ? nullable
      ? value
      : defaultValue
    : isScalarType(value)
      ? value
      : defaultValue;
}

export function getBooleanType(obj, def = undefined) {
  return isBooleanType(obj) ? obj : def;
}

export function getBoolishType(obj, def) {
  return obj === true || obj === 'true'
    ? true
    : obj === false || obj === 'false'
      ? false
      : def;
}

export function getNumberType(obj, def) {
  return isNumberType(obj) ? obj : def;
}

export function getNumbishType(obj, def) {
  return isNumbishType(obj) ? Number(obj) : def;
}

export function getIntegerType(obj, def = undefined) {
  return isIntegerType(obj) ? obj : def;
}

export function getIntishType(obj, def) {
  return isIntishType(obj) ? Number(obj) : def;
}

export function getStringType(obj, def) {
  return isStringType(obj) ? obj : def;
}

export function getBigIntType(obj, def) {
  return isBigIntType(obj) ? obj : def;
}

export function getBigIntishType(obj, def) {
  return isBigIntType(obj)
    ? obj
    : getIntishType(obj, def);
}
//#endregion

//#region array and set types
export function getArrayType(obj, def) {
  return isArrayType(obj) ? obj : def;
}

export function getArrayTypeMinItems(obj, len, def) {
  return isArrayType(obj) && obj.length >= len
    ? obj
    : def;
}

export function getArrayTyped(obj, def) {
  return isArrayTyped(obj) ? obj : def;
}

export function getArrayTypedMinItems(obj, len, def) {
  return isArrayTyped(obj) && obj.length >= len
    ? obj
    : def;
}

export function getSetType(obj, def) {
  return isSetType(obj) ? obj : def;
}

export function getArrayOrSetType(obj, def) {
  return isArrayType(obj) || isSetType(obj)
    ? obj
    : def;
}

export function getArrayOrSetTypeLength(obj) {
  return isSetType(obj)
    ? obj.size
    : isArrayType(obj)
      ? obj.length
      : 0;
}

export function getArrayOrSetTypeMinItems(obj, len, def) {
  return getArrayOrSetTypeLength(obj) >= len
    ? obj
    : def;
}

export function getArrayOrSetTypeUnique(obj, def) {
  return isArrayType(obj)
    ? getUniqueArray(obj)
    : isSetType(obj)
      ? obj
      : def;
}

export function getArrayOfSetType(obj, def) {
  return isArrayType(obj)
    ? getUniqueArray(obj)
    : isSetType(obj)
      ? Array.from(obj)
      : def;
}

//#endregion

//#region object and map types
export function getObjectType(obj, def) {
  return isObjectType(obj) ? obj : def;
}

export function getObjectTyped(obj, def) {
  return isObjectTyped(obj) ? obj : def;
}

export function getMapType(obj, def) {
  return isMapType(obj) ? obj : def;
}

export function getObjectOrMapType(obj, def) {
  return isObjectOrMapType(obj) ? obj : def;
}

export function getObjectOrMapTyped(obj, def) {
  return isObjectOrMapTyped(obj) ? obj : def;
}

export function getMapOfArrayType(obj, def) {
  return isMapType(obj)
    ? obj
    : isArrayType(obj)
      ? new Map(obj)
      : def;
}

//#endregion

//#region mixed types
export function getBoolOrNumbishType(obj, def) {
  return isBoolOrNumbishType(obj) ? obj : def;
}

export function getBoolOrArrayTyped(obj, def) {
  return isBoolOrArrayTyped(obj) ? obj : def;
}

export function getBoolOrObjectType(obj, def) {
  return isBoolOrObjectType(obj) ? obj : def;
}

export function getStringOrObjectType(obj, def) {
  return isStringOrObjectType(obj) ? obj : def;
}

export function getStringOrArrayTyped(obj, def) {
  return isStringOrArrayTyped(obj) ? obj : def;
}

export function getStringOrArrayTypedUnique(obj, def) {
  return isStringType(obj)
    ? obj
    : isArrayTyped(obj)
      ? getUniqueArray(obj)
      : def;
}
