/* eslint-disable function-paren-newline */
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

// eslint-disable-next-line no-unused-vars
function compileSchemaConditions(schema, addMember, addSelectSchema) {
  return trueThat;
}

export function compileSchemaRecursive(schemaObj, jsonSchema, schemaPath, dataPath) {
  if (!isStrictObjectType(jsonSchema)) {
    return trueThat;
  }

  function addErrorMember(key, expected, ...options) {
    const member = schemaObj.addSchemaMember(key, expected, options);
    return member.createAddError();
  }

  function addChildMember(key, ...options) {
    return schemaObj.createLocalMember(key, null, options);
  }

  function addChildObject(member, key, schema) {
    const childSchema = schemaObj.getChildSchemaPath(member, key);
    const childData = schemaObj.getChildDataPath(member, key);
    return (schemaPath && dataPath)
      ? compileSchemaRecursive(
        schemaDoc,
        schema,
        childSchema,
        childData,
      )
      : undefined;
  }

  function addChildSchema(member, key, selectSchema) {
    return schemaObj.createChildSchema(member, key, selectSchema);
  }

  const validateBasic = compileSchemaBasic(
    jsonSchema,
    addErrorMember,
  );
  const validateChildren = compileSchemaChildren(
    jsonSchema,
    addChildMember,
    addChildObject,
  );
  const validateSelectors = compileSchemaSelectors(jsonSchema,
    addChildMember,
    addChildSchema,
  );
  const validateConditions = compileSchemaConditions(jsonSchema,
    addChildMember,
    addChildSchema,
  );

  schemaObj.validateFn = function validateSchemaRecursive(data, dataRoot) {
    return validateBasic(data, dataRoot)
      && validateSelectors(data, dataRoot)
      && validateConditions(data, dataRoot)
      && validateChildren(data, dataRoot);
  };

  return schemaObj;
}
