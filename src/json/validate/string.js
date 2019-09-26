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

const CONST_SCHEMA_TYPE_STRING = 'string';

function compileMinLength(schemaObj, jsonSchema) {
  const min = getIntishType(jsonSchema.minLength, 0);
  if (min < 1) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'minLength',
    min,
    CONST_SCHEMA_TYPE_STRING);
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
    CONST_SCHEMA_TYPE_STRING);
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
    CONST_SCHEMA_TYPE_STRING);
  if (addError == null) return undefined;

  return function isMatch(str = '') {
    return pattern.test(str) || addError(str);
  };
}

export function compileStringRaw(schemaObj, jsonSchema) {
  const minLength = compileMinLength(schemaObj, jsonSchema);
  const maxLength = compileMaxLength(schemaObj, jsonSchema);
  const pattern = compilePattern(schemaObj, jsonSchema);
  if (minLength == null
    && maxLength == null
    && pattern == null) return undefined;

  const isMinLength = minLength || trueThat;
  const isMaxLength = maxLength || trueThat;
  const isMatch = pattern || trueThat;

  return function validateStringRaw(data) {
    const len = data.length;
    return isMinLength(len)
      && isMaxLength(len)
      && isMatch(data);
  };
}

export function compileStringBasic(schemaObj, jsonSchema) {
  const raw = compileStringRaw(schemaObj, jsonSchema);
  if (raw == null) return undefined;

  return function validateStringBasic(data) {
    return isStringType(data) && raw(data);
  };
}
