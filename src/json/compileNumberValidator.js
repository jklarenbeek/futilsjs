/* eslint-disable valid-typeof */
import {
  isStrictBigIntType,
  isStrictNumberType,
} from '../types/isDataType';

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
    const addError = schemaObj.createMemberError(
      'exclusiveMaximum',
      emax,
      compileNumberMaximum,
    );
    if (isStrictBigIntType(emax)) {
      return function exclusiveMaximumBigInt(data) {
        return (isStrictBigIntType(data) || isStrictNumberType(data)) // are we forgiving?
          ? data < emax ? true : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function exclusiveMaximum(data) {
        return isStrictNumberType(data)
          ? data < emax ? true : addError(data)
          : true; // other type, ignore
      };
    }
  }
  else if (max != null) {
    const addError = schemaObj.createMemberError(
      'maximum',
      max,
      compileNumberMaximum,
    );
    if (isStrictBigIntType(max)) {
      return function maximumBigInt(data) {
        return (isStrictBigIntType(data) || isStrictNumberType(data)) // are we that forgiving?
          ? data <= max ? true : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function maximum(data) {
        return isStrictNumberType(data)
          ? data <= max ? true : addError(data)
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
    const addError = schemaObj.createMemberError(
      'exclusiveMinimum',
      emin,
      compileNumberMinimum,
    );
    if (isStrictBigIntType(emin)) {
      return function exclusiveMinimumBigInt(data) {
        return (isStrictBigIntType(data) || isStrictNumberType(data))
          ? data > emin ? true : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function exclusiveMinimum(data) {
        return isStrictNumberType(data)
          ? data > emin ? true : addError(data)
          : true; // other type, ignore
      };
    }
  }
  else if (min != null) {
    const addError = schemaObj.createMemberError(
      'minimum',
      min,
      compileNumberMinimum,
    );
    if (isStrictBigIntType(min)) {
      return function minimumBigInt(data) {
        return (isStrictBigIntType(data) || isStrictNumberType(data))
          ? data >= min ? true : addError(data)
          : true; // other type, ignore
      };
    }
    else {
      return function minimum(data) {
        return isStrictNumberType(data)
          ? data >= min ? true : addError(data)
          : true; // other type, ignore
      };
    }
  }
  return undefined;
}

function compileNumberRange(schemaObj, jsonSchema) {
  const fnMin = compileNumberMinimum(schemaObj, jsonSchema);
  const fnMax = compileNumberMaximum(schemaObj, jsonSchema);
  if (fnMin && fnMax) {
    return function numberRange(data, dataRoot) {
      return fnMin(data, dataRoot) && fnMax(data, dataRoot);
    };
  }
  else if (fnMin != null)
    return fnMin;
  else if (fnMax != null)
    return fnMax;
  return undefined;
}

function compileNumberMultipleOf(schemaObj, jsonSchema) {
  const mulOf = isStrictBigIntType(jsonSchema.multipleOf)
    ? jsonSchema.multipleOf
    : getNumberishType(jsonSchema.multipleOf);

  if (mulOf == null) return undefined;

  const addError = schemaObj.createMemberError(
    'multipleOf',
    mulOf,
    compileNumberMultipleOf,
  );
  if (addError == null) return undefined;

  if (isStrictBigIntType(mulOf)) {
    return function multipleOfBigInt(data) {
      if (isStrictBigIntType(data)) {
        return data % mulOf === BigInt(0)
          ? true
          : addError(data);
      }
      if (isStrictNumberType(data)) {
        return data % Number(mulOf) === 0
          ? true
          : addError(data);
      }
      return true;
    };
  }
  else {
    return function multipleOf(data) {
      if (isStrictNumberType(data)) {
        return data % mulOf === 0
          ? true
          : addError(data);
      }
      return true;
    };
  }
}

export function compileNumberBasic(schemaObj, jsonSchema) {
  const fnRange = compileNumberRange(schemaObj, jsonSchema);
  const fnMulOf = compileNumberMultipleOf(schemaObj, jsonSchema);
  if (fnRange && fnMulOf) {
    return function validateNumberBasic(data) {
      return fnRange(data) && fnMulOf(data);
    };
  }
  return fnRange || fnMulOf;
}
