import {
  getStringOrArray,
  getPureBool,
  getBoolOrArray,
} from '../types-base';

import {
  isStrictStringType,
  isStrictArrayType,
} from './isDataType';

import { createIsStrictDataType } from './createIsStrictDataType';

// TODO: rename to createIsSchemaDataType
function compileType(schema, addMember) {
  const type = getStringOrArray(schema.type);
  const nullable = getPureBool(schema.nullable);

  if (isStrictStringType(type)) {
    const isStrictDataType = createIsStrictDataType(type);
    if (isStrictDataType) {
      const addError = addMember('type', type, compileType, 'string');
      if (nullable != null) addMember('nullable', nullable, compileType, 'string');

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
      const addError = addMember('type', type, compileType, 'array');
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
    const addError = addMember('nullable', nullable, compileType);
    return function validateNotNullable(data) {
      return data == null
        ? addError(data)
        : true;
    };
  }

  return undefined;
}

function compileRequired(schema, addMember) {
  const required = getBoolOrArray(schema.required);
  if (required === true) {
    const addError = addMember('required', true, compileRequired, 'bool');
    return function validateRequiredTrue(data) {
      if (data === undefined) return addError(data);
      if (data === null && typeof data !== 'object') return addError(data);
      return true;
    };
  }
  if (required != null) {
    const addError = addMember('required', true, compileRequired, 'array');
    return function validateRequired(data) {
      if (data == null) return addError(data);
      return true;
    };
  }
  return undefined;
}

export function compileTypeBasic(schema, addMember) {
  const fnType = compileType(schema, addMember);
  const fnRequired = compileRequired(schema, addMember);
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
