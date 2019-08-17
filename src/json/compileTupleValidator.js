import {
  isStrictArrayType,
  isArrayishType,
} from './isDataType';

import {
  getObjectishType,
  getNumberishType,
  getArrayishType,
} from './getDataType';

import {
  getStringOrArray,
} from './getDataTypeExtra';

import {
  fallbackFn,
  falseThat,
} from './isFunctionType';

export function compileTupleChildren(schema, addMember, addChildSchema) {
  const items = getArrayishType(schema.items);
  const contains = getObjectishType(schema.contains);

  if (items == null && contains == null) return undefined;

  // check if we are really in a tuple
  if (items == null) {
    const type = getStringOrArray(schema.type);
    let istuple = false;
    if (isStrictArrayType(type)) {
      istuple = type.includes('tuple');
    }
    else if (type === 'tuple') {
      istuple = true;
    }
    if (istuple !== true) return undefined;
  }

  const maxItems = getNumberishType(schema.maxItems, 0);

  function compileItems() {
    if (items == null) return undefined;
    const vals = new Array(items.length);
    for (let i = 0; i < items.length; ++i) {
      const cb = addChildSchema(['items', i], items[i], compileTupleChildren);
      vals[i] = cb;
    }

    return function validateItem(i, data, dataRoot) {
      if (vals.length < i) {
        const cb = vals[i];
        if (cb != null) {
          return cb(data, dataRoot);
        }
      }
      return false;
    };
  }

  function compileContains() {
    if (contains == null) return undefined;
    const cb = addChildSchema('contains', contains, compileTupleChildren);
    if (cb == null) return undefined;
    return function validateContains(data, dataRoot) {
      return cb(data, dataRoot);
    };
  }

  const validateItem = fallbackFn(compileItems(), falseThat);
  const validateContains = fallbackFn(compileContains(), falseThat);

  return function validateTuple(data, dataRoot) {
    let valid = true;
    if (isArrayishType(data)) {
      const len = maxItems > 0
        ? Math.min(maxItems, data.length)
        : data.length;
      for (let i = 0; i < len; ++i) {
        const val = data[i];
        if (!validateItem(i, val, dataRoot)) {
          if (validateContains(i, val, dataRoot) === true)
            continue;
          valid = false;
        }
      }
    }
    return valid;
  };
}
