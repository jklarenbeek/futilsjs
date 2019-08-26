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

export function compileTypeBasic(schemaObj, jsonSchema) {
  const required = getBoolOrArray(jsonSchema.required, false);
  const fnType = compileType(schemaObj, jsonSchema);
  if (required === false) {
    if (fnType) {
      return function validateTypeBasic(data) {
        if (data === undefined) return true;
        return fnType(data);
      };
    }
  }
  else if (fnType) {
    const addError = schemaObj.createMemberError('required', required, compileTypeBasic);
    return function validateRequiredType(data) {
      if (data === undefined) return addError(data);
      return fnType(data);
    };
  }
  else {
    const addError = schemaObj.createMemberError('required', required, compileTypeBasic);
    return function validateRequiredData(data) {
      if (data === undefined) return addError(data);
      return true;
    };
  }

  return undefined;
}
