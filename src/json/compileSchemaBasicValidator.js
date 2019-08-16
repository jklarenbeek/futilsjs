import {
  getStringOrArray,
  getPureBool,
  getBoolOrArray,
} from '../types-base';

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

// TODO: rename to createIsSchemaDataType
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

function compileValidateType(schema, addMember) {
  const type = getStringOrArray(schema.type);
  const nullable = getPureBool(schema.nullable);

  if (isStrictStringType(type)) {
    const isStrictDataType = createIsStrictDataType(type);
    if (isStrictDataType) {
      const addError = addMember('type', type, compileValidateType, 'string');
      if (nullable != null) addMember('nullable', nullable, compileValidateType, 'string');

      if (nullable === true) {
        return function validateNullableType(data) {
          const valid = data == null ? true : isStrictDataType(data);
          if (valid) return true;
          return addError(data);
        };
      }
      else {
        return isStrictDataType;
      }
    }
  }
  else if (isStrictArrayType(type)) {
    const types = [];
    let isnullable = nullable || false;
    for (let i = 0; i < type.length; ++i) {
      if (type === 'null') { isnullable = true; continue; }
      const cb = createIsStrictDataType(type[i]);
      if (cb) types.push(cb);
    }
    if (types.length > 0) {
      const addError = addMember('type', type, compileValidateType, 'array');
      if (isnullable === true) {
        return function validateNullableTypes(data) {
          if (data == null) return true;
          for (let i = 0; i < types.length; ++i) {
            if (types[i](data) === true) return true;
          }
          return addError(data);
        };
      }
      else {
        return function validateNotNullableTypes(data) {
          for (let i = 0; i < types.length; ++i) {
            if (types[i](data) === true) return true;
          }
          return addError(data);
        };
      }
    }
  }
  else if (nullable === false) {
    const addError = addMember('nullable', nullable, compileValidateType);
    return function validateNotNullable(data) {
      return data == null
        ? addError(data)
        : true;
    };
  }

  return undefined;
}

function compileValidateRequired(schema, addMember) {
  const required = getBoolOrArray(schema.required);
  if (required === true) {
    const addError = addMember('required', true, compileValidateRequired, 'bool');
    return function validateRequiredTrue(data) {
      if (data === undefined) return addError(data);
      if (data === null && typeof data !== 'object') return addError(data);
      return true;
    };
  }
  if (required != null) {
    const addError = addMember('required', true, compileValidateRequired, 'array');
    return function validateRequired(data) {
      if (data == null) return addError(data);
      return true;
    };
  }
  return undefined;
}

export function compileSchemaBasicValidator(schema, addMember) {
  const fnType = compileValidateType(schema, addMember);
  const fnRequired = compileValidateRequired(schema, addMember);
  if (fnType && fnRequired) {
    return function validateSchemaBasic(data) {
      return fnType(data) && fnRequired(data);
    };
  }
  else if (fnType) {
    return fnType;
  }
  else if (fnRequired) {
    return fnRequired;
  }
  return undefined;
}

export default compileSchemaBasicValidator;
