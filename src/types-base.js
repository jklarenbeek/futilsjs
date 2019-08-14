import { mathi32_round } from './int32-math';

export function isPrimitiveTypeEx(typeString) {
  // primitives: boolean = 1, integer = 32, float = 64, bigint = 0, letter = 16
  // complex: struct, array, string, map
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

export function isFnEx(typeString) {
  return typeString === 'function';
}

export function isFn(obj) {
  return typeof obj === 'function';
}

export function trueThat(whatever = true) {
  const that = true;
  return whatever === true || that;
}

export function undefThat(whatever = undefined) {
  return undefined;
}

export function fallbackFn(compiled, fallback = trueThat) {
  if (isFn(compiled)) return compiled;
  // eslint-disable-next-line no-unused-vars
  return isFn(fallback)
    ? fallback
    : trueThat;
}

export function sanitizePrimitiveValue(value, nullable, defaultValue = undefined) {
  if (nullable && value == null) return value;
  if (value == null) return defaultValue;
  return isPrimitiveType(value) ? value : defaultValue;
}

// region isPureNumber
function isPureNumber_asNaN(obj) {
  // eslint-disable-next-line no-restricted-globals
  return isNaN(obj) === false;
}

function isPureNumber_asNumber(obj) {
  return (Number(obj) || false) !== false;
}

function isPureNumber_asParseInt(obj) {
  // eslint-disable-next-line radix
  const n = parseInt(obj);
  // eslint-disable-next-line no-self-compare
  return n === n;
}

function isPureNumber_asParseFloat(obj) {
  // eslint-disable-next-line radix
  const n = parseFloat(obj);
  // eslint-disable-next-line no-self-compare
  return n === n; // we equal NaN with NaN here.
}

function isPureNumber_asMathRound(obj) {
  const n = Math.round(obj);
  // eslint-disable-next-line no-self-compare
  return n === n; // we equal NaN with NaN here.
}

function isPureNumber_asCastFloat(obj) {
  // eslint-disable-next-line no-self-compare
  return +obj === +obj; // we equal NaN with NaN here.
}

// endregion

/**
 * @example
 *  const fns_all = [ isPureNumber_asNumber, isPureNumber_asParseFloat ];
 *  const test_stringi = ['12345', '54321', '12358', '85321'];
 *  const test_stringf = ['12.345', '54.321', '12.358', '85.321'];
 *  const test_nan = ['abcde', 'edcba', 'abceh', 'hecba'];
 *  const test_number = [13.234, 21.123, 34.456, 55.223];
 *  const test_integer = [13, 21, 34, 55];
 *  const pref_idx = performanceIndexOfUnaryBool(fns_all, [ test_number, test_integer ]);
 *  const pref_fn = pref_idx >= 0 ? fns_all[pref_idx] : undefined;
 *
 * @param {*} functionList
 * @param {*} testList
 */
export function performanceIndexOfUnaryBool(functionList, testList) {
  let index = -1;
  let start = 0.0;
  let end = 0.0;
  let delta = 0.0;
  // eslint-disable-next-line no-unused-vars
  let tmp = false;

  // eslint-disable-next-line func-names
  let fn = function () { };

  for (let i = 0; i < functionList.length; ++i) {
    fn = functionList[i];
    end = 0.0;
    for (let j = 0; j < testList.length; ++j) {
      const test = testList[j];
      start = performance.now();
      for (let k = 0; k < 1000; ++k) {
        tmp |= fn(test % k);
      }
      end += performance.now() - start;
    }
    end /= testList.length;

    if (delta > end) {
      delta = end;
      index = i;
    }
  }
  return index;
}

export const isPureNumber = (function calibrate(doit = false) {
  if (!doit) return isPureNumber_asNumber;
  const floats = [Math.PI, 13.234, 21.123, 34.456, 55.223];
  const integers = [13, 21, 34, 55, 108];
  const fns = [
    isPureNumber_asNaN,
    isPureNumber_asNumber,
    isPureNumber_asParseInt,
    isPureNumber_asParseFloat,
    isPureNumber_asMathRound,
    isPureNumber_asCastFloat,
  ];
  return fns[performanceIndexOfUnaryBool(fns, [floats, integers])];
})(false);

export function isPureString(obj) {
  return obj != null && obj.constructor === String;
}

export function isPureObject(obj) {
  return (typeof obj === 'object' && obj.constructor !== Array);
}

export function isPureObjectReally(obj) {
  return (typeof obj === 'object'
    && !(obj.constructor === Array
      || obj.constructor === Map
      || obj.constructor === Set
      || obj.constructor === WeakMap
      || obj.constructor === WeakSet
      || obj.constructor === Int8Array
      || obj.constructor === Int16Array
      || obj.constructor === Int32Array
      // eslint-disable-next-line no-undef
      || obj.constructor === BigInt64Array
      // eslint-disable-next-line no-undef
      || obj.constructor === UInt8Array
      || obj.constructor === Uint8ClampedArray
      // eslint-disable-next-line no-undef
      || obj.constructor === UInt32Array
      // eslint-disable-next-line no-undef
      || obj.constructor === UInt16Array
      // eslint-disable-next-line no-undef
      || obj.constructor === UInt32Array
      // eslint-disable-next-line no-undef
      || obj.constructor === BigUint64Array
    ));
}

export function isPureArray(obj) {
  return (obj != null && obj.constructor === Array);
}

export function isPureTypedArray(obj) {
  return (obj != null
    && (obj.constructor === Int8Array
      || obj.constructor === Int16Array
      || obj.constructor === Int32Array
      // eslint-disable-next-line no-undef
      || obj.constructor === BigInt64Array
      // eslint-disable-next-line no-undef
      || obj.constructor === UInt8Array
      || obj.constructor === Uint8ClampedArray
      // eslint-disable-next-line no-undef
      || obj.constructor === UInt32Array
      // eslint-disable-next-line no-undef
      || obj.constructor === UInt16Array
      // eslint-disable-next-line no-undef
      || obj.constructor === UInt32Array
      // eslint-disable-next-line no-undef
      || obj.constructor === BigUint64Array
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
  return mathi32_round(obj) || def;
}

export function getPureBool(obj, def) {
  return obj === true || obj === false ? obj : def;
}
