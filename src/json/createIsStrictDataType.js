import {
  createIsStrictObjectOfType,
  isStrictBooleanType,
  isStrictIntegerType,
  isStrictBigIntType,
  isStrictNumberType,
  isStrictStringType,
  isStrictArrayType,
  isArrayishType,
  isStrictObjectType,
  isObjectishType,
} from '../json-schema-types';

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

export default createIsStrictDataType;
