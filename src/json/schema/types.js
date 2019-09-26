import { numberFormats as integerFormats } from '../format/integer';
import { numberFormats as floatFormats } from '../format/float';
import { numberFormats as bigIntFormats } from '../format/bigint';

import {
  isStringType,
  isArrayType,
  isObjectType,
} from '../../types/core';

import {
  getBoolishType,
} from '../../types/getters';

export const CONST_SCHEMA_TYPE_GENERAL = 'schema';
export const CONST_SCHEMA_TYPE_INTEGER = 'integer';
export const CONST_SCHEMA_TYPE_NUMBER = 'number';
export const CONST_SCHEMA_TYPE_BIGINT = 'bigint';
export const CONST_SCHEMA_TYPE_STRING = 'string';
export const CONST_SCHEMA_TYPE_TUPLE = 'tuple';
export const CONST_SCHEMA_TYPE_ARRAY = 'array';
export const CONST_SCHEMA_TYPE_OBJECT = 'object';

export function isOfSchemaType(schema, type) {
  if (type == null) return false;
  const stype = schema.type;
  if (stype == null) return false;
  if (stype === type) return true;
  if (stype.constructor === Array) {
    return stype.includes(type);
  }
  return false;
}

export function isOfStrictSchemaType(schema, type) {
  if (type == null) return false;
  if (schema.type == null) return false;
  if (schema.type === type) return true;
  if (schema.type.constructor === Array && schema.type.length <= 2)
    return schema.type.includes('null') && schema.type.includes(type);
  return false;
}

export function isUnkownSchema(schema) {
  return (schema.type == null
    && schema.properties == null
    && schema.patternProperties == null
    && schema.additionalProperties == null
    && schema.items == null
    && schema.contains == null
    && schema.additionalItems == null);
}

//#region is-primitive
export function isBooleanSchema(schema) {
  const isknown = isOfStrictSchemaType(schema, 'boolean');
  const isvalid = isUnkownSchema(schema)
    && (typeof schema.const === 'boolean'
      || typeof schema.default === 'boolean');
  return isknown || isvalid;
}
export function isNumberSchema(schema) {
  const isknown = isOfStrictSchemaType(schema, 'number');
  const isformat = isStringType(schema.format)
    && floatFormats[schema.format] != null;

  const isconst = (Number(schema.const) || false) !== false;
  const isdeflt = (Number(schema.default) || false) !== false;

  const isvalid = isUnkownSchema(schema) && (isconst || isdeflt);

  return isknown || isformat || isvalid;
}
export function isIntegerSchema(schema) {
  const isknown = isOfStrictSchemaType(schema, 'integer');
  const isformat = typeof schema.format === 'string'
    && integerFormats[schema.format] != null;

  const isconst = Number.isInteger(Number(schema.const));
  const isdeflt = Number.isInteger(Number(schema.default));

  const isvalid = isUnkownSchema(schema) && (isconst || isdeflt);

  return isknown || isformat || isvalid;
}
export function isBigIntSchema(schema) {
  const isknown = isOfStrictSchemaType(schema, 'bigint')
    || isOfStrictSchemaType(schema, 'biginteger');

  const isformat = typeof schema.format === 'string'
    && bigIntFormats[schema.format] != null;

  const isvalid = isUnkownSchema(schema)
    // eslint-disable-next-line valid-typeof
    && (typeof schema.const === 'bigint' || typeof schema.default === 'bigint');

  return isknown || isformat || isvalid;
}
export function isStringSchema(schema) {
  const isknown = isOfStrictSchemaType(schema, 'string');
  const isvalid = isUnkownSchema(schema)
    && (typeof schema.const === 'string'
      || typeof schema.default === 'string');

  return isknown || isvalid;
}
export function isPrimitiveSchema(schema) {
  return isStringSchema(schema)
    || isIntegerSchema(schema)
    || isBigIntSchema(schema)
    || isNumberSchema(schema)
    || isBooleanSchema(schema);
}
//#endregion

//#region has-children
export function isObjectSchema(schema) {
  const isknown = isOfStrictSchemaType(schema, 'object');

  const isprops = isObjectType(schema.properties)
    || isObjectType(schema.patternProperties)
    || isObjectType(schema.additionalProperties);

  const isvalid = schema.type == null
      && (isObjectType(schema.const) || isObjectType(schema.default));
  return isknown || isprops || isvalid;
}
export function isMapSchema(schema) {
  const isknown = isOfStrictSchemaType(schema, 'map');
  const ismap = isArrayType(schema.properties);
  return isknown || ismap;
}
export function isArraySchema(schema) {
  const isknown = isOfStrictSchemaType(schema === 'array');
  const isitems = isObjectType(schema.items);
  const iscontains = isObjectType(schema.contains);
  const isvalid = schema.type == null
    && (isArrayType(schema.const)
      || isArrayType(schema.default));
  return isknown || isitems || iscontains || isvalid;
}
export function isSetSchema(schema) {
  const isknown = isOfStrictSchemaType(schema, 'set');
  const isunique = getBoolishType(schema.uniqueItems, false);
  return isknown || isunique;
}
export function isTupleSchema(schema) {
  const isknown = isOfStrictSchemaType(schema, 'tuple');
  const istuple = isArrayType(schema.items);
  const isadditional = schema.type == null
    && schema.hasOwnProperty('additionalItems');
  return isknown || istuple || isadditional;
}
//#endregion

//#region is-combining
export function getCombiningSchemaName(schema) {
  const name = typeof schema === 'object'
    ? schema.allOf ? 'allOf'
      : schema.anyOf ? 'anyOf'
        : schema.oneOf ? 'oneOf'
          : schema.not ? 'not'
            : undefined
    : undefined;
  return name;
}

export function isCombiningSchema(schema) {
  return getCombiningSchemaName(schema) !== undefined;
}
//#endregion

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
  set: isSetSchema,
};
