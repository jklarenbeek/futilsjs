/* eslint-disable function-paren-newline */

import {
  getPureArray,
  getPureArrayMinItems,
  getPureObject,
  getPureString,
  getPureBool,
  getPureNumber,
  getPureInteger,
  isBoolOrNumber,
  getBoolOrArray,
  isFn,
} from './types-base';

import {
  String_createRegExp,
} from './types-String';

import {
  isIntegerSchema,
  isBigIntSchema,
  isPrimitiveSchema,
  isStrictStringType,
  isStrictIntegerType,
  isStrictBigIntType,
  isStrictNumberType,
  getCallbackIsStrictDataType,
} from './json-schema-types';

export class SchemaValidationError {
  constructor(schemaPath, schemaKey, expectedValue, dataPath, dataValue) {
    this.schemaPath = schemaPath;
    this.schemaKey = schemaKey;
    this.expectedValue = expectedValue;
    this.dataPath = dataPath;
    this.dataValue = dataValue;
    Object.freeze(this);
  }
}


function compileSchemaType(owner, schema, addMember) {
  const schemaRequired = getBoolOrArray(schema.required, false) && true;

  let schemaNullable = getPureBool(schema.nullable);

  function compileRequired() {
    if (schemaRequired === true) {
      const addError = addMember('required', schemaRequired, compileSchemaType);
      return function required(data) {
        if (data === undefined) {
          addError(data);
          return true;
        }
        return false;
      };
    }
    else return function isUndefined(data) {
      return (data === undefined);
    };
  }

  function compileNullable() {
    if (schemaNullable === false) {
      const addError = addMember('nullable', schemaNullable, compileSchemaType);
      return function nullable(data) {
        if (data === null) {
          addError(data);
          return true;
        }
        return false;
      };
    }
    else return function isNull(data) {
      return data === null;
    };
  }

  let schemaType = getPureString(
    schema.type,
    getPureArrayMinItems(schema.type, 1),
  );

  if (schemaType != null) {
    // check if we are object or array
    const schemaFormat = getPureString(schema.format);

    if (schemaType.constructor === String) {
      const isDataType = getCallbackIsStrictDataType(schemaType, schemaFormat);
      if (isDataType) {
        const isrequired = compileRequired();
        const isnullable = compileNullable();
        const addError = addMember('type', isDataType.name, compileSchemaType, 'string');

        // create single type validator callback
        return function type(data, err = []) {
          if (isrequired(data, err)) return !schemaRequired;
          if (isnullable(data, err)) return schemaNullable !== false;
          const valid = isDataType(data);
          if (!valid) {
            addError(data);
          }
          return valid;
        };
      }
    }

    // JSONSchema allows checks for multiple types
    if (schemaType.constructor === Array) {
      schemaNullable = schemaNullable === true; // NOTE: nullable default false
      const handlers = [];
      for (let i = 0; i < schemaType.length; ++i) {
        const type = schemaType[i];
        if (type === 'null') {
          schemaNullable = true;
        }
        else {
          const dataHandler = getCallbackIsStrictDataType(type, schemaFormat);
          if (dataHandler) handlers.push(dataHandler);
        }
      }

      // if we found some valid handlers compile validator callback
      if (handlers.length > 1) {
        const isrequired = compileRequired();
        const isnullable = compileNullable();
        const addError = addMember('type', handlers, compileSchemaType, 'array');

        // create multiple type validator callback
        return function typeArray(data) {
          if (isrequired(data)) return !schemaRequired;
          if (isnullable(data)) return schemaNullable !== false;
          let i = 0;
          for (; i < handlers.length; ++i) {
            const isDataType = handlers[i];
            const valid = isDataType(data);
            if (valid) {
              return true;
            }
          }
          addError(data && data.constructor.name);
          return false;
        };
      }
      // if we only found one handler, use the single type validator callback.
      else if (handlers.length === 1) {
        schemaType = handlers[0].typeName;
      }
    }
  }

  if (schemaRequired === true || schemaNullable === true) {
    const isrequired = compileRequired();
    const isnullable = compileNullable();
    return function important(data) {
      if (isrequired(data)) return !schemaRequired;
      if (isnullable(data)) return schemaNullable !== false;
      return true;
    };
  }
  return undefined;
}

function compileSchemaFormat(owner, schema, addMember) {
  if (isStrictStringType(schema.format)) {
    const format = owner.getFormatCompiler(schema.format);
    if (format) {
      return format(owner, schema, addMember);
    }
  }
  return undefined;
}

function compileEnumPrimitive(owner, schema, addMember) {
  const enums = getPureArrayMinItems(schema.enum, 1);
  if (enums) {
    if (isPrimitiveSchema(schema)) {
      const addError = addMember('enum', enums, compileEnumPrimitive);
      return function enumPrimitive(data) {
        if (data != null && typeof data !== 'object') {
          if (!enums.includes(data)) {
            addError(data);
            return false;
          }
        }
        return true;
      };
    }
  }
  return undefined;
}

function compileNumberRange(owner, schema, addMember) {
  const min = Number(schema.minimum) || undefined;
  const emin = schema.exclusiveMinimum === true
    ? min
    : Number(schema.exclusiveMinimum) || undefined;

  const max = Number(schema.maximum) || undefined;
  const emax = schema.exclusiveMaximum === true
    ? max
    : Number(schema.exclusiveMaximum) || undefined;

  const isDataType = isBigIntSchema(schema)
    ? function compileNumberRange_isBigIntType(data) {
      // eslint-disable-next-line valid-typeof
      return typeof data === 'bigint';
    }
    : isIntegerSchema(schema)
      ? function compileNumberRange_isIntegerType(data) {
        return Number.isInteger(data);
      }
      : function compileNumberRange_isNumberType(data) {
        return typeof data === 'number';
      };

  if (emin && emax) {
    const addError = addMember(['exclusiveMinimum', 'exclusiveMaximum'], [emin, emax], compileNumberRange);
    return function betweenExclusive(data) {
      if (isDataType(data)) {
        const valid = data > emin && data < emax;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (emin && max) {
    const addError = addMember(['exclusiveMinimum', 'maximum'], [emin, max], compileNumberRange);
    return function betweenexclusiveMinimum(data) {
      if (isDataType(data)) {
        const valid = data > emin && data <= max;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (emax && min) {
    const addError = addMember(['minimum', 'exclusiveMaximum'], [min, emax], compileNumberRange);
    return function betweenexclusiveMaximum(data) {
      if (isDataType(data)) {
        const valid = data >= min && data < emax;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (min && max) {
    const addError = addMember(['minimum', 'maximum'], [min, max], compileNumberRange);
    return function between(data) {
      if (isDataType(data)) {
        const valid = data >= min && data <= max;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (emax) {
    const addError = addMember('exclusiveMaximum', emax, compileNumberRange);
    return function exclusiveMaximum(data) {
      if (isDataType(data)) {
        const valid = data < emax;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (max) {
    const addError = addMember('maximum', max, compileNumberRange);
    return function maximum(data) {
      if (isDataType(data)) {
        const valid = data <= max;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (emin) {
    const addError = addMember('exclusiveMinimum', emin, compileNumberRange);
    return function exclusiveMinimum(data) {
      if (isDataType(data)) {
        const valid = data > emin;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (min) {
    const addError = addMember('minimum', min, compileNumberRange);
    return function minimum(data) {
      if (isDataType(data)) {
        const valid = data >= min;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  return undefined;
}

function compileNumberMultipleOf(owner, schema, addMember) {
  const mulOf = getPureNumber(schema.multipleOf);
  // we compare against bigint too! javascript is awesome!
  // eslint-disable-next-line eqeqeq
  if (mulOf && mulOf != 0) {
    if (Number.isInteger(mulOf)) {
      const addError = addMember('multipleOf', mulOf, compileNumberMultipleOf, 'integer');
      if (isIntegerSchema(schema)) {
        return function multipleOfInteger(data) {
          if (Number.isInteger(data)) {
            const valid = (data % mulOf) === 0;
            if (!valid) addError(data);
            return valid;
          }
          return true;
        };
      }
      else {
        return function multipleOfIntAsNumber(data) {
          if (typeof data === 'number') {
            const valid = Number.isInteger(Number(data) / mulOf);
            if (!valid) addError(data);
            return valid;
          }
          return true;
        };
      }
    }
    if (isBigIntSchema(schema)) {
      const mf = BigInt(mulOf);
      const addError = addMember('multipleOf', mf, compileNumberMultipleOf, 'bigint');
      return function multipleOfBigInt(data) {
        // eslint-disable-next-line valid-typeof
        if (typeof data === 'bigint') {
          // we compare against bigint too! javascript is awesome!
          // eslint-disable-next-line eqeqeq
          const valid = (data % mf) == 0;
          if (!valid) addError(data);
          return valid;
        }
        return true;
      };
    }
    else {
      const addError = addMember('multipleOf', mulOf, compileNumberMultipleOf, 'number');
      return function multipleOf(data) {
        if (typeof data === 'number') {
          const valid = Number.isInteger(Number(data) / mulOf);
          if (!valid) addError(data);
          return valid;
        }
        return true;
      };
    }
  }
  return undefined;
}

function compileStringLength(owner, schema, addMember) {
  const min = getPureInteger(schema.minLength, 0);
  const max = getPureInteger(schema.maxLength, 0);
  if (min > 0 && max > 0) {
    const addError = addMember(['minLength', 'maxLength'], [min, max], compileStringLength);
    return function betweenLength(data) {
      if (typeof data === 'string') {
        const len = data.length;
        const valid = len >= min && len <= max;
        if (!valid) addError(len);
        return valid;
      }
      return true;
    };
  }

  if (min > 0) {
    const addError = addMember('minLength', min, compileStringLength);
    return function minLength(data) {
      if (typeof data === 'string') {
        const len = data.length;
        const valid = len >= min;
        if (!valid) addError(len);
        return valid;
      }
      return true;
    };
  }

  if (max > 0) {
    const addError = addMember('maxLength', max, compileStringLength);
    return function maxLength(data) {
      if (typeof data === 'string') {
        const len = data.length;
        const valid = len <= max;
        if (!valid) addError(len);
        return valid;
      }
      return true;
    };
  }

  return undefined;
}

function compileStringPattern(owner, schema, addMember) {
  const ptrn = schema.pattern;
  const re = String_createRegExp(ptrn);
  if (re) {
    const addError = addMember('pattern', ptrn, compileStringPattern);
    return function pattern(data) {
      if (typeof data === 'string') {
        const valid = re.test(data);
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  return undefined;
}

function compileObjectBasic(owner, schema, addMember) {
  // get the defined lower and upper bounds of an array.
  const minprops = getPureInteger(schema.minProperties);
  const maxprops = getPureInteger(schema.maxProperties);

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
  const required = getPureArray(schema.required);

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
    let keys = required;
    const ms = getPureArray(schema.properties);
    let ismap = ms != null;
    if (keys.length === 0) {
      const os = getPureObject(schema.properties);
      const ok = os && Object.keys(os);
      const mk = ms > 0 && Array.from(new Map(ms).keys());
      ismap = ms != null;
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

  const patterns = getPureArray(schema.patternRequired);

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

      const ismap = (getPureArray(schema.properties) != null);
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

function compileArraySize(owner, schema, addMember) {
  const min = getPureInteger(schema.minItems);
  const max = getPureInteger(schema.maxItem);

  function isArrayOrSet(data) {
    return (data != null && (data.constructor === Array || data.constructor === Set));
  }
  function getLength(data) {
    return data.constructor === Set ? data.size : data.length;
  }

  if (min && max) {
    const addError = addMember(['minItems', 'maxItems'], [min, max], compileArraySize);
    return function itemsBetween(data) {
      if (!isArrayOrSet(data)) { return true; }
      const len = getLength(data);
      const valid = len >= min && len <= max;
      if (!valid) addError(data);
      return valid;
    };
  }
  else if (max) {
    const addError = addMember('maxItems', max, compileArraySize);
    return function maxItems(data) {
      if (!isArrayOrSet(data)) { return true; }
      const len = getLength(data);
      const valid = len <= max;
      if (!valid) addError(data);
      return valid;
    };
  }
  else if (min > 0) {
    const addError = addMember('minItems', min, compileArraySize);
    return function minItems(data) {
      if (!isArrayOrSet(data)) { return true; }
      const len = getLength(data);
      const valid = len >= min;
      if (!valid) addError(data);
      return valid;
    };
  }
  return undefined;
}

function compileObjectProperties(owner, schema, addMember) {
  return { schema, members, addError };
}


export function createNumberFormatCompiler(name, format) {
  if (format != null && format === 'object') {
    if (['integer', 'bigint', 'number'].includes(format.type)) {
      //const rbts = getPureNumber(r.bits);
      //const rsgn = getPureBool(r.signed);

      const rix = Number(format.minimum) || false;
      const rax = Number(format.maximum) || false;

      const isDataType = format.type === 'integer'
        ? isStrictIntegerType
        : format.type === 'bigint'
          ? isStrictBigIntType
          : format.type === 'number'
            ? isStrictNumberType
            : undefined;

      if (isDataType) {
        return function compileFormatNumber(owner, schema, addMember) {
          const fix = Math.max(Number(schema.formatMinimum) || rix, rix);
          const fax = Math.min(Number(schema.formatMaximum) || rax, rax);
          const _fie = schema.formatExclusiveMinimum === true
            ? fix
            : Number(schema.formatExclusiveMinimum) || false;
          const _fae = schema.formatExclusiveMaximum === true
            ? fax
            : Number(schema.formatExclusiveMaximum) || false;
          const fie = fix !== false && _fie !== false
            ? Math.max(fix, _fie)
            : _fie;
          const fae = fax !== false && _fae !== false
            ? Math.max(fax, _fae)
            : _fae;

          members.push('format');
          if (Number(schema.formatMinimum)) members.push('formatMinimum');
          if (Number(schema.formatMaximum)) members.push('formatMaximum');
          if (isBoolOrNumber(schema.formatExclusiveMinimum)) members.push('formatExclusiveMinimum');
          if (isBoolOrNumber(schema.formatExclusiveMaximum)) members.push('formatExclusiveMaximum');

          return function formatNumber(data) {
            let valid = true;
            if (isDataType(data)) {
              if (fie && fae) {
                valid = data > fie && data < fae;
                if (!valid) addError(
                  ['formatExclusiveMinimum', 'formatExclusiveMaximum'],
                  [fie, fae],
                  data,
                );
              }
              else if (fie && fax) {
                valid = data > fie && data <= fax;
                if (!valid) addError(
                  ['formatExclusiveMinimum', 'formatMaximum'],
                  [fie, fax],
                  data,
                );
              }
              else if (fae && fix) {
                valid = data >= fix && data < fae;
                if (!valid) addError(
                  ['formatMinimum', 'formatExclusiveMaximum'],
                  [fix, fae],
                  data,
                );
              }
              else if (fix && fax) {
                valid = data >= fix && data <= fax;
                if (!valid) addError(
                  ['formatMinimum', 'formatMaximum'],
                  [fix, fax],
                  data,
                );
              }
              else if (fie) {
                valid = data > fie;
                if (!valid) addError(
                  'formatExclusiveMinimum',
                  fie,
                  data,
                );
              }
              else if (fae) {
                valid = data > fae;
                if (!valid) addError(
                  'formatExclusiveMaximum',
                  fae,
                  data,
                );
              }
              else if (fax) {
                valid = data <= fax;
                if (!valid) addError(
                  'formatMaximum',
                  fax,
                  data,
                );
              }
              else if (fix) {
                valid = data <= fix;
                if (!valid) addError(
                  'formatMinimum',
                  fix,
                  data,
                );
              }
            }
            return valid;
          };
        };
      }
    }
  }
  return undefined;
}

export function compileSchemaObjectValidator(owner, schema, schemaPath, dataPath) {
  const members = [];

  function addError(key = 'unknown', expected, value) {
    owner.pushError(
      new SchemaValidationError(
        schema,
        schemaPath,
        key, expected,
        dataPath,
        value,
      ),
    );
    return false;
  }

  function fallback(compiled) {
    if (isFn(compiled)) return compiled;
    // eslint-disable-next-line no-unused-vars
    return function trueThat(whatever) {
      return true;
    };
  }

  const fnType = fallback(
    compileSchemaType(owner, schema, members, addError),
  );
  const fnFormat = fallback(
    compileSchemaFormat(owner, schema, members, addError),
  );
  const fnEnumPrimitive = fallback(
    compileEnumPrimitive(owner, schema, members, addError),
  );
  const fnNumberRange = fallback(
    compileNumberRange(owner, schema, members, addError),
  );
  const fnNumberMultipleOf = fallback(
    compileNumberMultipleOf(owner, schema, members, addError),
  );
  const fnStringLength = fallback(
    compileStringLength(owner, schema, members, addError),
  );
  const fnStringPattern = fallback(
    compileStringPattern(owner, schema, members, addError),
  );
  const fnObjectBasic = fallback(
    compileObjectBasic(owner, schema, members, addError),
  );
  const fnArraySize = fallback(
    compileArraySize(owner, schema, members, addError),
  );

  return function validateSchemaObject(data, dataRoot) {
    return fnType(data, dataRoot)
      && fnFormat(data, dataRoot)
      && fnEnumPrimitive(data, dataRoot)
      && fnNumberRange(data, dataRoot)
      && fnNumberMultipleOf(data, dataRoot)
      && fnStringLength(data, dataRoot)
      && fnStringPattern(data, dataRoot)
      && fnObjectBasic(data, dataRoot)
      && fnArraySize(data, dataRoot);
  };
}

export function compileSchemaChildrenValidator(owner, schema, schemaPath, dataPath) {

  function addError(key = 'unknown', expected, value) {
    owner.pushError(
      new SchemaValidationError(
        schema,
        schemaPath,
        key, expected,
        dataPath,
        value,
      ),
    );
    return false;
  }

  function fallback(compiled) {
    if (isFn(compiled)) return compiled;
    // eslint-disable-next-line no-unused-vars
    return function trueThat(whatever) {
      return true;
    };
  }


}