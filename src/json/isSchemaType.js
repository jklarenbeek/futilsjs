import {
  integerFormats,
  bigIntFormats,
  floatFormats,
} from '../json-schema-formats';

import {
  isObjectishType,
  isStrictArrayType,
} from './isDataType';

import {
  getBooleanishType,
} from './getDataType';

export function isSchemaOfType(schema, type) {
  if (type == null) return false;
  if (schema.type.constructor === String) {
    return schema.type === type;
  }
  else if (schema.type.constructor === Array) {
    const types = type;
    for (let i = 0; i < types.length; ++i) {
      const tp = types[i];
      if (tp === type) return true;
    }
  }
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
  const isknown = schema.type === 'object';

  const isprops = isObjectishType(schema.properties)
    || isObjectishType(schema.patternProperties)
    || isObjectishType(schema.additionalProperties);

  const isvalid = schema.type == null
      && (isObjectishType(schema.const) || isObjectishType(schema.default));
  return isknown || isprops || isvalid;
}
export function isMapSchema(schema) {
  const isknown = schema.type === 'map';
  const ismap = isStrictArrayType(schema.properties);
  return isknown || ismap;
}
export function isArraySchema(schema) {
  const isknown = schema.type === 'array';
  const isitems = isObjectishType(schema.items);
  const iscontains = isObjectishType(schema.contains);
  const isvalid = schema.type == null
    && (isStrictArrayType(schema.const)
      || isStrictArrayType(schema.default));
  return isknown || isitems || iscontains || isvalid;
}
export function isSetSchema(schema) {
  const isknown = schema.type === 'set';
  const isunique = getBooleanishType(schema.uniqueItems, false);
  return isknown || isunique;
}
export function isTupleSchema(schema) {
  const isknown = schema.type === 'tuple';
  const istuple = isStrictArrayType(schema.items);
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
