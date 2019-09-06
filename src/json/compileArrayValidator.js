/* eslint-disable no-unused-vars */
/* eslint-disable function-paren-newline */
import {
  isArrayTyped,
  isArrayOrSetTyped,
} from '../types/core';

import {
  getIntishType,
  getObjectType,
  getArrayTypeMinItems,
} from '../types/getters';

import {
  trueThat,
  falseThat,
} from '../types/functions';

import {
  getBooleanishType,
} from '../types/getDataType';

import {
  getArrayOrSetLength, getBoolOrObject,
} from '../types/getDataTypeExtra';

import {
  isUniqueArray,
} from '../types/arrays';

function compileMinItems(schemaObj, jsonSchema) {
  const min = getIntishType(jsonSchema.minItems);
  if (!(min > 0)) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'minItems',
    min,
    compileMinItems);
  if (addError == null) return undefined;

  return function minItems(data) {
    return !isArrayOrSetTyped(data)
      ? true
      : getArrayOrSetLength(data) >= min
        ? true
        : addError(data);
  };
}

function compileMaxItems(schemaObj, jsonSchema) {
  const max = getIntishType(jsonSchema.maxItems);
  if (!(max > 0)) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'maxItems',
    max,
    compileMaxItems);
  if (addError == null) return undefined;

  return function maxItems(data) {
    return !isArrayOrSetTyped(data)
      ? true
      : getArrayOrSetLength(data) <= max
        ? true
        : addError(data);
  };
}

function compileArrayUniqueness(schemaObj, jsonSchema) {
  const unique = getBooleanishType(jsonSchema.uniqueItems);
  if (unique !== true) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'uniqueItems',
    unique,
    compileArrayUniqueness);
  if (addError == null) return undefined;

  return function validateUniqueItems(data) {
    return !isArrayTyped(data)
      ? true
      : isUniqueArray(data)
        ? true
        : addError(data);
  };
}

export function compileArrayBasic(schemaObj, jsonSchema) {
  return [
    compileMinItems(schemaObj, jsonSchema),
    compileMaxItems(schemaObj, jsonSchema),
    compileArrayUniqueness(schemaObj, jsonSchema),
  ];
}

function compileArrayItemsBoolean(schemaObj, jsonSchema) {
  const items = getBooleanishType(jsonSchema.items);
  if (items === true) return trueThat;
  if (items !== false) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'items',
    false,
    compileArrayItemsBoolean);
  if (addError == null) return undefined;

  return function validateArrayItemsFalse(data) {
    return !isArrayTyped(data)
      ? true
      : data.length === 0
        ? true
        : addError(data);
  };
}

function compileArrayContainsBoolean(schemaObj, jsonSchema) {
  const contains = getBooleanishType(jsonSchema.contains);
  if (contains === true) {
    const addError = schemaObj.createSingleErrorHandler(
      'contains',
      true,
      compileArrayContainsBoolean);
    if (addError == null) return undefined;

    return function validateArrayContainsTrue(data, dataRoot) {
      return !isArrayTyped(data)
        ? true
        : data.length > 0
          ? true
          : addError(data);
    };
  }
  if (contains === false) {
    const addError = schemaObj.createSingleErrorHandler(
      'contains',
      false,
      compileArrayContainsBoolean);
    if (addError == null) return undefined;

    return function validateArrayContainsFalse(data, dataRoot) {
      return !isArrayTyped(data)
        ? true
        : addError(data);
    };
  }
  return undefined;
}

function compileArrayItems(schemaObj, jsonSchema) {
  const items = getObjectType(jsonSchema.items);
  if (items == null) return undefined;

  return schemaObj.createSingleValidator(
    'items',
    items,
    compileArrayItems);
}

function compileTupleItems(schemaObj, jsonSchema) {
  const items = getArrayTypeMinItems(jsonSchema.items, 1); // TODO: possible bug?
  if (items == null) return undefined;

  const additional = getBoolOrObject(jsonSchema.additionalItems, true);

  const member = schemaObj.createMember('items', compileTupleItems);
  const validators = new Array(items.length);
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    if (item === true) validators[i] = trueThat;
    else if (item === false) validators[i] = falseThat;
    else {
      const validator = schemaObj.createPairValidator(member, i, item);
      validators[i] = validator;
    }
  }

  if (additional === true || additional === false) {
    return function validateTupleItemBool(data, dataRoot, i) {
      if (i < validators.length) {
        const validator = validators[i];
        if (validator != null) {
          return validator(data, dataRoot);
        }
        return true; // TODO: if a validator is not present, we return true?
      }
      return additional;
    };
  }

  const validateAdditional = schemaObj.createSingleValidator(
    'additionalItems',
    additional,
    compileTupleItems);

  return function validateTupleItemSchema(data, dataRoot, i) {
    if (i < validators.length) {
      const validator = validators[i];
      if (validator != null) {
        return validator(data, dataRoot);
      }
    }
    return validateAdditional(data, dataRoot);
  };
}

function compileArrayContains(schemaObj, jsonSchema) {
  const contains = getObjectType(jsonSchema.contains);
  if (contains == null) return undefined;

  return schemaObj.createSingleValidator(
    'contains',
    contains,
    compileArrayContains);
}

function compileChildValidators(schemaObj, jsonSchema) {
  const validateItem = compileArrayItems(schemaObj, jsonSchema)
    || compileTupleItems(schemaObj, jsonSchema);
  const validateContains = compileArrayContains(schemaObj, jsonSchema);
  if (validateItem == null
    && validateContains == null)
    return undefined;

  const maxItems = getIntishType(jsonSchema.maxItems, 0);

  return function validateArrayChildren(data, dataRoot) {
    if (isArrayTyped(data)) {
      let valid = true;
      let contains = false;
      let errors = 0;
      const len = maxItems > 0
        ? Math.min(maxItems, data.length)
        : data.length;

      for (let i = 0; i < len; ++i) {
        if (errors > 32) break;
        const obj = data[i];
        if (validateItem) {
          if (validateItem(obj, dataRoot, i) === false) {
            valid = false;
            errors++;
            continue;
          }
        }
        if (validateContains) {
          if (contains === false && validateContains(obj, dataRoot) === true) {
            if (validateItem == null) return true;
            contains = true;
          }
        }
      }
      return valid && (validateContains == null || contains === true);
    }
    return true;
  };
}

export function compileArrayChildren(schemaObj, jsonSchema) {
  return [
    compileArrayItemsBoolean(schemaObj, jsonSchema),
    compileArrayContainsBoolean(schemaObj, jsonSchema),
    compileChildValidators(schemaObj, jsonSchema),
  ];
}
