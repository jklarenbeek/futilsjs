/* eslint-disable no-labels */
/* eslint-disable no-unused-labels */
/* eslint-disable function-paren-newline */
// eslint-disable-next-line import/no-cycle
import {
  isArrayType,
  isObjectType,
  isBoolOrObjectType,
} from '../../types/core';

import {
  getIntishType,
  getArrayTypeMinItems,
  getObjectType,
  getBoolOrObjectType,
} from '../../types/getters';

import {
  createRegExp,
} from '../../types/regexp';

import {
  undefThat,
  trueThat,
} from '../../types/functions';

import {
  isOfSchemaType,
} from '../schema/types';

//#region compile object constraints

function compileMinProperties(schemaObj, jsonSchema) {
  const min = getIntishType(jsonSchema.minProperties, 0);
  if (min < 1) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'minProperties',
    min,
    compileMinProperties);
  if (addError == null) return undefined;

  return function isMinProperties(len = 0) {
    return len >= min || addError(len);
  };
}

function compileMaxProperties(schemaObj, jsonSchema) {
  const max = getIntishType(jsonSchema.maxProperties, -1);
  if (max < 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'maxProperties',
    max,
    compileMaxProperties);
  if (addError == null) return undefined;

  return function isMaxProperties(len = 0) {
    return len <= max || addError(len);
  };
}

function compileRequiredProperties(schemaObj, jsonSchema) {
  const required = getArrayTypeMinItems(jsonSchema.required, 1);
  if (required == null) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'requiredProperties',
    required,
    compileRequiredProperties);
  if (addError == null) return undefined;

  return function validateRequiredProperties(dataKeys) {
    let valid = true;
    for (let i = 0; i < required.length; ++i) {
      const key = required[i];
      const idx = dataKeys.indexOf(key);
      if (idx === -1)
        valid = addError(key);
    }
    return valid;
  };
}

function compileRequiredPattern(schemaObj, jsonSchema) {
  const patterns = getArrayTypeMinItems(jsonSchema.patternRequired, 1);
  if (patterns == null) return undefined;

  const regexps = {};
  for (let i = 0; i < patterns.length; ++i) {
    const pattern = patterns[i];
    const regexp = createRegExp(pattern);
    if (regexp != null)
      regexps[String(pattern)] = regexp;
  }
  const regexpKeys = Object.keys(regexps);
  if (regexpKeys.length === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'patternRequired',
    regexpKeys,
    compileRequiredPattern);
  if (addError == null) return undefined;

  return function validateRequiredPattern(dataKeys) {
    let valid = true;
    outer: for (let r = 0; r < regexpKeys.length; ++r) {
      const regexp = regexps[regexpKeys[r]];
      // find first match
      inner: for (let i = 0; i < dataKeys.length; ++i) {
        const dataKey = dataKeys[i];
        if (regexp.test(dataKey)) continue outer;
      }
      valid = addError(regexp);
    }
    return valid;
  };
}

function compileDependencyArray(schemaObj, member, depKey, depItems) {
  if (depItems.length === 0) return undefined;

  const addError = schemaObj.createPairErrorHandler(
    member,
    depKey,
    depItems,
    compileDependencyArray);
  if (addError == null) return undefined;

  return function validateDependencyArray(data, dataRoot, dataKeys) {
    let valid = true;
    for (let i = 0; i < depItems.length; ++i) {
      const itemKey = depItems[i];
      if (dataKeys.includes(itemKey) === false) {
        addError(itemKey);
        valid = false;
      }
    }
    return valid;
  };
}

function compileDependencies(schemaObj, jsonSchema) {
  const dependencies = getObjectType(jsonSchema.dependencies);
  if (dependencies == null) return undefined;

  const dependKeys = Object.keys(dependencies);
  if (dependKeys.length === 0) return undefined;

  const member = schemaObj.createMember(
    'dependencies',
    compileDependencies);
  if (member == null) return undefined;

  const validators = {};
  for (let i = 0; i < dependKeys.length; ++i) {
    const depKey = dependKeys[i];
    const depItem = dependencies[depKey];
    if (isArrayType(depItem)) {
      const validator = compileDependencyArray(
        schemaObj,
        member,
        depKey,
        depItem);
      if (validator != null)
        validators[depKey] = validator;
    }
    else if (isBoolOrObjectType(depItem)) {
      const validator = schemaObj.createPairValidator(
        member,
        depKey,
        depItem,
        compileDependencies);
      if (validator != null)
        validators[depKey] = validator;
    }
  }

  const validatorKeys = Object.keys(validators);
  if (validatorKeys.length === 0) return undefined;

  return function validateDependencies(data, dataRoot, dataKeys) {
    let valid = true;
    let errors = 0;
    for (let i = 0; i < validatorKeys.length; ++i) {
      if (errors > 32) break;
      const key = validatorKeys[i];
      if (dataKeys.includes(key)) {
        const validator = validators[key];
        if (validator(data, dataRoot, dataKeys) === false) {
          valid = false;
          errors++;
        }
      }
    }
    return valid;
  };
}

//#endregion

//#region compile object children

function compileObjectPropertyNames(schemaObj, propNames) {
  if (propNames == null) return undefined;

  const validator = schemaObj.createSingleValidator(
    'propertyNames',
    propNames,
    compileObjectPropertyNames);
  if (validator == null) return undefined;

  return validator;
}

function createObjectPropertyValidators(schemaObj, properties) {
  if (properties == null) return undefined;

  const keys = Object.keys(properties);
  if (keys.length === 0) return undefined;

  const member = schemaObj.createMember('properties', compileObjectPropertyItem);
  if (member == null) return undefined;

  const children = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const child = properties[key];
    const validator = schemaObj.createPairValidator(member, key, child);
    if (validator != null)
      children[key] = validator;
  }
  return (Object.keys(children).length > 0)
    ? children
    : undefined;
}

function compileObjectPropertyItem(children) {
  if (children == null) return undefined;

  return function validatePropertyItem(key, data, dataRoot) {
    const validator = children[key];
    return validator != null
      ? validator(data[key], dataRoot)
      : undefined;
  };
}

function compileObjectPatternItem(schemaObj, entries) {
  if (entries == null) return undefined;

  const entryKeys = Object.keys(entries);
  if (entryKeys.length === 0) return undefined;

  const patterns = {};
  for (let i = 0; i < entryKeys.length; ++i) {
    const key = entryKeys[i];
    const pattern = createRegExp(key);
    if (pattern != null)
      patterns[key] = pattern;
  }

  const patternKeys = Object.keys(patterns);
  if (patternKeys.length === 0) return undefined;

  const member = schemaObj.createMember('patternProperties', compileObjectPatternItem);
  if (member == null) return undefined;

  const validators = {};
  for (let i = 0; i < patternKeys.length; ++i) {
    const key = patternKeys[i];
    const child = entries[key];
    const validator = schemaObj.createPairValidator(member, key, child);
    if (validator != null)
      validators[key] = validator;
  }

  const validatorKeys = Object.keys(validators);
  if (validatorKeys.length === 0) return undefined;

  return function validatePatternItem(propertyKey, data, dataRoot) {
    for (let i = 0; i < validatorKeys.length; ++i) {
      const key = validatorKeys[i];
      const pattern = patterns[key];
      if (pattern.test(propertyKey)) {
        const validate = validators[key];
        return validate(data[propertyKey], dataRoot);
      }
    }
    return undefined;
  };
}

function compileObjectAdditionalProperty(schemaObj, additional) {
  if (additional === true) return undefined;

  if (additional === false) {
    const addError = schemaObj.createSingleErrorHandler(
      'additionalProperties',
      false,
      compileObjectAdditionalProperty);
    if (addError == null) return undefined;

    // eslint-disable-next-line no-unused-vars
    return function noAdditionalProperties(dataKey, data, dataRoot) {
      return addError(dataKey, data);
    };
  }

  const validator = schemaObj.createSingleValidator(
    'additionalProperties',
    additional,
    compileObjectAdditionalProperty);
  if (validator == null) return undefined;

  return function validateAdditionalProperty(key, data, dataRoot) {
    return validator(data[key], dataRoot);
  };
}

function compileObjectChildren(schemaObj, jsonSchema) {
  const properties = getObjectType(jsonSchema.properties);
  const ptrnProps = getObjectType(jsonSchema.patternProperties);
  const propNames = getObjectType(jsonSchema.propertyNames);
  const addlProps = getBoolOrObjectType(jsonSchema.additionalProperties, true);

  const validatorChildren = createObjectPropertyValidators(schemaObj, properties);
  const patternValidator = compileObjectPatternItem(schemaObj, ptrnProps);
  const nameValidator = compileObjectPropertyNames(schemaObj, propNames);
  const additionalValidator = compileObjectAdditionalProperty(schemaObj, addlProps);

  if (!(patternValidator
    || nameValidator
    || additionalValidator) == null) {
    if (validatorChildren == null) return undefined;

    const childrenKeys = Object.keys(validatorChildren);
    return function validateProperties(data, dataRoot, dataKeys) {
      let valid = true;
      for (let i = 0; i < childrenKeys.length; ++i) {
        const key = childrenKeys[i];
        if (dataKeys.includes(key)) {
          const validator = validatorChildren[key];
          valid = validator(data[key], dataRoot) && valid;
        }
      }
      return valid;
    };
  }

  const propertyValidator = compileObjectPropertyItem(validatorChildren);

  const validateProperty = propertyValidator || undefThat;
  const validatePattern = patternValidator || undefThat;
  const validateName = nameValidator || trueThat;
  const validateAdditional = additionalValidator || trueThat;

  return function validateObjectChildren(data, dataRoot, dataKeys) {
    let valid = true;
    let errors = 0;
    for (let i = 0; i < dataKeys.length; ++i) {
      if (errors > 32) break; // TODO: get max list errors from config
      const dataKey = dataKeys[i];

      let result = validateProperty(dataKey, data, dataRoot);
      if (result != null) {
        if (result === false) {
          valid = false;
          errors++;
        }
        continue;
      }

      result = validatePattern(dataKey, data, dataRoot);
      if (result != null) {
        if (result === false) {
          valid = false;
          errors++;
        }
        continue;
      }

      if (validateName(dataKey) === false) {
        valid = false;
        errors++;
        continue;
      }

      result = validateAdditional(dataKey, data, dataRoot);
      if (result === false) {
        valid = false;
        errors++;
      }
    }
    return valid;
  };
}

//#endregion

// validate state of return value in check of wirestatestoactions!

export function compileObjectSchema(schemaObj, jsonSchema) {
  if (isOfSchemaType(jsonSchema, 'map'))
    return undefined;

  const minProperties = compileMinProperties(schemaObj, jsonSchema);
  const maxProperties = compileMaxProperties(schemaObj, jsonSchema);
  const requiredProperties = compileRequiredProperties(schemaObj, jsonSchema);
  const requiredPattern = compileRequiredPattern(schemaObj, jsonSchema);

  const dependencies = compileDependencies(schemaObj, jsonSchema);
  const objectChildren = compileObjectChildren(schemaObj, jsonSchema);

  if ((minProperties
    || maxProperties
    || requiredProperties
    || requiredPattern
    || dependencies
    || objectChildren) == null)
    return undefined;

  const isMinProperties = minProperties || trueThat;
  const isMaxProperties = maxProperties || trueThat;

  const hasRequiredProperties = requiredProperties || trueThat;
  const hasRequiredPattern = requiredPattern || trueThat;

  const hasDependencies = dependencies || trueThat;
  const validateChildren = objectChildren || trueThat;

  return function validateObjectSchema(data, dataRoot) {
    if (isObjectType(data)) {
      const dataKeys = Object.keys(data);
      const dataLen = dataKeys.length;
      return isMinProperties(dataLen)
        && isMaxProperties(dataLen)
        && hasRequiredProperties(dataKeys)
        && hasRequiredPattern(dataKeys)
        && hasDependencies(data, dataRoot, dataKeys)
        && validateChildren(data, dataRoot, dataKeys);
    }
    return true;
  };
}
