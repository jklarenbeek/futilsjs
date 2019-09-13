/* eslint-disable function-paren-newline */
/* eslint-disable valid-typeof */
import {
  isBigIntType,
} from '../../types/core';

import {
  getBigIntType,
  getTypeExclusiveBound,
} from '../../types/getters';
import { trueThat } from '../../types/functions';

function compileBigIntMaximum(schemaObj, jsonSchema) {
  const [max, emax] = getTypeExclusiveBound(
    getBigIntType,
    jsonSchema.maximum,
    jsonSchema.exclusiveMaximum,
  );

  if (emax != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'exclusiveMaximum',
      emax,
      compileBigIntMaximum);
    if (addError == null) return undefined;

    return function exclusiveMaximumBigInt(data) {
      return data < emax || addError(data);
    };
  }
  else if (max != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'maximum',
      max,
      compileBigIntMaximum);
    if (addError == null) return undefined;

    return function maximumBigInt(data) {
      return data <= max || addError(data);
    };
  }

  return undefined;
}

function compileBigIntMinimum(schemaObj, jsonSchema) {
  const [min, emin] = getTypeExclusiveBound(
    getBigIntType,
    jsonSchema.minimum,
    jsonSchema.exclusiveMinimum,
  );

  if (emin != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'exclusiveMinimum',
      emin,
      compileBigIntMinimum);
    if (addError == null) return undefined;

    return function exclusiveMinimumBigInt(data) {
      return data > emin || addError(data);
    };
  }
  else if (min != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'minimum',
      min,
      compileBigIntMinimum);
    if (addError == null) return undefined;

    return function minimumBigInt(data) {
      return data >= min || addError(data);
    };
  }

  return undefined;
}

function compileBigIntMultipleOf(schemaObj, jsonSchema) {
  const mulOf = getBigIntType(jsonSchema.multipleOf);
  if (mulOf == null) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'multipleOf',
    mulOf,
    compileBigIntMultipleOf);
  if (addError == null) return undefined;

  return function multipleOf(data) {
    return data % mulOf === BigInt(0) || addError(data);
  };
}

export function compileBigIntBasic(schemaObj, jsonSchema) {
  const maximum = compileBigIntMaximum(schemaObj, jsonSchema);
  const minimum = compileBigIntMinimum(schemaObj, jsonSchema);
  const multipleOf = compileBigIntMultipleOf(schemaObj, jsonSchema);
  if (maximum == null && minimum == null && multipleOf == null) return undefined;

  const isMax = maximum || trueThat;
  const isMin = minimum || trueThat;
  const isMul = multipleOf || trueThat;

  return function validateBigIntSchema(data) {
    if (isBigIntType(data)) {
      return isMax(data)
        && isMin(data)
        && isMul(data);
    }
    return true;
  };
}
