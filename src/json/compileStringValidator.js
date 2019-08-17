import {
  getPureInteger,
} from '../types-base';

import {
  String_createRegExp,
} from '../types-String';


function compileStringLength(schema, addMember) {
  const min = Math.max(getPureInteger(schema.minLength, 0), 0);
  const max = Math.max(getPureInteger(schema.maxLength, 0), 0);

  if (min > 0 && max > 0) {
    const addError = addMember(['minLength', 'maxLength'], [min, max], compileStringLength);
    return function betweenLength(data) {
      if (typeof data === 'string') {
        const len = data.length;
        const valid = len >= min && len <= max;
        if (!valid) addError(len);
        return valid;
      }
      return true;
    };
  }

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

  return undefined;
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
  return undefined;
}

export function compileStringBasic(schema, addMember) {
  const fnLength = compileStringLength(schema, addMember);
  const fnPattern = compileStringPattern(schema, addMember);
  if (fnLength && fnPattern) {
    return function validateSchemaBasic(data) {
      return fnLength(data) && fnPattern(data);
    };
  }
  else if (fnLength) {
    return fnLength;
  }
  else if (fnPattern) {
    return fnPattern;
  }
  return undefined;
}
