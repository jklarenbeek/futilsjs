import {
  performance,
} from 'perf_hooks';

import {
  isStrictStringType,
  isStrictArrayType,
  isObjectishType,
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

  createMemberError(key, expected, ...rest) {
    const self = this;
    const member = new SchemaMember(
      self,
      key,
      expected,
      rest,
    );

    if (isStrictStringType(key)) {
      self.members.push(key);
      return function addErrorSingle(data, ...meta) {
        return self.addErrorSingle(member, data, meta);
      };
    }
    else if (isStrictArrayType(key)) {
      self.members.push(...key);
      return function addErrorPair(dataKey, data, ...meta) {
        return self.addErrorPair(member, dataKey, data, meta);
      };
    }

    return undefined;
  }

  createSingleValidator(key, child, ...rest) {
    const self = this;
    if (isStrictStringType(key)) {
      const childObj = new SchemaObject(
        self.schemaRoot,
        JSONPointer_concatPath(self.schemaPath, key),
        rest,
      );
      const validator = compileSchemaObject(childObj, child);
      childObj.validateFn = validator;
      return validator;
    }
    return undefined;
  }

  createPairValidator(member, key, child, ...rest) {
    const self = this;
    const valid = member instanceof SchemaMember
      && isStrictStringType(key)
      && isObjectishType(child);
    if (!valid) return undefined;

    const childObj = new SchemaObject(
      self.schemaRoot,
      JSONPointer_concatPath(self.schemaPath, member.schemaKey, key),
      rest,
    );
    const validator = compileSchemaObject(childObj, child);
    childObj.validateFn = validator;
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
  baseUri = getStrictString(baseUri, '');
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
  baseUri = getStrictString(baseUri, '');
  if (registeredDocuments.hasOwnProperty(baseUri)) {
    return registeredDocuments[baseUri];
  }
  return undefined;
}
