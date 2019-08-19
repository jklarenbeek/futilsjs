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
  if (obj != null && typeof obj === 'object') {
    return Object.keys(obj).length;
  }
  return 0;
}

export function isObjectEmpty(obj) {
  return getObjectCountItems(obj) === 0;
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
