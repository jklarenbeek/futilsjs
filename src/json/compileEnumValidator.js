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

function compileEnum(schemaObj, enums) {
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
    compileEnumBasic,
  );

  if (hasObjects === false) {
    return function validateEnumSimple(data, dataRoot) {
      if (data !== undefined) {
        if (!enums.includes(data)) {
          return addError(data);
        }
      }
      return true;
    };
  }
  else {
    return function validateEnumDeep(data, dataRoot) {
      if (data !== undefined) {
        if (data !== null && typeof data === 'object') {
          for (let i = 0; i < enums.length; ++i) {
            const constant = enums[i];
            if (equalsDeep(constant, data) === true)
              return true;
          }
          return addError(data);
        }
        else if (!enums.includes(data)) {
          return addError(data);
        }
      }
      return true;
    };
  }
}

export function compileEnumBasic(schemaObj, jsonSchema) {
  const validateConst = compileConst(schemaObj, jsonSchema);
  if (validateConst) return validateConst;
  const enums = getArrayMinItems(jsonSchema.enum, 1);
  if (enums == null) return undefined;
  return compileEnum(schemaObj, enums);
}
