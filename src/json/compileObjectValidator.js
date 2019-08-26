/* eslint-disable function-paren-newline */
import {
  String_createRegExp,
} from '../helpers/String';

// eslint-disable-next-line import/no-cycle
import {
  isObjectishType, isStrictArrayType, isStrictBooleanType,
} from '../types/isDataType';

import {
  getObjectishType,
  getIntegerishType,
  getStrictArray,
} from '../types/getDataType';

import {
  getBoolOrObject,
} from '../types/getDataTypeExtra';

import {
  fallbackFn,
  undefThat,
  trueThat,
} from '../types/isFunctionType';

import {
  isOfSchemaType,
} from './isSchemaType';

function compileCheckBounds(schemaObj, jsonSchema) {
  // get the defined lower and upper bounds of an array.
  const minprops = getIntegerishType(jsonSchema.minProperties);
  const maxprops = getIntegerishType(jsonSchema.maxProperties);

  function compileMaxProperties() {
    if (maxprops > 0) {
      const addError = schemaObj.createMemberError(
        'maxProperties',
        maxprops,
        compileMaxProperties);
      return function maxProperties(length) {
        const valid = length <= maxprops;
        if (!valid) addError(length);
        return valid;
      };
    }
    return undefined;
  }
  function compileMinProperties() {
    if (minprops > 0) {
      const addError = schemaObj.createMemberError(
        'minProperties',
        minprops,
        compileMinProperties);
      return function minProperties(length) {
        const valid = length >= minprops;
        if (!valid) addError(length);
        return valid;
      };
    }
    return undefined;
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

function compileRequiredProperties(schemaObj, jsonSchema, checkBounds) {
  const required = getStrictArray(jsonSchema.required);
  const objProps = getObjectishType(jsonSchema.properties);
  const mapItems = getStrictArray(jsonSchema.properties);

  // short cut to check for property bounds in case
  // no required properties are available
  if (required == null) {
    if (checkBounds == null) {
      return undefined;
    }

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

  // when the array is present but empty,
  // REQUIRE all of the properties
  let ismap = mapItems != null;
  let keys = required;
  if (keys.length === 0) {
    const ok = objProps && Object.keys(objProps);
    const mk = mapItems > 0 && Array.from(new Map(mapItems).keys());
    ismap = isStrictArrayType(mk);
    keys = ok || mk || keys;
  }

  if (keys.length > 0) {
    if (ismap === true) {
      const addError = schemaObj.createMemberError(
        'required',
        keys,
        compileRequiredProperties,
        'ismap');
      return function requiredMapKeys(data) {
        let valid = true;
        if (data.constructor === Map) {
          for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            if (data.has(key) === false) {
              addError(key, data);
              valid = false;
            }
          }
          const length = data.size;
          valid = checkBounds(length) && valid;
        }
        return valid;
      };
    }
    else {
      const addError = schemaObj.createMemberError(
        'required',
        keys,
        compileRequiredProperties,
        'isobject');
      return function requiredProperties(data) {
        let valid = true;
        const dataKeys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (dataKeys.includes(key) === false) {
            addError(key, data);
            valid = false;
          }
        }
        const length = dataKeys.length;
        valid = checkBounds(length) && valid;
        return valid;
      };
    }
  }

  return undefined;
}

function compileRequiredPatterns(schemaObj, jsonSchema) {
  const patterns = getStrictArray(jsonSchema.patternRequired);

  if (patterns && patterns.length > 0) {
    // produce an array of regexp objects to validate members.
    const regs = [];
    for (let i = 0; i < patterns.length; ++i) {
      const pattern = String_createRegExp(patterns[i]);
      if (pattern) {
        regs.push(pattern);
      }
    }

    const ismap = (getStrictArray(jsonSchema.properties) != null);
    if (regs.length > 0) {
      const addError = schemaObj.createMemberError('patternRequired', regs, compileRequiredPatterns, ismap ? 'ismap' : 'isobject');
      return function patternRequiredMap(data) {
        if (data == null) return true;
        if (typeof data !== 'object') return true;

        let valid = true;
        const dataKeys = data.constructor === Map
          ? Array.from(data.keys())
          : Object.keys(data);

        for (let i = 0; i < regs.length; ++i) {
          const reg = regs[i];
          let found = false;
          for (let j = 0; j < dataKeys.length; ++j) {
            if (reg.test(dataKeys)) {
              found = true;
              continue;
            }
          }
          if (!found) {
            addError(reg, data);
            valid = false;
          }
        }
        return valid;
      };
    }
  }

  return undefined;
}

export function compileObjectBasic(schemaObj, jsonSchema) {
  const checkBounds = fallbackFn(compileCheckBounds(schemaObj, jsonSchema));
  const valProps = compileRequiredProperties(schemaObj, jsonSchema, checkBounds);
  const valPatts = compileRequiredPatterns(schemaObj, jsonSchema, checkBounds);

  if (valProps && valPatts) {
    return function validateObjectBasic(data) {
      return valProps(data) && valPatts(data);
    };
  }
  else if (valProps) {
    return valProps;
  }
  else if (valPatts) {
    return valPatts;
  }

  return undefined;
}

function compilePropertyNames(schemaObj, jsonSchema) {
  const propNames = getObjectishType(jsonSchema.propertyNames);
  if (propNames) {
    const validate = schemaObj.createSingleValidator(
      'propertyNames',
      propNames,
      compilePropertyNames);
    if (validate != null) {
      return function validatePropertyName(key) {
        return validate(key);
      };
    }
  }
  return undefined;
}

function compilePropertyItem(schemaObj, jsonSchema) {
  const properties = getObjectishType(jsonSchema.properties);
  if (properties == null) return undefined;

  const keys = Object.keys(properties);
  if (keys.length > 0) {
    const children = {};

    const member = schemaObj.createMember('properties', compilePropertyItem);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const child = properties[key];
      if (isObjectishType(child)) {
        const validator = schemaObj.createPairValidator(member, key, child);
        if (validator != null) children[key] = validator;
      }
    }

    if (Object.keys(children).length > 0) {
      return function validatePropertyItem(key, data, dataRoot) {
        const validate = children[key];
        return validate != null
          ? validate(data[key], dataRoot)
          : undefined;
      };
    }
  }
  return undefined;
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
