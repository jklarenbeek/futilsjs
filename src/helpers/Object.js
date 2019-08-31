import {
  isStrictTypedArray,
} from '../types/isDataType';

/* eslint-disable prefer-rest-params */

export function getObjectAllKeys(obj) {
  if (obj != null && typeof obj === 'object') {
    return Object.keys(obj);
  }
  return undefined;
}

export function getObjectAllValues(obj) {
  if (obj != null && typeof obj === 'object') {
    const keys = Object.keys(obj);
    const arr = new Array(keys.length);
    for (let i = 0; i < keys.length; ++i) {
      arr[i] = obj[keys[i]];
    }
    return arr;
  }
  return undefined;
}

export function getObjectFirstKey(obj) {
  if (obj != null && typeof obj === 'object') {
    return Object.keys(obj)[0];
  }
  return undefined;
}

export function getObjectFirstItem(obj) {
  if (obj != null && typeof obj === 'object') {
    const key = Object.keys(obj)[0];
    if (key) return obj[key];
  }
  return undefined;
}

export function getObjectCountItems(obj) {
  if (obj == null) return 0;
  if (typeof obj === 'object') {
    return Object.keys(obj).length;
  }
  return 0;
}

export function isObjectEmpty(obj) {
  return getObjectCountItems(obj) === 0;
}

export function equalsDeep(target, source) {
  if (target === source) return true;
  if (target == null) return false;
  if (source == null) return false;
  if (target === false || source === false) return false;
  if (target === true || source === true) return false;

  if (typeof target === 'function') {
    if (typeof source === 'function')
      return (target.toString() === source.toString());
    else
      return false;
  }

  if (typeof target !== 'object') return false;

  if (target.constructor !== source.constructor) return false;

  if (target.constructor === Object) {
    const tks = Object.keys(target);
    const sks = Object.keys(source);
    if (tks.length !== sks.length) return false;
    for (let i = 0; i < tks.length; ++i) {
      const key = tks[i];
      if (equalsDeep(target[key], source[key]) === false) return false;
    }
    return true;
  }

  if (target.constructor === Array) {
    if (target.length !== source.length) return false;
    for (let i = 0; i < target.length; ++i) {
      if (equalsDeep(target[i], source[i]) === false) return false;
    }
    return true;
  }

  if (target.constructor === Map) {
    if (target.size !== source.size) return false;
    for (const [key, value] of target) {
      if (source.has(key) === false) return false;
      if (equalsDeep(value, source[key]) === false) return false;
    }
    return true;
  }

  if (target.constructor === Set) {
    if (target.size !== source.size) return false;
    for (const value of target) {
      if (source.has(value) === false) return false;
    }
    return true;
  }

  if (target.constructor === RegExp) {
    return target.toString() === source.toString();
  }

  if (isStrictTypedArray(target)) {
    if (target.length !== source.length) return false;
    for (let i = 0; i < target.length; ++i) {
      if (target[i] !== source[i]) return false;
    }
    return true;
  }

  // we could test for instance of Array, Map and Set in order
  // to differentiate between types of equality.. but we dont.
  const tkeys = Object.keys(target);
  const skeys = Object.keys(source);
  if (tkeys.length !== skeys.length) return false;
  if (tkeys.length === 0) return true;
  for (let i = 0; i < tkeys.length; ++i) {
    const key = tkeys[i];
    if (equalsDeep(target[key], source[key]) === false) return false;
  }
  return true;
}

export function cloneObject(target, source) {
  return { ...target, ...source };
}

export function cloneDeep(target) {
  if (target == null) return target;
  if (target === true || target === false) return target;
  // if (typeof target === 'function') return target;
  if (typeof target !== 'object') return target;

  if (target.constructor === Object) {
    const obj = {};
    const tkeys = Object.keys(target);
    if (tkeys.length === 0) return obj;
    for (let i = 0; i < tkeys.length; ++i) {
      const tkey = tkeys[i];
      obj[tkey] = cloneDeep(target[tkey]);
    }
    return obj;
  }

  if (target.constructor === Array) {
    const arr = new Array(target.length);
    for (let i = 0; i < arr.length; ++i) {
      arr[i] = cloneDeep(target[i]);
    }
    return arr;
  }

  if (target.constructor === Map) {
    return new Map(target); // TODO this is not gonna work for object values
  }

  if (target.constructor === Set) {
    return new Set(target);
  }

  if (target.constructor === RegExp) {
    // NOTE: do we really have to do this?
    return new RegExp(target.toString());
  }

  if (isStrictTypedArray(target)) {
    // hmmm, isnt there a faster way?
    const arr = new target.constructor(target.length);
    for (let i = 0; i < arr.length; ++i) {
      arr[i] = target[i];
    }
    return arr;
  }

  const tobj = {};
  const tks = Object.keys(target);
  if (tks.length === 0) return target; // we don't understand this
  for (let i = 0; i < tks.length; ++i) {
    const tk = tks[i];
    tobj[tk] = cloneDeep(target[tk]);
  }
  // TODO: change prototype of new object to target!
  
  return tobj;
}

export function cloneDeep2(o) {
  if (o == null || typeof o !== 'object') {
    return o;
  }

  if (o.constructor === Array) {
    const arr = [];
    for (let i = 0; i < o.length; ++i) {
      arr[i] = cloneDeep2(o[i]);
    }
    return arr;
  }
  else {
    const obj = {};
    const keys = Object.keys(o);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      obj[i] = cloneDeep2(o[key]);
    }
    return obj;
  }
}

export function mergeObjects(target, ...rest) {
  const ln = rest.length;

  let i = 0;
  for (; i < ln; i++) {
    const object = rest[i];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        if (value == null) continue;
        if (value.constructor !== Array) {
          const sourceKey = target[key];
          mergeObjects(sourceKey, value);
        }
        else {
          target[key] = value;
        }
      }
    }
  }
  return target;
}
