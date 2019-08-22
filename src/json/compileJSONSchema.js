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
    const member = new SchemaMember(
      this,
      key,
      expected,
      rest,
    );

    if (isStrictArrayType(key)) {
      this.members.push(...key);
      return function addErrorPair(dataKey, data, ...meta) {
        return this.addErrorPair(member, dataKey, data, meta);
      };
    }
    else if (isStrictStringType(key)) {
      this.members.push(key);
      return function addErrorSingle(data, ...meta) {
        return this.addErrorSingle(member, data, meta);
      };
    }
    return undefined;
  }

  createSingleValidator(key, child, ...rest) {
    if (isStrictStringType(key)) {
      const childObj = new SchemaObject(
        this.schemaRoot,
        JSONPointer_concatPath(this.schemaPath, key),
        rest,
      );
      const validator = compileSchemaObject(childObj, child);
      childObj.validateFn = validator;
      return validator;
    }
    return undefined;
  }

  createPairValidator(member, key, child, ...rest) {
    const valid = member instanceof SchemaMember
      && isStrictStringType(key)
      && isObjectishType(child);
    if (!valid) return undefined;

    const childObj = new SchemaObject(
      this.schemaRoot,
      JSONPointer_concatPath(this.schemaPath, member.schemaKey, key),
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
  const first = root.createSchemaObject();
  first.validateFn = compileSchemaObject(first, json);

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
