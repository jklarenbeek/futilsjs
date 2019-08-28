/* eslint-disable no-unused-vars */
/* eslint-disable function-paren-newline */
import {
  isArrayishType,
} from '../types/isDataType';

import {
  getObjectishType,
  getIntegerishType,
  getBooleanishType,
} from '../types/getDataType';

import {
  getArrayOrSetLength,
} from '../types/getDataTypeExtra';

import {
  isArrayOrSet,
} from '../types/isDataTypeExtra';

import {
  trueThat,
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

function compileBooleanItems(schemaObj, jsonSchema) {
  const items = getBooleanishType(jsonSchema.items);
  if (items === false) {
    const addError = schemaObj.createMemberError(
      'items',
      false,
      compileBooleanItems);

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

function compileBooleanContains(schemaObj, jsonSchema) {
  const contains = getBooleanishType(jsonSchema.contains);
  if (contains === true) {
    const addError = schemaObj.createMemberError(
      'contains',
      true,
      compileBooleanContains);
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
      compileBooleanContains);
    return function validateArrayContainsFalse(data, dataRoot) {
      if (isArrayishType(data)) {
        return addError(data);
      }
      return true;
    };
  }
  return undefined;
}

function compileSchemaItems(schemaObj, jsonSchema) {
  const items = getObjectishType(jsonSchema.items);
  if (items == null) return undefined;

  return schemaObj.createSingleValidator(
    'items',
    items,
    compileSchemaItems);
}

function compileSchemaContains(schemaObj, jsonSchema) {
  const contains = getObjectishType(jsonSchema.contains);
  if (contains == null) return undefined;

  return schemaObj.createSingleValidator(
    'contains',
    contains,
    compileSchemaContains);
}

export function compileArrayChildren(schemaObj, jsonSchema) {
  const maxItems = getIntegerishType(jsonSchema.maxItems, 0);

  const validateBoolItems = compileBooleanItems(schemaObj, jsonSchema);
  if (validateBoolItems) return validateBoolItems;
  const validateBoolContains = compileBooleanContains(schemaObj, jsonSchema);
  if (validateBoolContains) return validateBoolContains;

  const validateSchemaItem = compileSchemaItems(schemaObj, jsonSchema);
  const validateSchemaContains = compileSchemaContains(schemaObj, jsonSchema);

  if (validateSchemaItem || validateSchemaContains) {
    return function validateArrayChildren(data, dataRoot) {
      if (isArrayishType(data)) {
        let valid = true;
        let found = false;
        let errors = 0;
        const len = maxItems > 0
          ? Math.min(maxItems, data.length)
          : data.length;
        for (let i = 0; i < len; ++i) {
          if (errors > 32) break;
          const obj = data[i];
          if (validateSchemaItem) {
            if (validateSchemaItem(obj, dataRoot) === false) {
              valid = false;
              errors++;
              continue;
            }
          }
          if (validateSchemaContains) {
            if (found === false && validateSchemaContains(obj, dataRoot) === true) {
              if (validateSchemaItem == null) return true;
              found = true;
            }
          }
        }
        return valid && (validateSchemaContains == null || found === true);
      }
      return true;
    };
  }
  return undefined;
}
