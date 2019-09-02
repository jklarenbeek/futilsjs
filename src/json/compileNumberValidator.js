/* eslint-disable valid-typeof */
import {
  isStrictBigIntType,
  isStrictIntegerType,
  isStrictNumberType,
} from '../types/isDataType';

import {
  getNumberishType,
} from '../types/getDataType';

import {
  isIntegerSchema,
  isBigIntSchema,
} from './isSchemaType';

function getBigIntExclusiveBound(inclusive, exclusive) {
  const includes = typeof inclusive === 'bigint'
    ? inclusive
    : Number.isNaN(Number(inclusive))
      ? undefined
      : BigInt(Number(inclusive));
  const excludes = exclusive === true
    ? includes
    : typeof exclusive === 'bigint'
      ? exclusive
      : Number.isNaN(Number(exclusive))
        ? undefined
        : BigInt(Number(exclusive));
  return excludes;
}

function getNumberExclusiveBound(inclusive, exclusive) {
  const includes = Number.isNaN(Number(inclusive))
    ? undefined
    : Number(inclusive);
  const excludes = exclusive === true
    ? includes
    : Number.isNaN(Number(exclusive))
      ? undefined
      : Number(exclusive);
  return excludes;
}

function compileNumberMaximum(schemaObj, jsonSchema) {
  const max = getNumberishType(jsonSchema.maximum) || undefined;
  const emax = getNumberExclusiveBound(max, jsonSchema.exclusiveMaximum);

  const isDataType = isBigIntSchema(jsonSchema)
    ? isStrictBigIntType
    : isIntegerSchema(jsonSchema)
      ? isStrictIntegerType
      : isStrictNumberType;

  if (emax != null) {
    const addError = schemaObj.createMemberError(
      'exclusiveMaximum',
      emax,
      compileNumberMaximum,
    );
    return function exclusiveMaximum(data) {
      if (isDataType(data)) {
        const valid = data < emax;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (max != null) {
    const addError = schemaObj.createMemberError(
      'maximum',
      max,
      compileNumberMaximum,
    );
    return function maximum(data) {
      if (isDataType(data)) {
        const valid = data <= max;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  return undefined;
}

function compileNumberMinimum(schemaObj, jsonSchema) {
  const min = getNumberishType(jsonSchema.minimum); // BUG: IGNORING BITINT TYPE!
  const emin = getNumberExclusiveBound(min, jsonSchema.exclusiveMinimum);

  const isDataType = isBigIntSchema(jsonSchema)
    ? isStrictBigIntType
    : isIntegerSchema(jsonSchema)
      ? isStrictIntegerType
      : isStrictNumberType;
  if (!isDataType) return undefined;

  if (emin != null) {
    const addError = schemaObj.createMemberError(
      'exclusiveMinimum',
      emin,
      compileNumberMinimum,
    );
    return function exclusiveMinimum(data) {
      if (isDataType(data)) {
        const valid = data > emin;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (min != null) {
    const addError = schemaObj.createMemberError(
      'minimum',
      min,
      compileNumberMinimum,
    );
    return function minimum(data) {
      if (isDataType(data)) {
        const valid = data >= min;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
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
  const mulOf = getNumberishType(jsonSchema.multipleOf);
  // we compare against bigint too! javascript is awesome!
  // eslint-disable-next-line eqeqeq
  if (mulOf && mulOf != 0) {
    if (Number.isInteger(mulOf)) {
      const addError = schemaObj.createMemberError(
        'multipleOf',
        mulOf,
        compileNumberMultipleOf,
        'integer',
      );
      if (isIntegerSchema(jsonSchema)) {
        return function multipleOfInteger(data) {
          if (Number.isInteger(data)) {
            const valid = (data % mulOf) === 0;
            if (!valid) addError(data);
            return valid;
          }
          return true;
        };
      }
      else {
        return function multipleOfIntAsNumber(data) {
          if (typeof data === 'number') {
            const valid = Number.isInteger(data / mulOf);
            if (!valid) addError(data);
            return valid;
          }
          return true;
        };
      }
    }
    else if (isBigIntSchema(jsonSchema)) {
      const mf = BigInt(mulOf);
      const addError = schemaObj.createMemberError(
        'multipleOf',
        mf,
        compileNumberMultipleOf,
        'bigint',
      );
      return function multipleOfBigInt(data) {
        // eslint-disable-next-line valid-typeof
        if (typeof data === 'bigint') {
          // we compare against bigint too! javascript is awesome!
          // eslint-disable-next-line eqeqeq
          const valid = (data % mf) == 0;
          if (!valid) addError(data);
          return valid;
        }
        return true;
      };
    }
    else {
      const addError = schemaObj.createMemberError(
        'multipleOf',
        mulOf,
        compileNumberMultipleOf,
        'number',
      );
      return function multipleOfNumber(data) {
        if (typeof data === 'number') {
          const valid = Number.isInteger(Number(data) / mulOf);
          if (!valid) addError(data);
          return valid;
        }
        return true;
      };
    }
  }
  return undefined;
}

export function compileNumberBasic(schemaObj, jsonSchema) {
  const fnRange = compileNumberRange(schemaObj, jsonSchema);
  const fnMulOf = compileNumberMultipleOf(schemaObj, jsonSchema);
  if (fnRange && fnMulOf) {
    return function validateNumberBasic(data) {
      return fnRange(data) && fnMulOf(data);
    };
  }
  else if (fnRange) {
    return fnRange;
  }
  else if (fnMulOf) {
    return fnMulOf;
  }
  return undefined;
}
