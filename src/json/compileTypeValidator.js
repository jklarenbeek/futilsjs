import {
  getBooleanishType,
} from '../types/getDataType';

import {
  getBoolOrArray,
  getStringOrArray,
} from '../types/getDataTypeExtra';

import {
  isStrictStringType,
  isStrictArrayType,
} from '../types/isDataType';

import {
  createIsStrictDataType,
} from '../types/createIsDataType';

function compileType(schemaObj, jsonSchema) {
  const type = getStringOrArray(jsonSchema.type);
  const nullable = getBooleanishType(jsonSchema.nullable);

  if (isStrictStringType(type)) {
    const isStrictDataType = createIsStrictDataType(type);
    if (isStrictDataType) {
      const addError = schemaObj.createMemberError('type', type, compileType, 'string');
      if (nullable != null) schemaObj.createMemberError('nullable', nullable, compileType, 'string');

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
      const tp = type[i];
      if (tp === 'null') { isnullable = true; continue; }
      const cb = createIsStrictDataType(tp);
      if (cb) types.push(cb);
    }
    if (types.length > 0) {
      const addError = schemaObj.createMemberError('type', type, compileType, 'array');
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
    const addError = schemaObj.createMemberError('nullable', nullable, compileType);
    return function validateNotNullable(data) {
      return data == null
        ? addError(data)
        : true;
    };
  }

  return undefined;
}

function compileRequired(schemaObj, jsonSchema) {
  const required = getBoolOrArray(jsonSchema.required);
  if (required === true) {
    const addError = schemaObj.createMemberError('required', true, compileRequired, 'bool');
    return function validateRequiredTrue(data) {
      if (data === undefined) return addError(data);
      if (data === null && typeof data !== 'object') return addError(data);
      return true;
    };
  }
  if (required != null) {
    const addError = schemaObj.createMemberError('required', true, compileRequired, 'array');
    return function validateRequired(data) {
      if (data == null) return addError(data);
      return true;
    };
  }
  return undefined;
}

export function compileTypeBasic(schemaObj, jsonSchema) {
  const fnType = compileType(schemaObj, jsonSchema);
  const fnRequired = compileRequired(schemaObj, jsonSchema);
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
