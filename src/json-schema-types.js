import {
  integerFormats,
  bigIntFormats,
  //numberFormats,
  floatFormats,
//stringFormats,
//arrayFormats,
//objectFormats,
} from './json-schema-formats';

import {
  isPureObject,
  isPureArray,
} from './types-base';

export function isUnkownSchema(schema) {
  return (schema.type == null
    && schema.properties == null
    && schema.patternProperties == null
    && schema.additionalProperties == null
    && schema.items == null
    && schema.contains == null
    && schema.additionalItems == null);
}

export function getSchemaSelectorName(schema) {
  const name = typeof schema === 'object'
    ? schema.allOf ? 'allOf'
      : schema.anyOf ? 'anyOf'
        : schema.oneOf ? 'oneOf'
          : schema.not ? 'not'
            : undefined
    : undefined;
  return name;
}

export function isBooleanSchema(schema) {
  const isknown = schema.type === 'boolean';
  const isvalid = isUnkownSchema(schema)
    && (typeof schema.const === 'boolean'
      || typeof schema.default === 'boolean');
  return isknown || isvalid;
}
export function isNumberSchema(schema) {
  const isknown = schema.type === 'number';
  const isformat = typeof schema.format === 'string'
    && floatFormats[schema.format] != null;

  const isconst = (Number(schema.const) || false) !== false;
  const isdeflt = (Number(schema.default) || false) !== false;

  const isvalid = isUnkownSchema(schema) && (isconst || isdeflt);

  return isknown || isformat || isvalid;
}
export function isIntegerSchema(schema) {
  const isknown = schema.type === 'integer';
  const isformat = typeof schema.format === 'string'
    && integerFormats[schema.format] != null;

  const isconst = Number.isInteger(Number(schema.const));
  const isdeflt = Number.isInteger(Number(schema.default));

  const isvalid = isUnkownSchema(schema) && (isconst || isdeflt);

  return isknown || isformat || isvalid;
}
export function isBigIntSchema(schema) {
  const isknown = schema.type === 'bigint' || schema.type === 'biginteger';
  const isformat = typeof schema.format === 'string'
    && bigIntFormats[schema.format] != null;

  const isvalid = isUnkownSchema(schema)
    // eslint-disable-next-line valid-typeof
    && (typeof schema.const === 'bigint' || typeof schema.default === 'bigint');

  return isknown || isformat || isvalid;
}
export function isStringSchema(schema) {
  const isknown = schema.type === 'string';
  const isvalid = isUnkownSchema(schema)
    && (typeof schema.const === 'string'
      || typeof schema.default === 'string');

  return isknown || isvalid;
}
export function isObjectSchema(schema) {
  const isknown = schema.type === 'object';

  const isprops = isPureObject(schema.properties)
    || isPureObject(schema.patternProperties)
    || isPureObject(schema.additionalProperties);

  const isvalid = schema.type == null
      && (isPureObject(schema.const) || isPureObject(schema.default));
  return isknown || isprops || isvalid;
}
export function isMapSchema(schema) {
  const isknown = schema.type === 'map';
  const ismap = isPureArray(schema.properties);
  return isknown || ismap;
}
export function isArraySchema(schema) {
  const isknown = schema.type === 'array';
  const isitems = isPureObject(schema.items);
  const iscontains = isPureObject(schema.contains);
  const isvalid = schema.type == null
    && (isPureArray(schema.const) || isPureArray(schema.default));
  return isknown || isitems || iscontains || isvalid;
}
export function isTupleSchema(schema) {
  const isknown = schema.type === 'tuple';
  const istuple = isPureArray(schema.items);
  const isadditional = schema.type == null
    && schema.hasOwnProperty('additionalItems');
  return isknown || istuple || isadditional;
}

export function isPrimitiveSchema(schema) {
  return isStringSchema(schema)
    || isIntegerSchema(schema)
    || isBigIntSchema(schema)
    || isNumberSchema(schema);
}

export const schemaTypes = {
  boolean: isBooleanSchema,
  integer: isIntegerSchema,
  bigint: isBigIntSchema,
  number: isNumberSchema,
  string: isStringSchema,
  object: isObjectSchema,
  array: isArraySchema,
  map: isMapSchema,
  tuple: isTupleSchema,
};

// DATA TYPES

export function isStrictBooleanType(data) {
  return typeof data === 'boolean';
}
isStrictBooleanType.typeName = 'boolean';
export function isBooleanishType(data) {
  return data === true
    || data === false
    || data === 'true'
    || data === 'false';
  // || data === 0
  // || data === 1;
}
isBooleanishType.typeName = 'boolean';
export function isStrictIntegerType(data) {
  return Number.isInteger(data);
}
isStrictIntegerType.typeName = 'integer';
export function isIntegerishType(data) {
  return Number.isInteger(Number(data));
}
isIntegerishType.typeName = 'integer';
export function isStrictBigIntType(data) {
  // eslint-disable-next-line valid-typeof
  return typeof data === 'bigint';
}
isStrictBigIntType.typeName = 'bigint';
export function isStrictNumberType(data) {
  return typeof data === 'number';
}
isStrictNumberType.typeName = 'number';
export function isNumberishType(data) {
  return (Number(data) || false) !== false;
}
isNumberishType.typeName = 'number';
export function isStrictStringType(data) {
  return typeof data === 'string';
}
isStrictStringType.typeName = 'string';
export function isStrictObjectOfType(data, fn) {
  return data != null && data.constructor === fn;
}
isStrictObjectOfType.typeName = 'object';
export function isStrictArrayType(data) {
  return data != null && data.constructor === Array;
}
isStrictArrayType.typeName = 'array';
export function isArrayishType(data) {
  return data != null
    && data instanceof Array
    && data.constructor === Int8Array
    && data.constructor === Uint8Array
    && data.constructor === Uint8ClampedArray
    && data.constructor === Int16Array
    && data.constructor === Uint16Array
    && data.constructor === Int32Array
    && data.constructor === Uint32Array
    // eslint-disable-next-line no-undef
    && data.constructor === BigInt64Array
    // eslint-disable-next-line no-undef
    && data.constructor === BigUint64Array;
}
isArrayishType.typeName = 'array';

export const TypedArrays = {

};

export function createIsStrictObjectOfType(fn) {
  // eslint-disable-next-line no-undef-init
  let usefull = undefined;
  if (typeof fn === 'function') {
    usefull = function isStrictObjectOfTypeFn(data) {
      return isStrictObjectOfType(data, fn);
    };
  }
  else if (fn instanceof Array) {
    const types = [];
    for (let i = 0; i < fn.length; ++i) {
      const type = fn[i];
      if (typeof type === 'string') {
        types.push('data.constructor===' + type);
      }
      else if (typeof type === 'function') {
        types.push('data.constructor===' + type.name);
      }
    }
    if (types > 0) {
      // eslint-disable-next-line no-new-func
      usefull = new Function(
        'data',
        'return data!=null && (' + types.join('||') + ')',
      );
    }
  }
  else if (typeof fn === 'string') {
    // eslint-disable-next-line no-new-func
    usefull = new Function(
      'data',
      'return data!=null && data.constructor===' + fn,
    );
  }
  return usefull;
}
