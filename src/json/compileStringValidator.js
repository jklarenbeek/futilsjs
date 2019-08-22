import {
  String_createRegExp,
} from '../helpers/String';

import { getIntegerishType } from '../types/getDataType';

function compileMinLength(schemaObj, jsonSchema) {
  const min = Math.max(getIntegerishType(jsonSchema.minLength, 0), 0);
  if (min > 0) {
    const addError = schemaObj.createMemberError('minLength', min, compileStringLength);
    return function validateStringMinLength(data) {
      if (typeof data === 'string') {
        const len = data.length;
        const valid = len >= min;
        if (!valid) addError(len);
        return valid;
      }
      return true;
    };
  }
  else return undefined;
}

function compileMaxLength(schemaObj, jsonSchema) {
  const max = Math.max(getIntegerishType(jsonSchema.maxLength, 0), 0);

  if (max > 0) {
    const addError = schemaObj.createMemberError('maxLength', max, compileStringLength);
    return function validateStringMaxLength(data) {
      if (typeof data === 'string') {
        const len = data.length;
        const valid = len <= max;
        if (!valid) addError(len);
        return valid;
      }
      return true;
    };
  }
  else return undefined;
}

function compileStringLength(schemaObj, jsonSchema) {
  const fnMin = compileMinLength(schemaObj, jsonSchema);
  const fnMax = compileMaxLength(schemaObj, jsonSchema);

  if (fnMin && fnMax) {
    return function validateStringBetweenLength(data, dataRoot) {
      return fnMin(data, dataRoot) && fnMax(data, dataRoot);
    };
  }
  else if (fnMin) return fnMin;
  else if (fnMax) return fnMax;
  else return undefined;
}

function compileStringPattern(schemaObj, jsonSchema) {
  const ptrn = jsonSchema.pattern;
  const re = String_createRegExp(ptrn);
  if (re) {
    const addError = schemaObj.createMemberError('pattern', ptrn, compileStringPattern);
    return function validateStringPattern(data) {
      if (typeof data === 'string') {
        const valid = re.test(data);
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else return undefined;
}

export function compileStringBasic(schemaObj, jsonSchema) {
  const fnLength = compileStringLength(schemaObj, jsonSchema);
  const fnPattern = compileStringPattern(schemaObj, jsonSchema);
  if (fnLength && fnPattern) {
    return function validateSchemaBasic(data) {
      return fnLength(data) && fnPattern(data);
    };
  }
  else if (fnLength) return fnLength;
  else if (fnPattern) return fnPattern;
  else return undefined;
}
