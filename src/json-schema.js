/* eslint-disable class-methods-use-this */
/* eslint-disable no-labels */
/* eslint-disable no-lonely-if */
import { mathi32_max } from './int32-math';
import {
  getObjectCountItems,
  getAllObjectKeys,
  isPureObject,
  isPureArray,
} from './object-base';
import {
  JSONPointer_addFolder,
  JSONPointer_pathSeparator,
} from './json-pointer';

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
      if (!(srcType === 'object' && (data instanceof type))) {
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
      && (isPureArray(schema.enum) && schema.enum.length === 2);
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
  if (isPureArray(schema.pattern)) {
    const pattern = new RegExp(...schema.pattern);
    if (data.search(pattern) === -1) err.push([path, 'pattern', '[\'' + schema.pattern.join('\', \'') + '\']', data]);
  }
}

export function JSONSchema_isObject(schema) {
  const isknown = schema.type === 'object';
  const isprops = isPureObject(schema.properties);
  const isvalid = schema.type == null
      && (isPureObject(schema.const) || isPureObject(schema.default));
  return isknown || isprops || isvalid;
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

  const hasproperties = isPureObject(properties);
  const haspatterns = isPureObject(patterns);

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
  const isitems = isPureObject(schema.items);
  const iscontains = isPureObject(schema.contains);
  const isvalid = schema.type == null
    && (isPureArray(schema.const) || isPureArray(schema.default));
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
  const istuple = isPureArray(schema.items);
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
    && isPureArray(schema.items)
    && schema.items.length === 2;
  return isknown || isvalid;
}

export function JSONSchema_isValidMap(schema, path = '/', data, err = [], callback) {
  err = JSONSchema_isValidState(schema, path, Map, data, err);
  if (err.length > 0) return err;
  if (data == null) return err;

  const size = data.size;
  if (typeof schema.minItems === 'number') {
    if (size < schema.minItems) err.push([path, 'minItems', schema.minItems, size]);
  }
  if (typeof schema.maxItems === 'number') {
    if (size > schema.maxItems) err.push([path, 'maxItems', schema.maxItems, size]);
  }

  if (callback) {
    const ks = schema.items[0];
    const vs = schema.items[1];
    for (const [key, value] of data) {
      const p = JSONPointer_addFolder(path, key);
      callback(ks, p, key, err);
      callback(vs, p, value, err);
    }
  }
  return err;
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

export const JSONSchema_NUMBER_FORMATS = ['number', 'range', 'date', 'month', 'time', 'week', 'int32', 'int64'];

export function JSONSchema_getNumberFormatType(schema) {
  return JSONSchema_NUMBER_FORMATS.includes(schema.format)
    ? schema.format
    : JSONSchema_NUMBER_FORMATS[0];
}

export const JSONSchema_STRING_FORMATS = ['text', 'date', 'datetime', 'datetime-local', 'search', 'url', 'tel', 'email', 'password'];

export function getStringFormatType(schema) {
  if (schema.writeOnly === true) return 'password';
  return JSONSchema_STRING_FORMATS.includes(schema.format)
    ? schema.format
    : JSONSchema_STRING_FORMATS[0];
}

export default class JSONSchemaDocument {
  constructor() {
    this.schema = null;
    this.schemaHandlers = {};
  }

  registerSchemaHandler(formatName = 'default', schemaHandler) {
    if (schemaHandler instanceof JSONSchema) {
      const primaryType = schemaHandler.getPrimaryType();
      // insanity check!
      if (schemaHandler instanceof primaryType) {
        const primaryName = primaryType.name;
        if (!this.schemaHandlers[primaryName]) {
          this.schemaHandlers[primaryName] = {};
        }
        const formats = this.schemaHandlers[primaryName];
        if (formats.hasOwnProperty(formatName) === false) {
          formats[formatName] = schemaHandler.constructor;
          return true;
        }
      }
    }
    return false;
  }

  registerDefaultSchemaHandlers() {
    return this.registerSchemaHandler('default', new JSONSchemaBoolean())
      && this.registerSchemaHandler('default', new JSONSchemaNumber())
      && this.registerSchemaHandler('default', new JSONSchemaInteger())
      && this.registerSchemaHandler('default', new JSONSchemaString())
      && this.registerSchemaHandler('default', new JSONSchemaObject())
      && this.registerSchemaHandler('default', new JSONSchemaArray())
      && this.registerSchemaHandler('default', new JSONSchemaTuple())
      && this.registerSchemaHandler('default', new JSONSchemaMap());
  }

  getSchemaHandler(schema) {
    if (isPureObject(schema)) {
      let name = null;

      if (JSONSchema_isBoolean(schema)) {
        name = JSONSchemaBoolean.name;
      }
      else if (JSONSchema_isNumber(schema)) {
        name = JSONSchemaNumber.name;
      }
      else if (JSONSchema_isInteger(schema)) {
        name = JSONSchemaInteger.name;
      }
      else if (JSONSchema_isString(schema)) {
        name = JSONSchemaString.name;
      }
      else if (JSONSchema_isObject(schema)) {
        name = JSONSchemaString.name;
      }
      else if (JSONSchema_isArray(schema)) {
        name = JSONSchemaString.name;
      }
      else if (JSONSchema_isTuple(schema)) {
        name = JSONSchemaString.name;
      }
      else if (JSONSchema_isMap(schema)) {
        name = JSONSchemaString.name;
      }
      else {
        return undefined;
      }

      if (this.schemaHandlers.hasOwnProperty(name)) {
        const formats = this.schemaHandlers[name];
        const format = typeof schema.format === 'string'
          ? schema.format
          : 'default';
        // eslint-disable-next-line dot-notation
        return formats[format] || formats['default'];
      }
    }
    return undefined;
  }

  parseSchema(schema) {
    // we do NOT check for the type of the schema, we reinitialise it.
    return schema;
  }

  importSchema(schema) {
    // we only change the owner and path here!
    if (schema instanceof JSONSchema) {
      this.schema = schema;
      throw new Error('not implemented: schema is instanceof JSONSchema with different owner (and path?).');
    }
  }
}

export function JSONSchema_parseDocument(schema, err = []) {
  const owner = new JSONSchemaDocument();
  JSONSchema_loadSchema(owner, JSONPointer_pathSeparator, schema, err);
}
export function JSONSchema_loadSchema(owner, path, schema, err) {
  if (isPureObject(schema)) {
    let Handler = null;
    if (JSONSchema_isBoolean(schema)) {
      Handler = owner.booleanHandler.default;
    }
    else if (JSONSchema_isNumber(schema)) {
      Handler = owner.booleanHandler.default;
    }
    else if (JSONSchema_isInteger(schema)) {
      Handler = owner.booleanHandler.default;
    }
    else if (JSONSchema_isString(schema)) {
      Handler = owner.booleanHandler.default;
    }
    else if (JSONSchema_isObject(schema)) {
      Handler = owner.booleanHandler.default;
    }
    else if (JSONSchema_isArray(schema)) {
      Handler = owner.booleanHandler.default;
    }
    else if (JSONSchema_isTuple(schema)) {
      Handler = owner.booleanHandler.default;
    }
    else if (JSONSchema_isMap(schema)) {
      Handler = owner.booleanHandler.default;
    }
    else {
      err.push([path, 'schema', 'undefined', schema]);
      return err;
    }
    return new Handler(owner, path, schema);
  }
  else {
    err.push([
      path,
      'type',
      'object',
      typeof schema === 'object' ? schema.constructor.name : typeof schema,
    ]);
    return err;
  }
}

const Object_prototype_propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

export class JSONSchema {
  constructor(owner = {}, path, schema = {}, type) {
    // if (!(owner instanceof JSONSchemaDocument)) throw new TypeError('owner');
    // if (typeof path !== 'string') throw new TypeError('path');
    // if (typeof schema !== 'object') throw new TypeError('schema');
    if (this.constructor === JSONSchema) throw new SyntaxError('JSONSchema is an abstract class');

    this._owner = owner;
    this._path = path;

    this.type = typeof type === 'string'
      ? type
      : (typeof schema.type === 'string')
        ? schema.type
        : 'undefined';
    this.format = (typeof schema.format === 'string')
      ? schema.format
      : null;
    this.required = schema.required === true;
    this.nullable = schema.nullable === true;
    this.readOnly = schema.readOnly === true;
    this.writeOnly = schema.writeOnly === true;

    this.title = schema.title;
    this.$comment = schema.$comment;
    this.description = schema.description; // MarkDown
    this.placeholder = schema.placeholder;
    this.default = schema.default;
    this.examples = schema.examples;
  }

  getPrimaryType() { throw new Error('Abstract Method'); }

  propertyIsEnumerable(prop) {
    return (typeof prop === 'string' || prop.indexOf('_') !== 0)
      && Object_prototype_propertyIsEnumerable.call(this, prop);
  }

  hasSchemaChildren() {
    return false;
  }

  isValidState(type, data, err) {
    if (data === undefined && this.required === true) {
      err.push([this._path, 'required']);
    }
    else if (data === null && this.nullable === false) {
      err.push([this._path, 'nullable', this.nullable]);
    }
    else if (data != null) {
      const srcType = typeof data === 'object'
        ? data.constructor.name
        : typeof data;
      if (typeof type === 'function') {
        if (!(data instanceof type)) {
          err.push([
            this.path,
            'type',
            type.name,
            srcType,
          ]);
        }
      }
      else {
        if (srcType !== type) {
          err.push([
            this.path,
            'type',
            type,
            srcType,
          ]);
        }
      }
    }
    return err;
  }
}

export class JSONSchemaBoolean extends JSONSchema {
  constructor(owner, path, schema) {
    super(owner, path, schema, 'boolean');
  }

  getPrimaryType() { return JSONSchemaBoolean; }

  isValid(data, err = []) {
    return this.isValidState('boolean', data, err);
  }
}

export class JSONSchemaNumber extends JSONSchema {
  constructor(owner, path, schema) {
    super(owner, path, schema, 'number');

    this.minimum = typeof schema.minimum === 'number' ? schema.minimum : undefined;
    this.maximum = typeof schema.maximum === 'number' ? schema.maximum : undefined;
    this.exclusiveMinimim = schema.exclusiveMinimim === true;
    this.exclusiveMaximim = schema.exclusiveMaximim === true;

    this.low = typeof schema.low === 'number' ? schema.low : undefined;
    this.high = typeof schema.high === 'number' ? schema.high : undefined;
    this.optimum = typeof schema.optimum === 'number' ? schema.optimum : undefined;
    this.multipleOf = typeof schema.multipleOf === 'number' ? schema.multipleOf : undefined;
  }

  getPrimaryType() { return JSONSchemaNumber; }

  isValidNumberConstraint(data, err) {
    if (this.minimum) {
      if (this.exclusiveMinimum === true) {
        if (data < this.minimum) {
          err.push([this._path, 'exclusiveMinumum', this.minimum, data]);
        }
      }
      else {
        if (data <= this.minimum) {
          err.push([this._path, 'minimum', this.minimum, data]);
        }
      }
    }
    if (this.maximum) {
      if (this.exclusiveMaximum === true) {
        if (data > this.maximum) {
          err.push([this._path, 'exclusiveMaximum', this.maximum, data]);
        }
      }
      else {
        if (data >= this.maximum) {
          err.push([this._path, 'maximum', this.maximum, data]);
        }
      }
    }
    if (this.multipleOf) {
      if (data === 0 || ((data % this.multipleOf) !== 0)) {
        err.push([this.path, 'multipleOf', this.multipleOf, data]);
      }
    }
    return err;
  }

  isValid(data, err = []) {
    err = this.isValidState('number', data, err);
    if (err.length > 0) return err;
    if (data == null) return err;
    return this.isValidNumberConstraint(data, err);
  }
}

export class JSONSchemaInteger extends JSONSchema {
  constructor(owner, path, schema) {
    super(owner, path, schema, 'integer');
    this.minimum = typeof schema.minimum === 'number'
      ? Math.round(schema.minimum)
      : undefined;
    this.maximum = typeof schema.maximum === 'number'
      ? Math.round(schema.maximum)
      : undefined;
    this.exclusiveMinimim = schema.exclusiveMinimim === true;
    this.exclusiveMaximim = schema.exclusiveMaximim === true;

    this.low = typeof schema.low === 'number'
      ? Math.round(schema.low)
      : undefined;
    this.high = typeof schema.high === 'number'
      ? Math.round(schema.high)
      : undefined;
    this.optimum = typeof schema.optimum === 'number'
      ? Math.round(schema.optimum)
      : undefined;
    this.multipleOf = typeof schema.multipleOf === 'number'
      ? Math.round(schema.multipleOf)
      : undefined;
  }

  getPrimaryType() { return JSONSchemaInteger; }

  isValidNumberConstraint(data, err) {
    if (this.minimum) {
      if (this.exclusiveMinimum === true) {
        if (data < this.minimum) {
          err.push([this._path, 'exclusiveMinumum', this.minimum, data]);
        }
      }
      else {
        if (data <= this.minimum) {
          err.push([this._path, 'minimum', this.minimum, data]);
        }
      }
    }
    if (this.maximum) {
      if (this.exclusiveMaximum === true) {
        if (data > this.maximum) {
          err.push([this._path, 'exclusiveMaximum', this.maximum, data]);
        }
      }
      else {
        if (data >= this.maximum) {
          err.push([this._path, 'maximum', this.maximum, data]);
        }
      }
    }
    if (this.multipleOf) {
      if (data === 0 || ((data % this.multipleOf) !== 0)) {
        err.push([this.path, 'multipleOf', this.multipleOf, data]);
      }
    }
    return err;
  }


  isValid(data, err = []) {
    err = this.isValidState('number', data, err);
    if (data == null) return err;
    if (!Number.isInteger(data)) {
      err.push([this.path, 'type', 'integer', typeof data]);
    }
    if (err.length > 0) return err;
    return this.isValidNumberConstraint(data, err);
  }
}
export class JSONSchemaString extends JSONSchema {
  constructor(owner, path, schema) {
    super(owner, path, schema, 'string');
    this.maxLength = typeof schema.maxLength === 'number'
      ? Math.round(schema.maxLength)
      : undefined;
    this.minLength = typeof schema.minLength === 'number'
      ? Math.round(schema.minLength)
      : undefined;
    if (schema.pattern != null && schema._pattern == null) {
      const isvalid = (schema.pattern.constructor === String
          || schema.pattern.constructor === Array);
      this.pattern = isvalid ? schema.pattern : undefined;
      if (isvalid && schema.pattern.constructor === String) {
        this._pattern = new RegExp(this.pattern);
      }
      else if (isvalid) {
        this._pattern = new RegExp(...this.pattern);
      }
    }
    else if (schema._pattern != null) {
      this.pattern = schema.pattern;
      this._pattern = schema._pattern;
    }
  }

  getPrimaryType() { return JSONSchemaString; }

  isValid(data, err = []) {
    err = this.isValidState('string', data, err);
    if (err.length > 0) return err;
    if (data == null) return err;

    const length = data.length;
    if (this.maxLength) {
      if (length > this.maxLength) {
        err.push([this._path, 'maxLength', this.maxLength, data.length]);
      }
    }
    if (this.minLength) {
      if (length < this.minLength) {
        err.push([this._path, 'maxLength', this.maxLength, data.length]);
      }
    }
    if (this._pattern) {
      if (this._pattern.search(data) === -1) {
        err.push([this._path, 'pattern', this.pattern, data]);
      }
    }
    return err;
  }
}

export class JSONSchemaObject extends JSONSchema {
  constructor(owner, path, schema) {
    super(owner, path, schema, 'object');

    this.maxProperties = typeof schema.maxProperties === 'number'
      ? schema.maxProperties
      : undefined;
    this.minProperties = typeof schema.minProperties === 'number'
      ? schema.minProperties
      : undefined;

    this.required = schema.required === true
      || (schema.required != null
      && schema.required.constructor === Array)
      ? schema.required
      : undefined;

    if (schema.patternRequired && !this._patternRequired) {
      this.patternRequired = isPureArray(schema.patternRequired)
        && schema.patternRequired.length > 0
        ? schema.patternRequired
        : undefined;
      if (this.patternRequired) {
        const required = [];
        for (let i = 0; i < this.patternRequired.length; ++i) {
          const pattern = this.patternRequired[i];
          // TODO: Test if valid regexp pattern before adding
          if (pattern.constructor === String) {
            const rxp = new RegExp(pattern);
            required.push(rxp);
          }
          else {
            const rxp = new RegExp(...pattern);
            required.push(rxp);
          }
        }
        this._patternRequired = required;
      }
    }
    else if (schema._patternRequired) {
      this.patternRequired = schema.patternRequired;
      this._patternRequired = schema._patternRequired;
    }
    else {
      this.patternRequired = undefined;
      this._patternRequired = undefined;
    }

    this.properties = isPureObject(schema.properties)
      ? schema.properties
      : {};

    if (schema.patternProperties && !this._patternProperties) {
      this.patternProperties = isPureObject(schema.patternProperties)
        ? schema.patternProperties
        : undefined;
      if (this.patternProperties) {
        const patterns = this.patternProperties;
        const props = {};
        for (const i in patterns) {
          if (patterns.hasOwnProperty(i)) {
            const rxp = new RegExp(i);
            props[i] = rxp;
          }
        }
        this._patternProperties = props;
      }
    }
    else if (schema._patternProperties) {
      this.patternProperties = schema.patternProperties;
      this._patternProperties = schema._patternProperties;
    }
    else {
      this.patternProperties = undefined;
      this._patternProperties = undefined;
    }

    this.additionalProperties = schema.additionalProperties === true;
  }

  getPrimaryType() { return JSONSchemaObject; }

  isValid(data, err = [], callback) {
    err = this.isValidState('object', data, err);
    if (data == null) return err;
    if (data.constructor === Array) {
      err.push([this._path, 'type', 'object', 'Array']);
    }
    if (err.length > 0) return err;

    const count = getObjectCountItems(data)|0;
    if (this.maxProperties) {
      if (count > this.maxProperties) {
        err.push([this._path, 'maxProperties', this.maxProperties, count]);
      }
    }
    if (this.minProperties) {
      if (count < this.minProperties) {
        err.push([this._path, 'minProperties', this.minProperties, count]);
      }
    }

    if (this.required) {
      const required = this.required !== true
        ? this.required
        : getAllObjectKeys(this.properties);

      if (required.constructor === Array) {
        for (let i = 0; i < required.length; ++i) {
          const prop = required[i];
          if (!data.hasOwnProperty(prop)) {
            err.push([this._path, 'required', prop]);
          }
        }
      }
      else {
        for (const prop in required) {
          if (required.hasOwnProperty(prop)) {
            if (!data.hasOwnProperty(prop)) {
              err.push([this._path, 'required', prop]);
            }
          }
        }
      }
    }

    if (this._patternRequired) {
      const required = this._patternRequired;
      if (required.constructor === Array) {
        loop:
        for (let i = 0; i < required.length; ++i) {
          const rgx = required[i];
          for (const item in data) {
            if (data.hasOwnProperty(item)) {
              if (rgx.exec(item) != null) continue loop;
            }
          }
          err.push([this._path, 'patternRequired', rgx]);
        }
      }
    }
    if (err.length > 0) return err;

    const properties = this.properties;
    const patterns = this._patternProperties;

    next:
    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        // test whether all properties of data are
        // within limits of properties and patternProperties
        // defined in schema.

        if (properties.hasOwnProperty(prop) === true) {
          if (callback) {
            const s = properties[prop];
            const d = data[prop];
            const p = JSONPointer_addFolder(this._path, prop);
            callback(s, p, d, err);
          }
          continue;
        }

        if (patterns) {
          for (const pattern in patterns) {
            if (patterns.hasOwnProperty(pattern)) {
              const rgx = patterns[pattern];
              if (rgx && rgx.exec(prop) != null) {
                if (callback) {
                  const s = this.patternProperties[pattern];
                  const d = data[prop];
                  const p = JSONPointer_addFolder(this._path, prop);
                  callback(s, p, d, err);
                }
                continue next;
              }
            }
          }
          if (this.additionalProperties === false) {
            err.push([this._path, 'patternProperties', prop]);
          }
          continue;
        }
        else {
          if (this.additionalProperties === false) {
            err.push([this._path, 'properties', prop]);
          }
        }
      }
    }
    return err;
  }
}

export class JSONSchemaArray extends JSONSchema {
  constructor(owner, path, schema) {
    super(owner, path, schema, 'array');
    this.minItems = typeof schema.minItems === 'number'
      ? Math.round(schema.minItems)
      : undefined;
    this.maxItems = typeof schema.maxItems === 'number'
      ? Math.round(schema.maxItems)
      : undefined;
    this.uniqueItems = schema.uniqueItems === true;
    this.items = isPureObject(schema.items)
      ? schema.items
      : undefined;
    this.contains = isPureObject(schema.contains)
      ? schema.contains
      : undefined;
  }

  getPrimaryType() { return JSONSchemaArray; }

  isValid(data, err = [], callback) {
    err = this.isValidState(Array, data, err);
    if (err.length > 0) return err;
    if (data == null) return err;

    const length = data.length;
    if (this.minItems) {
      if (length < this.minItems) {
        err.push([this._path, 'minItems', this.minItems, length]);
      }
    }
    if (this.maxItems) {
      if (length > this.maxItems) {
        err.push([this._path, 'maxItems', this.maxItems, length]);
      }
    }
    if (this.uniqueItems === true) {
      // TODO: implementation.uniqueItems
      err.push([this._path, 'implementation', 'uniqueItems']);
    }

    if (callback) {
      const s = this.items;
      const c = this.contains;
      for (let i = 0; i < length; ++i) {
        const d = data[i];
        const p = JSONPointer_addFolder(this._path, i);
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
}

export class JSONSchemaTuple extends JSONSchema {
  constructor(owner, path, schema) {
    super(owner, path, schema, 'tuple');

    this.items = isPureArray(schema.items) ? schema.items : undefined;
    this.additionalItems = typeof schema.additionalItems === 'object'
      ? schema.additionalItems
      : undefined;
    if (this.additionalItems) {
      this.minItems = this.additionalItems && typeof schema.minItems === 'number'
        ? schema.minItems
        : undefined;
      this.maxItems = this.additionalItems && typeof schema.maxItems === 'number'
        ? schema.maxItems
        : undefined;
      this.uniqueItems = this.additionalItems && schema.uniqueItems === true;
    }
  }

  getPrimaryType() { return JSONSchemaTuple; }

  isValid(data, err = [], callback) {
    err = this.isValidState(Array, data, err);
    if (err.length > 0) return err;
    if (data == null) return err;

    const length = data.length;
    const size = this.items.length;
    if (length !== size) {
      err.push([this._path, 'items', size, length]);
    }

    if (callback) {
      for (let i = 0; i < size; ++i) {
        const s = this.items[i];
        const d = i < data.length ? data[i] : undefined;
        const p = JSONPointer_addFolder(this._path, i);
        callback(s, p, d, err);
      }
    }

    if (this.additionalItems) {
      const minitems = mathi32_max(this.minItems > 0 ? this.minItems : size, size);
      const maxitems = mathi32_max(this.maxItems > 0 ? this.maxItems : size, size);

      if (length < minitems) {
        err.push([this._path, 'minItems', minitems, length]);
      }
      if (length > maxitems) {
        err.push([this._path, 'maxItems', maxitems, length]);
      }

      if (this.uniqueItems === true) {
        // TODO: implementation.uniqueItems
        err.push([this._path, 'implementation', 'uniqueItems']);
      }

      if (callback) {
        const s = this.additionalItems;
        for (let i = size; i < data.length; ++i) {
          const d = data[i];
          const p = JSONPointer_addFolder(this._path, i);
          callback(s, p, d, err);
        }
      }
    }
    return err;
  }
}

export class JSONSchemaMap extends JSONSchema {
  constructor(owner, path, schema) {
    super(owner, path, schema, 'map');
    this.minItems = typeof schema.minItems === 'number'
      ? Math.round(schema.minItems)
      : undefined;
    this.maxItems = typeof schema.maxItems === 'number'
      ? Math.round(schema.maxItems)
      : undefined;
    this.items = isPureArray(schema.items) ? schema.items : undefined;
  }

  getPrimaryType() { return JSONSchemaMap; }

  isValid(data, err = [], callback) {
    err = this.isValidState(Map, data, err);
    if (err.length > 0) return err;
    if (data == null) return err;

    const size = data.size;
    if (this.minItems) {
      if (size < this.minItems) {
        err.push([this._path, 'minItems', this.minItems, size]);
      }
    }
    if (this.maxItems) {
      if (size > this.maxItems) {
        err.push([this._path, 'maxItems', this.maxItems, size]);
      }
    }

    if (callback) {
      const ks = this.items[0];
      const vs = this.items[1];
      for (const [key, value] of data) {
        const p = JSONPointer_addFolder(this._path, key);
        callback(ks, p, key, err);
        callback(vs, p, value, err);
      }
    }
    return err;
  }
}
