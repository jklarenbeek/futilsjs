import { mathi32_round } from './int32-math';

export function isPrimitiveTypeEx(typeString) {
  return typeString === 'integer'
    || typeString === 'number'
    || typeString === 'string'
    || typeString === 'bigint'
    || typeString === 'boolean';
}

export function isPrimitiveType(obj) {
  const tp = typeof obj;
  return isPrimitiveTypeEx(tp);
}

export function sanitizePrimitiveValue(value, nullable, defaultValue = undefined) {
  if (nullable && value == null) return value;
  if (value == null) return defaultValue;
  return isPrimitiveType(value) ? value : defaultValue;
}

export function isPureNumber(obj) {
  return (Number(obj) || false) !== false;
}

export function isPureString(obj) {
  return obj != null && obj.constructor === String;
}

export function isPureObject(obj) {
  return (typeof obj === 'object' && obj.constructor !== Array);
}

export function isPureArray(obj) {
  return (obj != null && obj.constructor === Array);
}

export function isPureTypedArray(obj) {
  return (obj != null
    && (obj.constructor === Int8Array
      || obj.constructor === Int16Array
      || obj.constructor === Int32Array
      //|| obj.constructor === BigInt64Array
      //|| obj.constructor === UInt8Array
      || obj.constructor === Uint8ClampedArray
      //|| obj.constructor === UInt32Array
      //|| obj.constructor === UInt16Array
      //|| obj.constructor === UInt32Array
      //|| obj.constructor === BigUint64Array
    ));
}

export function isBoolOrNumber(obj) {
  return obj != null && (obj === true
    || obj === false
    || obj.constructor === Number);
}

export function isBoolOrArray(obj) {
  return obj != null
    && (obj === true
      || obj === false
      || obj.constructor === Array);
}

export function isBoolOrObject(obj) {
  return obj != null
    && (obj === true
      || obj === false
      || (typeof obj === 'object'
        && obj.constructor !== Array));
}

export function isStringOrArray(obj) {
  return obj != null
    && (obj.constructor === String
      || obj.constructor === Array);
}

export function isStringOrObject(obj) {
  return obj != null
    && (obj.constructor === String
      || (obj.constructor !== Array && typeof obj === 'object'));
}

export function getBoolOrNumber(obj, def) {
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

export function getPureObject(obj, def) {
  return isPureObject(obj) ? obj : def;
}
export function getPureArray(obj, def) {
  return isPureArray(obj) ? obj : def;
}

export function getPureArrayMinItems(obj, len, def) {
  return isPureArray(obj) && obj.length > len ? obj: def;
}

export function getPureString(obj, def) {
  return (obj != null && obj.constructor === String) ? obj : def;
}

export function getPureNumber(obj, def) {
  return Number(obj) || def; // TODO: performance check for isNaN and Number!!!
}

export function getPureInteger(obj, def) {
  return (mathi32_round(obj)|0) || def;
}

export function getPureBool(obj, def) {
  return obj === true || obj === false ? obj : def;
}
