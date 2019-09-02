/* eslint-disable no-unused-vars */
import {
  getArrayMinItems,
} from '../types/getDataTypeExtra';
import { isPrimitiveType } from '../types/isDataType';

import {
  equalsDeep,
} from '../helpers/Object';

function compileConst(schemaObj, jsonSchema) {
  const constant = jsonSchema.const;
  if (constant === undefined) return undefined;

  if (isPrimitiveType(constant)) {
    const addError = schemaObj.createMemberError('const', constant, compileConst);
    return function validatePrimitiveConst(data, dataRoot) {
      if (data !== constant) return addError(data);
      return true;
    };
  }
  else {
    const addError = schemaObj.createMemberError('const', constant, compileConst);
    return function validatePrimitiveConst(data, dataRoot) {
      if (equalsDeep(constant, data) === false) return addError(data);
      return true;
    };
  }
}

function compileEnumSimple(enums, schemaObj) {
  const addError = schemaObj.createMemberError(
    'enum',
    enums,
    compileEnumBasic,
  );
  return function validateEnumSimple(data, dataRoot) {
    if (data != null && typeof data !== 'object') {
      if (!enums.includes(data)) {
        return addError(data);
      }
    }
    return true;
  };
}

export function compileEnumBasic(schemaObj, jsonSchema) {
  const validateConst = compileConst(schemaObj, jsonSchema);
  if (validateConst) return validateConst;
  const enums = getArrayMinItems(jsonSchema.enum, 1);
  if (enums == null) return undefined;
  return compileEnumSimple(enums, schemaObj);
}
