import { isComplexType, isFn, isScalarType, isBooleanType } from './core-is';

export function forEachPair(obj, fn) {
  if (isComplexType(obj)) {
    if (obj.constructor === Map) {
      for (const [k, v] of map)
        fn(v, k, map);
    }
    else {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; ++i) {
        const k = keys[i]
        fn(obj[k], k, obj);
      }
    }
  }
}

export function getObjectItem(obj, key) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? obj.get(key)
      : obj[key]
    : undefined;
}

export function setObjectItem(obj, key, value) {
  if (isComplexType(obj)) {
    if (obj.constructor === Map)
      obj.set(key, value)
    else
      obj[key] = value;
  }
}

export function getObjectAllKeys(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? Array.from(obj.keys())
      : Object.keys(obj)
    : undefined;
}

export function getObjectAllValues(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? Array.from(obj.values())
      : Object.values(obj)
    : undefined;
}

export function getObjectFirstKey(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? obj.keys().next().value
      : Object.keys(obj)[0]
    : undefined;
}

export function getObjectFirstItem(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? obj.values().next().value
      : Object.values(obj)[0]
    : undefined;
}

export function getObjectCountItems(obj) {
  return isComplexType(obj)
    ? obj.constructor === Map
      ? obj.size
      : Object.keys(obj).length
    : 0;
}

export function isObjectEmpty(obj) {
  return getObjectCountItems(obj) === 0;
}

export function equalsDeep(target, source) {
  if (target === source) return true;
  if (target == null) return false;
  if (source == null) return false;
  if (isBooleanType(target)) return false;
  if (isBooleanType(source)) return false;

  if (isFn(target))
      return target.toString() === source.toString();

  if (isScalarType(target))
    return false;

  if (target.constructor !== source.constructor)
    return false;

  if (target.constructor === Object) {
    const tks = Object.keys(target);
    const sks = Object.keys(source);
    if (tks.length !== sks.length)
      return false;
    for (let i = 0; i < tks.length; ++i) {
      const key = tks[i];
      if (!equalsDeep(target[key], source[key]))
        return false;
    }
    return true;
  }

  if (target.constructor === Array) {
    if (target.length !== source.length)
      return false;
    for (let i = 0; i < target.length; ++i) {
      if (!equalsDeep(target[i], source[i]))
        return false;
    }
    return true;
  }

  if (target.constructor === Map) {
    if (target.size !== source.size)
      return false;
    for (const [key, value] of target) {
      if (source.has(key) === false)
        return false;
      if (!equalsDeep(value, source[key]))
        return false;
    }
    return true;
  }

  if (target.constructor === Set) {
    if (target.size !== source.size)
      return false;
    for (const value of target) {
      if (source.has(value) === false)
        return false;
    }
    return true;
  }

  if (target.constructor === RegExp) {
    return target.toString() === source.toString();
  }

  if (isTypedArray(target)) {
    if (target.length !== source.length)
      return false;
    for (let i = 0; i < target.length; ++i) {
      if (target[i] !== source[i])
        return false;
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
    if (!equalsDeep(target[key], source[key]))
      return false;
  }
  return true;
}

export function cloneObject(target, source) {
  return { ...target, ...source };
}

export function cloneDeep(target, force = false) {
  if (!isComplexType(target)) return target;

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
    return new Set(target); // TODO neither does this
  }

  if (target.constructor === RegExp) {
    return force
      ? new RegExp(target.toString())
      : target;
  }

  if (isTypedArray(target)) {
    // hmmm, isnt there a faster way?
    const arr = new target.constructor(target.length);
    for (let i = 0; i < arr.length; ++i) {
      arr[i] = target[i];
    }
    return arr;
  }

  const tobj = {};
  const tks = Object.keys(target);
  for (let i = 0; i < tks.length; ++i) {
    const tk = tks[i];
    tobj[tk] = cloneDeep(target[tk]);
  }

  // TODO: change prototype of new object to target!

  return tobj;
}

/** obsolete */
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
