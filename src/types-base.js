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

export function getAllObjectValues(obj) {
  const arr = [];
  if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; ++i) {
      arr.push(obj[i]);
    }
  }
  return arr;
}

export function getObjectFirstKey(obj) {
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj)[0];
  }
  return undefined;
}

export function getObjectCountItems(obj) {
  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).length;
  }
  return 0;
}

export function isObjectEmpty(obj) {
  return getObjectFirstKey(obj) === undefined;
}

export function cloneObject(target, source) {
  // const out = {};

  // for (const t in target) {
  //   if (target.hasOwnProperty(t)) out[t] = target[t];
  // }
  // for (const s in source) {
  //   if (source.hasOwnProperty(s)) out[s] = source[s];
  // }
  // return out;
  return { ...target, ...source };
}

export function cloneDeep(o) {
  if (o == null || typeof o !== 'object') {
    return o;
  }

  if (o.constructor === Array) {
    const arr = [];
    for (let i = 0; i < o.length; ++i) {
      arr[i] = cloneDeep(o[i]);
    }
    return arr;
  }
  else {
    const obj = {};
    const keys = Object.keys(o);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      obj[i] = cloneDeep(o[key]);
    }
    return obj;
  }
}

export function mergeObjects(target, ...rest) {
  const ln = rest.length;
  const mergeFn = mergeObjects;

  let i = 0;
  for (; i < ln; i++) {
    const object = rest[i];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        if (value == null) continue;
        if (isPureObject(value)) {
          const sourceKey = target[key];
          mergeFn(sourceKey, value);
        }
        else {
          target[key] = value;
        }
      }
    }
  }
  return target;
}

//#region

/* -----------------------------------------------------------------------------------------
    deepEquals( a, b [, enforce_properties_order, cyclic] )
    https://stackoverflow.com/a/6713782/4598221

    Returns true if a and b are deeply equal, false otherwise.

    Parameters:
      - a (Any type): value to compare to b
      - b (Any type): value compared to a

    Optional Parameters:
      - enforce_properties_order (Boolean): true to check if Object properties are provided
        in the same order between a and b

      - cyclic (Boolean): true to check for cycles in cyclic objects

    Implementation:
      'a' is considered equal to 'b' if all scalar values in a and b are strictly equal as
      compared with operator '===' except for these two special cases:
        - 0 === -0 but are not equal.
        - NaN is not === to itself but is equal.

      RegExp objects are considered equal if they have the same lastIndex, i.e. both regular
      expressions have matched the same number of times.

      Functions must be identical, so that they have the same closure context.

      "undefined" is a valid value, including in Objects

      106 automated tests.

      Provide options for slower, less-common use cases:

        - Unless enforce_properties_order is true, if 'a' and 'b' are non-Array Objects, the
          order of occurence of their attributes is considered irrelevant:
            { a: 1, b: 2 } is considered equal to { b: 2, a: 1 }

        - Unless cyclic is true, Cyclic objects will throw:
            RangeError: Maximum call stack size exceeded
*/
export function deepEquals(a, b, enforce_properties_order, cyclic) {
  /* -----------------------------------------------------------------------------------------
    reference_equals( a, b )

    Helper function to compare object references on cyclic objects or arrays.

    Returns:
      - null if a or b is not part of a cycle, adding them to object_references array
      - true: same cycle found for a and b
      - false: different cycle found for a and b

    On the first call of a specific invocation of equal(), replaces self with inner function
    holding object_references array object in closure context.

    This allows to create a context only if and when an invocation of equal() compares
    objects or arrays.
  */
  function reference_equals(a1, b1) {
    const object_references = [];

    function _reference_equals(a2, b2) {
      let l = object_references.length;

      while (l--) {
        if (object_references[l--] === b2) {
          return object_references[l] === a2;
        }
      }
      object_references.push(a2, b2);
      return null;
    }

    return _reference_equals(a1, b1);
  }


  function _equals(a1, b1) {
    // They should have the same toString() signature
    const s = toString.call(a1);
    if (s !== toString.call(b1)) return false;

    switch (s) {
      default: // Boolean, Date, String
        return a1.valueOf() === b1.valueOf();

      case '[object Number]':
        // Converts Number instances into primitive values
        // This is required also for NaN test bellow
        a1 = +a1;
        b1 = +b1;

        // return a ?         // a is Non-zero and Non-NaN
        //     a === b
        //   :                // a is 0, -0 or NaN
        //     a === a ?      // a is 0 or -0
        //     1/a === 1/b    // 1/0 !== 1/-0 because Infinity !== -Infinity
        //   : b !== b;        // NaN, the only Number not equal to itself!
        // ;

        // eslint-disable-next-line no-nested-ternary
        return a1
          ? a1 === b1
          // eslint-disable-next-line no-self-compare
          : a1 === a1
            ? 1 / a1 === 1 / b1
            // eslint-disable-next-line no-self-compare
            : b1 !== b1;

      case '[object RegExp]':
        return a1.source === b1.source
          && a1.global === b1.global
          && a1.ignoreCase === b1.ignoreCase
          && a1.multiline === b1.multiline
          && a1.lastIndex === b1.lastIndex;

      case '[object Function]':
        return false; // functions should be strictly equal because of closure context

      case '[object Array]': {
        const r = reference_equals(a1, b1);
        if ((cyclic && r) !== null) return r; // intentionally duplicated bellow for [object Object]

        let l = a1.length;
        if (l !== b1.length) return false;
        // Both have as many elements

        while (l--) {
          const x = a1[l];
          const y = b1[l];
          if (x === y && x !== 0 || _equals(x, y)) continue;

          return false;
        }

        return true;
      }

      case '[object Object]': {
        const r = reference_equals(a1, b1);
        // intentionally duplicated from above for [object Array]
        if ((cyclic && r) !== null) return r;

        if (enforce_properties_order) {
          const properties = [];

          for (const p in a1) {
            if (a1.hasOwnProperty(p)) {
              properties.push(p);
              const x = a1[p];
              const y = b1[p];
              if (x === y && x !== 0 || _equals(x, y)) continue;
              return false;
            }
          }

          // Check if 'b' has as the same properties as 'a' in the same order
          let l = 0;
          for (const p in b1) {
            if (b1.hasOwnProperty(p)) {
              if (properties[l] !== p) return false;
              l++;
            }
          }
        }
        else {
          let l = 0;
          for (const p in a1) {
            if (a1.hasOwnProperty(p)) {
              ++l;
              const x = a1[p];
              const y = b1[p];
              if (x === y && x !== 0 || _equals(x, y)) continue;

              return false;
            }
          }
          // Check if 'b' has as not more own properties than 'a'
          for (const p in b1) {
            if (b1.hasOwnProperty(p) && --l < 0) return false;
          }
        }
        return true;
      }
    }
  }

  return a === b // strick equality should be enough unless zero
    && a !== 0 // because 0 === -0, requires test by _equals()
    || _equals(a, b); // handles not strictly equal or zero values
}

//#endregion
