/* eslint-disable no-labels */
import { getObjectCountItems } from './object';

/* eslint-disable no-lonely-if */

export function JSONSchema_isUnknownSchema(schema) {
  return (schema.type == null
    && schema.properties == null
    && schema.items == null);
}

export function JSONSchema_isValidState(schema, dataType = '', data) {
  const err = [];
  if ((schema.required != null && schema.required !== false) && data == null) err.push('required');
  if (schema.nullable === false && data == null) err.push('nullable');
  if (data != null && (typeof data !== dataType)) err.push('type');
  return err;
}

export function JSONSchema_isBoolean(schema) {
  const isknown = schema.type === 'boolean';
  const isknowable = isknown || JSONSchema_isUnknownSchema(schema);
  const isvalid = isknowable
    && (typeof schema.const === 'boolean'
      || typeof schema.default === 'boolean');
  const isenum = isknowable
      && (typeof schema.enum === 'object'
        && schema.enum.constructor === Array
        && schema.enum.length === 2);
  return isknown || isvalid || isenum;
}
export function JSONSchema_isValidBoolean(schema, data) {
  return JSONSchema_isValidState(schema, 'boolean', data);
}

export function JSONSchema_isNumber(schema) {
  const isknown = schema.type === 'number';
  const isknowable = isknown || JSONSchema_isUnknownSchema(schema);
  const isvalid = isknowable
    && (typeof schema.const === 'number'
      || typeof schema.default === 'number');

  return isknown || isvalid;
}
export function JSONSchema_isInteger(schema) {
  const isknown = schema.type === 'integer';
  const isknowable = isknown || JSONSchema_isUnknownSchema(schema);
  const isvalid = isknowable
    && (Number.isInteger(schema.const)
      || Number.isInteger(schema.default));
  return isknown || isvalid;
}

function JSONSchema_isValidNumberConstraint(schema, err, data) {
  if (typeof schema.minimum === 'number') {
    if (schema.exclusiveMinimum === true) {
      if (data < schema.minimum) err.push('exclusiveMinumum');
    }
    else {
      if (data <= schema.minimum) err.push('minimum');
    }
  }
  if (typeof schema.maximum === 'number') {
    if (schema.exclusiveMaximum === true) {
      if (data > schema.maximum) err.push('exclusiveMaximum');
    }
    else {
      if (data >= schema.maximum) err.push('maximum');
    }
  }
  if (typeof schema.multipleOf === 'number') {
    if (data === 0 || ((data % schema.multipleOf) !== 0)) err.push('multipleOf');
  }
  return err;
}

export function JSONSchema_isValidNumber(schema, data) {
  const err = JSONSchema_isValidState(schema, 'number', data);
  if (err.length > 0) return err;
  if (data == null) return err;
  return JSONSchema_isValidNumberConstraint(schema, err, data);
}

export function JSONSchema_isValidInteger(schema, data) {
  const err = JSONSchema_isValidState(schema, 'number', data);
  if (data == null) return err;
  if (!Number.isInteger(data)) {
    err.push('type');
  }
  if (err.length > 0) return err;
  return JSONSchema_isValidNumberConstraint(schema, err, data);
}

export function JSONSchema_isString(schema) {
  const isknown = schema.type === 'string';
  const isknowable = isknown || JSONSchema_isUnknownSchema(schema);
  const isvalid = isknowable
    || typeof schema.const === 'string'
    || typeof schema.default === 'string';

  return isknown || isvalid;
}

export function JSONSchema_isValidString(schema, data) {
  const err = JSONSchema_isValidState(schema, 'string', data);
  if (err.length > 0) return err;
  if (data == null) return err;

  if (typeof schema.maxLength === 'number') {
    if (data.length > schema.maxLength) err.push('maxLength');
  }
  if (typeof schema.minLength === 'number') {
    if (data.length < schema.minLength) err.push('minLength');
  }
  if (typeof schema.pattern === 'string') {
    const pattern = new RegExp(schema.pattern);
    if (data.search(pattern) === -1) err.push('pattern');
  }
  if (typeof schema.pattern === 'object' && schema.pattern.constructor === Array) {
    const pattern = new RegExp(...schema.pattern);
    if (data.search(pattern) === -1) err.push('pattern');
  }
}

export function JSONSchema_isObject(schema) {
  const isknown = schema.type === 'object';
  const isknowable = isknown || schema.type == null;
  const isvalid = isknowable
    && typeof schema.properties === 'object'
    && schema.properties.constructor !== Array;
  return isknown || isvalid;
}

export function JSONSchema_isValidObject(schema, data) {
  const err = JSONSchema_isValidState(schema, 'object', data);
  if (data == null) return err;
  if (data.constructor === Array) err.push('type');
  if (err.length > 0) return err;

  // TODO: we can make this way faster by
  // containing all tests within one loop.
  // If possible! Thus, not what we do now.

  const count = getObjectCountItems(data)|0;
  if (typeof schema.maxProperties === 'number') {
    if (count > schema.maxProperties) err.push('maxProperties');
  }
  if (typeof schema.minProperties === 'number') {
    if (count < schema.minProperties) err.push('minProperties');
  }

  if (typeof schema.required === 'object') {
    const required = schema.required;
    if (required.constructor === Array) {
      for (let i = 0; i < required.length; ++i) {
        const prop = required[i];
        if (!data.hasOwnProperty(prop)) err.push(['required', prop]);
      }
    }
    else {
      for (const prop in required) {
        if (required.hasOwnProperty(prop)) {
          if (!data.hasOwnProperty(prop)) err.push(['required', prop]);
        }
      }
    }
  }

  if (typeof schema.patternRequired === 'object') {
    const required = schema.patternRequired;
    if (required.constructor === Array) {
      loop:
      for (let i = 0; i < required.length; ++i) {
        const rgx = required[i];
        if (typeof rgx === 'string') {
          const pattern = new RegExp(rgx);
          for (const item in data) {
            if (data.hasOwnProperty(item)) {
              if (pattern.exec(item) != null) continue loop;
            }
          }
          err.push(['patternRequired', rgx]);
        }
      }
    }
  }

  if (schema.additionalProperties === false) {
    // test whether all properties of data are
    // within limits of properties and patternProperties
    // defined in schema.

    const properties = schema.properties;
    const patterns = schema.patternProperties;

    const hasproperties = typeof properties === 'object'
      && properties.constructor !== Array;
    const haspattern = typeof patterns === 'object'
      && patterns.constructor !== Array;

    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        if (hasproperties || haspattern) {
          if (properties.hasOwnProperty(prop) === false) err.push(['properties', prop]);
        }
      }
    }
  }
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
