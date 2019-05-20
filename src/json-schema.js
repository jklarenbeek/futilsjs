/* eslint-disable class-methods-use-this */
/* eslint-disable no-labels */
/* eslint-disable no-lonely-if */
import { getObjectCountItems, isPureObject } from './object';


export const JSONPath_separator = '/';
export function JSONPath_addFolder(path, folder) {
  // TODO: test folder name is valid
  if (path === JSONPath_separator) {
    return path + folder;
  }
}

export function JSONSchema_isUnknownSchema(schema) {
  return (schema.type == null
    && schema.properties == null
    && schema.items == null);
}

export function JSONSchema_isValidState(path, schema, dstType = '', data, err) {
  if (data == null) {
    if (data === undefined && schema.required != null && schema.required !== false) err.push([path, 'required']);
    if (data === null && schema.nullable !== true) err.push([path, 'nullable', schema.nullable]);
  }
  else {
    const srcType = typeof data;
    if (dstType === 'array') {
      if (!(srcType === 'object' && data.constructor === Array)) err.push([path, 'type', dstType, srcType]);
    }
    else if (dstType === 'tuple') {
      err.push([path, 'implementation', dstType, srcType]);
    }
    else if (dstType === 'map') {
      err.push([path, 'implementation', dstType, srcType]);
    }
    else {
      if (srcType !== dstType) err.push([path, 'type', dstType, srcType]);
    }
  }
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
export function JSONSchema_constructBooleanSchema(schema) {
  schema.type = 'boolean';
}
export function JSONSchema_isValidBoolean(path = '/', schema, data, err = []) {
  return JSONSchema_isValidState(path, schema, 'boolean', data, err);
}

export const JSONSchema_formatNumber = ['number', 'range', 'date', 'datetime', 'datetime-local', 'month', 'time', 'week'];

export function JSONSchema_getFormatNumberType(schema) {
  return JSONSchema_formatNumber.includes(schema.format)
    ? schema.format
    : 'number';
}

function JSONSchema_isValidNumberConstraint(path, schema, data, err) {
  if (typeof schema.minimum === 'number') {
    if (schema.exclusiveMinimum === true) {
      if (data < schema.minimum) err.push([path, 'exclusiveMinumum', schema.minimum, data]);
    }
    else {
      if (data <= schema.minimum) err.push([path, 'minimum', schema.minimum, data]);
    }
  }
  if (typeof schema.maximum === 'number') {
    if (schema.exclusiveMaximum === true) {
      if (data > schema.maximum) err.push([path, 'exclusiveMaximum', schema.maximum, data]);
    }
    else {
      if (data >= schema.maximum) err.push([path, 'maximum', schema.maximum, data]);
    }
  }
  if (typeof schema.multipleOf === 'number') {
    if (data === 0 || ((data % schema.multipleOf) !== 0)) err.push([path, 'multipleOf', schema.multipleOf, data]);
  }
  return err;
}

export function JSONSchema_isNumber(schema) {
  const isknown = schema.type === 'number';
  const isknowable = isknown || JSONSchema_isUnknownSchema(schema);
  const isvalid = isknowable
    && (typeof schema.const === 'number'
      || typeof schema.default === 'number');

  return isknown || isvalid;
}
export function JSONSchema_constructNumberSchema(schema) {
  schema.type = 'number';
}
export function JSONSchema_isValidNumber(path = '/', schema, data, err = []) {
  err = JSONSchema_isValidState(path, schema, 'number', data, err);
  if (err.length > 0) return err;
  if (data == null) return err;
  return JSONSchema_isValidNumberConstraint(path, schema, data, err);
}

export function JSONSchema_isInteger(schema) {
  const isknown = schema.type === 'integer';
  const isknowable = isknown || JSONSchema_isUnknownSchema(schema);
  const isvalid = isknowable
    && (Number.isInteger(schema.const)
      || Number.isInteger(schema.default));
  return isknown || isvalid;
}
export function JSONSchema_constructIntegerSchema(schema) {
  schema.type = 'integer';
}
export function JSONSchema_isValidInteger(path = '/', schema, data, err = []) {
  err = JSONSchema_isValidState(path, schema, 'number', data, err);
  if (data == null) return err;
  if (!Number.isInteger(data)) {
    err.push([path, 'type', 'integer', typeof data]);
  }
  if (err.length > 0) return err;
  return JSONSchema_isValidNumberConstraint(path, schema, data, err);
}

export function JSONSchema_isString(schema) {
  const isknown = schema.type === 'string';
  const isknowable = isknown || JSONSchema_isUnknownSchema(schema);
  const isvalid = isknowable
    || typeof schema.const === 'string'
    || typeof schema.default === 'string';

  return isknown || isvalid;
}

export function JSONSchema_constructStringSchema(schema) {
  schema.type = 'string';
}
export function JSONSchema_isValidString(path = '/', schema, data, err = []) {
  err = JSONSchema_isValidState(path, schema, 'string', data, err);
  if (err.length > 0) return err;
  if (data == null) return err;

  if (typeof schema.maxLength === 'number') {
    if (data.length > schema.maxLength) err.push([path, 'maxLength', schema.maxLength, data.length]);
  }
  if (typeof schema.minLength === 'number') {
    if (data.length < schema.minLength) err.push([path, 'maxLength', schema.maxLength, data.length]);
  }
  if (typeof schema.pattern === 'string') {
    const pattern = new RegExp(schema.pattern);
    if (data.search(pattern) === -1) err.push([path, 'pattern', schema.pattern, data]);
  }
  if (typeof schema.pattern === 'object' && schema.pattern.constructor === Array) {
    const pattern = new RegExp(...schema.pattern);
    if (data.search(pattern) === -1) err.push([path, 'pattern', '[\'' + schema.pattern.join('\', \'') + '\']', data]);
  }
}

export function JSONSchema_isObject(schema) {
  const isknown = schema.type === 'object';
  const isvalid = schema.hasOwnProperty('properties');
  return isknown || isvalid;
}

export function JSONSchema_isValidObject(path = '/', schema, data, err = [], callback) {
  err = JSONSchema_isValidState(path, schema, 'object', data, err);
  if (data == null) return err;
  if (data.constructor === Array) err.push([path, 'type', 'object', 'array']);
  if (err.length > 0) return err;

  const count = getObjectCountItems(data)|0;
  if (typeof schema.maxProperties === 'number') {
    if (count > schema.maxProperties) err.push([path, 'maxProperties', schema.maxProperties, count]);
  }
  if (typeof schema.minProperties === 'number') {
    if (count < schema.minProperties) err.push([path, 'minProperties', schema.minProperties, count]);
  }

  if (typeof schema.required === 'object') {
    const required = schema.required;
    if (required.constructor === Array) {
      for (let i = 0; i < required.length; ++i) {
        const prop = required[i];
        if (!data.hasOwnProperty(prop)) err.push([path, 'required', prop]);
      }
    }
    else {
      for (const prop in required) {
        if (required.hasOwnProperty(prop)) {
          if (!data.hasOwnProperty(prop)) err.push([path, 'required', prop]);
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
          err.push([path, 'patternRequired', rgx]);
        }
      }
    }
  }
  if (err.length > 0) return err;

  const properties = schema.properties;
  const patterns = schema.patternProperties;

  const hasproperties = typeof properties === 'object'
    && properties.constructor !== Array;
  const haspatterns = typeof patterns === 'object'
    && patterns.constructor !== Array;

  next:
  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      // test whether all properties of data are
      // within limits of properties and patternProperties
      // defined in schema.

      if (hasproperties) {
        if (properties.hasOwnProperty(prop) === true) {
          if (callback) {
            callback(JSONPath_addFolder(path, prop), properties[prop], data[prop], err);
          }
          continue;
        }
      }

      if (haspatterns) {
        for (const pattern in patterns) {
          if (patterns.hasOwnProperty(pattern)) {
            const rgx = new RegExp(pattern);
            if (rgx.search(prop) !== -1) {
              if (callback) {
                callback(JSONPath_addFolder(path, prop), patterns[prop], data[prop], err);
              }
              continue next;
            }
          }
        }
        if (schema.additionalProperties === false) err.push([path, 'patternProperties', prop]);
        continue;
      }
      else {
        if (schema.additionalProperties === false) err.push([path, 'properties', prop]);
      }
    }
  }
  return err;
}

export function JSONSchema_constructObject(schema) {
  schema.type = 'object';
  schema.items = schema.properties || {};
  return schema;
}

export function JSONSchema_isArray(schema) {
  const isknown = schema.type === 'array';
  const isvalid = typeof schema.items === 'object'
    && schema.items.constructor !== Array;

  return isknown || isvalid;
}

export function JSONSchema_constructArray(schema) {
  schema.type = 'array';
  schema.items = schema.items || {};
  return schema;
}

export function JSONSchema_isValidArray(path = '/', schema, data, err = [], callback) {
  err = JSONSchema_isValidState(path, schema, 'array', data, err);
  if (data == null) return err;
  if (err.length > 0) return err;

  const length = data.length;
  if (typeof schema.minItems === 'number') {
    if (length < schema.minItems) err.push([path, 'minItems', schema.minItems, length]);
  }
  if (typeof schema.maxItems === 'number') {
    if (length > schema.maxItems) err.push([path, 'maxItems', schema.maxItems, length]);
  }
  if (schema.uniqueItems === true) {
    // TODO: implementation.uniqueItems
    err.push([path, 'implementation', 'uniqueItems']);
  }

  if (callback) {
    const itemschema = schema.items;
    for (let i = 0; i < length; ++i) {
      callback(JSONPath_addFolder(path, i), itemschema, data[i], err);
    }
  }
}

export function JSONSchema_isTuple(schema) {
  const isknown = schema.type === 'tuple';
  const isvalid = schema.type == null
    && typeof schema.items === 'object'
    && schema.items.constructor === Array;
  return isknown || isvalid;
}

export function JSONSchema_isValidTuple(path = '/', schema, data, err = [], callback) {
  throw new Error('Not Implemented', schema, data);
}

export function JSONSchema_isMap(schema) {
  const isknown = schema.type === 'map';
  const isvalid = isknown
    && typeof schema.items === 'object'
    && schema.items.constructor === Array
    && schema.items.length === 2;
  return isvalid;
}

export function JSONSchema_isValidMap(path = '/', schema, data, err = [], callback) {
  throw new Error('Not Implemented', schema, data);
}

export function JSONSchema_isValid(path = '/', schema, data, err = [], callback) {
  if (JSONSchema_isBoolean(schema)) {
    return JSONSchema_isValidBoolean(path, schema, data, err);
  }
  if (JSONSchema_isNumber(schema)) {
    return JSONSchema_isValidNumber(path, schema, data, err);
  }
  if (JSONSchema_isInteger(schema)) {
    return JSONSchema_isValidInteger(path, schema, data, err);
  }
  if (JSONSchema_isString(schema)) {
    return JSONSchema_isValidString(path, schema, data, err);
  }
  if (JSONSchema_isObject(schema)) {
    return JSONSchema_isValidObject(path, schema, data, err, callback || JSONSchema_isValid);
  }
  if (JSONSchema_isArray(schema)) {
    return JSONSchema_isValidArray(path, schema, data, err, callback || JSONSchema_isValid);
  }
  if (JSONSchema_isTuple(schema)) {
    return JSONSchema_isValidTuple(path, schema, data, err, callback || JSONSchema_isValid);
  }
  if (JSONSchema_isMap(schema)) {
    return JSONSchema_isValidMap(path, schema, data, err, callback || JSONSchema_isValid);
  }

  err.push([path, 'error', schema, data]);
  return err;
}

export default class JSONSchemaDocument {
  constructor(schema, data) {
    this.schema = schema;
    this.data = data;
  }
}

export class JSONSchema {
  constructor(owner, path, schema) {
    if (!(owner instanceof JSONSchemaDocument)) throw new TypeError('owner');
    if (typeof path !== 'string') throw new TypeError('path');
    if (typeof schema !== 'object') throw new TypeError('schema');

    this._owner = owner;
    this._path = path;

    this.type = (typeof schema.type === 'string')
      ? schema.type
      : 'unknown';
    this.format = (typeof schema.format === 'string')
      ? schema.format
      : null;
    this.required = schema.required === true;
    this.nullable = schema.nullable === true;
    this.readOnly = schema.readOnly === true;
    this.writeOnly = schema.writeOnly === true;

    this.title = schema.title;
    this.$comment = schema.$comment;
    this.description = schema.description;
    this.placeholder = schema.placeholder;
    this.default = schema.default;
    this.examples = schema.examples;

    this.layout = isPureObject(this.layout) ? this.layout : {};
  }
}

export class JSONSchemaBoolean extends JSONSchema {
}

export class JSONSchemaNumber extends JSONSchema {
  constructor(owner, path, schema) {
    super(owner, path, schema);

    if (schema.type === 'integer') {
      this.type = 'integer';
      // this.primitive = schema.primitive;
    }
    else if (schema.type === 'number') {
      this.type = 'number';
      // this.primitive = schema.primitive;
    }
    else if (schema.type.indexOf('int') === 0) {
      this.type = 'integer';
      this.primitive = schema.type;
    }
    else if (schema.type.indexOf('uint') === 0) {
      this.type = 'integer';
      this.primitive = schema.type;
    }
    else {
      this.type = 'number';
      this.primitive = schema.type;
    }
    this.format = getNumberFormatType();

    const min = this.type === 'integer'
      ? (schema.minimum && parseInt(schema.minimum)) || 0
      : (schema.minimum && Number(schema.minimum)) || 0.0;
    const max = this.type === 'integer'
      ? Math.max((schema.maximum && parseInt(schema.maximum)), min)
      : Math.max((schema.maximum && Number(schema.maximum)), min);

    if (!Number.isNaN(schema.minimum)) {
      this.minimum = min;
      this.exclusiveMinimim = typeof schema.exclusiveMinimim === 'boolean'
        ? schema.exclusiveMinimim
        : false;
      this._minimum = !schema.exclusiveMinimim ? schema.minimum : schema.minimum + 1;
    }

    if (!Number.isNaN(schema.maximum)) {
      if (max > 0 || max > min) {
        this.maximum = max;
        this.exclusiveMaximim = typeof schema.exclusiveMaximim === 'boolean'
          ? schema.exclusiveMaximim
          : false;
        this._maximum = !schema.exclusiveMaximim ? schema.maximum : schema.maximum - 1;
      }
    }

    const low = this.type === 'integer'
      ? (schema.low && parseInt(schema.low)) || min
      : (schema.low && Number(schema.low)) || min;
    const high = this.type === 'integer'
      ? Math.max(((schema.high && parseInt(schema.high)) || max), low)
      : Math.max(((schema.high && Number(schema.high)) || max), low);

    if (!Number.isNaN(schema.low)) {
      if (low > min && low < high) {
        this.low = low;
      }
    }
    if (!Number.isNaN(schema.high)) {
      if (high > low && high < max) {
        this.high = high;
      }
    }

    const optimum = this.type === 'integer'
      ? (schema.optimum && parseInt(schema.optimum)) || min
      : (schema.optimum && Number(schema.optimum)) || min;
    if (!Number.isNaN(schema.optimum)) {
      if (optimum > min && optimum < max) {
        this.optimum = optimum;
      }
    }

    if (!Number.isNaN(schema.multipleOf)) {
      this.multipleOf = this.type === 'integer'
        ? parseInt(schema.multipleOf)
        : Number(schema.multipleOf);
    }
    else if (this.type === 'integer') this.multipleOf = 1;

    if (!Number.isNaN(schema.default)) {
      this.default = this.type === 'integer'
        ? this.default = parseInt(schema.default)
        : this.default = Number(schema.default);
    }

    this._value = this.default;
    this._valid = false;
    this._error = null;
  }
}

export class JSONSchemaInteger extends JSONSchema {
}

export class JSONSchemaString extends JSONSchema {
}

export class JSONSchemaObject extends JSONSchema {
}

export class JSONSchemaArray extends JSONSchema {
}

export class JSONSchemaTuple extends JSONSchema {
}

export class JSONSchemaMap extends JSONSchema {
}
