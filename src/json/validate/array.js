/* eslint-disable no-unused-vars */
/* eslint-disable function-paren-newline */
import {
  isArrayTyped,
  isArrayOrSetTyped,
  isArrayType,
} from '../../types/core';

import {
  getBoolishType,
  getIntishType,
  getArrayTypeMinItems,
  getArrayOrSetTypeLength,
  getObjectType,
  getBoolOrObjectType,
} from '../../types/getters';

import {
  trueThat,
  falseThat,
} from '../../types/functions';

import {
  isUniqueArray,
} from '../../types/arrays';

//#region compile array constraints

function compileMinItems(schemaObj, jsonSchema) {
  const min = getIntishType(jsonSchema.minItems, 0);
  if (min < 1) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'minItems',
    min,
    compileMinItems);
  if (addError == null) return undefined;

  return function minItems(len = 0) {
    return len >= min || addError(len);
  };
}

function compileMaxItems(schemaObj, jsonSchema) {
  const max = getIntishType(jsonSchema.maxItems, -1);
  if (max < 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'maxItems',
    max,
    compileMaxItems);
  if (addError == null) return undefined;

  return function maxItems(len = 0) {
    return len <= max || addError(len);
  };
}

function compileUniqueItems(schemaObj, jsonSchema) {
  const unique = getBoolishType(jsonSchema.uniqueItems);
  if (unique !== true) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'uniqueItems',
    unique,
    compileUniqueItems);
  if (addError == null) return undefined;

  return function validateUniqueItems(data) {
    return isUniqueArray(data) || addError(data);
  };
}

//#endregion

export function compileArrayBasic(schemaObj, jsonSchema) {
  const minItems = compileMinItems(schemaObj, jsonSchema);
  const maxItems = compileMaxItems(schemaObj, jsonSchema);
  const uniqueItems = compileUniqueItems(schemaObj, jsonSchema);

  if ((minItems
    || maxItems
    || uniqueItems) === undefined)
    return undefined;

  const isMinItems = minItems || trueThat;
  const isMaxItems = maxItems || trueThat;
  const isUniqueItems = uniqueItems || trueThat;

  return function validateArraySchema(data, dataRoot) {
    if (isArrayType(data)) {
      const len = data.length;
      return isMinItems(len)
        && isMaxItems(len)
        && isUniqueItems(data);
    }
    return true;
  };
}

function compileArrayItemsBoolean(schemaObj, jsonSchema) {
  const items = getBoolishType(jsonSchema.items);
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
  const contains = getBoolishType(jsonSchema.contains);
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

  const additional = getBoolOrObjectType(jsonSchema.additionalItems, true);

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
