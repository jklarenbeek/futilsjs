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


function compileSchemaType(owner, schema, members, addError) {
  const schemaRequired = getBoolOrArray(schema.required, false) && true;

  let schemaNullable = getPureBool(schema.nullable);

  function compileRequired() {
    if (schemaRequired === true) {
      members.push('required');
      return function required(data) {
        if (data === undefined) {
          addError('required', schemaRequired, data);
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
      members.push('nullable');
      return function nullable(data) {
        if (data === null) {
          addError('nullable', schemaNullable, data);
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
        members.push('type');

        // create single type validator callback
        return function type(data, err = []) {
          if (isrequired(data, err)) return !schemaRequired;
          if (isnullable(data, err)) return schemaNullable !== false;
          const valid = isDataType(data);
          if (!valid) {
            addError('type', type, data);
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
        members.push('type');

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
          addError('type', handlers, data && data.constructor.name);
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
    return function important(data, err = []) {
      if (isrequired(data, err)) return !schemaRequired;
      if (isnullable(data, err)) return schemaNullable !== false;
      return true;
    };
  }
  return undefined;
}

function compileSchemaFormat(owner, schema, members, addError) {
  if (isStrictStringType(schema.format)) {
    const format = owner.getFormatCompiler(schema.format);
    if (format) {
      return format(owner, schema, members, addError);
    }
  }
  return undefined;
}

function compileEnumPrimitive(owner, schema, members, addError) {
  const enums = getPureArrayMinItems(schema.enum, 1);
  if (enums) {
    if (isPrimitiveSchema(schema)) {
      members.push('enum');
      return function enumPrimitive(data) {
        if (data != null && typeof data !== 'object') {
          if (!enums.includes(data)) {
            addError('enum', enums, data);
            return false;
          }
        }
        return true;
      };
    }
  }
  return undefined;
}

function compileNumberRange(owner, schema, members, addError) {
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
    members.push('exclusiveMinimum', 'exclusiveMaximum');
    return function betweenExclusive(data) {
      if (isDataType(data)) {
        const valid = data > emin && data < emax;
        if (!valid) addError(['exclusiveMinimum', 'exclusiveMaximum'], [emin, emax], data);
        return valid;
      }
      return true;
    };
  }
  else if (emin && max) {
    members.push('exclusiveMinimum', 'maximum');
    return function betweenexclusiveMinimum(data) {
      if (isDataType(data)) {
        const valid = data > emin && data <= max;
        if (!valid) addError(['exclusiveMinimum', 'maximum'], [emin, max], data);
        return valid;
      }
      return true;
    };
  }
  else if (emax && min) {
    members.push('minimum', 'exclusiveMaximum');
    return function betweenexclusiveMaximum(data) {
      if (isDataType(data)) {
        const valid = data > emin && data <= max;
        if (!valid) addError(['minimum', 'exclusiveMaximum'], [min, emax], data);
        return valid;
      }
      return true;
    };
  }
  else if (min && max) {
    members.push('minimum', 'maximum');
    return function between(data) {
      if (isDataType(data)) {
        const valid = data > emin && data <= max;
        if (!valid) addError(['minimum', 'maximum'], [min, max], data);
        return valid;
      }
      return true;
    };
  }
  else if (emax) {
    members.push('exclusiveMaximum');
    if (max) members.push('maximum');

    return function exclusiveMaximum(data) {
      if (isDataType(data)) {
        const valid = data < emax;
        if (!valid) addError('exclusiveMaximum', emax, data);
        return valid;
      }
      return true;
    };
  }
  else if (max) {
    members.push('maximum');

    return function maximum(data) {
      if (isDataType(data)) {
        const valid = data <= max;
        if (!valid) addError('maximum', max, data);
        return valid;
      }
      return true;
    };
  }
  else if (emin) {
    members.push('exclusiveMinimum');
    if (min) members.push('minimum');

    return function exclusiveMinimum(data) {
      if (isDataType(data)) {
        const valid = data > emin;
        if (!valid) addError('exclusiveMinimum', emin, data);
        return valid;
      }
      return true;
    };
  }
  else if (min) {
    members.push('minimum');

    return function minimum(data) {
      if (isDataType(data)) {
        const valid = data >= min;
        if (!valid) addError('minimum', min, data);
        return valid;
      }
      return true;
    };
  }
  return undefined;
}

function compileNumberMultipleOf(owner, schema, members, addError) {
  const mulOf = getPureNumber(schema.multipleOf);
  // we compare against bigint too! javascript is awesome!
  // eslint-disable-next-line eqeqeq
  if (mulOf && mulOf != 0) {
    members.push('multipleOf');
    if (Number.isInteger(mulOf)) {
      if (isIntegerSchema(schema)) {
        return function multipleOfInteger(data) {
          if (Number.isInteger(data)) {
            const valid = (data % mulOf) === 0;
            if (!valid) addError('multipleOf', mulOf, data);
            return valid;
          }
          return true;
        };
      }
      else {
        return function multipleOfIntAsNumber(data) {
          if (typeof data === 'number') {
            const valid = Number.isInteger(Number(data) / mulOf);
            if (!valid) addError('multipleOf', mulOf, data);
            return valid;
          }
          return true;
        };
      }
    }
    if (isBigIntSchema(schema)) {
      const mf = BigInt(mulOf);
      return function multipleOfBigInt(data) {
        // eslint-disable-next-line valid-typeof
        if (typeof data === 'bigint') {
          // we compare against bigint too! javascript is awesome!
          // eslint-disable-next-line eqeqeq
          const valid = (data % mf) == 0;
          if (!valid) addError('multipleOf', mf, data);
          return valid;
        }
        return true;
      };
    }
    else {
      return function multipleOf(data) {
        if (typeof data === 'number') {
          const valid = Number.isInteger(Number(data) / mulOf);
          if (!valid) addError('multipleOf', mulOf, data);
          return valid;
        }
        return true;
      };
    }
  }
  return undefined;
}

function compileStringLength(owner, schema, members, addError) {
  const min = getPureInteger(schema.minLength, 0);
  const max = getPureInteger(schema.maxLength, 0);
  if (min > 0 && max > 0) {
    members.push('minLength', 'maxLength');

    return function betweenLength(data) {
      if (typeof data === 'string') {
        const len = data.length;
        const valid = len >= min && len <= max;
        if (!valid) addError(['minLength', 'maxLength'], [min, max], len);
        return valid;
      }
      return true;
    };
  }

  if (min > 0) {
    members.push('minLength');

    return function minLength(data) {
      if (typeof data === 'string') {
        const len = data.length;
        const valid = len >= min;
        if (!valid) addError('minLength', min, len);
        return valid;
      }
      return true;
    };
  }

  if (max > 0) {
    members.push('maxLength');

    return function maxLength(data) {
      if (typeof data === 'string') {
        const len = data.length;
        const valid = len <= max;
        if (!valid) addError('maxLength', max, len);
        return valid;
      }
      return true;
    };
  }

  return undefined;
}

function compileStringPattern(owner, schema, members, addError) {
  const ptrn = schema.pattern;
  const re = String_createRegExp(ptrn);
  if (re) {
    members.push('pattern');

    return function pattern(data) {
      if (typeof data === 'string') {
        const valid = re.test(data);
        if (!valid) addError('pattern', ptrn, data);
        return valid;
      }
      return true;
    };
  }
  return undefined;
}

function compileBasicObject(owner, schema, members, addError) {
  let keys = getPureArray(schema.required);
  if (keys == null) return undefined;

  // when the array is present but empty,
  // REQUIRE all of the properties
  if (keys.length === 0) {
    const os = getPureObject(schema.properties);
    const ms = getPureArrayMinItems(schema.properties, 1);
    const ok = os && Object.keys(os);
    const mk = ms && Array.from(new Map(ms).keys());
    keys = ok || mk;
  }
  // are there properties required?
  if (keys.length > 0) members.push('required');

  // produce an array of regexp objects to validate members.
  const regs = [];
  const patterns = getPureArray(schema.patternRequired);
  if (patterns && patterns.length > 0) {
    for (let i = 0; i < patterns.length; ++i) {
      const pattern = String_createRegExp(patterns[i]);
      if (pattern) {
        regs.push(pattern);
      }
    }
    if (regs.length > 0) members.push('patternRequired');
  }

  // get the defined lower and upper bounds of an array.
  const minprops = getPureInteger(schema.minProperties);
  if (minprops > 0) members.push('minProperties');
  const maxprops = getPureInteger(schema.maxProperties);
  if (maxprops > 0) members.push('maxProperties');

  // when there are required or pattern properties
  if (keys.length > 0 || regs.length > 0) {
    return function objectBasic(data) {
      if (typeof data !== 'object' || data === null) return true;
      if (data.constructor === Array) return true;

      let valid = true;
      let length = 0;
      if (data.constructor === Map) {
        length = data.size;

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (data.has(key) === false) {
            addError('required', key, data);
            valid = false;
          }
        }
        if (!valid) return valid;

        if (regs) {
          const dataKeys = Array.from(data.keys());
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
              addError('patternRequired', reg, data);
              valid = false;
            }
          }
          if (!valid) return valid;
        }
      }
      else { // normal object type
        const dataKeys = Object.keys(data);
        length = dataKeys.length;
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (dataKeys.includes(key) === false) {
            addError('required', key, data);
            valid = false;
          }
        }
        if (valid === false) return valid;

        if (regs) {
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
              addError('requiredPattern', reg, data);
              valid = false;
            }
          }
          if (!valid) return valid;
        }
      }

      if (minprops && maxprops) {
        valid = length >= minprops && length <= maxprops;
        if (!valid) addError(['minProperties', 'maxProperties'], [minprops, maxprops], length);
      }
      else if (maxprops) {
        valid = length <= maxprops;
        if (!valid) addError('maxProperties', maxprops, length);
      }
      else if (minprops > 0) {
        valid = length >= minprops;
        if (!valid) addError('minProperties', minprops, length);
      }
      return valid;
    };
  }
  else if (minprops || maxprops) {
    return function objectSize(data) {
      if (typeof data !== 'object' || data === null) return true;
      if (data.constructor === Array) return true;

      const length = data.constructor === Map
        ? data.size()
        : Object.keys(data).length;

      let valid = true;
      if (minprops && maxprops) {
        valid = length >= minprops && length <= maxprops;
        if (!valid) addError(['minProperties', 'maxProperties'], [minprops, maxprops], length);
      }
      else if (maxprops) {
        valid = length <= maxprops;
        if (!valid) addError('maxProperties', maxprops, length);
      }
      else if (minprops > 0) {
        valid = length >= minprops;
        if (!valid) addError('minProperties', minprops, length);
      }
      return valid;
    };
  }
  return undefined;
}

function compileBasicArray(owner, schema, members, addError) {
  const min = getPureInteger(schema.minItems);
  const max = getPureInteger(schema.maxItem);

  if (min && max) {
    members.push('minItems', 'maxItems');
    return function itemsBetween(data) {
      if (data == null || data.constructor !== Array) return true;
      const len = data.length;
      const valid = len >= min && len <= max;
      if (!valid) addError(['minItems', 'maxItems'], [min, max], data);
      return valid;
    };
  }
  else if (max) {
    members.push('maxItems');
    return function maxItems(data) {
      if (data == null || data.constructor !== Array) return true;
      const len = data.length;
      const valid = len <= max;
      if (!valid) addError('maxItems', max, data);
      return valid;
    };
  }
  else if (min > 0) {
    members.push('minItems');
    return function minItems(data) {
      if (data == null || data.constructor !== Array) return true;
      const len = data.length;
      const valid = len >= min;
      if (!valid) addError('minItems', max, data);
      return valid;
    };
  }
  return undefined;
}

function compileObjectProperties(owner, schema, members, addError) {
  return { schema, members, addError };
}


export function createNumberFormatCompiler(name, format) {
  if (format === 'object') {
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
        return function compileFormatNumber(owner, schema, members, addError) {
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
  const errors = [];

  function addError(key = 'unknown', expected, value) {
    errors.push(
      new SchemaValidationError(
        schemaPath,
        key, expected,
        dataPath,
        value,
      ),
    );
    return false;
  }

  function fallback(compiled) {
    if (typeof compiled === 'function') return compiled;
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
  const fnBasicObject = fallback(
    compileBasicObject(owner, schema, members, addError),
  );
  const fnBasicArray = fallback(
    compileBasicArray(owner, schema, members, addError),
  );

  return function validateSchemaObject(data, dataRoot) {
    return fnType(data, dataRoot)
      && fnFormat(data, dataRoot)
      && fnEnumPrimitive(data, dataRoot)
      && fnNumberRange(data, dataRoot)
      && fnNumberMultipleOf(data, dataRoot)
      && fnStringLength(data, dataRoot)
      && fnStringPattern(data, dataRoot)
      && fnBasicObject(data, dataRoot)
      && fnBasicArray(data, dataRoot);
  };
}

export function compileSchemaChildrenValidator(owner, schema, schemaPath, dataPath) {
  const members = [];
  const errors = [];

  function addError(key = 'unknown', expected, value) {
    errors.push(
      new SchemaValidationError(
        schemaPath,
        key, expected,
        dataPath,
        value,
      ),
    );
    return false;
  }

  function fallback(compiled) {
    if (typeof compiled === 'function') return compiled;
    // eslint-disable-next-line no-unused-vars
    return function trueThat(whatever) {
      return true;
    };
  }


}