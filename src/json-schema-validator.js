
import {
  getPureArray,
  getPureArrayMinItems,
  getPureObject,
  getPureString,
  getPureBool,
  getPureNumber,
  getPureInteger,
} from './types-base';

import {
  String_createRegExp,
} from './types-String';

import {
  getSchemaSelectorName,
  isIntegerSchema,
  isBigIntSchema,
  isNumberSchema,
  isStringSchema,
  isObjectSchema,
  isArraySchema,
  isTupleSchema,
  isPrimitiveSchema,
  getCallBackIsDataType,
} from './json-schema-types';

export function createPrimitiveSequence() {
  return [
    function compileEnumPrimitive(owner, schema, members = [], addError) {
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
    },

    function compileNumberRange(owner, schema, members = [], addError) {
      const min = Number(schema.minimum) || undefined;
      const emin = schema.exclusiveMinimum === true
        ? min
        : Number(schema.exclusiveMinimum) || undefined;

      const max = Number(schema.maximum) || undefined;
      const emax = schema.exclusiveMaximum === true
        ? max
        : Number(schema.exclusiveMaximum) || undefined;

      const isDataType = isBigIntSchema(schema)
        // eslint-disable-next-line valid-typeof
        ? function compileNumberRange_isBigIntType(data) { return typeof data === 'bigint'; }
        : function compileNumberRange_isNumberType(data) { return typeof data === 'number'; };

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
    },

    function compileNumberMultipleOf(owner, schema, members = [], addError) {
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
    },

    function compileStringLength(owner, schema, members = [], addError) {
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
    },

    function compileStringPattern(owner, schema, members = [], addError) {
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
    },

    function compileBasicObject(owner, schema, members = [], addError) {
      let keys = getPureArray(schema.required);
      if (keys == null) return undefined;

      if (keys.length === 0) {
        const os = getPureObject(schema.properties);
        const ms = getPureArrayMinItems(schema.properties, 1);
        const ok = os && Object.keys(os);
        const mk = ms && Array.from(new Map(ms).keys());
        keys = ok || mk;
      }

      let regs;
      const patterns = getPureArray(schema.patternRequired);
      if (patterns && patterns.length > 0) {
        regs = [];
        for (let i = 0; i < patterns.length; ++i) {
          const pattern = String_createRegExp(patterns[i]);
          if (pattern) {
            if (!regs) regs = [];
            regs.push(pattern);
          }
        }
        if (regs.length === 0) regs = undefined;
      }

      if (keys.length > 0) {
        members.push('_required_properties_');

        const minprops = getPureInteger(schema.minProperties);
        if (minprops > 0) members.push('minProperties');
        const maxprops = getPureInteger(schema.maxProperties);
        if (maxprops > 0) members.push('maxProperties');

        return function object(data) {
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
                  addError('required', reg, data);
                  valid = false;
                }
              }
              if (!valid) return valid;
            }
          }
          else { // pure object type
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
                  addError('required', reg, data);
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
      return undefined;
    },

    function compileBasicArray(owner, schema, members = [], addError) {
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
    },

  ];
}

export function createComplexSequence() {
  return [
    function compileObjectProperties(owner, schema, members = [], addError) {
      return { schema, members, addError };
    },
  ];
}

export function createSchemaSequence() {
  return [
    function compileSchemaType(owner, schema, members = [], addError) {
      const schemaRequired = getPureBool(
        schema.required,
        (getPureArray(schema.required, false) !== false),
      );

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
        const isarr = owner.getArrayFormatter(format);
        const isobj = owner.getObjectFormatter(format);
        
        if (schemaType.constructor === String) {
          const isDataType = owner.getIsDataTypeCallback(schemaType, schemaFormat);
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
              const dataHandler = owner.getIsDataTypeCallback(type, schemaFormat);
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
    },

    function compileSchemaFormat(owner, schema, members = [], addError) {
      return schema === members === addError;
    },
  ];
}

export class JSONSchemaValidationError {
  constructor(schemaPath, schemaKey, expectedValue, dataPath, dataValue) {
    this.schemaPath = schemaPath;
    this.schemaKey = schemaKey;
    this.expectedValue = expectedValue;
    this.dataPath = dataPath;
    this.dataValue = dataValue;
    Object.freeze(this);
  }
}

export class JSONSchemaValidationCompiler {
  constructor(schemaPath, dataPath) {
    this.schemaPath = schemaPath;
    this.dataPath = dataPath;
    this.errors = [];
    Object.freeze(this);
  }

  __addError(key = 'unknown', expected, value) {
    this.errors.push(
      new JSONSchemaValidationError(
        this.schemaPath,
        key, expected,
        this.dataPath,
        value,
      ),
    );
    return false;
  }
}
