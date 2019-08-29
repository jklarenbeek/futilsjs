import {
  getBooleanishType,
  getStrictString,
} from '../types/getDataType';

import {
  getBoolOrArray,
  getArrayUnique,
} from '../types/getDataTypeExtra';

import {
  createIsStrictDataType,
} from '../types/createIsDataType';

function compileStringType(schemaObj, jsonSchema) {
  const type = getStrictString(jsonSchema.type);
  if (type == null) return undefined;

  const isDataType = createIsStrictDataType(type);
  if (!isDataType) return undefined;

  const addError = schemaObj.createMemberError('type', type, compileStringType);
  if (!addError) return undefined;

  return function validateTypeSimple(data) {
    return isDataType(data) ? true : addError(data);
  };
}

function compileArrayType(schemaObj, jsonSchema) {
  const type = getArrayUnique(jsonSchema.type);
  if (type == null) return undefined;

  // collect all testable data types
  const types = [];
  const names = [];
  for (let i = 0; i < type.length; ++i) {
    const tp = type[i];
    const cb = createIsStrictDataType(tp);
    if (cb) {
      types.push(cb);
      names.push(tp);
    }
  }

  // if non has been found exit
  if (names.length === 0) return undefined;

  // if one has been found create a validator
  if (names.length === 1) {
    const addError = schemaObj.createMemberError('type', names[0], compileArrayType);
    if (!addError) return undefined;
    const dt1 = types[0];
    return function validateArrayOfTypeOne(data) {
      return dt1(data) ? true : addError(data);
    };
  }
  else if (names.length === 2) {
    const addError = schemaObj.createMemberError('type,', names, compileArrayType);
    if (!addError) return undefined;
    const dt1 = types[0];
    const dt2 = types[1];
    return function validateArrayOfTypeTwo(data) {
      return dt1(data) || dt2(data) ? true : addError(data);
    };
  }
  else if (names.length === 3) {
    const addError = schemaObj.createMemberError('type,', names, compileArrayType);
    if (!addError) return undefined;
    const dt1 = types[0];
    const dt2 = types[1];
    const dt3 = types[2];
    return function validateArrayOfTypeThree(data) {
      return dt1(data) || dt2(data) || dt3(data) ? true : addError(data);
    };
  }
  else {
    const addError = schemaObj.createMemberError('type', names, compileArrayType);
    if (!addError) return undefined;
    return function validateArrayOfTypeAll(data) {
      for (let i = 0; i < types.length; ++i) {
        if (types[i](data) === true) return true;
      }
      return addError(data);
    };
  }
}

export function compileTypeBasic(schemaObj, jsonSchema) {
  const fnType = compileStringType(schemaObj, jsonSchema)
    || compileArrayType(schemaObj, jsonSchema);
  const required = getBoolOrArray(jsonSchema.required, false);
  const nullable = getBooleanishType(jsonSchema.nullable);

  if (required === false) {
    if (fnType) {
      return function validateTypeBasic(data) {
        if (data === undefined) return true;
        return fnType(data);
      };
    }
    return undefined;
  }
  else if (fnType) {
    const addError = schemaObj.createMemberError('required', required, compileTypeBasic);
    if (!addError) return undefined;
    return function validateRequiredType(data) {
      if (data === undefined) return addError(data);
      return fnType(data);
    };
  }
  else if (nullable === false) {
    const addError = schemaObj.createMemberError(['nullable', 'required'], [nullable, required], compileTypeBasic);
    return function validateRequiredNonNullableData(data) {
      if (data === undefined) return addError('required', data);
      if (data === null) return addError('nullable', data);
      return true;
    };
  }
  else {
    const addError = schemaObj.createMemberError('required', required, compileTypeBasic);
    return function validateRequiredNullableData(data) {
      return data !== undefined ? true : addError(data);
    };
  }
}
