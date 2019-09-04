import {
  String_createRegExp,
} from '../helpers/String';

import {
  isStrictStringType,
} from '../types/isDataType';

import {
  getIntegerishType,
} from '../types/getDataType';

function compileMinLength(schemaObj, jsonSchema) {
  const min = Math.max(getIntegerishType(jsonSchema.minLength, 0), 0);
  if (min === 0) return undefined;

  const addError = schemaObj.createMemberError('minLength', min, compileMinLength);
  if (addError == null) return undefined;

  return function validateStringMinLength(data) {
    return isStrictStringType(data)
      ? data.length >= min
        ? true
        : addError(data.length)
      : true;
  };
}

function compileMaxLength(schemaObj, jsonSchema) {
  const max = Math.max(getIntegerishType(jsonSchema.maxLength, 0), 0);
  if (max === 0) return undefined;

  const addError = schemaObj.createMemberError('maxLength', max, compileMaxLength);
  if (addError == null) return undefined;

  return function validateStringMaxLength(data) {
    return isStrictStringType(data)
      ? data.length <= max
        ? true
        : addError(data.length)
      : true;
  };
}

function compileStringPattern(schemaObj, jsonSchema) {
  const ptrn = jsonSchema.pattern;
  const re = String_createRegExp(ptrn);
  if (re == null) return undefined;

  const addError = schemaObj.createMemberError('pattern', ptrn, compileStringPattern);
  if (addError == null) return undefined;

  return function validateStringPattern(data) {
    return isStrictStringType(data)
      ? re.test(data)
        ? true
        : addError(data)
      : true;
  };
}

export function compileStringBasic(schemaObj, jsonSchema) {
  return [
    compileMinLength(schemaObj, jsonSchema),
    compileMaxLength(schemaObj, jsonSchema),
    compileStringPattern(schemaObj, jsonSchema),
  ];
}
