import {
  isStrictStringType,
  isStrictArrayType,
} from '../types/isDataType';

import {
  getStrictString,
} from '../types/getDataType';

import {
  falseThat,
} from '../types/isFunctionType';

import {
  compileSchemaObject,
} from './compileSchemaValidator';

class SchemaRoot {
  constructor(baseUri, json) {
    this.baseUri = baseUri;
    this.json = json;
    this.firstSchema = new SchemaObject();
    this.errors = [];
  }

  createSchemaObject() {
    const schema = new SchemaObject(this, '', '');
    this.firstSchema = this.firstSchema || schema;
    return schema;
  }

  addErrorSingle(method, value, rest) {
    this.errors.push([
      performance.now(),
      method,
      value,
      rest]);
  }

  addErrorPair(method, key, value, rest) {
    this.errors.push([
      performance.now(),
      method,
      key,
      value,
      rest]);
  }

  validate(data) {
    // clear all errors
    while (this.errors.pop());
    // call compiled validator
    return this.firstSchema.validate(data, data);
  }
}

class SchemaObject {
  constructor(schemaRoot, schemaPath, dataPath) {
    this.schemaRoot = schemaRoot;
    this.schemaPath = schemaPath;
    this.dataPath = dataPath;
    this.validateFn = falseThat;
  }

  createSchemaObject(schemaPath, dataPath) {
    const schema = new SchemaObject(this.schemaRoot, schemaPath, dataPath);
    return schema;
  }

  createLocalMember(schemaKey, expectedValue, ...options) {
    return new SchemaMember(this, schemaKey, expectedValue, options);
  }

  get addErrorSingle() {
    return this.schemaRoot.addErrorSingle;
  }

  get addErrorPair() {
    return this.schemaRoot.addErrorPair;
  }

  get validate() {
    return this.validateFn;
  }
}

class SchemaMember {
  constructor(schemaObject, schemaKey, expectedValue, options) {
    this.schemaObject = schemaObject;
    this.schemaKey = schemaKey;
    this.expectedValue = expectedValue;
    this.options = options;
  }

  createAddError() {
    const self = this;
    const parent = this.schemaObject;
    if (isStrictStringType(this.schemaKey)) {
      return function addErrorSingle(value, ...rest) {
        parent.addErrorSingle(self, value, rest);
        return false;
      };
    }
    else if (isStrictArrayType(this.schemaKey)) {
      return function addErrorPair(key, value, ...rest) {
        parent.addErrorPair(self, key, value, rest);
        return false;
      };
    }
    return undefined;
  }
}

const registeredDocuments = {};

export function compileJSONSchema(baseUri, json) {
  baseUri = getStrictString(baseUri, '');
  // TODO: test if valid baseUri
  if (registeredDocuments.hasOwnProperty(baseUri)) {
    return false;
  }

  const root = compileSchemaObject(
    new SchemaRoot(baseUri, json),
    json,
    '',
    '',
  );

  registeredDocuments[baseUri] = root;

  return true;
}

export function getJSONSchema(baseUri) {
  baseUri = getStrictString(baseUri, '');
  if (registeredDocuments.hasOwnProperty(baseUri)) {
    return registeredDocuments[baseUri];
  }
  return undefined;
}
