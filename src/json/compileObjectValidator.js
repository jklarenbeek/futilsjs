/* eslint-disable function-paren-newline */
import {
  String_createRegExp,
} from '../helpers/String';

// eslint-disable-next-line import/no-cycle
import {
  isObjectishType,
} from '../types/isDataType';

import {
  isMapOrObjectish,
} from '../types/isDataTypeExtra';

import {
  getObjectishType,
  getIntegerishType,
  getStrictArray,
} from '../types/getDataType';

import {
  getBoolOrObject,
  getMapOfArray,
} from '../types/getDataTypeExtra';

import {
  fallbackFn,
  undefThat,
  trueThat,
  isFn,
} from '../types/isFunctionType';

function compileCheckBounds(schemaObj, jsonSchema) {
  function compileMaxProperties() {
    const maxprops = getIntegerishType(jsonSchema.maxProperties);
    if (!(maxprops > 0)) return undefined;

    const addError = schemaObj.createMemberError(
      'maxProperties',
      maxprops,
      compileMaxProperties);
    if (addError == null) return undefined;

    return function maxProperties(length) {
      return length <= maxprops
        ? true
        : addError(length);
    };
  }

  function compileMinProperties() {
    const minprops = getIntegerishType(jsonSchema.minProperties);
    if (!(minprops > 0)) return undefined;

    const addError = schemaObj.createMemberError(
      'minProperties',
      minprops,
      compileMinProperties);
    if (addError == null) return undefined;

    return function minProperties(length) {
      return length >= minprops
        ? true
        : addError(length);
    };
  }

  const xp = compileMaxProperties();
  const mp = compileMinProperties();
  if (xp && mp) {
    return function checkPropertyBounds(length) {
      return xp(length) && mp(length);
    };
  }
  return xp || mp;
}

function compileDefaultPropertyBounds(checkBounds) {
  if (!isFn(checkBounds)) return undefined;
  return function propertyBounds(data) {
    return !isMapOrObjectish(data)
      ? true
      : data.constructor === Map
        ? checkBounds(data.size)
        : checkBounds(Object.keys(data).length);
  };
}

function compileRequiredProperties(schemaObj, jsonSchema, checkBounds) {
  const required = getStrictArray(jsonSchema.required);
  if (required == null) return undefined;

  const mapProps = getMapOfArray(jsonSchema.properties);
  const objProps = getObjectishType(jsonSchema.properties);

  const requiredKeys = required.length !== 0
    ? required
    : mapProps != null
      ? Array.from(mapProps.keys())
      : objProps != null
        ? Object.keys(objProps)
        : [];

  if (requiredKeys.length === 0) return undefined;

  checkBounds = checkBounds || trueThat;

  const addError = schemaObj.createMemberError(
    'requiredProperties',
    required,
    compileRequiredProperties);
  if (addError == null) return undefined;

  return function requiredProperties(data) {
    if (!isMapOrObjectish(data)) return true;

    let valid = true;
    if (data.constructor === Map) {
      for (let i = 0; i < requiredKeys.length; ++i) {
        if (data.has(requiredKeys[i]) === false) {
          valid = addError(requiredKeys[i], data);
        }
      }
      return checkBounds(data.size) && valid;
    }

    const dataKeys = Object.keys(data);
    for (let i = 0; i < requiredKeys.length; ++i) {
      if (dataKeys.includes(requiredKeys[i]) === false) {
        valid = addError(requiredKeys[i], data);
      }
    }
    return checkBounds(dataKeys.length) && valid;
  };
}

function compileRequiredPatterns(schemaObj, jsonSchema) {
  const required = getStrictArray(jsonSchema.patternRequired);
  if (required == null || required.length === 0) return undefined;

  // produce an array of regexp objects to validate members.
  const patterns = [];
  for (let i = 0; i < required.length; ++i) {
    const pattern = String_createRegExp(required[i]);
    if (pattern) patterns.push(pattern);
  }
  if (patterns.length === 0) return undefined;

  const addError = schemaObj.createMemberError(
    'patternRequired',
    patterns,
    compileRequiredPatterns);
  if (addError == null) return undefined;

  return function patternRequired(data) {
    if (!isMapOrObjectish(data)) return true;

    const dataKeys = data.constructor === Map
      ? Array.from(data.keys())
      : Object.keys(data);

    let valid = true;
    for (let i = 0; i < patterns.length; ++i) {
      const pattern = patterns[i];
      let found = false;
      for (let j = 0; j < dataKeys.length; ++j) {
        const dk = dataKeys[j];
        if (dk != null && pattern.test(dk)) {
          found = true;
          dataKeys[j] = undefined;
          break;
        }
      }
      if (!found)
        valid = addError(data, pattern);
    }
    return valid;
  };
}

export function compileObjectBasic(schemaObj, jsonSchema) {
  const checkBounds = compileCheckBounds(schemaObj, jsonSchema);
  return [
    compileRequiredProperties(schemaObj, jsonSchema, checkBounds)
      || compileDefaultPropertyBounds(checkBounds),
    compileRequiredPatterns(schemaObj, jsonSchema),
  ];
}

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
    const pattern = String_createRegExp(key);
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
    const addError = schemaObj.createMemberError(
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

export function compileObjectChildren(schemaObj, jsonSchema) {
  const properties = getObjectishType(jsonSchema.properties);
  const ptrnProps = getObjectishType(jsonSchema.patternProperties);
  const propNames = getObjectishType(jsonSchema.propertyNames);
  const addlProps = getBoolOrObject(jsonSchema.additionalProperties, true);

  const validatorChildren = createObjectPropertyValidators(schemaObj, properties);
  const patternValidator = compileObjectPatternItem(schemaObj, ptrnProps);
  const nameValidator = compileObjectPropertyNames(schemaObj, propNames);
  const additionalValidator = compileObjectAdditionalProperty(schemaObj, addlProps);

  if (patternValidator == null
    && nameValidator == null
    && additionalValidator == null) {
    if (validatorChildren == null) return undefined;

    const childrenKeys = Object.keys(validatorChildren);
    return function validateProperties(data, dataRoot) {
      if (isObjectishType(data)) {
        const dataKeys = Object.keys(data);
        if (dataKeys.length === 0) return true;
        let valid = true;
        for (let i = 0; i < childrenKeys.length; ++i) {
          const key = childrenKeys[i];
          if (dataKeys.includes(key)) {
            const validator = validatorChildren[key];
            valid = validator(data[key], dataRoot) && valid;
          }
        }
        return valid;
      }
      return true;
    };
  }

  const propertyValidator = compileObjectPropertyItem(validatorChildren);

  const validateProperty = fallbackFn(propertyValidator, undefThat);
  const validatePattern = fallbackFn(patternValidator, undefThat);
  const validateName = fallbackFn(nameValidator, trueThat);
  const validateAdditional = fallbackFn(additionalValidator, trueThat);

  return function validateObjectChildren(data, dataRoot) {
    if (isObjectishType(data)) {
      const dataKeys = Object.keys(data);
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
    }
    return true;
  };
}
