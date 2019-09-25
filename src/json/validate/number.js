/* eslint-disable function-paren-newline */
/* eslint-disable valid-typeof */
import {
  isNumberType,
} from '../../types/core';

import {
  getNumbishType,
  getTypeExclusiveBound,
} from '../../types/getters';
import { trueThat } from '../../types/functions';

function compileNumberMaximum(schemaObj, jsonSchema) {
  const [max, emax] = getTypeExclusiveBound(
    getNumbishType,
    jsonSchema.maximum,
    jsonSchema.exclusiveMaximum,
  );

  if (emax != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'exclusiveMaximum',
      emax,
      compileNumberMaximum);
    if (addError == null) return undefined;

    return function exclusiveMaximum(data) {
      return data < emax || addError(data);
    };
  }
  else if (max != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'maximum',
      max,
      compileNumberMaximum);
    if (addError == null) return undefined;

    return function maximum(data) {
      return data <= max || addError(data);
    };
  }

  return undefined;
}

function compileNumberMinimum(schemaObj, jsonSchema) {
  const [min, emin] = getTypeExclusiveBound(
    getNumbishType,
    jsonSchema.minimum,
    jsonSchema.exclusiveMinimum,
  );

  if (emin != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'exclusiveMinimum',
      emin,
      compileNumberMinimum);
    if (addError == null) return undefined;

    return function exclusiveMinimum(data) {
      return data > emin || addError(data);
    };
  }
  else if (min != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'minimum',
      min,
      compileNumberMinimum);
    if (addError == null) return undefined;

    return function minimum(data) {
      return data >= min || addError(data);
    };
  }

  return undefined;
}

function compileNumberMultipleOf(schemaObj, jsonSchema) {
  const mulOf = getNumbishType(jsonSchema.multipleOf);
  if (mulOf == null) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'multipleOf',
    mulOf,
    compileNumberMultipleOf);
  if (addError == null) return undefined;

  return function multipleOf(data) {
    return data % mulOf === 0 || addError(data);
  };
}

function compileNumberRaw(schemaObj, jsonSchema) {
  const maximum = compileNumberMaximum(schemaObj, jsonSchema);
  const minimum = compileNumberMinimum(schemaObj, jsonSchema);
  const multipleOf = compileNumberMultipleOf(schemaObj, jsonSchema);
  if (maximum == null && minimum == null && multipleOf == null)
    return undefined;

  const isMax = maximum || trueThat;
  const isMin = minimum || trueThat;
  const isMul = multipleOf || trueThat;

  return function validateNumberRaw(data) {
    return isMax(data)
      && isMin(data)
      && isMul(data);
  };
}

export function compileNumberBasic(schemaObj, jsonSchema) {
  const raw = compileNumberRaw(schemaObj, jsonSchema);
  return function validateNumber(data) {
    return isNumberType(data) && raw(data);
  };
}

export function getDefaultValue(jsonSchema) {
  return (isNumberType(jsonSchema.const) && jsonSchema.const)
    || (isNumberType(jsonSchema.default) && jsonSchema.default);
}

export function renderNumberControl(schemaObj, jsonSchema) {
  const widget = jsonSchema.widget;
  if (widget !== 'number') return undefined;

  const validator = compileNumberRaw(schemaObj, jsonSchema);
  if (validator == null) return undefined;

  return (<input type='number' value={ getDefaultValue(jsonSchema) } />);
}
