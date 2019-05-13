export function getFirstObjectItem(items) {
  for (const item in items) {
    if (!items.hasOwnProperty(item)) continue;
    return item;
  }
  return undefined;
}

export function recursiveDeepCopy(o) {
  if (typeof o !== 'object') {
    return o;
  }
  if (!o) {
    return o;
  }

  if (o instanceof Array) {
    const newO = [];
    for (let i = 0; i < o.length; i += 1) {
      newO[i] = recursiveDeepCopy(o[i]);
    }
    return newO;
  }
  else {
    const newO = {};
    const keys = Reflect.ownKeys(o);
    for (const i in keys) {
      newO[i] = recursiveDeepCopy(o[i]);
    }
    return newO;
  }
}

export function mergeObjects(target) {
  const ln = arguments.length;
  const mergeFn = mergeObjects;

  let i = 1;
  for (; i < ln; i++) {
    const object = arguments[i];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        if (value && value.constructor === Object) {
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
  function reference_equals(a, b) {
    const object_references = [];

    function _reference_equals(a, b) {
      let l = object_references.length;

      while (l--) {
        if (object_references[l--] === b) {
          return object_references[l] === a;
        }
      }
      object_references.push(a, b);
      return null;
    }

    return _reference_equals(a, b);
  }


  function _equals(a, b) {
    // They should have the same toString() signature
    const s = toString.call(a);
    if (s !== toString.call(b)) return false;

    switch (s) {
      default: // Boolean, Date, String
        return a.valueOf() === b.valueOf();

      case '[object Number]':
        // Converts Number instances into primitive values
        // This is required also for NaN test bellow
        a = +a;
        b = +b;

        // return a ?         // a is Non-zero and Non-NaN
        //     a === b
        //   :                // a is 0, -0 or NaN
        //     a === a ?      // a is 0 or -0
        //     1/a === 1/b    // 1/0 !== 1/-0 because Infinity !== -Infinity
        //   : b !== b;        // NaN, the only Number not equal to itself!
        // ;

        return a
          ? a === b
          // eslint-disable-next-line no-self-compare
          : a === a
            ? 1 / a === 1 / b
            // eslint-disable-next-line no-self-compare
            : b !== b;

      case '[object RegExp]':
        return a.source === b.source
          && a.global === b.global
          && a.ignoreCase === b.ignoreCase
          && a.multiline === b.multiline
          && a.lastIndex === b.lastIndex;

      case '[object Function]':
        return false; // functions should be strictly equal because of closure context

      case '[object Array]': {
        const r = reference_equals(a, b);
        if ((cyclic && r) !== null) return r; // intentionally duplicated bellow for [object Object]

        let l = a.length;
        if (l !== b.length) return false;
        // Both have as many elements

        while (l--) {
          const x = a[l];
          const y = b[l];
          if (x === y && x !== 0 || _equals(x, y)) continue;

          return false;
        }

        return true;
      }

      case '[object Object]': {
        const r = reference_equals(a, b);
        if ((cyclic && r) !== null) return r; // intentionally duplicated from above for [object Array]

        if (enforce_properties_order) {
          const properties = [];

          for (const p in a) {
            if (a.hasOwnProperty(p)) {
              properties.push(p);
              const x = a[p];
              const y = b[p];
              if (x === y && x !== 0 || _equals(x, y)) continue;
              return false;
            }
          }

          // Check if 'b' has as the same properties as 'a' in the same order
          let l = 0; // counter of own properties
          for (const p in b) {
            if (b.hasOwnProperty(p) && properties[l] !== p) return false;
            l++;
          }
        }
        else {
          let l = 0;
          for (const p in a) {
            if (a.hasOwnProperty(p)) {
              ++l;
              const x = a[p];
              const y = b[p];
              if (x === y && x !== 0 || _equals(x, y)) continue;

              return false;
            }
          }
          // Check if 'b' has as not more own properties than 'a'
          for (const p in b) {
            if (b.hasOwnProperty(p) && --l < 0) return false;
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
