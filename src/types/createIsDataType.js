import {
  isArrayishType,
} from './isDataType';

import {
  isFn,
  isNullValue,
  isObjectOfType,
  isBooleanType,
  isNumberType,
  isIntegerType,
  isBigIntType,
  isStringType,
  isArrayType,
  isObjectType,
  isObjectTyped,
  isSetType,
  isMapType,
  isRegExpType,
} from './core';

export function createIsStrictDataType(type, format, isstrict = false) {
  if (type === 'object') {
    return isstrict
      ? isObjectTyped
      : isObjectType;
  }
  else if (type === 'array') {
    return isstrict
      ? isArrayType
      : isArrayishType;
  }
  else if (type === 'set') {
    return isSetType;
  }
  else if (type === 'map') {
    return isMapType;
  }
  else if (type === 'tuple') {
    return isArrayType;
  }
  else if (type === 'regex') {
    return isRegExpType;
  }
  else {
    switch (type) {
      case 'null': return isNullValue;
      case 'boolean': return isBooleanType;
      case 'integer': return isIntegerType;
      case 'bigint': return isBigIntType;
      case 'number': return isNumberType;
      case 'string': return isStringType;
      default: break;
    }
  }
  return undefined;
}

export function createisObjectOfType(fn) {
  // eslint-disable-next-line no-undef-init
  let usefull = undefined;
  if (isFn(fn)) {
    usefull = function isObjectOfTypeFn(data) {
      return isObjectOfType(data, fn);
    };
  }
  else if (fn instanceof Array) {
    const types = [];
    for (let i = 0; i < fn.length; ++i) {
      const type = fn[i];
      const tn = typeof type;
      if (tn === 'string') {
        types.push('data.constructor===' + type);
      }
      else if (tn === 'function') {
        types.push('data.constructor===' + type.name);
      }
    }
    if (types > 0) {
      // eslint-disable-next-line no-new-func
      usefull = new Function(
        'data',
        'return data!=null && (' + types.join('||') + ')',
      );
    }
  }
  else if (typeof fn === 'string') {
    // eslint-disable-next-line no-new-func
    usefull = new Function(
      'data',
      'return data!=null && data.constructor===' + fn,
    );
  }
  return usefull;
}
