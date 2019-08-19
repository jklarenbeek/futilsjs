import {
  isStrictStringType,
  isStrictArrayType,
} from '../types/isDataType';

import {
  getStrictString,
} from '../types/getDataType';

import {
  trueThat,
} from '../types/isFunctionType';

import {
  compileSchemaValidator,
} from './compileSchemaValidator';

class SchemaRoot {
  constructor(baseUri, json) {
    this.baseUri = baseUri;
    this.json = json;
    this.validateFn = trueThat;
    this.errors = [];
  }

  createSchemaObject(schemaPath, dataPath) {
    return new SchemaObject(this, schemaPath, dataPath);
  }

  addErrorSingle(method, value, rest) {
    this.errors.push([performance.now(), method, value, rest]);
  }

  addErrorMulti(method, key, value, rest) {
    this.errors.push([performance.now(), method, key, value, rest]);
  }

  validate(data, dataRoot) {
    while (this.errors.pop());
    return this.validateFn(data, dataRoot);
  }
}

class SchemaObject {
  constructor(document, schemaPath, dataPath) {
    this.schemaDocument = document;
    this.schemaPath = schemaPath;
    this.dataPath = dataPath;
    this.validateFn = trueThat;
  }

  validate(data, dataRoot) {
    return this.validateFn(data, dataRoot);
  }

  createSchemaMember(schemaKey, expectedValue, ...options) {
    return new SchemaMember(this, schemaKey, expectedValue, options);
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
    const document = this.schemaObject.schemaDocument;
    if (isStrictStringType(this.schemaKey)) {
      return function addErrorSingle(value, ...rest) {
        document.addErrorSingle(self, value, rest);
        return false;
      };
    }
    else if (isStrictArrayType(this.schemaKey)) {
      return function addErrorPair(key, value, ...rest) {
        document.addErrorPair(self, key, value, rest);
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

  const root = new SchemaRoot(baseUri, json);
  root.validateFn = compileSchemaValidator(root, json, '', '');

  registeredDocuments[baseUri] = root;

  return false;
}

export function getJSONSchema(baseUri) {
  baseUri = getStrictString(baseUri, '');
  if (registeredDocuments.hasOwnProperty(baseUri)) {
    return registeredDocuments[baseUri];
  }
  return undefined;
}
