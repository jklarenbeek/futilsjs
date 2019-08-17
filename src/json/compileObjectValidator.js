import {
  String_createRegExp,
} from '../types-String';

// eslint-disable-next-line import/no-cycle
import {
  isStrictStringType,
  isObjectishType,
  isStrictArrayType,
} from './isDataType';

import {
  getObjectishType,
  getIntegerishType,
  getArrayishType,
} from './getDataType';

import {
  getBoolOrObject,
} from './getDataTypeExtra';

import {
  fallbackFn,
  undefThat,
} from './functionUtils';

export function compileObjectBasic(schema, addMember) {
  // get the defined lower and upper bounds of an array.
  const minprops = getIntegerishType(schema.minProperties);
  const maxprops = getIntegerishType(schema.maxProperties);

  function compilePropertyBounds() {
    if (minprops && maxprops) {
      const addError = addMember(['minProperties', 'maxProperties'], [minprops, maxprops], compileObjectBasic);
      return function minmaxProperties(length) {
        const valid = length >= minprops && length <= maxprops;
        if (!valid) addError(length);
        return valid;
      };
    }
    else if (maxprops > 0) {
      const addError = addMember('maxProperties', maxprops, compileObjectBasic);
      return function maxProperties(length) {
        const valid = length <= maxprops;
        if (!valid) addError(length);
        return valid;
      };
    }
    else if (minprops > 0) {
      const addError = addMember('minProperties', minprops, compileObjectBasic);
      return function minProperties(length) {
        const valid = length >= minprops;
        if (!valid) addError(length);
        return valid;
      };
    }
    return undefined;
  }
  const checkBounds = compilePropertyBounds();

  // find all required properties
  const required = getArrayishType(schema.required);

  function compileRequiredProperties() {
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
    const objProps = getObjectishType(schema.properties);
    const mapProps = getArrayishType(schema.properties);
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
        const addError = addMember('required', keys, compileRequiredProperties, 'ismap');
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
        const addError = addMember('required', keys, compileRequiredProperties, 'isobject');
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

  const patterns = getArrayishType(schema.patternRequired);

  function compileRequiredPatterns() {
    if (patterns && patterns.length > 0) {
      // produce an array of regexp objects to validate members.
      const regs = [];
      for (let i = 0; i < patterns.length; ++i) {
        const pattern = String_createRegExp(patterns[i]);
        if (pattern) {
          regs.push(pattern);
        }
      }

      const ismap = (getArrayishType(schema.properties) != null);
      if (regs.length > 0) {
        const addError = addMember('patternRequired', regs, compileRequiredPatterns, ismap ? 'ismap' : 'isobject');
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

  const valProps = compileRequiredProperties();
  const valPatts = compileRequiredPatterns();

  if (valProps && valPatts) {
    return function objectBasic(data) {
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

export function compileObjectChildren(schema, addMember, addChildSchema) {
  const properties = getObjectishType(schema.properties);
  const patterns = getObjectishType(schema.patternProperties);
  const additional = getBoolOrObject(schema.additionalProperties, true);

  if (properties == null && patterns == null && additional === true)
    return undefined;

  // make sure we are not part of a map!
  if (additional !== true && additional !== false) {
    if (properties == null && patterns == null) {
      let isobj = true;
      if (isStrictArrayType(schema.type)) {
        isobj = !schema.type.includes('map');
        isobj = isobj && schema.type.includes('object');
      }
      else if (isStrictStringType(schema.type)) {
        isobj = schema.type === 'object';
      }
      if (isobj === false) return undefined;
    }
  }

  function compileProperties() {
    const keys = Object.keys(properties);
    const props = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const prop = properties[key];
      if (isObjectishType(prop)) {
        const cb = addChildSchema(['properties', key], prop, compileObjectChildren);
        if (cb != null) props[key] = cb;
      }
    }

    if (Object.keys(props).length > 0) {
      return function validateProperty(key, data, dataRoot) {
        const cb = props[key];
        return cb != null
          ? cb(data[key], dataRoot)
          : undefined;
      };
    }

    return undefined;
  }

  function compilePatterns() {
    const keys = Object.keys(patterns);
    const regs = {};
    const props = {};

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const rxp = String_createRegExp(key);
      if (rxp != null) {
        const patt = patterns[key];
        const cb = addChildSchema(['patternProperties', key], patt, compileObjectChildren);
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

    return undefined;
  }

  function compileAdditional() {
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

  const validateProperty = fallbackFn(compileProperties(), undefThat);
  const validatePattern = fallbackFn(compilePatterns(), undefThat);
  const validateAdditional = fallbackFn(compileAdditional(), undefThat);

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
