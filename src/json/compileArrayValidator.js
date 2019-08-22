/* eslint-disable function-paren-newline */
import {
  isArrayishType,
} from '../types/isDataType';

import {
  getObjectishType,
  getIntegerishType,
} from '../types/getDataType';

import {
  getArrayOrSetLength,
} from '../types/getDataTypeExtra';

import {
  isArrayOrSet,
} from '../types/isDataTypeExtra';

export function compileArrayBasic(schemaObj, jsonSchema) {
  const min = getIntegerishType(jsonSchema.minItems);
  const max = getIntegerishType(jsonSchema.maxItem);

  function compileMinItems() {
    if (min > 0) {
      const addError = schemaObj.createMemberError(
        'minItems',
        min,
        compileArrayBasic);
      return function minItems(data) {
        if (!isArrayOrSet(data)) { return true; }
        const len = getArrayOrSetLength(data);
        const valid = len >= min;
        if (!valid) addError(data);
        return valid;
      };
    }
    return undefined;
  }

  function compileMaxItems() {
    if (max > 0) {
      const addError = schemaObj.createMemberError(
        'maxItems',
        max,
        compileArrayBasic);
      return function maxItems(data) {
        if (!isArrayOrSet(data)) { return true; }
        const len = getArrayOrSetLength(data);
        const valid = len <= max;
        if (!valid) addError(data);
        return valid;
      };
    }
    return undefined;
  }

  const minItems = compileMinItems();
  const maxItems = compileMaxItems();
  if (minItems && maxItems) {
    return function checkArrayBounds(data, dataRoot) {
      return minItems(data, dataRoot) && maxItems(data, dataRoot);
    };
  }
  return minItems || maxItems;
}

export function compileArrayChildren(schemaObj, jsonSchema) {
  const items = getObjectishType(jsonSchema.items);
  const contains = getObjectishType(jsonSchema.contains);
  const maxItems = getIntegerishType(jsonSchema.maxItems, 0);

  function compileItems() {
    if (items == null) return undefined;

    const validate = schemaObj.createSingleValidator(
      'items',
      items,
      compileArrayChildren);
    if (validate != null) {
      return function validateItem(childData, dataRoot) {
        return validate(childData, dataRoot);
      };
    }

    return undefined;
  }

  function compileContains() {
    if (contains == null) return undefined;

    const validate = schemaObj.createSingleValidator(
      'contains',
      contains,
      compileArrayChildren);

    if (validate == null) return undefined;
    return function validateContainsItem(childData, dataRoot) {
      return validate(childData, dataRoot);
    };
  }

  const validateItem = compileItems();
  const validateContains = compileContains();

  if (validateItem || validateContains) {
    return function validateArrayChildren(data, dataRoot) {
      let valid = true;
      let found = false;
      if (isArrayishType(data)) {
        let errors = 32;
        const len = maxItems > 0
          ? Math.min(maxItems, data.length)
          : data.length;
        for (let i = 0; i < len; ++i) {
          if (errors > 32) break;
          const obj = data[i];
          if (validateItem) {
            if (validateItem(i, obj, dataRoot) === false) {
              valid = false;
              errors++;
              continue;
            }
          }
          if (validateContains && found === false) {
            if (validateContains(i, obj, dataRoot) === true) {
              if (validateItem == null) return true;
              found = true;
            }
          }
        }
      }
      return valid && (validateContains == null || found === true);
    };
  }
  return undefined;
}
