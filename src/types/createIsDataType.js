import {
  isStrictBooleanType,
  isStrictBigIntType,
  isStrictNumberType,
  isStrictNullValue,
  isStrictObjectType,
  isStrictObjectOfType,
  isArrayishType,
} from './isDataType';

import {
  isFn,
  isIntegerType,
  isStringType,
  isArrayType,
  isObjectType,
} from './core';

export function createIsStrictDataType(type, format, isstrict = false) {
  if (type === 'object') {
    return isstrict
      ? isStrictObjectType
      : isObjectType;
  }
  else if (type === 'array') {
    return isstrict
      ? isArrayType
      : isArrayishType;
  }
  else if (type === 'set') {
    return createIsStrictObjectOfType(Set);
  }
  else if (type === 'map') {
    return createIsStrictObjectOfType(Map);
  }
  else if (type === 'tuple') {
    return isArrayType;
  }
  else if (type === 'regex') {
    return createIsStrictObjectOfType(RegExp);
  }
  else {
    switch (type) {
      case 'null': return isStrictNullValue;
      case 'boolean': return isStrictBooleanType;
      case 'integer': return isIntegerType;
      case 'bigint': return isStrictBigIntType;
      case 'number': return isStrictNumberType;
      case 'string': return isStringType;
      default: break;
    }
  }
  return undefined;
}

export function createIsStrictObjectOfType(fn) {
  // eslint-disable-next-line no-undef-init
  let usefull = undefined;
  if (isFn(fn)) {
    usefull = function isStrictObjectOfTypeFn(data) {
      return isStrictObjectOfType(data, fn);
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
