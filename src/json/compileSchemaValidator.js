/* eslint-disable function-paren-newline */
import {
  fallbackFn,
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
import { compileCombineSchema } from './compileCombineValidator';
import { compileConditionSchema } from './compileConditionValidator';

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

  return function validateSchemaBasic(data, dataRoot) {
    const vType = fnType(data, dataRoot);
    if (vType === false) return false;
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
function compileSchemaAdvanced(schemaObj, jsonSchema) {
  const fnCombine = compileCombineSchema(schemaObj, jsonSchema);
  const fnCondition = compileConditionSchema(schemaObj, jsonSchema);

  if (fnCombine && fnCondition) {
    return function validateAdvandedSchema(data, dataRoot) {
      return fnCombine(data, dataRoot) && fnCondition(data, dataRoot);
    };
  }
  return fnCombine || fnCondition;
}

export function compileSchemaObject(schemaObj, jsonSchema) {
  if (!isStrictObjectType(jsonSchema)) {
    return falseThat;
  }

  const validateBasic = compileSchemaBasic(schemaObj, jsonSchema);
  const validateChildren = compileSchemaChildren(schemaObj, jsonSchema);
  const validateAdvanced = compileSchemaAdvanced(schemaObj, jsonSchema);

  return function validateSchemaObject(data, dataRoot) {
    return validateBasic(data, dataRoot)
      && validateAdvanced(data, dataRoot)
      && validateChildren(data, dataRoot);
  };
}
