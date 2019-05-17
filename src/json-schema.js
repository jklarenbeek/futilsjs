/* eslint-disable no-lonely-if */

export function JSONSchema_isPrimitiveSchema(schema) {
  return (schema.type == null
    && schema.properties == null
    && schema.items == null);
}

export function JSONSchema_isBoolean(schema) {
  const isknown = schema.type === 'boolean';
  const isknowable = isknown || JSONSchema_isPrimitiveSchema(schema);
  const isderived = isknowable
    && (typeof schema.const === 'boolean'
      || typeof schema.default === 'boolean');
  const isvalid = isknowable
      && (typeof schema.enum === 'object'
        && schema.enum.constructor === Array
        && schema.enum.length === 2);
  return isknown || isderived || isvalid;
}

export function JSONSchema_isValidBoolean(schema, data) {
  if (schema.required === true && data == null) return false;
  if (schema.nullable === false && data == null) return false;
  if (data == null) return true;
  return (typeof data === 'boolean');
}

export function JSONSchema_isNumber(schema) {
  const isknown = schema.type === 'number'
    || schema.type === 'integer';
  const isknowable = isknown || JSONSchema_isPrimitiveSchema(schema);
  const isvalid = isknowable
    || typeof schema.const === 'number'
    || typeof schema.default === 'number';

  return isknown || isvalid;
}

export function JSONSchema_isValidNumber(schema, data) {
  if (schema.required === true && data == null) return false;
  if (schema.nullable === false && data == null) return false;
  if (data == null) return true;
  if (typeof data !== 'number') return false;
  if (typeof schema.minimum === 'number') {
    if (schema.exclusiveMinimum === true) {
      if (data < schema.minimum) return false;
    }
    else {
      if (data <= schema.minimum) return false;
    }
  }
}

export function JSONSchema_isString(schema) {
  const isknown = schema.type === 'string';
  const isknowable = isknown || JSONSchema_isPrimitiveSchema(schema);
  const isvalid = isknowable
    || typeof schema.const === 'string'
    || typeof schema.default === 'string';

  return isknown || isvalid;
}

export function JSONSchema_isObject(schema) {
  const isknown = schema.type === 'object';
  const isknowable = isknown || schema.type == null;
  const isvalid = isknowable
    && typeof schema.properties === 'object'
    && schema.properties.constructor !== Array;
  return isknown || isvalid;
}

export function JSONSchema_isArray(schema) {
  const isknown = schema.type === 'array';
  const isknowable = isknown || schema.type == null;
  const isvalid = isknowable
    && typeof schema.items === 'object'
    && schema.items.constructor !== Array;

  return isknown || isvalid;
}

export function JSONSchema_isTuple(schema) {
  const isknown = schema.type === 'tuple';
  const isknowable = isknown || schema.type === 'array' || schema.type == null;
  const isvalid = isknowable
    && typeof schema.items === 'object'
    && schema.items.constructor === Array;
  return isknown || isvalid;
}

export default class JSONSchema {

}
