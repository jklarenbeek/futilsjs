/* eslint-disable function-paren-newline */
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

  const addError = schemaObj.createMemberError(
    'const',
    constant,
    compileConst);
  if (addError == null) return undefined;

  if (isPrimitiveType(constant)) {
    return function validatePrimitiveConst(data, dataRoot) {
      return constant === data
        ? true
        : addError(data);
    };
  }
  else {
    return function validatePrimitiveConst(data, dataRoot) {
      return equalsDeep(constant, data)
        ? true
        : addError(data);
    };
  }
}

function compileEnum(schemaObj, jsonSchema) {
  const enums = getArrayMinItems(jsonSchema.enum, 1);
  if (enums == null) return undefined;

  let hasObjects = false;
  for (let i = 0; i < enums.length; ++i) {
    const e = enums[i];
    if (e != null && typeof e === 'object') {
      hasObjects = true;
      break;
    }
  }

  const addError = schemaObj.createMemberError(
    'enum',
    enums,
    compileEnum);
  if (addError == null) return undefined;

  if (hasObjects === false) {
    return function validateEnumSimple(data, dataRoot) {
      return data === undefined
        ? true
        : enums.includes(data)
          ? true
          : addError(data);
    };
  }
  else {
    return function validateEnumDeep(data, dataRoot) {
      if (data === undefined) return true;
      if (data === null || typeof data !== 'object')
        return enums.includes(data)
          ? true
          : addError(data);

      for (let i = 0; i < enums.length; ++i) {
        if (equalsDeep(enums[i], data) === true)
          return true;
      }
      return addError(data);
    };
  }
}

export function compileEnumBasic(schemaObj, jsonSchema) {
  return [
    compileConst(schemaObj, jsonSchema),
    compileEnum(schemaObj, jsonSchema),
  ];
}
