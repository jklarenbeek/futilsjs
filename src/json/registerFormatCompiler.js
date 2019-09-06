import {
  fallbackFn,
} from '../types/isFunctionType';

import {
  isStrictStringType,
  isStrictIntegerType,
  isStrictBigIntType,
  isStrictNumberType,
} from '../types/isDataType';

import {
  isStringOrDate,
} from '../types/isDataTypeExtra';

//#region number definitions
/* eslint-disable quote-props */

export const integerFormats = {
  int8: {
    type: 'integer',
    arrayType: Int8Array,
    bits: 8,
    signed: true,
    minimum: -128,
    maximum: 127,
  },
  uint8: {
    type: 'integer',
    arrayType: Uint8Array,
    bits: 8,
    signed: false,
    minimum: 0,
    maximum: 255,
  },
  uint8c: {
    type: 'integer',
    arrayType: Uint8ClampedArray,
    bits: 8,
    signed: false,
    minimum: 0,
    maximum: 255,
    clamped: true,
  },
  int16: {
    type: 'integer',
    arrayType: Int16Array,
    bits: 16,
    signed: true,
    minimum: -32768,
    maximum: 32767,
  },
  uint16: {
    type: 'integer',
    arrayType: Uint16Array,
    bits: 16,
    signed: false,
    minimum: 0,
    maximum: 65535,
  },
  int32: {
    type: 'integer',
    arrayType: Int32Array,
    bits: 32,
    signed: true,
    minimum: -(2 ** 31),
    maximum: (2 ** 31) - 1,
  },
  uint32: {
    type: 'integer',
    arrayType: Uint32Array,
    bits: 32,
    signed: false,
    minimum: 0,
    maximum: (2 ** 32) - 1,
  },
  int64: {
    type: 'integer',
    bits: 53,
    packed: 64,
    signed: true,
    minimum: Number.MIN_SAFE_INTEGER,
    maximum: Number.MAX_SAFE_INTEGER,
  },
  uint64: {
    type: 'integer',
    bits: 64,
    signed: false,
    minimum: 0,
    maximum: Number.MAX_SAFE_INTEGER,
  },
};

export const bigIntFormats = {
  big64: {
    type: 'bigint',
    // eslint-disable-next-line no-undef
    arrayType: BigInt64Array,
    bits: 64,
    signed: true,
    minimum: -(2 ** 63),
    maximum: (2 ** 63) - 1, // TODO: bigint eslint support anyone?
  },
  ubig64: {
    type: 'bigint',
    // eslint-disable-next-line no-undef
    arrayType: BigUint64Array,
    bits: 64,
    signed: true,
    minimum: 0,
    maximum: (2 ** 64) - 1, // TODO: bigint eslint support anyone?
  },
};

export const floatFormats = {
  float: {
    type: 'number',
    bits: 32,
    minimum: 1.175494e-38, // largest negative number in float32
    maximum: 3.402823e+38, // largest positive number in float32
    epsilon: 1.192093e-07, // smallest number in float32
  },
  double: {
    type: 'number',
    bits: 64,
    minimum: Number.MIN_VALUE,
    maximum: Number.MAX_VALUE,
    epsilon: Number.EPSILON,
  },
};

export const numberFormats = {
  ...integerFormats,
  ...bigIntFormats,
  ...floatFormats,
};

export const dateTimeFormats = {
  year: {
    type: 'integer',
    minimum: 1970,
    maximum: 2378,
  },
  month: {
    type: 'integer',
    minimum: 1,
    maximum: 12,
  },
  week: {
    type: 'integer',
    minimum: 1,
    maximum: 52,
  },
  hour: {
    type: 'integer',
    minimum: 0,
    maximum: 23,
  },
  minute: {
    type: 'integer',
    minimum: 0,
    maximum: 59,
  },
  second: {
    type: 'integer',
    minimum: 0,
    maximum: 59,
  },
};
//#endregion

//#region string definitions
function compileDateFormat(schemaObj, jsonSchema) {
  if (jsonSchema.format === 'date-time') {
    const fmin = jsonSchema.formatMinimum;
    const femin = jsonSchema.formatExclusiveMinimum;
    const min = Date.parse(fmin) || undefined;
    const emin = femin === true ? min
      : Date.parse(femin) || undefined;

    const fmax = jsonSchema.formatMaximum;
    const femax = jsonSchema.formatExclusiveMaximum;
    const max = Date.parse(fmax);
    const emax = femax === true ? max
      : Date.parse(femax) || undefined;

    // eslint-disable-next-line no-inner-declarations
    function compileMinimum() {
      if (emin) {
        const addError = schemaObj.createSingleErrorHandler('formatExclusiveMinimum', emin, compileDateFormat);
        return function formatExclusiveMinimum(date) {
          if (!(date > emin)) return addError(date);
          return true;
        };
      }
      else if (min) {
        const addError = schemaObj.createSingleErrorHandler('formatMinimum', min, compileDateFormat);
        return function formatMinimum(date) {
          if (!(date >= min)) return addError(date);
          return true;
        };
      }
      return undefined;
    }

    // eslint-disable-next-line no-inner-declarations
    function compileMaximum() {
      if (emax) {
        const addError = schemaObj.createSingleErrorHandler('formatExclusiveMaximum', emax, compileDateFormat);
        return function formatExclusiveMaximum(date) {
          if (!(date < emax)) return addError(date);
          return true;
        };
      }
      else if (max) {
        const addError = schemaObj.createSingleErrorHandler('formatMaximum', max, compileDateFormat);
        return function formatMaximum(date) {
          if (!(date <= max)) return addError(date);
          return true;
        };
      }
      return undefined;
    }

    // eslint-disable-next-line no-inner-declarations
    function compileDateType() {
      const addError = schemaObj.createSingleErrorHandler('format', 'date', compileDateFormat);
      return function parseDate(data) {
        if (isStringOrDate(data)) {
          const date = Date.parse(data) || false;
          if (date === false) return addError(
            'format',
            'date',
            data,
          );
          return date;
        }
        return true;
      };
    }

    const parseDate = compileDateType();

    const isMinimum = fallbackFn(compileMinimum());
    const isMaximum = fallbackFn(compileMaximum());

    return function formatDate(data) {
      const date = parseDate(data);
      if (date === false) return false;
      if (date === true) return true;
      return isMinimum(date) && isMaximum(date);
    };
  }
  return undefined;
}

export const stringFormats = {
  'date-time': compileDateFormat,
};
//#endregion

export function createFormatNumberCompiler(name, format) {
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
        return function compileFormatNumber(schemaObj, jsonSchema) {
          const fix = Math.max(Number(jsonSchema.formatMinimum) || rix, rix);
          const _fie = jsonSchema.formatExclusiveMinimum === true
            ? fix
            : Number(jsonSchema.formatExclusiveMinimum) || false;
          const fie = fix !== false && _fie !== false
            ? Math.max(fix, _fie)
            : _fie;

          const fax = Math.min(Number(jsonSchema.formatMaximum) || rax, rax);
          const _fae = jsonSchema.formatExclusiveMaximum === true
            ? fax
            : Number(jsonSchema.formatExclusiveMaximum) || false;
          const fae = fax !== false && _fae !== false
            ? Math.max(fax, _fae)
            : _fae;

          if (fie && fae) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatExclusiveMinimum', 'formatExclusiveMaximum'],
              [fie, fae],
              compileFormatNumber,
            );
            return function betweenExclusive(data) {
              if (!isDataType(data)) return true;
              if (data > fie && data < fae) return true;
              return addError(data);
            };
          }
          else if (fie && fax) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatExclusiveMinimum', 'formatMaximum'],
              [fie, fax],
              compileFormatNumber,
            );
            return function betweenExclusiveMinimum(data) {
              if (!isDataType(data)) return true;
              if (data > fie && data <= fax) return true;
              return addError(data);
            };
          }
          else if (fae && fix) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatMinimum', 'formatExclusiveMaximum'],
              [fix, fae],
              compileFormatNumber,
            );
            return function betweenExclusiveMaximum(data) {
              if (!isDataType(data)) return true;
              if (data >= fix && data < fae) return true;
              return addError(data);
            };
          }
          else if (fix && fax) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatMinimum', 'formatMaximum'],
              [fie, fae],
              compileFormatNumber,
            );
            return function formatBetween(data) {
              if (!isDataType(data)) return true;
              if (data >= fix && data <= fax) return true;
              return addError(data);
            };
          }
          else if (fie) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatExclusiveMinimum',
              fie,
              compileFormatNumber,
            );
            return function formatExclusiveMinimum(data) {
              if (!isDataType(data)) return true;
              if (data > fie) return true;
              return addError(data);
            };
          }
          else if (fae) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatExclusiveMaximum',
              fae,
              compileFormatNumber,
            );
            return function formatExclusiveMaximum(data) {
              if (!isDataType(data)) return true;
              if (data < fae) return true;
              return addError(data);
            };
          }
          else if (fax) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatMaximum',
              fax,
              compileFormatNumber,
            );
            return function formatMaximum(data) {
              if (!isDataType(data)) return true;
              if (data <= fax) return true;
              return addError(data);
            };
          }
          else if (fix) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatMinimum',
              fix,
              compileFormatNumber,
            );
            return function formatMinimum(data) {
              if (!isDataType(data)) return true;
              if (data >= fix) return true;
              return addError(data);
            };
          }
          return undefined;
        };
      }
    }
  }
  return undefined;
}

export function registerDefaultFormatCompilers() {
  const all = {
    ...numberFormats,
    ...dateTimeFormats,
    ...stringFormats,
  };

  const keys = Object.keys(all);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    const item = all[key];
    registerFormatCompiler(key, item);
  }
}

const registeredSchemaFormatters = {};
export function registerFormatCompiler(name, jsonSchema) {
  if (registeredSchemaFormatters[name] == null) {
    const r = typeof jsonSchema;
    if (r === 'function') {
      registeredSchemaFormatters[name] = jsonSchema;
      return true;
    }
    else {
      const fn = createFormatNumberCompiler(name, jsonSchema);
      if (fn) {
        registeredSchemaFormatters[name] = fn;
        return true;
      }
    }
  }
  return false;
}

export function getSchemaFormatCompiler(name) {
  if (isStrictStringType(name))
    return registeredSchemaFormatters[name];
  else
    return undefined;
}
