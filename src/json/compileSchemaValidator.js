import {
  fallbackFn,
  trueThat,
} from '../types/isFunctionType';

import {
  isStrictObjectType,
} from '../types/isDataType';

import { compileTypeBasic } from './compileTypeValidator';
import { compileFormatBasic } from './compileFormatValidator';
import { compileEnumBasic } from './compileEnumValidator';
import { compileNumberBasic } from './compileNumberValidator';
import { compileStringBasic } from './compileStringValidator';
import { compileObjectBasic, compileObjectChildren } from './compileObjectValidator';
import { compileArrayBasic, compileArrayChildren } from './compileArrayValidator';
import { compileMapChildren } from './compileMapValidator';
import { compileSetChildren } from './compileSetValidator';
import { compileTupleChildren } from './compileTupleValidator';

function compileSchemaBasic(schema, addMember) {
  const fnType = fallbackFn(
    compileTypeBasic(schema, addMember),
  );
  const fnFormat = fallbackFn(
    compileFormatBasic(schema, addMember),
  );
  const fnEnum = fallbackFn(
    compileEnumBasic(schema, addMember),
  );
  const fnNumber = fallbackFn(
    compileNumberBasic(schema, addMember),
  );
  const fnString = fallbackFn(
    compileStringBasic(schema, addMember),
  );
  const fnObject = fallbackFn(
    compileObjectBasic(schema, addMember),
  );
  const fnArray = fallbackFn(
    compileArrayBasic(schema, addMember),
  );

  return function validateSchemaObject(data, dataRoot) {
    const vType = fnType(data, dataRoot);
    const vFormat = fnFormat(data, dataRoot);
    const vEnum = fnEnum(data, dataRoot);
    const vNumber = fnNumber(data, dataRoot);
    const vString = fnString(data, dataRoot);
    const vObject = fnObject(data, dataRoot);
    const vArray = fnArray(data, dataRoot);
    return vType
      && vFormat
      && vEnum
      && vNumber
      && vString
      && vObject
      && vArray;
  };
}

function compileSchemaChildren(schema, addMember, addChildSchema) {
  const fnObject = fallbackFn(
    compileObjectChildren(schema, addMember, addChildSchema),
  );
  const fnMap = fallbackFn(
    compileMapChildren(schema, addMember, addChildSchema),
  );
  const fnArray = fallbackFn(
    compileArrayChildren(schema, addMember, addChildSchema),
  );
  const fnSet = fallbackFn(
    compileSetChildren(schema, addMember, addChildSchema),
  );
  const fnTuple = fallbackFn(
    compileTupleChildren(schema, addMember, addChildSchema),
  );

  return function validateSchemaChildren(data, dataRoot) {
    return fnObject(data, dataRoot)
      && fnMap(data, dataRoot)
      && fnArray(data, dataRoot)
      && fnSet(data, dataRoot)
      && fnTuple(data, dataRoot);
  };
}

// eslint-disable-next-line no-unused-vars
function compileSchemaSelectors(schema, addMember, addSelectSchema) {
  return trueThat;
}

export function compileSchemaObject(schemadoc, jsonschema, schemaPath, dataPath) {
  if (!isStrictObjectType(jsonschema)) {
    return trueThat;
  }

  const schema = schemadoc.createSchemaObject(schemaPath, dataPath);

  function addMember(key, expected, ...options) {
    const member = schema.createSchemaMember(key, expected, ...options);
    return member.createAddError();
  }
  function addChildSchema(key, childSchema) {
    return schema.createSchemaMember(key, childSchema);
  }
  function addSelectSchema(key, selectSchema) {
    return schema.createChildSchema(key, selectSchema);
  }

  const validateBasic = compileSchemaBasic(jsonschema, addMember);
  const validateChildren = compileSchemaChildren(jsonschema, addMember, addChildSchema);
  const validateSelectors = compileSchemaSelectors(jsonschema, addMember, addSelectSchema);

  return function validateSchemaRecursive(data, dataRoot) {
    return validateBasic(data, dataRoot)
      && validateChildren(data, dataRoot)
      && validateSelectors(data, dataRoot);
  };
}
