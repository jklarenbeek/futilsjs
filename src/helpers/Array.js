/* eslint-disable no-extend-native */

export function Array_isUnique(array) {
  const len = array.length;
  return Array_getUnique(array).length === len;
}

export function Array_getUnique(array) {
  const filtered = array.filter((el, index, a) => index === a.indexOf(el));
  return filtered;
  // return Array.from(new Set(array));
}

// e3Merge from https://jsperf.com/merge-two-arrays-keeping-only-unique-values/22
export function Array_uniqueMerge(target = [], source = []) {
  target = [...target];

  const hash = {};

  let i = target.length;
  while (i--) {
    hash[target[i]] = 1;
  }

  for (i = 0; i < source.length; ++i) {
    const e = source[i];
    // eslint-disable-next-line no-unused-expressions
    hash[e] || target.push(e);
  }
  return target;
}

export function Array_collapseShallow(array) {
  const result = [];
  let cursor = 0;

  const lenx = array.length;
  let itemx = null;
  let ix = 0;


  let leny = 0;
  let itemy = null;
  let iy = 0;

  // fill the children array with the array argument
  for (ix = 0; ix < lenx; ++ix) {
    itemx = array[ix];
    if (itemx == null) continue;
    if (itemx.constructor === Array) {
      // fill the result array with the
      // items of this next loop. We do
      // not go any deeper.
      leny = itemx.length;
      for (iy = 0; iy < leny; ++iy) {
        itemy = itemx[iy];
        if (itemy == null) continue;
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

export function Array_forEach(array, fn) {
  for (let i = 0; i < array.length; ++i)
    fn(array[i], i, array);
}

export function Array_every(array, test) {
  for (let i = 0; i < array.length; ++i) {
    if (!test(array[i], i, array)) return false;
  }
  return true;
}

export function Array_intersect(...arrays) {
  // https://codeburst.io/optimizing-array-analytics-in-javascript-part-two-search-intersection-and-cross-products-79b4a6d68da0
  // if we process the arrays from shortest to longest
  // then we will identify failure points faster, i.e.
  // when one item is not in all arrays
  const ordered = arrays.length === 1
    ? arrays
    : arrays.sort((a1, a2) => a1.length - a2.length);
  const shortest = ordered[0];
  const set = new Set(); // used for bookeeping, Sets are faster
  const result = []; // the intersection, conversion from Set is slow

  // for each item in the shortest array
  for (let i = 0; i < shortest.length; ++i) {
    const item = shortest[i];
    // see if item is in every subsequent array
    let every = true; // don't use ordered.every ... it is slow
    for (let j = 1; j < ordered.length; ++j) {
      if (ordered[j].includes(item)) continue;
      every = false;
      break;
    }
    // ignore if not in every other array, or if already captured
    if (!every || set.has(item)) continue;
    // otherwise, add to bookeeping set and the result
    set.add(item);
    result[result.length] = item;
  }
  return result;
}

export function Array_fastIntersect(...arrays) {
  // https://github.com/lovasoa/fast_array_intersect
  const ret = [];
  const obj = {};

  let nShortest = arrays[0].length;
  let shortest = 0;

  let i = 0;
  let j = 0;
  for (i = 0; i < arrays.length; i++) {
    const n = arrays[i].length;
    if (n < nShortest) {
      shortest = i;
      nShortest = n;
    }
  }

  for (i = 0; i < arrays.length; i++) {
    const islast = i === (arrays.length - 1);
    // Read the shortest array first.
    // Read the first array instead of the shortest
    const n = (i === shortest) ? 0 : (i || shortest);

    const subarr = arrays[n];
    const len = subarr.length;
    for (j = 0; j < len; j++) {
      const elem = subarr[j];
      if (obj[elem] === i - 1) {
        if (islast) {
          ret.push(elem);
          obj[elem] = 0;
        } else {
          obj[elem] = i;
        }
      } else if (i === 0) {
        obj[elem] = 0;
      }
    }
  }
  return ret;
}

export function Array_patchPrototype() {
  Array.prototype.getItem = function Array_prototype_getItem(index = 0) {
    index = index | 0;
    return this[index];
  };
  Array.prototype.setItem = function Array_prototype_setItem(index = 0, value) {
    index = index | 0;
    this[index] = value;
    return value;
  };
  Array.prototype.getUnique = function Array_prototype_getUnique() {
    return Array_getUnique(this);
  };
  Array.prototype.mergeUnique = function Array_prototype_mergeUnique(right = []) {
    return Array_uniqueMerge(this, right);
  };
  Array.prototype.collapseShallow = function Array_prototype_collapseShallow() {
    return Array_collapseShallow(this);
  };
}

export default {
  uniqueArray: Array_getUnique,
  uniqueMergeArray: Array_uniqueMerge,
  collapseShallow: Array_collapseShallow,
  forEach: Array_forEach,
  every: Array_every,
};
