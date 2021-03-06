import {
  isIntegerType,
  isStringType,
  isArrayType,
  isBoolOrObjectType,
} from '../../types/core';

import {
  getStringType,
} from '../../types/getters';

import {
  falseThat,
} from '../../types/functions';

import {
  performance,
} from '../../types/perf';

import {
  compileSchemaObject,
} from '../validate/schema';

import {
  JSONPointer_concatPath,
} from './pointer';


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
    return false;
  }

  addErrorPair(member, key, value, rest) {
    this.errors.push(new SchemaError(
      performance.now(),
      member,
      key,
      value,
      rest,
    ));
    return false;
  }

  validate(data) {
    // clear all errors
    while (this.errors.pop());
    // call compiled validator
    return this.firstSchema.validate(data, data);
  }
}

class SchemaObject {
  constructor(schemaRoot, schemaPath, meta) {
    this.schemaRoot = schemaRoot;
    this.schemaPath = schemaPath;
    this.metaData = meta;
    this.validateFn = falseThat;
    this.members = [];
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

  createMember(key, ...rest) {
    const member = new SchemaMember(
      this,
      key,
      null,
      rest,
    );
    return member;
  }

  createSingleErrorHandler(key, expected, ...rest) {
    const self = this;
    const member = new SchemaMember(
      self,
      key,
      expected,
      rest,
    );

    if (isStringType(key)) {
      self.members.push(member);
      return function addErrorSingle(data, ...meta) {
        return self.addErrorSingle(member, data, meta);
      };
    }
    else if (isArrayType(key)) {
      self.members.push(member);
      return function addErrorPair(dataKey, data, ...meta) {
        return self.addErrorPair(member, dataKey, data, meta);
      };
    }

    return undefined;
  }

  createPairErrorHandler(member, key, expected, ...rest) {
    const self = this;
    if (!isStringType(key)) return undefined;

    const submember = new SchemaMember(
      self,
      JSONPointer_concatPath(member.memberKey, key),
      expected,
      rest,
    );

    self.members.push(submember);
    return function addErrorPair(dataKey, data, ...meta) {
      return self.addErrorPair(submember, dataKey, data, meta);
    };
  }

  createSingleValidator(key, child, ...rest) {
    const self = this;
    if (!isStringType(key)) return undefined;
    if (!isBoolOrObjectType(child)) return undefined;

    const childObj = new SchemaObject(
      self.schemaRoot,
      JSONPointer_concatPath(self.schemaPath, key),
      rest,
    );

    const validator = compileSchemaObject(childObj, child);
    if (validator == null) return undefined;

    childObj.validateFn = validator;

    self.members.push(childObj);
    return validator;
  }

  createPairValidator(member, key, child, ...rest) {
    const self = this;
    const valid = member instanceof SchemaMember
      && (isStringType(key)
        || isIntegerType(key))
      && isBoolOrObjectType(child);
    if (!valid) return undefined;

    const childObj = new SchemaObject(
      self.schemaRoot,
      JSONPointer_concatPath(self.schemaPath, member.schemaKey, key),
      rest,
    );

    const validator = compileSchemaObject(childObj, child);
    if (validator == null) return undefined;

    childObj.validateFn = validator;

    self.members.push(childObj);
    return validator;
  }
}

class SchemaMember {
  constructor(schemaObject, memberKey, expectedValue, options) {
    this.schemaObject = schemaObject;
    this.memberKey = memberKey;
    this.expectedValue = expectedValue;
    this.options = options;
  }
}

const registeredDocuments = {};

export function compileJSONSchema(baseUri, json) {
  baseUri = getStringType(baseUri, '');
  // TODO: test if valid baseUri
  if (registeredDocuments.hasOwnProperty(baseUri)) {
    return false;
  }

  // create a new schema root
  const root = new SchemaRoot(baseUri, json);

  // compile the first schema object
  const first = root.firstSchema;
  first.validateFn = compileSchemaObject(first, json);

  registeredDocuments[baseUri] = root;

  return true;
}

export function getJSONSchema(baseUri) {
  baseUri = getStringType(baseUri, '');
  if (registeredDocuments.hasOwnProperty(baseUri)) {
    return registeredDocuments[baseUri];
  }
  return undefined;
}
