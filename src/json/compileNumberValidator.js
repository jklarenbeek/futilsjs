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

function compileNumberMaximum(schema, addMember) {
  const max = Number(schema.maximum) || undefined;
  const emax = schema.exclusiveMaximum === true
    ? max
    : Number(schema.exclusiveMaximum) || undefined;

  const isDataType = isBigIntSchema(schema)
    ? isStrictBigIntType
    : isIntegerSchema(schema)
      ? isStrictIntegerType
      : isStrictNumberType;

  if (emax) {
    const addError = addMember('exclusiveMaximum', emax, compileNumberMaximum);
    return function exclusiveMaximum(data) {
      if (isDataType(data)) {
        const valid = data < emax;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (max) {
    const addError = addMember('maximum', max, compileNumberMaximum);
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

function compileNumberMinimum(schema, addMember) {
  const min = Number(schema.minimum) || undefined;
  const emin = schema.exclusiveMinimum === true
    ? min
    : Number(schema.exclusiveMinimum) || undefined;

  const isDataType = isBigIntSchema(schema)
    ? isStrictBigIntType
    : isIntegerSchema(schema)
      ? isStrictIntegerType
      : isStrictNumberType;

  if (emin) {
    const addError = addMember('exclusiveMinimum', emin, compileNumberMinimum);
    return function exclusiveMinimum(data) {
      if (isDataType(data)) {
        const valid = data > emin;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (min) {
    const addError = addMember('minimum', min, compileNumberMinimum);
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

function compileNumberRange(schema, addMember) {
  const fnMin = compileNumberMinimum(schema, addMember);
  const fnMax = compileNumberMaximum(schema, addMember);
  if (fnMin && fnMax) {
    return function numberRange(data, dataRoot) {
      return fnMin(data, dataRoot) && fnMin(data, dataRoot);
    };
  }
  else if (fnMin != null)
    return fnMin;
  else if (fnMax != null)
    return fnMax;
  return undefined;
}

function compileNumberMultipleOf(schema, addMember) {
  const mulOf = getNumberishType(schema.multipleOf);
  // we compare against bigint too! javascript is awesome!
  // eslint-disable-next-line eqeqeq
  if (mulOf && mulOf != 0) {
    if (Number.isInteger(mulOf)) {
      const addError = addMember('multipleOf', mulOf, compileNumberMultipleOf, 'integer');
      if (isIntegerSchema(schema)) {
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
    else if (isBigIntSchema(schema)) {
      const mf = BigInt(mulOf);
      const addError = addMember('multipleOf', mf, compileNumberMultipleOf, 'bigint');
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
      const addError = addMember('multipleOf', mulOf, compileNumberMultipleOf, 'number');
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

export function compileNumberBasic(schema, addMember) {
  const fnRange = compileNumberRange(schema, addMember);
  const fnMulOf = compileNumberMultipleOf(schema, addMember);
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
