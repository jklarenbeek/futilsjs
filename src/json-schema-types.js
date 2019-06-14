import {
  integerFormats,
  bigintFormats,
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
    && bigintFormats[schema.format] != null;

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

export function isBooleanType(data) {
  return typeof data === 'boolean';
}
export function isIntegerType(data) {
  return Number.isInteger(Number(data));
}
export function isBigIntType(data) {
  // eslint-disable-next-line valid-typeof
  return typeof data === 'bigint';
}
export function isNumberType(data) {
  return (Number(data) || false) && !Number.isInteger(data);
}
export function isStringType(data) {
  return data != null && data.constructor === String;
}
export function isObjectType(data) {
  return data != null
    && !(data.constructor === Array || data.constructor === Map || data.constructor === Set);
}
export function isArrayType(data) {
  return data != null && data.constructor === Array;
}

isBooleanType.typeName = 'boolean';
isIntegerType.typeName = 'integer';
isNumberType.typeName = 'number';
isStringType.typeName = 'string';
isObjectType.typeName = 'object';
isArrayType.typeName = 'array';

export function getCallBackIsDataType(dataType) {
  return ({
    boolean: isBooleanType,
    integer: isIntegerType,
    bigint: isBigIntType,
    number: isNumberType,
    string: isStringType,
    object: isObjectType,
    array: isArrayType,
  })[dataType];
}
