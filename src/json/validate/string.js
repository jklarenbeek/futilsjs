/* eslint-disable function-paren-newline */
import {
  isStringType,
} from '../../types/core';

import {
  getIntishType,
} from '../../types/getters';

import {
  createRegExp,
} from '../../types/regexp';

import {
  trueThat,
} from '../../types/functions';

function compileMinLength(schemaObj, jsonSchema) {
  const min = getIntishType(jsonSchema.minLength, 0);
  if (min < 1) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'minLength',
    min,
    compileMinLength);
  if (addError == null) return undefined;

  return function isMinLength(len = 0) {
    return len >= min || addError(len);
  };
}

function compileMaxLength(schemaObj, jsonSchema) {
  const max = getIntishType(jsonSchema.maxLength, -1);
  if (max < 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'maxLength',
    max,
    compileMaxLength);
  if (addError == null) return undefined;

  return function isMaxLength(len = 0) {
    return len <= max || addError(len);
  };
}

function compilePattern(schemaObj, jsonSchema) {
  const pattern = createRegExp(jsonSchema.pattern);
  if (pattern == null) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'pattern',
    pattern,
    compilePattern);
  if (addError == null) return undefined;

  return function isMatch(str = '') {
    return pattern.test(str) || addError(str);
  };
}

export function compileStringBasic(schemaObj, jsonSchema) {
  const minLength = compileMinLength(schemaObj, jsonSchema);
  const maxLength = compileMaxLength(schemaObj, jsonSchema);
  const pattern = compilePattern(schemaObj, jsonSchema);
  if (minLength == null && maxLength == null && pattern == null) return undefined;

  const isMinLength = minLength || trueThat;
  const isMaxLength = maxLength || trueThat;
  const isMatch = pattern || trueThat;

  return function validateStringSchema(data) {
    if (isStringType(data)) {
      const len = data.length;
      return isMinLength(len)
        && isMaxLength(len)
        && isMatch(data);
    }
    return true;
  };
}
