/* eslint-disable class-methods-use-this */
/* eslint-disable no-labels */
/* eslint-disable no-lonely-if */
import { isPureObject } from './types';
import { getObjectCountItems } from './object';
import { mathi32_max } from './int32-math';
import { JSONPointer_addFolder } from './json-pointer';

export function JSONSchema_isUnknownSchema(schema) {
  return (schema.type == null
    && schema.properties == null
    && schema.items == null);
}

export function JSONSchema_isValidState(schema, path, type, data, err) {
  if (data == null) {
    if (data === undefined
      && schema.required != null
      && schema.required !== false) err.push([path, 'required']);
    if (data === null
      && schema.nullable !== true) err.push([path, 'nullable', schema.nullable]);
  }
  else {
    const srcType = typeof data === 'object'
      ? data.constructor.name
      : typeof data;
    if (typeof type === 'function') {
      if (!(srcType === 'object' && data.constructor === type)) {
        err.push([
          path,
          'type',
          type.name,
          srcType,
        ]);
      }
    }
    else {
      if (srcType !== type) {
        err.push([
          path,
          'type',
          type,
          srcType,
        ]);
      }
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
export function JSONSchema_isValidBoolean(schema, path = '/', data, err = []) {
  return JSONSchema_isValidState(schema, path, 'boolean', data, err);
}

function JSONSchema_isValidNumberConstraint(schema, path, data, err) {
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
  const isknown = schema.type === 'number'
    || schema.type === 'float'
    || schema.type === 'double';
  const isformat = schema.format === 'float'
    || schema.format === 'double';
  const isvalid = JSONSchema_isUnknownSchema(schema)
    && (typeof schema.const === 'number'
      || typeof schema.default === 'number');

  return isknown || isformat || isvalid;
}
export function JSONSchema_isValidNumber(schema, path = '/', data, err = []) {
  err = JSONSchema_isValidState(schema, path, 'number', data, err);
  if (err.length > 0) return err;
  if (data == null) return err;
  return JSONSchema_isValidNumberConstraint(schema, path, data, err);
}

export function JSONSchema_isInteger(schema) {
  const isknown = schema.type === 'integer'
    || schema.type === 'int32'
    || schema.type === 'int64';
  const isformat = schema.format === 'int32'
      || schema.format === 'int64';
  const isvalid = JSONSchema_isUnknownSchema(schema)
    && (Number.isInteger(schema.const)
      || Number.isInteger(schema.default));
  return isknown || isformat || isvalid;
}
export function JSONSchema_isValidInteger(path = '/', schema, data, err = []) {
  err = JSONSchema_isValidState(schema, path, 'number', data, err);
  if (data == null) return err;
  if (!Number.isInteger(data)) {
    err.push([path, 'type', 'integer', typeof data]);
  }
  if (err.length > 0) return err;
  return JSONSchema_isValidNumberConstraint(schema, path, data, err);
}

export function JSONSchema_isString(schema) {
  const isknown = schema.type === 'string';
  const isvalid = JSONSchema_isUnknownSchema(schema)
    && (typeof schema.const === 'string'
      || typeof schema.default === 'string');

  return isknown || isvalid;
}
export function JSONSchema_isValidString(schema, path = '/', data, err = []) {
  err = JSONSchema_isValidState(schema, path, 'string', data, err);
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
  const isvalid = schema.type == null && schema.items == null
    && ((typeof schema.properties === 'object' && schema.properties.constructor !== Array)
      || (typeof schema.const === 'object' && schema.const.constructor !== Array)
      || (typeof schema.default === 'object' && schema.default.constructor !== Array));
  return isknown || isvalid;
}

export function JSONSchema_isValidObject(schema, path = '/', data, err = [], callback) {
  err = JSONSchema_isValidState(schema, path, 'object', data, err);
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
            const s = properties[prop];
            const d = data[prop];
            const p = JSONPointer_addFolder(path, prop);
            callback(s, p, d, err);
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
                const s = patterns[prop];
                const d = data[prop];
                const p = JSONPointer_addFolder(path, prop);
                callback(s, p, d, err);
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

export function JSONSchema_isArray(schema) {
  const isknown = schema.type === 'array';
  const isitems = schema.type == null
    && typeof schema.items === 'object'
    && schema.items.constructor !== Array;
  const iscontains = schema.type == null
    && typeof schema.contains === 'object';
  const isvalid = schema.type == null
    && schema.properties == null
    && ((typeof schema.const === 'object' && schema.const.constructor === Array)
      || (typeof schema.default === 'object' && schema.default.constructor === Array));
  return isknown || isitems || iscontains || isvalid;
}
export function JSONSchema_isValidArray(schema, path = '/', data, err = [], callback) {
  err = JSONSchema_isValidState(schema, path, Array, data, err);
  if (err.length > 0) return err;
  if (data == null) return err;

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
    const s = schema.items;
    const c = schema.contains;
    for (let i = 0; i < length; ++i) {
      const d = data[i];
      const p = JSONPointer_addFolder(path, i);
      if (c) {
        if (callback(c, p, d).length === 0) break;
      }
      else {
        callback(s, p, d, err);
      }
    }
  }

  return err;
}

export function JSONSchema_isTuple(schema) {
  const isknown = schema.type === 'tuple';
  const istuple = schema.type == null
    && typeof schema.items === 'object'
    && schema.items.constructor === Array;
  const isadditional = schema.type == null
    && schema.hasOwnProperty('additionalItems');
  return isknown || istuple || isadditional;
}

export function JSONSchema_isValidTuple(schema, path = '/', data, err = [], callback) {
  err = JSONSchema_isValidState(schema, path, Array, data, err);
  if (err.length > 0) return err;
  if (data == null) return err;

  const length = data.length;
  const size = schema.items.length;
  if (length !== size) err.push([path, 'items', size, length]);

  if (callback) {
    for (let i = 0; i < size; ++i) {
      const s = schema.items[i];
      const d = i < data.length ? data[i] : undefined;
      const p = JSONPointer_addFolder(path, i);
      callback(s, p, d, err);
    }
  }

  if (schema.additionalItems) {
    const minitems = mathi32_max(schema.minItems > 0 ? schema.minItems : size, size);
    const maxitems = mathi32_max(schema.maxItems > 0 ? schema.maxItems : size, size);

    if (length < minitems) err.push([path, 'minItems', minitems, length]);
    if (length > maxitems) err.push([path, 'maxItems', maxitems, length]);

    if (schema.uniqueItems === true) {
      // TODO: implementation.uniqueItems
      err.push([path, 'implementation', 'uniqueItems']);
    }

    if (callback) {
      for (let i = size; i < data.length; ++i) {
        const s = schema.additionalItems;
        const d = data[i];
        const p = JSONPointer_addFolder(path, i);
        callback(s, p, d, err);
      }
    }
  }
  return err;
}

export function JSONSchema_isMap(schema) {
  const isknown = schema.type === 'map';
  const isvalid = schema.type == null
    && typeof schema.items === 'object'
    && schema.items.constructor === Array
    && schema.items.length === 2;
  return isknown || isvalid;
}

export function JSONSchema_isValidMap(schema, path = '/', data, err = [], callback) {
  err = JSONSchema_isValidState(schema, path, Map, data, err);
  if (err.length > 0) return err;
  if (data == null) return err;

  const length = data.length;
  const size = schema.items.length;
}

export function JSONSchema_isValid(schema, path = '/', data, err = [], callback) {
  if (JSONSchema_isBoolean(schema)) {
    return JSONSchema_isValidBoolean(schema, path, data, err);
  }
  if (JSONSchema_isNumber(schema)) {
    return JSONSchema_isValidNumber(schema, path, data, err);
  }
  if (JSONSchema_isInteger(schema)) {
    return JSONSchema_isValidInteger(schema, path, data, err);
  }
  if (JSONSchema_isString(schema)) {
    return JSONSchema_isValidString(schema, path, data, err);
  }
  if (JSONSchema_isObject(schema)) {
    return JSONSchema_isValidObject(schema, path, data, err, callback || JSONSchema_isValid);
  }
  if (JSONSchema_isArray(schema)) {
    return JSONSchema_isValidArray(schema, path, data, err, callback || JSONSchema_isValid);
  }
  if (JSONSchema_isTuple(schema)) {
    return JSONSchema_isValidTuple(schema, path, data, err, callback || JSONSchema_isValid);
  }
  if (JSONSchema_isMap(schema)) {
    return JSONSchema_isValidMap(schema, path, data, err, callback || JSONSchema_isValid);
  }

  err.push([path, 'error', schema, data]);
  return err;
}

export const JSONSchema_NUMBER_FORMATS = ['number', 'range', 'date', 'datetime', 'datetime-local', 'month', 'time', 'week'];

export function JSONSchema_getNumberFormatType(schema) {
  return JSONSchema_NUMBER_FORMATS.includes(schema.format)
    ? schema.format
    : JSONSchema_NUMBER_FORMATS[0];
}

export const JSONSchema_STRING_FORMATS = ['text', 'date', 'search', 'url', 'tel', 'email', 'password'];

export function getStringFormatType(schema) {
  if (schema.writeOnly === true) return 'password';
  return JSONSchema_STRING_FORMATS.includes(schema.format)
    ? schema.format
    : JSONSchema_STRING_FORMATS[0];
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
