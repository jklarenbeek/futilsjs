import { isFn } from "./types-base";

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

function compileDateFormat(owner, schema, addMember) {
  if (schema.format === 'date-time') {
    const fmin = schema.formatMinimum;
    const femin = schema.formatExclusiveMinimum;
    const min = Date.parse(fmin) || undefined;
    const emin = femin === true ? min
      : Date.parse(femin) || undefined;

    const fmax = schema.formatMaximum;
    const femax = schema.formatExclusiveMaximum;
    const max = Date.parse(fmax);
    const emax = femax === true ? max
      : Date.parse(femax) || undefined;

    // eslint-disable-next-line no-inner-declarations
    function isStringOrDate(data) {
      return (data != null && (data.constructor === String || data.constructor === Date));
    }

    // eslint-disable-next-line no-inner-declarations
    function fallback(fn) { return isFn(fn) ? fn : function allgood() { return true; }; }

    // eslint-disable-next-line no-inner-declarations
    function compileMinimum() {
      if (emin) {
        const addError = addMember('formatExclusiveMinimum', emin, compileDateFormat);
        return function formatExclusiveMinimum(date) {
          if (!(date > emin)) return addError(date);
          return true;
        };
      }
      else if (min) {
        const addError = addMember('formatMinimum', min, compileDateFormat);
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
        const addError = addMember('formatExclusiveMaximum', emax, compileDateFormat);
        return function formatExclusiveMaximum(date) {
          if (!(date < emax)) return addError(date);
          return true;
        };
      }
      else if (max) {
        const addError = addMember('formatMaximum', max, compileDateFormat);
        return function formatMaximum(date) {
          if (!(date <= max)) return addError(date);
          return true;
        };
      }
      return undefined;
    }

    // eslint-disable-next-line no-inner-declarations
    function compileDateType() {
      const addError = addMember('format', 'date', compileDateFormat);
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

    const isMinimum = fallback(compileMinimum());
    const isMaximum = fallback(compileMaximum());

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
