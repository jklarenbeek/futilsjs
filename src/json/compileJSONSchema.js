import {
  isStrictStringType,
  isStrictArrayType,
  isPrimitiveType,
} from '../types/isDataType';

import {
  getStrictString,
} from '../types/getDataType';

import {
  falseThat,
} from '../types/isFunctionType';

import {
  compileSchemaRecursive,
} from './compileSchemaValidator';

class SchemaError {
  constructor(timeStamp, member, key, value, rest) {
    this.timeStamp = timeStamp;
    this.member = member;
    this.key = key;
    this.value = value;
    this.rest = rest;
  }
}

class SchemaRoot {
  constructor(baseUri, json) {
    this.baseUri = baseUri;
    this.json = json;
    this.firstSchema = new SchemaObject(this, '', '');
    this.errors = [];
  }

  addErrorSingle(member, value, rest) {
    this.errors.push(new SchemaError(
      performance.now(),
      member,
      null,
      value,
      rest,
    ));
  }

  addErrorPair(member, key, value, rest) {
    this.errors.push(new SchemaError(
      performance.now(),
      member,
      key,
      value,
      rest,
    ));
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
    this.validateFn = falseThat;
    this.members = [];
  }

  // returns a simple member for schema properties
  // like: minProperties, maxProperties, pattern, etc.
  addSchemaMember(schemaKey, expectedValue, options) {
    if (isPrimitiveType(expectedValue)) {
      const member = new SchemaMember(
        this,
        schemaKey,
        expectedValue,
        options,
      );
      return member;
    }
    if (expectedValue instanceof SchemaObject) {
      const member = new SchemaMember(
        this,
        schemaKey,
        expectedValue,
        options,
      );
      return member;
    }
    return undefined;
  }

  addSchemaChildObject(member, key) {
    if (member instanceof SchemaMember) {
      const memberKey = member.memberKey;
      const memberPath = this.schemaPath + '/' + memberKey + '/' + key;
      const dataPath = this.dataPath + '/' + key;
      const schemaObj = new SchemaObject(
        this.schemaRoot,
        memberPath,
        dataPath,
      );
      return schemaObj;
    }
    return undefined;
  }

  get errors() {
    return this.schemaRoot.errors;
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
  constructor(schemaObject, memberKey, expectedValue, options) {
    this.schemaObject = schemaObject;
    this.memberKey = memberKey;
    this.expectedValue = expectedValue;
    this.options = options;
  }

  createAddError() {
    const self = this;
    const parent = this.schemaObject;
    if (isStrictStringType(this.memberKey)) {
      return function addErrorSingle(value, ...rest) {
        parent.addErrorSingle(self, value, rest);
        return false;
      };
    }
    else if (isStrictArrayType(this.memberKey)) {
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

  // create a new schema root
  const root = new SchemaRoot(baseUri, json);

  // compile the first schema object
  const first = root.createSchemaObject();
  first.validateFn = compileSchemaRecursive(
    first,
    json,
    '',
    '',
  );

  registeredDocuments[baseUri] = first;

  return true;
}

export function getJSONSchema(baseUri) {
  baseUri = getStrictString(baseUri, '');
  if (registeredDocuments.hasOwnProperty(baseUri)) {
    return registeredDocuments[baseUri];
  }
  return undefined;
}
