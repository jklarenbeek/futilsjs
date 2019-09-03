/* eslint-disable function-paren-newline */
import {
  falseThat,
  trueThat,
  addFunctionToArray,
} from '../types/isFunctionType';

import {
  isStrictObjectType,
} from '../types/isDataType';

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

import { compileFormatBasic } from './compileFormatValidator';
import { compileEnumBasic } from './compileEnumValidator';
import { compileNumberBasic } from './compileNumberValidator';
import { compileStringBasic } from './compileStringValidator';
import { compileObjectBasic, compileObjectChildren } from './compileObjectValidator';
import { compileArrayBasic, compileArrayChildren } from './compileArrayValidator';
import { compileCombineSchema } from './compileCombineValidator';
import { compileConditionSchema } from './compileConditionValidator';

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

function compileTypeBasic(schemaObj, jsonSchema) {
  const fnType = compileStringType(schemaObj, jsonSchema)
    || compileArrayType(schemaObj, jsonSchema);

  const required = getBoolOrArray(jsonSchema.required, false);
  const nullable = getBooleanishType(jsonSchema.nullable);

  const addRequiredError = required !== false
    ? schemaObj.createMemberError(
      'required',
      true,
      compileTypeBasic)
    : undefined;

  const addNullableError = nullable != null
    ? schemaObj.createMemberError(
      'nullable',
      nullable,
      compileTypeBasic)
    : undefined;

  if (addRequiredError == null) {
    if (fnType) {
      if (addNullableError != null) {
        return function validateTypeNullable(data) {
          if (data === undefined) return true;
          if (data === null) return nullable
            ? true
            : addNullableError(data);
          return fnType(data);
        };
      }

      return function validateTypeBasic(data) {
        if (data === undefined) return true;
        return fnType(data);
      };
    }

    if (addNullableError != null) {
      return function validateNotNullable(data) {
        if (data === null) return nullable
          ? true
          : addNullableError(data);
        return true;
      };
    }

    return undefined;
  }

  if (fnType) {
    if (addNullableError != null) {
      return function validateRequiredTypeNullable(data) {
        if (data === undefined) return addRequiredError(data);
        if (data === null) return nullable
          ? true
          : addNullableError(data);
        return fnType(data);
      };
    }

    return function validateRequiredType(data) {
      if (data === undefined) return addRequiredError(data);
      return fnType(data);
    };
  }

  if (addNullableError != null) {
    return function validateRequiredNonNullableData(data) {
      if (data === undefined) return addRequiredError(data);
      if (data === null) return nullable
        ? true
        : addNullableError(data);
      return true;
    };
  }

  return function validateRequiredNullableData(data) {
    return data !== undefined ? true : addRequiredError(data);
  };
}

export function compileSchemaObject(schemaObj, jsonSchema) {
  if (jsonSchema === true) return trueThat;
  if (jsonSchema === false) return falseThat;
  if (!isStrictObjectType(jsonSchema)) return falseThat;
  if (Object.keys(jsonSchema).length === 0) return trueThat;

  const fnType = compileTypeBasic(schemaObj, jsonSchema);

  const validators = [];
  addFunctionToArray(validators, compileFormatBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileEnumBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileNumberBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileStringBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileObjectBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileArrayBasic(schemaObj, jsonSchema));

  addFunctionToArray(validators, compileObjectChildren(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileArrayChildren(schemaObj, jsonSchema));

  addFunctionToArray(validators, compileCombineSchema(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileConditionSchema(schemaObj, jsonSchema));

  if (validators.length === 0) return fnType
    || trueThat; // same as empty schema

  if (validators.length === 1) {
    const first = validators[0];
    if (fnType != null) return function validateSingleSchemaObjectTyped(data, dataRoot) {
      if (fnType(data, dataRoot) === false) return false;
      if (data == null) return true;
      return first(data, dataRoot);
    };

    return function validateSingleSchemaObject(data, dataRoot) {
      if (data == null) return true;
      return first(data, dataRoot);
    };
  }

  if (validators.length === 2) {
    const first = validators[0];
    const second = validators[1];
    if (fnType != null) return function validatePairSchemaObjectTyped(data, dataRoot) {
      if (fnType(data, dataRoot) === false) return false;
      if (data == null) return true;
      return first(data, dataRoot)
        && second(data, dataRoot);
    };

    return function validatePairSchemaObject(data, dataRoot) {
      if (data == null) return true;
      return first(data, dataRoot)
        && second(data, dataRoot);
    };
  }

  if (validators.length === 3) {
    const first = validators[0];
    const second = validators[1];
    const thirth = validators[2];

    if (fnType != null) return function validateTernarySchemaObjectTyped(data, dataRoot) {
      if (fnType(data, dataRoot) === false) return false;
      if (data == null) return true;
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot);
    };

    return function validateTernarySchemaObject(data, dataRoot) {
      if (data == null) return true;
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot);
    };
  }

  if (validators.length === 4) {
    const first = validators[0];
    const second = validators[1];
    const thirth = validators[2];
    const fourth = validators[3];

    if (fnType != null) return function validateSchemaObjectTypedQuaternary(data, dataRoot) {
      if (fnType(data, dataRoot) === false) return false;
      if (data == null) return true;
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot)
        && fourth(data, dataRoot);
    };

    return function validateSchemaObjectQuaternary(data, dataRoot) {
      if (data == null) return true;
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot)
        && fourth(data, dataRoot);
    };
  }

  if (fnType != null) return function validateAllSchemaObjectTyped(data, dataRoot) {
    if (fnType(data, dataRoot) === false) return false;
    if (data == null) return true;
    for (let i = 0; i < validators.length; ++i) {
      if (validators[i](data, dataRoot) === false) return false;
    }
    return true;
  };

  return function validateAllSchemaObject(data, dataRoot) {
    if (data == null) return true;
    for (let i = 0; i < validators.length; ++i) {
      if (validators[i](data, dataRoot) === false) return false;
    }
    return true;
  };
}
