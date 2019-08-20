import {
  String_createRegExp,
} from '../helpers/String';

// eslint-disable-next-line import/no-cycle
import {
  isObjectishType,
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
} from '../types/isFunctionType';

import {
  isOfSchemaType,
} from './isSchemaType';

function compileCheckBounds(schema, addErrorMember) {
  // get the defined lower and upper bounds of an array.
  const minprops = getIntegerishType(schema.minProperties);
  const maxprops = getIntegerishType(schema.maxProperties);

  function compileMaxProperties() {
    if (maxprops > 0) {
      const addError = addErrorMember('maxProperties', maxprops, compileObjectBasic);
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
      const addError = addErrorMember('minProperties', minprops, compileObjectBasic);
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

function compileRequiredProperties(schema, addErrorMember, checkBounds) {
  const required = getStrictArray(schema.required);
  const objProps = getObjectishType(schema.properties);
  const mapProps = getStrictArray(schema.properties);

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
  let ismap = mapProps != null;
  let keys = required;
  if (keys.length === 0) {
    const ok = objProps && Object.keys(objProps);
    const mk = mapProps > 0 && Array.from(new Map(mapProps).keys());
    ismap = mapProps != null;
    keys = ok || mk || keys;
  }

  if (keys.length > 0) {
    if (ismap === true) {
      const addError = addErrorMember('required', keys, compileRequiredProperties, 'ismap');
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
      const addError = addErrorMember('required', keys, compileRequiredProperties, 'isobject');
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

function compileRequiredPatterns(schema, addErrorMember) {
  const patterns = getStrictArray(schema.patternRequired);

  if (patterns && patterns.length > 0) {
    // produce an array of regexp objects to validate members.
    const regs = [];
    for (let i = 0; i < patterns.length; ++i) {
      const pattern = String_createRegExp(patterns[i]);
      if (pattern) {
        regs.push(pattern);
      }
    }

    const ismap = (getStrictArray(schema.properties) != null);
    if (regs.length > 0) {
      const addError = addErrorMember('patternRequired', regs, compileRequiredPatterns, ismap ? 'ismap' : 'isobject');
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

export function compileObjectBasic(schema, addErrorMember) {
  const checkBounds = compileCheckBounds();
  const valProps = compileRequiredProperties(schema, addErrorMember, checkBounds);
  const valPatts = compileRequiredPatterns(schema, addErrorMember, checkBounds);

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

function compileProperties(schema, addMember, addChildObject) {
  const properties = getObjectishType(schema.properties);

  const keys = Object.keys(properties);
  if (keys.length > 0) {
    const children = {};

    const member = addMember('properties');
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const child = properties[key];
      if (isObjectishType(child)) {
        const cb = addChildObject(member, key, child);
        if (cb != null) children[key] = cb;
      }
    }

    if (Object.keys(children).length > 0) {
      return function validateProperty(key, data, dataRoot) {
        const cb = children[key];
        return cb != null
          ? cb(data[key], dataRoot)
          : undefined;
      };
    }
  }
  return undefined;
}

function compilePatterns(schema, addMember, addChildSchema) {
  const patterns = getObjectishType(schema.patternProperties);

  const keys = Object.keys(patterns);
  if (keys.length > 0) {
    const regs = {};
    const props = {};

    const member = addMember('patternProperties', compileObjectChildren);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const rxp = String_createRegExp(key);
      if (rxp != null) {
        const child = patterns[key];
        const cb = addChildSchema(member, key, child);
        if (cb != null) {
          regs[key] = rxp;
          props[key] = cb;
        }
      }
    }

    const regKeys = Object.keys(regs);

    if (regKeys.length > 0) {
      return function validatePatternProperty(key, data, dataRoot) {
        for (let i = 0; i < regKeys.length; ++i) {
          const rky = regKeys[i];
          const rxp = regs[rky];
          if (rxp != null && rxp.test(key)) {
            const cb = props[key];
            return cb(data[key], dataRoot);
          }
        }
        return undefined;
      };
    }
  }
  return undefined;
}

function compileAdditional(schema, addMember, addChildSchema) {
  const additional = getBoolOrObject(schema.additionalProperties, true);
  if (additional === false) {
    const addError = addMember('additionalProperties', false, compileObjectChildren);
    // eslint-disable-next-line no-unused-vars
    return function noAdditionalProperties(dataKey, data, dataRoot) {
      return addError(dataKey, data);
    };
  }
  if (additional !== true) {
    const validate = addChildSchema('additionalProperties', additional, compileObjectChildren);
    if (validate != null) {
      return function validateAdditional(key, data, dataRoot) {
        return validate(data[key], dataRoot);
      };
    }
  }

  return undefined;
}

export function compileObjectChildren(schema, addMember, addChildSchema) {
  const properties = getObjectishType(schema.properties);
  const patterns = getObjectishType(schema.patternProperties);
  const additional = getBoolOrObject(schema.additionalProperties, true);

  if (properties == null && patterns == null && additional === true)
    return undefined;

  // make sure we are not part of a map!
  if (additional !== true && additional !== false) {
    if (properties == null && patterns == null) {
      if (isOfSchemaType(schema, 'map')) return undefined;
    }
  }

  // TODO: check for properties only!
  // eslint-disable-next-line no-constant-condition
  if (true) {
    const validateProperty = fallbackFn(
      compileProperties(schema, addMember, addChildSchema),
      undefThat,
    );
    const validatePattern = fallbackFn(
      compilePatterns(schema, addMember, addChildSchema),
      undefThat,
    );
    const validateAdditional = fallbackFn(
      compileAdditional(schema, addMember, addChildSchema),
      undefThat,
    );

    return function validateObjectChildren(data, dataRoot) {
      let valid = true;
      if (isObjectishType(data)) {
        const dataKeys = Object.keys(data);
        for (let i = 0; i < dataKeys.length; ++i) {
          const dataKey = dataKeys[i];
          let found = validateProperty(dataKey, data, dataRoot);
          if (found != null) {
            dataKeys[i] = found;
            valid = valid && found;
            continue;
          }
          found = validatePattern(dataKey, data, dataRoot);
          if (found != null) {
            dataKeys[i] = found;
            valid = valid && found;
            continue;
          }
          found = validateAdditional(dataKey, data, dataRoot);
          if (found != null) {
            dataKeys[i] = found;
            valid = valid && found;
            if (found === false) return false;
          }
        }
      }
      return valid;
    };
  }

  return undefined;
}
