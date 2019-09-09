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
  isDateType,
} from './core';

import {
  getUniqueArray,
} from './arrays';

//#region scalar types
export function getScalarNormalised(value, defaultValue = undefined, nullable = false) {
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

export function getBoolishType(obj, def = undefined) {
  return obj === true || obj === 'true'
    ? true
    : obj === false || obj === 'false'
      ? false
      : def;
}

export function getNumberType(obj, def = undefined) {
  return isNumberType(obj) ? obj : def;
}

export function getNumbishType(obj, def = undefined) {
  return isNumbishType(obj) ? Number(obj) : def;
}

export function getNumberExclusiveBound(inclusive, exclusive) {
  const includes = isBigIntType(inclusive)
    ? inclusive
    : getNumbishType(inclusive);
  const excludes = exclusive === true
    ? includes
    : isBigIntType(exclusive)
      ? exclusive
      : getNumbishType(exclusive);
  return (excludes !== undefined)
    ? [undefined, excludes]
    : [includes, undefined];
}

export function getIntegerType(obj, def = undefined) {
  return isIntegerType(obj) ? obj : def;
}

export function getIntishType(obj, def = undefined) {
  return isIntishType(obj) ? Number(obj) : def;
}

export function getStringType(obj, def = undefined) {
  return isStringType(obj) ? obj : def;
}

export function getBigIntType(obj, def = undefined) {
  return isBigIntType(obj) ? obj : def;
}

export function getBigIntishType(obj, def = undefined) {
  return isBigIntType(obj)
    ? obj
    : getIntishType(obj, def);
}

export function getDateishType(obj, def = undefined) {
  return isDateType(obj)
    ? obj
    : Number.isNaN(Date.parse(obj))
      ? def
      : new Date(Date.parse(obj));
}

export function getDateishExclusiveBound(inclusive, exclusive) {
  const includes = getDateishType(inclusive);
  const excludes = exclusive === true
    ? includes
    : getDateishType(exclusive);
  return (excludes !== undefined)
    ? [undefined, excludes]
    : [includes, undefined];
}
//#endregion

//#region array and set types
export function getArrayType(obj, def = undefined) {
  return isArrayType(obj) ? obj : def;
}

export function getArrayTypeMinItems(obj, len, def = undefined) {
  return (isArrayType(obj) && obj.length >= len && obj) || def;
}

export function getArrayTyped(obj, def = undefined) {
  return isArrayTyped(obj) ? obj : def;
}

export function getArrayTypedMinItems(obj, len, def = undefined) {
  return (isArrayTyped(obj) && obj.length >= len && obj) || def;
}

export function getSetType(obj, def = undefined) {
  return isSetType(obj) ? obj : def;
}

export function getSetTypeOfArray(obj, def = undefined) {
  return isSetType(obj)
    ? obj
    : isArrayType(obj)
      ? new Set(obj)
      : def;
}

export function getArrayTypeOfSet(obj, def = undefined) {
  return isArrayType(obj)
    ? getUniqueArray(obj)
    : isSetType(obj)
      ? Array.from(obj)
      : def;
}

export function getArrayOrSetType(obj, def = undefined) {
  return isArrayType(obj) || isSetType(obj)
    ? obj
    : def;
}

export function getArrayOrSetTypeLength(obj = undefined) {
  return isSetType(obj)
    ? obj.size
    : isArrayType(obj)
      ? obj.length
      : 0;
}

export function getArrayOrSetTypeMinItems(obj, len, def = undefined) {
  return getArrayOrSetTypeLength(obj) >= len
    ? obj
    : def;
}

export function getArrayOrSetTypeUnique(obj, def = undefined) {
  return isArrayType(obj)
    ? getUniqueArray(obj)
    : isSetType(obj)
      ? obj
      : def;
}

//#endregion

//#region object and map types
export function getObjectType(obj, def = undefined) {
  return isObjectType(obj) ? obj : def;
}

export function getObjectTyped(obj, def = undefined) {
  return isObjectTyped(obj) ? obj : def;
}

export function getMapType(obj, def = undefined) {
  return isMapType(obj) ? obj : def;
}

export function getMapTypeOfArray(obj, def = undefined) {
  return isMapType(obj)
    ? obj
    : isArrayType(obj)
      ? new Map(obj)
      : def;
}

export function getObjectOrMapType(obj, def = undefined) {
  return isObjectOrMapType(obj) ? obj : def;
}

export function getObjectOrMapTyped(obj, def = undefined) {
  return isObjectOrMapTyped(obj) ? obj : def;
}

//#endregion

//#region mixed types
export function getBoolOrNumbishType(obj, def = undefined) {
  return isBoolOrNumbishType(obj) ? obj : def;
}

export function getBoolOrArrayTyped(obj, def = undefined) {
  return isBoolOrArrayTyped(obj) ? obj : def;
}

export function getBoolOrObjectType(obj, def = undefined) {
  return isBoolOrObjectType(obj) ? obj : def;
}

export function getStringOrObjectType(obj, def = undefined) {
  return isStringOrObjectType(obj) ? obj : def;
}

export function getStringOrArrayTyped(obj, def = undefined) {
  return isStringOrArrayTyped(obj) ? obj : def;
}

export function getStringOrArrayTypedUnique(obj, def = undefined) {
  return isStringType(obj)
    ? obj
    : isArrayTyped(obj)
      ? getUniqueArray(obj)
      : def;
}
//#endregion
