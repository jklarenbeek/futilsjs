import {
  String_createRegExp,
} from "../helpers/String";

//#region core
export function isFnEx(typeString) {
  return typeString === 'function';
}

export function isFn(obj) {
  return typeof obj === 'function';
}

export function isScalarType(data) {
  return data != null && typeof data !== 'object' && typeof data !== 'function';
}

export function isComplexType(data) {
  return data != null && typeof data === 'object';
}

export function isNullValue(data) {
  return data !== undefined && data === null;
}

export function isObjectOfType(data, type) {
  return data != null && data.constructor === type;
}
//#endregion

//#region scalars
export function isBooleanType(data) {
  return data === true || data === false;
}

export function isBoolishType(data) {
  return data === true
    || data === false
    || data === 'true'
    || data === 'false';
}

export function isNumberType(data) {
  return typeof data === 'number';
}

export function isNumbishType(data) {
  return !Number.isNaN(Number(data));
}

export function isIntegerType(data) {
  return Number.isInteger(data);
}

export function isIntishType(data) {
  return Number.isInteger(Number(data));
}

export function isBigIntType(data) {
  return typeof data === 'bigint';
}

export function isBigIntishType(data) {
  return isBigIntType(data)
    || isIntishType(data);
}

export function isStringType(data) {
  return typeof data === 'string';
}
//#endregion

//#region array and set
export function isArrayType(data) {
  return isObjectOfType(data, Array);
}

export function isTypedArray(data) {
  return data != null
    && (data.constructor === Int8Array
      || data.constructor === Uint8Array
      || data.constructor === Uint8ClampedArray
      || data.constructor === Int16Array
      || data.constructor === Uint16Array
      || data.constructor === Int32Array
      || data.constructor === Uint32Array
      // eslint-disable-next-line no-undef
      || data.constructor === BigInt64Array
      // eslint-disable-next-line no-undef
      || data.constructor === BigUint64Array);
}

export function isArrayTyped(data) {
  return isArrayType(data)
      || isTypedArray(data);
}

export function isSetType(data) {
  return isObjectOfType(data, Set);
}

export function isArrayOrSetType(data) {
  return data != null
    && (data.constructor === Array
      || data.constructor === Set);
}

export function isArrayOrSetTyped(data) {
  return data != null
    && (data.constructor === Array
      || data.constructor === Set
      || isTypedArray(data));
}
//#endregion

//#region object and map
export function isObjectType(data) {
  return isComplexType(data)
    && !(data instanceof Array
      || data.constructor === Map
      || data.constructor === Set);
}

export function isObjectTyped(data) {
  return isObjectType(data)
    && !isTypedArray(data)
}

export function isMapType(data) {
  return isObjectOfType(data, Map);
}

export function isObjectOrMapType(data) {
  return isComplexType(data)
    && !(data instanceof Array
      || data.constructor === Set);
}

export function isObjectOrMapTyped(data) {
  return isComplexType(data)
    && !(data instanceof Array
      || data.constructor === Set
      || isTypedArray(data));
}

export function isRegExpType(data) {
  return isObjectOfType(data, RegExp);
}

export function isRegExpishType(data) {
  return isRegExp(data)
    || String_createRegExp(data) != null;
}
//#endregion

//#region mixed types
export function isBoolOrNumbishType(obj) {
  return isBooleanType(obj)
    || isNumbishType(obj);
}

export function isBoolOrArrayTyped(obj) {
  return isBooleanType(obj)
    || isArrayTyped(obj);
}

export function isStringOrArrayTyped(obj) {
  return isStringType(obj)
    || isArrayTyped(obj);
}

export function isBoolOrObjectType(obj) {
  return isBooleanType(obj)
    || isObjectType(obj);
}

export function isStringOrObjectType(obj) {
  return isStringType(obj)
    || isObjectType(obj);
}

export function isStringOrDateType(data) {
  return (data != null
    && (data.constructor === String
      || data.constructor === Date));
}
//#endregion
