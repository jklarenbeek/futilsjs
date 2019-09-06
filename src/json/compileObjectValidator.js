/* eslint-disable function-paren-newline */
// eslint-disable-next-line import/no-cycle
import {
  isFn,
  isArrayType,
  isObjectType,
  isObjectOrMapType,
  isBoolOrObjectType,
} from '../types/core';

import {
  getIntishType,
  getArrayType,
  getObjectType,
  getBoolOrObjectType,
} from '../types/getters';

import {
  String_createRegExp,
} from '../types/strings';

import {
  getMapOfArray,
} from '../types/getDataTypeExtra';

import {
  fallbackFn,
  undefThat,
  trueThat,
} from '../types/functions';

function compileCheckBounds(schemaObj, jsonSchema) {
  function compileMaxProperties() {
    const maxprops = getIntishType(jsonSchema.maxProperties);
    if (!(maxprops > 0)) return undefined;

    const addError = schemaObj.createSingleErrorHandler(
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
    const minprops = getIntishType(jsonSchema.minProperties);
    if (!(minprops > 0)) return undefined;

    const addError = schemaObj.createSingleErrorHandler(
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
    return !isObjectOrMapType(data)
      ? true
      : data.constructor === Map
        ? checkBounds(data.size)
        : checkBounds(Object.keys(data).length);
  };
}

function compileRequiredProperties(schemaObj, jsonSchema, checkBounds) {
  const required = getArrayType(jsonSchema.required);
  if (required == null) return undefined;

  const mapProps = getMapOfArray(jsonSchema.properties);
  const objProps = getObjectType(jsonSchema.properties);

  const requiredKeys = required.length !== 0
    ? required
    : mapProps != null
      ? Array.from(mapProps.keys())
      : objProps != null
        ? Object.keys(objProps)
        : [];

  if (requiredKeys.length === 0) return undefined;

  checkBounds = checkBounds || trueThat;

  const addError = schemaObj.createSingleErrorHandler(
    'requiredProperties',
    required,
    compileRequiredProperties);
  if (addError == null) return undefined;

  return function requiredProperties(data) {
    if (!isObjectOrMapType(data)) return true;

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
  const required = getArrayType(jsonSchema.patternRequired);
  if (required == null || required.length === 0) return undefined;

  // produce an array of regexp objects to validate members.
  const patterns = [];
  for (let i = 0; i < required.length; ++i) {
    const pattern = String_createRegExp(required[i]);
    if (pattern) patterns.push(pattern);
  }
  if (patterns.length === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'patternRequired',
    patterns,
    compileRequiredPatterns);
  if (addError == null) return undefined;

  return function patternRequired(data) {
    if (!isObjectOrMapType(data)) return true;

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

function compileDependencyArray(schemaObj, member, key, items) {
  if (items.length === 0) return undefined;

  const addError = schemaObj.createPairErrorHandler(member, key, items, compileDependencyArray);
  if (addError == null) return undefined;

  return function validateDependencyArray(data) {
    if (!isObjectOrMapType(data)) return true;
    let valid = true;
    if (data.constructor === Map) {
      for (let i = 0; i < items.length; ++i) {
        if (data.has(items[i]) === false) {
          addError(items[i]);
          valid = false;
        }
      }
    }
    else {
      const keys = Object.keys(data);
      for (let i = 0; i < items.length; ++i) {
        if (keys.includes(items[i]) === false) {
          addError(items[i]);
          valid = false;
        }
      }
    }
    return valid;
  };
}

function compileDependencies(schemaObj, jsonSchema) {
  const dependencies = getObjectType(jsonSchema.dependencies);
  if (dependencies == null) return undefined;

  const depKeys = Object.keys(dependencies);
  if (depKeys.length === 0) return undefined;

  const member = schemaObj.createMember('dependencies', compileDependencies);
  if (member == null) return undefined;

  const validators = {};
  for (let i = 0; i < depKeys.length; ++i) {
    const key = depKeys[i];
    const item = dependencies[key];
    if (isArrayType(item)) {
      const validator = compileDependencyArray(schemaObj, member, key, item);
      if (validator != null) validators[key] = validator;
    }
    else if (isBoolOrObjectType(item)) {
      const validator = schemaObj.createPairValidator(member, key, item, compileDependencies);
      if (validator != null) validators[key] = validator;
    }
  }

  const valKeys = Object.keys(validators);
  if (valKeys.length === 0) return undefined;

  return function validateDependencies(data, dataRoot) {
    if (!isObjectOrMapType(data)) return true;
    let valid = true;
    let errors = 0;
    if (data.constructor === Map) {
      for (let i = 0; i < valKeys.length; ++i) {
        if (errors > 32) break;
        const key = valKeys[i];
        if (data.has(key)) {
          const validator = validators[key];
          if (validator(data, dataRoot) === false) {
            valid = false;
            errors++;
          }
        }
      }
    }
    else {
      for (let i = 0; i < valKeys.length; ++i) {
        if (errors > 32) break;
        const key = valKeys[i];
        if (data.hasOwnProperty(key)) {
          const validator = validators[key];
          if (validator(data, dataRoot) === false) {
            valid = false;
            errors++;
          }
        }
      }
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
    compileDependencies(schemaObj, jsonSchema),
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

export function compileObjectChildren(schemaObj, jsonSchema) {
  const properties = getObjectType(jsonSchema.properties);
  const ptrnProps = getObjectType(jsonSchema.patternProperties);
  const propNames = getObjectType(jsonSchema.propertyNames);
  const addlProps = getBoolOrObjectType(jsonSchema.additionalProperties, true);

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
      if (isObjectType(data)) {
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
    if (isObjectType(data)) {
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
