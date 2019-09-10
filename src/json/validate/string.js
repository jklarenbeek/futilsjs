import {
  isStringType,
} from '../../types/core';

import {
  getIntishType,
} from '../../types/getters';

import {
  createRegExp,
} from '../../types/regexp';

function compileMinLength(schemaObj, jsonSchema) {
  const min = Math.max(getIntishType(jsonSchema.minLength, 0), 0);
  if (min === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler('minLength', min, compileMinLength);
  if (addError == null) return undefined;

  return function validateStringMinLength(data) {
    return isStringType(data)
      ? data.length >= min
        ? true
        : addError(data.length)
      : true;
  };
}

function compileMaxLength(schemaObj, jsonSchema) {
  const max = Math.max(getIntishType(jsonSchema.maxLength, 0), 0);
  if (max === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler('maxLength', max, compileMaxLength);
  if (addError == null) return undefined;

  return function validateStringMaxLength(data) {
    return isStringType(data)
      ? data.length <= max
        ? true
        : addError(data.length)
      : true;
  };
}

function compileStringPattern(schemaObj, jsonSchema) {
  const ptrn = jsonSchema.pattern;
  const re = createRegExp(ptrn);
  if (re == null) return undefined;

  const addError = schemaObj.createSingleErrorHandler('pattern', ptrn, compileStringPattern);
  if (addError == null) return undefined;

  return function validateStringPattern(data) {
    return isStringType(data)
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
