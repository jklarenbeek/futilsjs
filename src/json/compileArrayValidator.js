/* eslint-disable no-unused-vars */
/* eslint-disable function-paren-newline */
import {
  isArrayishType,
} from '../types/isDataType';

import {
  getObjectishType,
  getIntegerishType,
  getBooleanishType,
  getStrictArray,
  getStrictArrayMinItems,
} from '../types/getDataType';

import {
  getArrayOrSetLength, getBoolOrObject,
} from '../types/getDataTypeExtra';

import {
  isArrayOrSet,
} from '../types/isDataTypeExtra';

import {
  trueThat,
  falseThat,
} from '../types/isFunctionType';

import {
  Array_isUnique,
} from '../helpers/Array';

function compileArrayBounds(schemaObj, jsonSchema) {
  const min = getIntegerishType(jsonSchema.minItems);
  const max = getIntegerishType(jsonSchema.maxItems);

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

function compileArrayUniqueness(schemaObj, jsonSchema) {
  const unique = getBooleanishType(jsonSchema.uniqueItems);
  if (unique === true) {
    const addError = schemaObj.createMemberError(
      'uniqueItems',
      unique,
      compileArrayUniqueness);
    // eslint-disable-next-line no-unused-vars
    return function validateUniqueItems(data, dataRoot) {
      if (isArrayishType(data)) {
        if (!Array_isUnique(data)) {
          return addError(data);
        }
      }
      return true;
    };
  }
  return undefined;
}

export function compileArrayBasic(schemaObj, jsonSchema) {
  const bounds = compileArrayBounds(schemaObj, jsonSchema);
  const unique = compileArrayUniqueness(schemaObj, jsonSchema);
  if (bounds && unique) {
    return function validateArrayBasic(data, dataRoot) {
      return bounds(data, dataRoot) && unique(data, dataRoot);
    };
  }
  return bounds || unique;
}

function compileArrayItemsBoolean(schemaObj, jsonSchema) {
  const items = getBooleanishType(jsonSchema.items);
  if (items === false) {
    const addError = schemaObj.createMemberError(
      'items',
      false,
      compileArrayItemsBoolean);

    return function validateArrayItemsFalse(data, dataRoot) {
      if (isArrayishType(data)) {
        if (data.length > 0) return addError(data);
      }
      return true;
    };
  }
  if (items === true) {
    return trueThat; // TODO: check spec if this is correct
  }
  return undefined;
}

function compileArrayContainsBoolean(schemaObj, jsonSchema) {
  const contains = getBooleanishType(jsonSchema.contains);
  if (contains === true) {
    const addError = schemaObj.createMemberError(
      'contains',
      true,
      compileArrayContainsBoolean);
    return function validateArrayContainsTrue(data, dataRoot) {
      if (isArrayishType(data)) {
        if (data.length === 0) return addError(data);
      }
      return true;
    };
  }
  if (contains === false) {
    const addError = schemaObj.createMemberError(
      'contains',
      false,
      compileArrayContainsBoolean);
    return function validateArrayContainsFalse(data, dataRoot) {
      if (isArrayishType(data)) {
        return addError(data);
      }
      return true;
    };
  }
  return undefined;
}

function compileArrayItems(schemaObj, jsonSchema) {
  const items = getObjectishType(jsonSchema.items);
  if (items == null) return undefined;

  return schemaObj.createSingleValidator(
    'items',
    items,
    compileArrayItems);
}

function compileTupleItems(schemaObj, jsonSchema) {
  const items = getStrictArrayMinItems(jsonSchema.items, 1); // TODO: possible bug?
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
  const contains = getObjectishType(jsonSchema.contains);
  if (contains == null) return undefined;

  return schemaObj.createSingleValidator(
    'contains',
    contains,
    compileArrayContains);
}

export function compileArrayChildren(schemaObj, jsonSchema) {
  const validateBoolItems = compileArrayItemsBoolean(schemaObj, jsonSchema);
  if (validateBoolItems) return validateBoolItems;
  const validateBoolContains = compileArrayContainsBoolean(schemaObj, jsonSchema);
  if (validateBoolContains) return validateBoolContains;

  const validateArrayItem = compileArrayItems(schemaObj, jsonSchema)
    || compileTupleItems(schemaObj, jsonSchema);
  const validateArrayContains = compileArrayContains(schemaObj, jsonSchema);
  const maxItems = getIntegerishType(jsonSchema.maxItems, 0);

  if (validateArrayItem || validateArrayContains) {
    return function validateArrayChildren(data, dataRoot) {
      if (isArrayishType(data)) {
        let valid = true;
        let contains = false;
        let errors = 0;
        const len = maxItems > 0
          ? Math.min(maxItems, data.length)
          : data.length;

        for (let i = 0; i < len; ++i) {
          if (errors > 32) break;
          const obj = data[i];
          if (validateArrayItem) {
            if (validateArrayItem(obj, dataRoot, i) === false) {
              valid = false;
              errors++;
              continue;
            }
          }
          if (validateArrayContains) {
            if (contains === false && validateArrayContains(obj, dataRoot) === true) {
              if (validateArrayItem == null) return true;
              contains = true;
            }
          }
        }
        return valid && (validateArrayContains == null || contains === true);
      }
      return true;
    };
  }
  return undefined;
}
