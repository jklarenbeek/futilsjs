import {
  getPureObject,
  getPureNumber,
  getPureInteger,
  fallbackFn,
  trueThat,
  falseThat,
} from '../types-base';

import {
  isArrayishType,
} from './isDataType';


export function compileArrayBasic(schema, addMember) {
  const min = getPureInteger(schema.minItems);
  const max = getPureInteger(schema.maxItem);

  function isArrayOrSet(data) {
    return (data != null && (data.constructor === Array || data.constructor === Set));
  }
  function getLength(data) {
    return data.constructor === Set ? data.size : data.length;
  }

  if (min && max) {
    const addError = addMember(['minItems', 'maxItems'], [min, max], compileArrayBasic);
    return function itemsBetween(data) {
      if (!isArrayOrSet(data)) { return true; }
      const len = getLength(data);
      const valid = len >= min && len <= max;
      if (!valid) addError(data);
      return valid;
    };
  }
  else if (max) {
    const addError = addMember('maxItems', max, compileArrayBasic);
    return function maxItems(data) {
      if (!isArrayOrSet(data)) { return true; }
      const len = getLength(data);
      const valid = len <= max;
      if (!valid) addError(data);
      return valid;
    };
  }
  else if (min > 0) {
    const addError = addMember('minItems', min, compileArrayBasic);
    return function minItems(data) {
      if (!isArrayOrSet(data)) { return true; }
      const len = getLength(data);
      const valid = len >= min;
      if (!valid) addError(data);
      return valid;
    };
  }
  return undefined;
}

export function compileArrayChildren(schema, addMember, addChildSchema) {
  const items = getPureObject(schema.items);
  const contains = getPureObject(schema.contains);
  if (items == null && contains == null) return undefined;

  const maxItems = getPureNumber(schema.maxItems, 0);

  function compileItems() {
    if (items == null) return undefined;

    const validate = addChildSchema('items', items, compileArrayChildren);
    if (validate != null) {
      return function validateItem(childData, dataRoot) {
        return validate(childData, dataRoot);
      };
    }

    return undefined;
  }

  function compileContains() {
    if (contains == null) return undefined;

    const validate = addChildSchema('contains', contains, compileArrayChildren);
    if (validate != null) {
      return function validateContains(childData, dataRoot) {
        return validate(childData, dataRoot);
      };
    }

    return undefined;
  }

  const validateItem = fallbackFn(compileItems(), trueThat);
  const validateContains = fallbackFn(compileContains(), falseThat);

  return function validateArrayChildren(data, dataRoot) {
    let valid = true;
    if (isArrayishType(data)) {
      const len = maxItems > 0
        ? Math.min(maxItems, data.length)
        : data.length;
      for (let i = 0; i < len; ++i) {
        const obj = data[i];
        valid = valid
          && validateItem(i, obj, dataRoot);
        if (validateContains(i, obj, dataRoot) === true)
          return true;
      }
    }
    return valid;
  };
}
