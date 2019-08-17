import {
  isStrictBooleanType,
  isStrictIntegerType,
  isStrictBigIntType,
  isStrictNumberType,
  isStrictStringType,
  isStrictArrayType,
  isArrayishType,
  isStrictObjectType,
  isObjectishType,
  isStrictObjectOfType,
} from './isDataType';

import {
  isFn,
} from './isFunctionType';

export function createIsStrictDataType(type, format, isstrict = false) {
  if (type === 'object') {
    return isstrict
      ? isStrictObjectType
      : isObjectishType;
  }
  else if (type === 'array') {
    return isstrict
      ? isStrictArrayType
      : isArrayishType;
  }
  else if (type === 'set') {
    return createIsStrictObjectOfType(Set);
  }
  else if (type === 'map') {
    return createIsStrictObjectOfType(Map);
  }
  else if (type === 'tuple') {
    return isStrictArrayType;
  }
  else {
    switch (type) {
      case 'boolean': return isStrictBooleanType;
      case 'integer': return isStrictIntegerType;
      case 'bigint': return isStrictBigIntType;
      case 'number': return isStrictNumberType;
      case 'string': return isStrictStringType;
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
