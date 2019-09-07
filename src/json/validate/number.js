/* eslint-disable function-paren-newline */
/* eslint-disable valid-typeof */
import {
  isNumberType,
  isBigIntType,
} from '../../types/core';

import {
  getNumbishType,
  getNumberExclusiveBound,
} from '../../types/getters';

function compileNumberMaximum(schemaObj, jsonSchema) {
  const [max, emax] = getNumberExclusiveBound(
    jsonSchema.maximum,
    jsonSchema.exclusiveMaximum,
  );

  if (emax != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'exclusiveMaximum',
      emax,
      compileNumberMaximum);
    if (addError == null) return undefined;

    if (isBigIntType(emax)) {
      return function exclusiveMaximumBigInt(data) {
        return (isBigIntType(data) || isNumberType(data)) // are we forgiving?
          ? data < emax
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function exclusiveMaximum(data) {
        return isNumberType(data)
          ? data < emax
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
  }
  else if (max != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'maximum',
      max,
      compileNumberMaximum);
    if (addError == null) return undefined;

    if (isBigIntType(max)) {
      return function maximumBigInt(data) {
        return (isBigIntType(data) || isNumberType(data)) // are we that forgiving?
          ? data <= max
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function maximum(data) {
        return isNumberType(data)
          ? data <= max
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
  }
  return undefined;
}

function compileNumberMinimum(schemaObj, jsonSchema) {
  const [min, emin] = getNumberExclusiveBound(
    jsonSchema.minimum,
    jsonSchema.exclusiveMinimum,
  );

  if (emin != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'exclusiveMinimum',
      emin,
      compileNumberMinimum);
    if (addError == null) return undefined;

    if (isBigIntType(emin)) {
      return function exclusiveMinimumBigInt(data) {
        return (isBigIntType(data) || isNumberType(data))
          ? data > emin
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function exclusiveMinimum(data) {
        return isNumberType(data)
          ? data > emin
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
  }
  else if (min != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'minimum',
      min,
      compileNumberMinimum);
    if (addError == null) return undefined;

    if (isBigIntType(min)) {
      return function minimumBigInt(data) {
        return (isBigIntType(data) || isNumberType(data))
          ? data >= min
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function minimum(data) {
        return isNumberType(data)
          ? data >= min
            ? true
            : addError(data)
          : true; // other type, ignore
      };
    }
  }
  return undefined;
}

function compileNumberMultipleOf(schemaObj, jsonSchema) {
  const mulOf = isBigIntType(jsonSchema.multipleOf)
    ? jsonSchema.multipleOf
    : getNumbishType(jsonSchema.multipleOf);

  if (mulOf == null) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'multipleOf',
    mulOf,
    compileNumberMultipleOf);
  if (addError == null) return undefined;

  if (isBigIntType(mulOf)) {
    return function multipleOfBigInt(data) {
      return isBigIntType(data)
        ? data % mulOf === BigInt(0)
          ? true
          : addError(data)
        : isNumberType(data)
          ? data % Number(mulOf) === 0
            ? true
            : addError(data)
          : true;
    };
  }
  else {
    return function multipleOf(data) {
      return isNumberType(data)
        ? data % mulOf === 0
          ? true
          : addError(data)
        : true;
    };
  }
}

export function compileNumberBasic(schemaObj, jsonSchema) {
  return [
    compileNumberMinimum(schemaObj, jsonSchema),
    compileNumberMaximum(schemaObj, jsonSchema),
    compileNumberMultipleOf(schemaObj, jsonSchema),
  ];
}
