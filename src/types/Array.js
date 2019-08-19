/* eslint-disable no-extend-native */

export function Array_unique(array) {
  return array.filter((el, index, a) => index === a.indexOf(el));
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
    return Array_unique(this);
  };
  Array.prototype.mergeUnique = function Array_prototype_mergeUnique(right = []) {
    return Array_uniqueMerge(this, right);
  };
  Array.prototype.collapseShallow = function Array_prototype_collapseShallow() {
    return Array_collapseShallow(this);
  };
}

export default {
  uniqueArray: Array_unique,
  uniqueMergeArray: Array_uniqueMerge,
  collapseShallow: Array_collapseShallow,
};
