/* eslint-disable prefer-rest-params */
export function getObjectFirstItem(obj) {
  for (const item in obj) {
    if (obj.hasOwnProperty(item)) {
      return item;
    }
  }
  return undefined;
}

export function getObjectCountItems(obj) {
  let count = 0;
  for (const item in obj) {
    if (obj.hasOwnProperty(item)) {
      ++count;
    }
  }
  return count;
}

export function isObjectEmpty(obj) {
  return getObjectFirstItem(obj) === undefined;
}

export function clone(target, source) {
  const out = {};

  for (const t in target) {
    if (target.hasOwnProperty(t)) out[t] = target[t];
  }
  for (const s in source) {
    if (source.hasOwnProperty(s)) out[s] = source[s];
  }
  return out;
}

export function cloneDeep(o) {
  if (typeof o !== 'object') {
    return o;
  }
  if (!o) {
    return o;
  }

  if (o.constructor === Array) {
    const newO = [];
    for (let i = 0; i < o.length; i += 1) {
      newO[i] = cloneDeep(o[i]);
    }
    return newO;
  }
  else {
    const newO = {};
    const keys = Reflect.ownKeys(o); // TODO: SLOW!!! OMG SLOW!!!
    for (const i in keys) {
      if (keys.hasOwnProperty(i)) {
        newO[i] = cloneDeep(o[i]);
      }
    }
    return newO;
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
        if (value === undefined || value === null) continue;
        if (typeof value === 'object' && value.constructor !== Array) {
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

//#region Arrays

export function getUniqueArray(array) {
  return array.filter((el, index, a) => index === a.indexOf(el));
  // return Array.from(new Set(array));
}

// e3Merge from https://jsperf.com/merge-two-arrays-keeping-only-unique-values/22
export function mergeArrays(a, b) {
  const hash = {};
  let i = (a = a.slice(0)).length;

  while (i--) {
    hash[a[i]] = 1;
  }

  for (i = 0; i < b.length; i++) {
    const e = b[i];
    // eslint-disable-next-line no-unused-expressions
    hash[e] || a.push(e);
  }

  return a;
}

export function collapseArrayIsToPrimitive(obj) {
  return (obj === undefined || obj === null || obj === false || obj === true);
}

export function collapseArrayShallow(rest) {
  const result = [];
  let cursor = 0;

  const lenx = rest.length;
  let itemx = null;
  let ix = 0;


  let leny = 0;
  let itemy = null;
  let iy = 0;

  // fill the children array with the rest parameters
  for (ix = 0; ix < lenx; ++ix) {
    itemx = rest[ix];
    if (collapseArrayIsToPrimitive(itemx)) continue;
    if (typeof itemx === 'object' && itemx.constructor === Array) {
      // fill the result array with the
      // items of this next loop. We do
      // not go any deeper.
      leny = itemx.length;
      for (iy = 0; iy < leny; ++iy) {
        itemy = itemx[iy];
        if (collapseArrayIsToPrimitive(itemy)) continue;
        // whatever it is next, put it in!?
        result[cursor++] = itemy;
      }
    }
    else {
      // whatever it is next, put it in!?
      result[cursor++] = itemx;
    }
  }
  return result;
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
