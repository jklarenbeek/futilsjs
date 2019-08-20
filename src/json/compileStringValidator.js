import {
  String_createRegExp,
} from '../helpers/String';

import { getIntegerishType } from '../types/getDataType';

function compileMinLength(schema, addMember) {
  const min = Math.max(getIntegerishType(schema.minLength, 0), 0);
  if (min > 0) {
    const addError = addMember('minLength', min, compileStringLength);
    return function minLength(data) {
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

function compileMaxLength(schema, addMember) {
  const max = Math.max(getIntegerishType(schema.maxLength, 0), 0);

  if (max > 0) {
    const addError = addMember('maxLength', max, compileStringLength);
    return function maxLength(data) {
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

function compileStringLength(schema, addMember) {
  const fnMin = compileMinLength(schema, addMember);
  const fnMax = compileMaxLength(schema, addMember);

  if (fnMin && fnMax) {
    return function betweenLength(data, dataRoot) {
      return fnMin(data, dataRoot) && fnMax(data, dataRoot);
    };
  }
  else if (fnMin) return fnMin;
  else if (fnMax) return fnMax;
  else return undefined;
}

function compileStringPattern(schema, addMember) {
  const ptrn = schema.pattern;
  const re = String_createRegExp(ptrn);
  if (re) {
    const addError = addMember('pattern', ptrn, compileStringPattern);
    return function pattern(data) {
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

export function compileStringBasic(schema, addMember) {
  const fnLength = compileStringLength(schema, addMember);
  const fnPattern = compileStringPattern(schema, addMember);
  if (fnLength && fnPattern) {
    return function validateSchemaBasic(data) {
      return fnLength(data) && fnPattern(data);
    };
  }
  else if (fnLength) return fnLength;
  else if (fnPattern) return fnPattern;
  else return undefined;
}
