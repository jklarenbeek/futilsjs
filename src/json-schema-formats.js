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
    minimum: -128,
    maximum: 127,
  },
  uint8c: {
    type: 'integer',
    arrayType: Uint8ClampedArray,
    bits: 8,
    signed: false,
    minimum: -128,
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

export const stringFormats = {
  'date-time': function compileDate(owner, schema, members, addError) {
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

      if (emin) members.push('formatExclusiveMinimum');
      else if (min) members.push('formatMinimum');
      if (emax) members.push('formatExclusiveMaximum');
      else if (max) members.push('formatMaximum');

      return function formatDate(data) {
        let valid = true;
        if (data != null && (data.constructor === String || data.constructor === Date)) {
          const date = Date.parse(data) || false;
          if (date === false) return addError(
            'format',
            'date',
            data,
          );

          if (emin) {
            if (!(date > emin)) valid = addError(
              'formatExclusiveMinimum',
              femin === true ? fmin : femin,
              data,
            );
          }
          else if (min) {
            if (!(date >= min)) valid = addError(
              'formatMinimum',
              fmin,
              data,
            );
          }

          if (emax) {
            if (!(date < emax)) valid = addError(
              'formatExclusiveMaximum',
              femax === true ? fmax : femax,
              data,
            );
          }
          else if (max) {
            if (!(date <= emax)) valid = addError(
              'formatMaximum',
              fmax,
              data,
            );
          }
        }
        return valid;
      };
    }
    return undefined;
  },
};
