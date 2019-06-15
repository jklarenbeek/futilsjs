/* eslint-disable quote-props */

export function createIntegerFormats() {
  return {
    int8: {
      type: 'integer',
      bits: 8,
      signed: true,
      minimum: -128,
      maximum: 127,
    },
    uint8: {
      type: 'integer',
      bits: 8,
      signed: false,
      minimum: -128,
      maximum: 127,
    },
    uint8c: {
      type: 'integer',
      bits: 8,
      signed: false,
      minimum: -128,
      maximum: 255,
      clamped: true,
    },
    int16: {
      type: 'integer',
      bits: 16,
      signed: true,
      minimum: -32768,
      maximum: 32767,
    },
    uint16: {
      type: 'integer',
      bits: 16,
      signed: false,
      minimum: 0,
      maximum: 65535,
    },
    int32: {
      type: 'integer',
      bits: 32,
      signed: true,
      minimum: -(2 ** 31),
      maximum: (2 ** 31) - 1,
    },
    uint32: {
      type: 'integer',
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
}

export function createBigIntFormats() {
  return {
    big64: {
      type: 'bigint',
      bits: 64,
      signed: true,
      minimum: -(2 ** 63),
      maximum: (2 ** 63) - 1, // TODO: bigint eslint support anyone?
    },
    ubig64: {
      type: 'bigint',
      bits: 64,
      signed: true,
      minimum: 0,
      maximum: (2 ** 64) - 1, // TODO: bigint eslint support anyone?
    },
  };
}

export function createFloatFormats() {
  return {
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
}

export function createNumberFormats() {
  return {
    ...createIntegerFormats(),
    ...createBigIntFormats(),
    ...createFloatFormats(),
    year: {
      type: 'integer',
      minimum: 1970,
      maximum: 2030,
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
}
//#endregion

export function createStringFormats() {
  return {
    date: function compileDate(schema, members, addError) {
      const min = Date.parse(schema.formatMinimum) || undefined;
      const emin = schema.formatExclusiveMinimum === true
        ? min
        : Date.parse(schema.formatExclusiveMinimum) || undefined;

      const max = Date.parse(schema.formatMaximum);
      const emax = schema.formatExclusiveMaximum === true
        ? max
        : Date.parse(schema.formatExclusiveMaximum) || undefined;

      return function formatDate(data) {
        if (typeof data === 'string') {
          const date = Date.parse(data) || false;
          if (date === false) {
            addError('format', 'date', data);
          }
          return false; // TODO;
        }
        return false;
      };
    },

    time: function compileTime(schema) {
      return schema;
    },

    'date-time': function compileTime(schema) {
      return schema;
    },
  };
}

export function createArrayFormats() {
  return {
    'int8': 'Int8Array', // array type maps for item format
    'uint8': 'Uint8Array',
    'uint8c': 'Uint8ClampedArray',
    'int16': 'Int16Array',
    'uint16': 'Uint16Array',
    'int32': 'Int32Array',
    'uint32': 'Uint32Array',
    'big64': 'BigInt64Array',
    'ubig64': 'BigUint64Array',
    'set': 'Set',
  };
}

export function createObjectFormats() {
  return {
    'map': 'Map', //
  };
}
