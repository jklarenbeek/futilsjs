/* eslint-disable function-paren-newline */
import {
  String_createRegExp,
} from '../helpers/String';

// eslint-disable-next-line import/no-cycle
import {
  isObjectishType,
  isStrictBooleanType,
} from '../types/isDataType';

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
  falseThat,
} from '../types/isFunctionType';

import {
  isOfSchemaType,
} from './isSchemaType';

function compileCheckBounds(schemaObj, jsonSchema) {
  // get the defined lower and upper bounds of an array.
  const minprops = getIntegerishType(jsonSchema.minProperties);
  const maxprops = getIntegerishType(jsonSchema.maxProperties);

  function compileMaxProperties() {
    if (maxprops === 0) return undefined;

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
    if (minprops === 0) return undefined;

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
    if (data == null) return true;
    if (typeof data !== 'object') return true;
    if (data.constructor === Map) {
      return checkBounds(data.size);
    }
    else {
      return checkBounds(Object.keys(data).length);
    }
  };
}

function compileRequiredProperties(schemaObj, jsonSchema, checkBounds) {
  const required = getStrictArray(jsonSchema.required);
  if (required == null) return undefined;

  const mapProps = getMapOfArray(jsonSchema.properties);
  const objProps = getObjectishType(jsonSchema.properties);

  const keys = required.length !== 0
    ? required
    : mapProps != null
      ? Array.from(mapProps.keys())
      : objProps != null
        ? Object.keys(objProps)
        : [];

  if (keys.length === 0) return undefined;

  checkBounds = checkBounds || trueThat;

  const addError = schemaObj.createMemberError(
    'requiredProperties',
    required,
    compileRequiredProperties);
  if (addError == null) return undefined;

  return function requiredProperties(data) {
    if (data == null) return true;
    if (typeof data !== 'object') return true;
    let valid = true;
    if (data.constructor === Map) {
      for (let i = 0; i < keys.length; ++i) {
        if (data.has(keys[i]) === false) {
          valid = addError(keys[i], data);
        }
      }
      return checkBounds(data.size) && valid;
    }

    const dataKeys = Object.keys(data);
    for (let i = 0; i < keys.length; ++i) {
      if (dataKeys.includes(keys[i]) === false) {
        valid = addError(keys[i], data);
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
    if (data == null) return true;
    if (typeof data !== 'object') return true;

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
  const valProps = compileRequiredProperties(schemaObj, jsonSchema, checkBounds)
    || compileDefaultPropertyBounds(checkBounds);
  const valPatts = compileRequiredPatterns(schemaObj, jsonSchema);

  if (valProps && valPatts) {
    return function validateObjectBasic(data) {
      return valProps(data) && valPatts(data);
    };
  }

  return valProps || valPatts;
}

function compilePropertyNames(schemaObj, jsonSchema) {
  const propNames = getObjectishType(jsonSchema.propertyNames);
  if (propNames == null) return undefined;

  const validator = schemaObj.createSingleValidator(
    'propertyNames',
    propNames,
    compilePropertyNames);
  if (validator == null) return undefined;

  return function validatePropertyName(key) {
    return validator(key);
  };
}

function compilePropertyItem(schemaObj, jsonSchema) {
  const properties = getObjectishType(jsonSchema.properties);
  if (properties == null) return undefined;

  const keys = Object.keys(properties);
  if (keys.length === 0) return undefined;

  const member = schemaObj.createMember('properties', compilePropertyItem);
  if (member == null) return undefined;

  const children = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const child = properties[key];
    if (child === true)
      children[key] = trueThat;
    else if (child === false)
      children[key] = falseThat;
    else if (isObjectishType(child)) {
      const validator = schemaObj.createPairValidator(member, key, child);
      if (validator != null)
        children[key] = validator;
    }
    else
      children[key] = falseThat;
  }
  if (Object.keys(children).length === 0) return undefined;

  return function validatePropertyItem(key, data, dataRoot) {
    const validator = children[key];
    return validator != null
      ? validator(data[key], dataRoot)
      : undefined;
  };
}

function compileMapValueItem(schemaObj, jsonSchema) {
  const properties = getMapOfArray(jsonSchema.properties);
  if (properties == null) return undefined;
  if (properties.size === 0) return undefined;

  const member = schemaObj.createMember('properties', compileMapValueItem);
  if (member == null) return undefined;

  const children = new Map();
  for (const [key, child] of properties) {
    if (child === true)
      children.set(key, trueThat);
    else if (child === false)
      children.set(key, falseThat);
    else if (!isObjectishType(value))
      children.set(key, falseThat); // we return false on schema error
    else {
      const validator = schemaObject.createPairValidator(member, key, value);
      if (validator != null)
        children.set(key, validator);
    }
    if (children.size === 0) return undefined;

    return function validateMapValueItem(key, data, dataRoot) {
      const validator = children.get(key);
      if (validator == null) return undefined;
      return data.constructor === Map
        ? validator(data.get(key), dataRoot)
        : validator(data[key], dataRoot);
    }
}

function compilePatternItem(schemaObj, jsonSchema) {
  const patterns = getObjectishType(jsonSchema.patternProperties);
  if (patterns == null) return undefined;

  const keys = Object.keys(patterns);
  if (keys.length > 0) {
    const regs = {};
    const props = {};

    const member = schemaObj.createMember('patternProperties', compilePatternItem);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const rxp = String_createRegExp(key);
      if (rxp != null) {
        const child = patterns[key];
        const validator = schemaObj.createPairValidator(member, key, child);
        if (validator != null) {
          regs[key] = rxp;
          props[key] = validator;
        }
      }
    }

    const regKeys = Object.keys(regs);
    if (regKeys.length > 0) {
      return function validatePatternItem(key, data, dataRoot) {
        for (let i = 0; i < regKeys.length; ++i) {
          const rky = regKeys[i];
          const rxp = regs[rky];
          if (rxp.test(key)) {
            const validate = props[rky];
            return validate(data[key], dataRoot);
          }
        }
        return undefined;
      };
    }
  }
  return undefined;
}

function compileAdditionalItem(schemaObj, jsonSchema) {
  const additional = getBoolOrObject(jsonSchema.additionalProperties, true);
  if (additional === false) {
    const addError = schemaObj.createMemberError(
      'additionalProperties',
      false,
      compileAdditionalItem);
    // eslint-disable-next-line no-unused-vars
    return function noAdditionalProperties(dataKey, data, dataRoot) {
      return addError(dataKey, data);
    };
  }
  if (additional !== true) {
    const validate = schemaObj.createSingleValidator(
      'additionalProperties',
      additional,
      compileAdditionalItem);
    if (validate != null) {
      return function validateAdditionalItem(key, data, dataRoot) {
        return validate(data[key], dataRoot);
      };
    }
  }

  return undefined;
}

export function compileObjectChildren(schemaObj, jsonSchema) {
  const propNames = getObjectishType(jsonSchema.propertyNames);
  const properties = getObjectishType(jsonSchema.properties);
  const patterns = getObjectishType(jsonSchema.patternProperties);
  const additional = getBoolOrObject(jsonSchema.additionalProperties, true);

  if (propNames == null && properties == null && patterns == null && additional === true)
    return undefined;

  // make sure we are not part of a map!
  if (!isStrictBooleanType(additional)) {
    if (properties == null && patterns == null) {
      if (isOfSchemaType(jsonSchema, 'map')) return undefined;
    }
  }

  // eslint-disable-next-line no-constant-condition
  if (true) {
    const validateName = fallbackFn(
      compilePropertyNames(schemaObj, jsonSchema),
      trueThat,
    );
    const validateProperty = fallbackFn(
      compilePropertyItem(schemaObj, jsonSchema),
      undefThat,
    );
    const validatePattern = fallbackFn(
      compilePatternItem(schemaObj, jsonSchema),
      undefThat,
    );
    const validateAdditional = fallbackFn(
      compileAdditionalItem(schemaObj, jsonSchema),
      trueThat,
    );

    return function validateObjectChildren(data, dataRoot) {
      let valid = true;
      if (isObjectishType(data)) {
        const dataKeys = Object.keys(data);
        let errors = 0;
        for (let i = 0; i < dataKeys.length; ++i) {
          if (errors > 32) break;
          const dataKey = dataKeys[i];
          if (validateName(dataKey) === false) {
            valid = false;
            continue;
          }

          let result = validateProperty(dataKey, data, dataRoot);
          if (result != null) {
            dataKeys[i] = result;
            if (result === false) {
              valid = false;
              errors++;
            }
            continue;
          }

          result = validatePattern(dataKey, data, dataRoot);
          if (result != null) {
            dataKeys[i] = result;
            if (result === false) {
              valid = false;
              errors++;
            }
            continue;
          }

          result = validateAdditional(dataKey, data, dataRoot);
          dataKeys[i] = result;
          if (result === false) {
            valid = false;
            errors++;
          }
        }
      }
      return valid;
    };
  }
  return undefined;
}
