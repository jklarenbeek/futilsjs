/* eslint-disable function-paren-newline */
import {
  fallbackFn,
  trueThat,
  falseThat,
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

function compileSchemaBasic(schemaObj, jsonSchema) {
  const fnType = fallbackFn(
    compileTypeBasic(schemaObj, jsonSchema),
  );
  const fnFormat = fallbackFn(
    compileFormatBasic(schemaObj, jsonSchema),
  );
  const fnEnum = fallbackFn(
    compileEnumBasic(schemaObj, jsonSchema),
  );
  const fnNumber = fallbackFn(
    compileNumberBasic(schemaObj, jsonSchema),
  );
  const fnString = fallbackFn(
    compileStringBasic(schemaObj, jsonSchema),
  );
  const fnObject = fallbackFn(
    compileObjectBasic(schemaObj, jsonSchema),
  );
  const fnArray = fallbackFn(
    compileArrayBasic(schemaObj, jsonSchema),
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

function compileSchemaChildren(schemaObj, jsonSchema) {
  const fnObject = fallbackFn(
    compileObjectChildren(schemaObj, jsonSchema),
  );
  const fnMap = fallbackFn(
    compileMapChildren(schemaObj, jsonSchema),
  );
  const fnArray = fallbackFn(
    compileArrayChildren(schemaObj, jsonSchema),
  );
  const fnSet = fallbackFn(
    compileSetChildren(schemaObj, jsonSchema),
  );
  const fnTuple = fallbackFn(
    compileTupleChildren(schemaObj, jsonSchema),
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
function compileSchemaSelectors(schemaObj, jsonSchema) {
  return trueThat;
}

// eslint-disable-next-line no-unused-vars
function compileSchemaConditions(schemaObj, jsonSchema) {
  return trueThat;
}

export function compileSchemaRecursive(schemaObj, jsonSchema) {
  if (!isStrictObjectType(jsonSchema)) {
    return falseThat;
  }

  const validateBasic = compileSchemaBasic(schemaObj, jsonSchema);
  const validateChildren = compileSchemaChildren(schemaObj, jsonSchema);
  const validateSelectors = compileSchemaSelectors(schemaObj, jsonSchema);
  const validateConditions = compileSchemaConditions(schemaObj, jsonSchema);

  schemaObj.validateFn = function validateSchemaRecursive(data, dataRoot) {
    return validateBasic(data, dataRoot)
      && validateSelectors(data, dataRoot)
      && validateConditions(data, dataRoot)
      && validateChildren(data, dataRoot);
  };

  return schemaObj;
}
