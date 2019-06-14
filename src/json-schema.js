/* eslint-disable quote-props */
/* eslint-disable eqeqeq */
/* eslint-disable dot-notation */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-labels */
/* eslint-disable no-lonely-if */

import { mathi32_max } from './int32-math';
import {
  isPureArray,
  isPureTypedArray,
  getPureObject,
  getBoolOrNumber,
  getBoolOrArray,
  getBoolOrObject,
  getPureArray,
  getPureArrayGTLength,
  getPureString,
  getPureBool,
  getPureNumber,
  getPureInteger,
  cloneObject,
} from './types-base';

import { String_createRegExp } from './types-String';

import {
  getSchemaSelectorName,
  isBooleanSchema,
  isIntegerSchema,
  isBigIntSchema,
  isNumberSchema,
  isStringSchema,
  isObjectSchema,
  isArraySchema,
  isTupleSchema,
  isPrimitiveSchema,
} from './json-schema-types';

import {
  JSONPointer_addFolder, JSONPointer_traverseFilterObjectBF, JSONPointer,
} from './json-pointer';

//#region schema type classes

export function JSONSchema_expandSchemaReferences(json, baseUri, callback) {
  // in place merge of object members
  // TODO: circular reference check.
  JSONPointer_traverseFilterObjectBF(json, '$ref',
    function JSONSchema_expandSchemaReferencesCallback(obj) {
      const ref = obj.$ref;
      delete obj.$ref;
      const pointer = new JSONPointer(baseUri, ref);
      const root = (pointer.baseUri != baseUri)
        ? ((typeof callback === 'function')
          ? callback(baseUri)
          : json)
        : json;
      const source = pointer.get(root);
      const keys = Object.keys(source);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        obj[key] = source[key];
      }
    });
}

export class JSONSchemaDocument {
  constructor(baseUri) {
    this.baseUri = baseUri;
    this.schema = null;
    this.handlers = {};
    this.defaultHandler = null;
    this.baseUriCallback = undefined;
  }


  registerSchemaHandler(formatName = 'default', schemaHandler) {
    if (schemaHandler instanceof JSONSchemaObject) {
      const schemaType = schemaHandler.getSchemaType();
      if (schemaHandler instanceof schemaType) {
        const schemaName = schemaType.name;
        if (!this.handlers[schemaName]) {
          this.handlers[schemaName] = {};
        }
        const formats = this.handlers[schemaName];
        if (formats.hasOwnProperty(formatName) === false) {
          formats[formatName] = schemaHandler.constructor;
          return true;
        }
      }
    }
    return false;
  }

  registerDefaultSchemaHandlers() {
    this.defaultHandler = JSONSchemaStringType;
    return this.registerSchemaHandler('default', new JSONSchemaSelectorType())
      && this.registerSchemaHandler('default', new JSONSchemaBooleanType())
      && this.registerSchemaHandler('default', new JSONSchemaNumberType())
      && this.registerSchemaHandler('default', new JSONSchemaIntegerType())
      && this.registerSchemaHandler('default', new JSONSchemaStringType())
      && this.registerSchemaHandler('default', new JSONSchemaObjectType())
      && this.registerSchemaHandler('default', new JSONSchemaArrayType())
      && this.registerSchemaHandler('default', new JSONSchemaTupleType());
  }

  getSchemaHandler(schema, force = true) {
    if (typeof schema === 'object' && !(isPureArray(schema) || isPureTypedArray(schema))) {
      let typeName = null;

      const selector = getSchemaSelectorName(schema);
      if (selector) {
        typeName = JSONSchemaSelectorType.name;
      }
      else if (isBooleanSchema(schema)) {
        typeName = JSONSchemaBooleanType.name;
      }
      else if (isIntegerSchema(schema)) {
        typeName = JSONSchemaIntegerType.name;
      }
      else if (isNumberSchema(schema)) {
        typeName = JSONSchemaNumberType.name;
      }
      else if (isStringSchema(schema)) {
        typeName = JSONSchemaStringType.name;
      }
      else if (isObjectSchema(schema)) {
        typeName = JSONSchemaObjectType.name;
      }
      else if (isArraySchema(schema)) {
        typeName = JSONSchemaArrayType.name;
      }
      else if (isTupleSchema(schema)) {
        typeName = JSONSchemaTupleType.name;
      }
      else {
        if (force === false) return undefined;
        typeName = this.defaultHandler.name;
      }

      if (this.handlers.hasOwnProperty(typeName)) {
        const formats = this.handlers[typeName];
        const format = typeof schema.format === 'string'
          ? schema.format
          : 'default';
        // eslint-disable-next-line dot-notation
        return formats[format] || formats['default'];
      }
    }
    return undefined;
  }

  createSchemaHandler(path, schema) {
    const Handler = this.getSchemaHandler(schema);
    return Handler
      ? new Handler(this, path, schema)
      : undefined;
  }

  registerBaseUriCallBack(callback) {
    this.baseUriCallback = callback;
  }

  loadSchema(json, baseUri) {
    const callback = typeof this.baseUriCallback === 'function'
      ? this.baseUriCallback
      : (function JSONSchemaDocument_loadSchemaDefaultCallback() { return json; });
    JSONSchema_expandSchemaReferences(json, baseUri || this.baseUri, callback);
    this.baseUri = typeof baseUri === 'string' ? baseUri : this.baseUri; // TODO: parse baseUri from JSONPointer_compile?
    const schema = this.createSchemaHandler('/', json);
    this.schema = schema;
  }
}

export class JSONSchemaXMLObject {
  constructor(schema) {
    const xml = getPureObject(schema.xml, {});
    this.name = getPureString(xml.name);
    this.namespace = getPureString(xml.namespace);
    this.prefix = getPureString(xml.prefix);
    this.attribute = getPureBool(xml.attribute, false);
    this.wrapped = getPureBool(xml.wrapped, false);
    this.attributes = getPureObject(xml.attributes);
  }
}

const Object_prototype_propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

export const JSONSchema_keywords = {
  '': ['type', 'required', 'format', 'formatMaximum', 'formatMinimum', 'formatExclusiveMaximum', 'formatExclusiveMinimum'],
  'number': ['minimum', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum', 'multipleOf'],
  'string': ['maxLength', 'minLength', 'pattern'],
  'array': [],
};

export class JSONSchemaObject {
  constructor(owner, schemaPath, dataPath, schema, type) {
    if (this.constructor === JSONSchemaObject)
      throw new TypeError('JSONSchemaObject is an abstract class');

    let parent = null;
    if (owner != null) {
      if (owner instanceof JSONSchemaObject) {
        parent = owner;
        owner = owner._parent;
      }
      if (!(owner instanceof JSONSchemaDocument))
        throw new TypeError('JSONSchemaObject owner MUST be of type JSONSchemaDocument');
    }

    this._owner = owner;
    this._parent = parent;
    this._schemaPath = schemaPath && new JSONPointer(owner.baseUri, schemaPath);
    this._dataPath = new JSONPointer(owner.baseUri, dataPath);

    this.type = getPureString(type, getPureString(schema.type));
    this.required = getBoolOrArray(schema.required, false);
    this.nullable = getBoolOrArray(schema.nullable, true);

    this.format = getPureString(schema.format);

    this.readOnly = getBoolOrArray(schema.readOnly, false);
    this.writeOnly = getBoolOrArray(schema.writeOnly, false);

    this.title = getPureString(schema.title);
    this.placeholder = getPureString(schema.placeholder);

    this.$comment = getPureString(schema.$comment);
    this.description = getPureString(schema.description); // MarkDown

    this.default = schema.default !== null ? schema.default : undefined;
    this.const = schema.const !== null ? schema.const : undefined;

    this.examples = getPureArray(schema.examples);
  }

  getSchemaType() { throw new Error('Abstract Method'); }

  isPrimitiveSchemaType() { return true; }

  hasSchemaChildren() { return false; }

  getDefault() { return this.const || this.default; }

  propertyIsEnumerable(prop) {
    return (typeof prop === 'string' || prop.indexOf('_') !== 0)
      && Object_prototype_propertyIsEnumerable.call(this, prop);
  }
}

export class JSONSchemaEmptyType extends JSONSchemaObject {
  constructor(owner, path, schema = {}, clone = false) {
    super(owner, path, schema, undefined, clone);
  }
}

export class JSONSchemaBooleanType extends JSONSchemaObject {
  constructor(owner, schemaPath, dataPath, schema = {}, clone = false) {
    super(owner, schemaPath, schema, 'boolean', clone);
    this.validateEx = JSONSchemaObject.compileValidateSchemaType(schemaPath, dataPath, schema);
  }

  getSchemaType() { return JSONSchemaBooleanType; }

  isValid(data, err = []) {
    return this.isValidState('boolean', data, err);
  }
}

export class JSONSchemaNumberType extends JSONSchemaObject {
  constructor(owner, path, schema = {}, clone = false) {
    super(owner, path, schema, 'number', clone);

    this.minimum = getPureNumber(schema.minimum);
    this.maximum = getPureNumber(schema.maximum);
    this.exclusiveMinimum = getBoolOrNumber(schema.exclusiveMinimum);
    this.exclusiveMaximum = getBoolOrNumber(schema.exclusiveMaximum);
    this.multipleOf = getPureNumber(schema.multipleOf);

    this.low = getPureNumber(schema.low);
    this.high = getPureNumber(schema.high);
    this.optimum = getPureNumber(schema.optimum);
  }

  getSchemaType() { return JSONSchemaNumberType; }
}

export class JSONSchemaIntegerType extends JSONSchemaObject {
  constructor(owner, path, schema = {}, clone = false) {
    super(owner, path, schema, 'integer', clone);
    this.minimum = getPureInteger(schema.minimum);
    this.maximum = getPureInteger(schema.maximum);
    this.exclusiveMinimum = getPureBool(schema.exclusiveMinimum, false);
    this.exclusiveMaximum = getPureBool(schema.exclusiveMaximum, false);
    this.multipleOf = getPureInteger(schema.multipleOf, 1);

    this.low = getPureInteger(schema.low, 0);
    this.high = getPureInteger(schema.high, 0);
    this.optimum = getPureInteger(schema.optimum, 0);
  }

  getSchemaType() { return JSONSchemaIntegerType; }
}
export class JSONSchemaStringType extends JSONSchemaObject {
  constructor(owner, path, schema = {}, clone = false) {
    super(owner, path, schema, 'string', clone);

    this.maxLength = getPureInteger(schema.maxLength, 0);
    this.minLength = getPureInteger(schema.minLength, 0);

    this.pattern = String_createRegExp(schema.pattern);
  }

  getSchemaType() { return JSONSchemaStringType; }
}

export class JSONSchemaSelectorType extends JSONSchemaObject {
  constructor(owner, path, schema = {}) {
    super(owner, path, schema, undefined);
    const selectName = getSchemaSelectorName(schema);
    const selectBase = { ...schema };
    delete selectBase.oneOf;
    delete selectBase.anyOf;
    delete selectBase.allOf;
    delete selectBase.not;
    const selectItems = getPureArrayGTLength(schema[selectName], 0);

    this._selectName = selectName;
    this._selectItems = this.initSelectorItems(selectName, selectBase, selectItems);

    this[selectName] = this._selectItems;
  }

  initSelectorItems(name, base, items) {
    const owner = this._owner;
    const path = JSONPointer_addFolder(this._schemaPath, name);
    if (items) {
      const selectors = [];
      const len = items.length;
      for (let i = 0; i < len; i++) {
        const item = getPureObject(items[i]);
        if (item) {
          const schema = cloneObject(base, item);
          const child = owner.createSchemaHandler(
            JSONPointer_addFolder(path, String(i)),
            schema,
          );
          selectors.push(child);
        }
      }
      return selectors.length > 0 ? selectors : undefined;
    }
    return undefined;
  }

  getSchemaType() { return JSONSchemaSelectorType; }

  isPrimitiveSchemaType() { return false; }

  hasSchemaChildren() { return false; }

  isValid(data, err = [], callback) {
    throw new Error('not implemented', data, err, callback);
  }
}

export class JSONSchemaObjectType extends JSONSchemaObject {
  constructor(owner, path, schema = {}, clone = false) {
    super(owner, path, schema, 'object', clone);

    this.maxProperties = getPureInteger(schema.maxProperties, 0);
    this.minProperties = getPureInteger(schema.minProperties, 0);

    this.required = getBoolOrArray(schema.required, false);

    this.properties = this.initObjectProperties(schema);

    const patternRequiredCached = schema._patternRequired
      || this.initObjectPatternRequired(schema);

    this.patternRequired = patternRequiredCached
      ? schema.patternRequired
      : undefined;
    this._patternRequired = patternRequiredCached;

    const { patternProperties, patternPropertiesCached } = this.initObjectPatternProperties(schema);
    this.patternProperties = patternProperties;
    this._patternProperties = patternPropertiesCached;

    this.additionalProperties = this.initObjectAdditionalProperties(schema);
  }

  //#region init schema

  initObjectPatternRequired(schema) {
    const patterns = getPureArrayGTLength(schema.patternRequired, 0);
    if (patterns) {
      const required = [];
      for (let i = 0; i < patterns.length; ++i) {
        const pattern = patterns[i];
        // TODO: Test if valid regexp pattern before adding
        const regex = String_createRegExp(pattern);
        if (regex) required.push(regex);
      }
      if (required.length > 0) return required;
    }
    return undefined;
  }

  initObjectProperties(schema) {
    const owner = this._owner;
    const path = JSONPointer_addFolder(this._schemaPath, 'properties');
    const properties = getPureObject(schema.properties);
    if (properties) {
      const obj = {};
      const keys = Object.keys(properties);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const item = properties[key];
        const handler = owner.createSchemaHandler(
          JSONPointer_addFolder(path, key),
          item,
        );
        obj[key] = handler;
      }
      return obj;
    }
    return undefined;
  }

  initObjectPatternProperties(schema) {
    const owner = this._owner;
    const path = JSONPointer_addFolder(this._schemaPath, 'patternProperties');
    const properties = getPureObject(schema.patternProperties);
    const cached = getPureObject(schema._patternProperties);
    if (properties && !cached) {
      const regex = {};
      const patterns = {};
      const keys = Object.keys(properties);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];

        const rxp = String_createRegExp(key);
        regex[key] = rxp;

        patterns[key] = owner.createSchemaHandler(
          JSONPointer_addFolder(path, key),
          properties[key],
        );
      }
      return {
        patternProperties: patterns,
        patternPropertiesCached: regex,
      };
    }
    else if (cached) {
      return {
        patternProperties: schema.patternProperties,
        patternPropertiesCached: schema._patternProperties,
      };
    }
    return {
      patternProperties: undefined,
      patternPropertiesCached: undefined,
    };
  }

  initObjectAdditionalProperties(schema) {
    const additionalProperties = getBoolOrObject(schema.additionalProperties, true);
    if (additionalProperties.constructor === Boolean) return additionalProperties;

    const owner = this._owner;
    const path = JSONPointer_addFolder(this._schemaPath, 'additionalProperties');
    return owner.createSchemaHandler(path, additionalProperties);
  }

  //#endregion

  getSchemaType() { return JSONSchemaObjectType; }

  isPrimitiveSchemaType() { return false; }

  hasSchemaChildren() { return true; }

  isValid(data, err = [], callback) {
    err = this.isValidState('object', data, err);
    if (data == null) return err;
    if (data.constructor === Array) {
      err.push([this._schemaPath, 'type', 'object', 'Array']);
    }
    if (err.length > 0) return err;

    const dataKeys = Object.keys(data);
    const properties = this.properties;
    const propertyKeys = Object.keys(properties);

    if (this.maxProperties) {
      if (dataKeys.length > this.maxProperties) {
        err.push([this._schemaPath, 'maxProperties', this.maxProperties, dataKeys.length]);
      }
    }
    if (this.minProperties) {
      if (dataKeys.length < this.minProperties) {
        err.push([this._schemaPath, 'minProperties', this.minProperties, dataKeys.length]);
      }
    }

    if (this.required) {
      const required = this.required !== true
        ? this.required
        : propertyKeys;

      if (required.constructor === Array) {
        for (let i = 0; i < required.length; ++i) {
          const prop = required[i];
          if (dataKeys.includes(prop) === false) {
            err.push([this._schemaPath, 'required', prop]);
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
          for (let j = 0; j < dataKeys.length; ++j) {
            const key = dataKeys[j];
            if (rgx.test(key)) continue loop;
          }
          err.push([this._schemaPath, 'patternRequired', rgx]);
        }
      }
    }
    if (err.length > 0) return err;

    const patterns = this._patternProperties;
    const patternKeys = Object.keys(patterns);

    next:
    for (let i = 0; i < dataKeys.length; ++i) {
      const key = dataKeys[i];
      // test whether all properties of data are
      // within limits of properties and patternProperties
      // defined in schema.

      if (propertyKeys.includes(key)) {
        if (callback) {
          const s = properties[key];
          const d = data[key];
          const p = JSONPointer_addFolder(this._schemaPath, key);
          callback(s, p, d, err);
        }
        continue;
      }

      if (patterns) {
        for (let j = 0; j < patternKeys.length; ++j) {
          const pattern = patternKeys[j];
          const rgx = patterns[pattern];
          if (rgx.test(key)) {
            if (callback) {
              const s = this.patternProperties[pattern];
              const d = data[key];
              const p = JSONPointer_addFolder(this._schemaPath, key);
              callback(s, p, d, err);
            }
            continue next;
          }
        }

        if (this.additionalProperties === false) {
          err.push([this._schemaPath, 'patternProperties', key]);
        }
        continue;
      }
      else {
        if (this.additionalProperties === false) {
          err.push([this._schemaPath, 'properties', key]);
        }
      }
    }

    return err;
  }
}

export class JSONSchemaArrayType extends JSONSchemaObject {
  constructor(owner, path, schema = {}, clone = false) {
    super(owner, path, schema, 'array', clone);
    this.minItems = getPureInteger(schema.minItems, 0);
    this.maxItems = getPureInteger(schema.maxItems, 0);
    this.uniqueItems = getPureBool(schema.uniqueItems, false);
    this.items = this.initArrayItems(schema);
    this.contains = this.initArrayContains(schema);
  }

  initArrayItems(schema) {
    const owner = this._owner;
    const path = JSONPointer_addFolder(this._schemaPath, 'items');
    const item = getPureObject(schema.items);
    return item ? owner.createSchemaHandler(path, item) : undefined;
  }

  initArrayContains(schema) {
    const owner = this._owner;
    const path = JSONPointer_addFolder(this._schemaPath, 'contains');
    const item = getPureObject(schema.contains);
    return item ? owner.createSchemaHandler(path, item) : undefined;
  }

  getSchemaType() { return JSONSchemaArrayType; }

  isPrimitiveSchemaType() { return false; }

  hasSchemaChildren() { return true; }

  isValid(data, err = [], callback) {
    err = this.isValidState(Array, data, err);
    if (err.length > 0) return err;
    if (data == null) return err;

    const length = data.length;
    if (this.minItems) {
      if (length < this.minItems) {
        err.push([this._schemaPath, 'minItems', this.minItems, length]);
      }
    }
    if (this.maxItems) {
      if (length > this.maxItems) {
        err.push([this._schemaPath, 'maxItems', this.maxItems, length]);
      }
    }
    if (this.uniqueItems === true) {
      // TODO: implementation.uniqueItems
      err.push([this._schemaPath, 'implementation', 'uniqueItems']);
    }

    if (callback) {
      const s = this.items;
      const c = this.contains;
      for (let i = 0; i < length; ++i) {
        const d = data[i];
        const p = JSONPointer_addFolder(this._schemaPath, i);
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

export class JSONSchemaTupleType extends JSONSchemaObject {
  constructor(owner, path, schema = {}, clone = false) {
    super(owner, path, schema, 'tuple', clone);

    this.items = this.initTupleItems(schema);
    this.additionalItems = this.initTupleAdditionalItems(schema);
    if (this.additionalItems) {
      this.minItems = getPureInteger(schema.minItems);
      this.maxItems = getPureInteger(schema.maxItems);
      this.uniqueItems = getPureBool(schema.uniqueItems);
    }
  }

  initTupleItems(schema) {
    const owner = this._owner;
    const path = JSONPointer_addFolder(this._schemaPath, 'items');
    const items = getPureArray(schema.items);
    if (items) {
      const result = new Array(items.length);
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        const handler = owner.createSchemaHandler(
          JSONPointer_addFolder(path, i),
          item,
        );
        result[i] = handler;
      }
      return result.length > 0 ? result : undefined;
    }
    return undefined;
  }

  initTupleAdditionalItems(schema) {
    const owner = this._owner;
    const path = JSONPointer_addFolder(this._schemaPath, 'additionalItems');
    const item = getPureObject(schema.additionalItems);
    if (item) {
      const handler = owner.createSchemaHandler(
        path,
        item,
      );
      return handler;
    }
    return undefined;
  }

  getSchemaType() { return JSONSchemaTupleType; }

  isPrimitiveSchemaType() { return false; }

  hasSchemaChildren() { return true; }

  isValid(data, err = [], callback) {
    err = this.isValidState(Array, data, err);
    if (err.length > 0) return err;
    if (data == null) return err;

    const length = data.length;
    const size = this.items.length;
    if (length !== size) {
      err.push([this._schemaPath, 'items', size, length]);
    }

    if (callback) {
      for (let i = 0; i < size; ++i) {
        const s = this.items[i];
        const d = i < data.length ? data[i] : undefined;
        const p = JSONPointer_addFolder(this._schemaPath, i);
        callback(s, p, d, err);
      }
    }

    if (this.additionalItems) {
      const minitems = mathi32_max(this.minItems > 0 ? this.minItems : size, size);
      const maxitems = mathi32_max(this.maxItems > 0 ? this.maxItems : size, size);

      if (length < minitems) {
        err.push([this._schemaPath, 'minItems', minitems, length]);
      }
      if (length > maxitems) {
        err.push([this._schemaPath, 'maxItems', maxitems, length]);
      }

      if (this.uniqueItems === true) {
        // TODO: implementation.uniqueItems
        err.push([this._schemaPath, 'implementation', 'uniqueItems']);
      }

      if (callback) {
        const s = this.additionalItems;
        for (let i = size; i < data.length; ++i) {
          const d = data[i];
          const p = JSONPointer_addFolder(this._schemaPath, i);
          callback(s, p, d, err);
        }
      }
    }
    return err;
  }
}

//#endregion
