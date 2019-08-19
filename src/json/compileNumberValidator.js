import {
  getNumberishType,
} from '../types/getDataType';

import {
  isIntegerSchema,
  isBigIntSchema,
} from './isSchemaType';


function compileNumberRange(schema, addMember) {
  const min = Number(schema.minimum) || undefined;
  const emin = schema.exclusiveMinimum === true
    ? min
    : Number(schema.exclusiveMinimum) || undefined;

  const max = Number(schema.maximum) || undefined;
  const emax = schema.exclusiveMaximum === true
    ? max
    : Number(schema.exclusiveMaximum) || undefined;

  const isDataType = isBigIntSchema(schema)
    ? function compileNumberRange_isBigIntType(data) {
      // eslint-disable-next-line valid-typeof
      return typeof data === 'bigint';
    }
    : isIntegerSchema(schema)
      ? function compileNumberRange_isIntegerType(data) {
        return Number.isInteger(data);
      }
      : function compileNumberRange_isNumberType(data) {
        return typeof data === 'number';
      };

  if (emin && emax) {
    const addError = addMember(['exclusiveMinimum', 'exclusiveMaximum'], [emin, emax], compileNumberRange);
    return function betweenExclusive(data) {
      if (isDataType(data)) {
        const valid = data > emin && data < emax;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (emin && max) {
    const addError = addMember(['exclusiveMinimum', 'maximum'], [emin, max], compileNumberRange);
    return function betweenexclusiveMinimum(data) {
      if (isDataType(data)) {
        const valid = data > emin && data <= max;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (emax && min) {
    const addError = addMember(['minimum', 'exclusiveMaximum'], [min, emax], compileNumberRange);
    return function betweenexclusiveMaximum(data) {
      if (isDataType(data)) {
        const valid = data >= min && data < emax;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (min && max) {
    const addError = addMember(['minimum', 'maximum'], [min, max], compileNumberRange);
    return function between(data) {
      if (isDataType(data)) {
        const valid = data >= min && data <= max;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (emax) {
    const addError = addMember('exclusiveMaximum', emax, compileNumberRange);
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
    const addError = addMember('maximum', max, compileNumberRange);
    return function maximum(data) {
      if (isDataType(data)) {
        const valid = data <= max;
        if (!valid) addError(data);
        return valid;
      }
      return true;
    };
  }
  else if (emin) {
    const addError = addMember('exclusiveMinimum', emin, compileNumberRange);
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
    const addError = addMember('minimum', min, compileNumberRange);
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
            const valid = Number.isInteger(Number(data) / mulOf);
            if (!valid) addError(data);
            return valid;
          }
          return true;
        };
      }
    }
    if (isBigIntSchema(schema)) {
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
      return function multipleOf(data) {
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
