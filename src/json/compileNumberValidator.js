/* eslint-disable valid-typeof */
import {
  isStrictBigIntType,
} from '../types/isDataType';

import {
  isNumberType,
} from '../types/core';

import {
  getNumberishType,
} from '../types/getDataType';

function getNumberExclusiveBound(inclusive, exclusive) {
  const includes = isStrictBigIntType(inclusive)
    ? inclusive
    : getNumberishType(inclusive);
  const excludes = exclusive === true
    ? includes
    : isStrictBigIntType(exclusive)
      ? exclusive
      : getNumberishType(exclusive);
  return (excludes !== undefined)
    ? [undefined, excludes]
    : [includes, undefined];
}

function compileNumberMaximum(schemaObj, jsonSchema) {
  const [max, emax] = getNumberExclusiveBound(
    jsonSchema.maximum,
    jsonSchema.exclusiveMaximum,
  );

  if (emax != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'exclusiveMaximum',
      emax,
      compileNumberMaximum,
    );
    if (isStrictBigIntType(emax)) {
      return function exclusiveMaximumBigInt(data) {
        return (isStrictBigIntType(data) || isNumberType(data)) // are we forgiving?
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
      compileNumberMaximum,
    );
    if (isStrictBigIntType(max)) {
      return function maximumBigInt(data) {
        return (isStrictBigIntType(data) || isNumberType(data)) // are we that forgiving?
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
      compileNumberMinimum,
    );
    if (isStrictBigIntType(emin)) {
      return function exclusiveMinimumBigInt(data) {
        return (isStrictBigIntType(data) || isNumberType(data))
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
      compileNumberMinimum,
    );
    if (isStrictBigIntType(min)) {
      return function minimumBigInt(data) {
        return (isStrictBigIntType(data) || isNumberType(data))
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
  const mulOf = isStrictBigIntType(jsonSchema.multipleOf)
    ? jsonSchema.multipleOf
    : getNumberishType(jsonSchema.multipleOf);

  if (mulOf == null) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'multipleOf',
    mulOf,
    compileNumberMultipleOf,
  );
  if (addError == null) return undefined;

  if (isStrictBigIntType(mulOf)) {
    return function multipleOfBigInt(data) {
      return isStrictBigIntType(data)
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
