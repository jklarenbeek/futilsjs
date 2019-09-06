/* eslint-disable function-paren-newline */
import {
  isObjectTyped,
} from '../types/core';

import {
  getBoolishType,
  getStringType,
  getBoolOrArrayTyped,
} from '../types/getters';

import {
  falseThat,
  trueThat,
  addFunctionToArray,
} from '../types/functions';

import {
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

function compileTypeSimple(schemaObj, jsonSchema) {
  const type = getStringType(jsonSchema.type);
  if (type == null) return undefined;

  const isDataType = createIsStrictDataType(type);
  if (!isDataType) return undefined;

  const addError = schemaObj.createSingleErrorHandler('type', type, compileTypeSimple);
  if (!addError) return undefined;

  return function validateTypeSimple(data) {
    return isDataType(data)
      ? true
      : addError(data);
  };
}

function compileTypeArray(schemaObj, jsonSchema) {
  const schemaType = getArrayUnique(jsonSchema.type);
  if (schemaType == null) return undefined;

  // collect all testable data types
  const types = [];
  const names = [];
  for (let i = 0; i < schemaType.length; ++i) {
    const type = schemaType[i];
    const callback = createIsStrictDataType(type);
    if (callback) {
      types.push(callback);
      names.push(type);
    }
  }

  // if non has been found exit
  if (types.length === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler('type', names, compileTypeArray);
  if (!addError) return undefined;

  // if one has been found create a validator
  if (types.length === 1) {
    const one = types[0];
    return function validateOneType(data) {
      return one(data)
        ? true
        : addError(data);
    };
  }
  else if (types.length === 2) {
    const one = types[0];
    const two = types[1];
    return function validateTwoTypes(data) {
      return one(data) || two(data)
        ? true
        : addError(data);
    };
  }
  else if (types.length === 3) {
    const one = types[0];
    const two = types[1];
    const three = types[2];
    return function validateThreeTypes(data) {
      return one(data) || two(data) || three(data)
        ? true
        : addError(data);
    };
  }
  else {
    return function validateAllTypes(data) {
      for (let i = 0; i < types.length; ++i) {
        if (types[i](data) === true) return true;
      }
      return addError(data);
    };
  }
}

function compileTypeBasic(schemaObj, jsonSchema) {
  const fnType = compileTypeSimple(schemaObj, jsonSchema)
    || compileTypeArray(schemaObj, jsonSchema);

  const required = getBoolOrArrayTyped(jsonSchema.required, false);
  const nullable = getBoolishType(jsonSchema.nullable);

  const addRequiredError = required !== false
    ? schemaObj.createSingleErrorHandler(
      'required',
      true,
      compileTypeBasic)
    : undefined;

  const addNullableError = nullable != null
    ? schemaObj.createSingleErrorHandler(
      'nullable',
      nullable,
      compileTypeBasic)
    : undefined;

  if (addRequiredError == null) {
    if (fnType) {
      if (addNullableError != null) {
        return function validateTypeNullable(data) {
          return data === undefined
            ? true
            : data === null
              ? nullable
                ? true
                : addNullableError(data)
              : fnType(data);
        };
      }

      return function validateTypeBasic(data) {
        return data === undefined
          ? true
          : fnType(data);
      };
    }

    if (addNullableError != null) {
      return function validateNotNullable(data) {
        return data === null
          ? nullable
            ? true
            : addNullableError(data)
          : true;
      };
    }

    return undefined;
  }

  if (fnType) {
    if (addNullableError != null) {
      return function validateRequiredTypeNullable(data) {
        return data === undefined
          ? addRequiredError(data)
          : data === null
            ? nullable
              ? true
              : addNullableError(data)
            : fnType(data);
      };
    }

    return function validateRequiredType(data) {
      return data === undefined
        ? addRequiredError(data)
        : fnType(data);
    };
  }

  if (addNullableError != null) {
    return function validateRequiredNonNullableData(data) {
      return data === undefined
        ? addRequiredError(data)
        : data === null
          ? nullable
            ? true
            : addNullableError(data)
          : true;
    };
  }

  return function validateRequiredNullableData(data) {
    return data === undefined
      ? addRequiredError(data)
      : true;
  };
}

export function compileSchemaObject(schemaObj, jsonSchema) {
  if (jsonSchema === true) return trueThat;
  if (jsonSchema === false) return falseThat;
  if (!isObjectTyped(jsonSchema)) return falseThat;
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
      return fnType(data, dataRoot) === true
        ? first(data, dataRoot)
        : false;
    };
    return first;
  }

  if (validators.length === 2) {
    const first = validators[0];
    const second = validators[1];
    if (fnType != null) return function validatePairSchemaObjectTyped(data, dataRoot) {
      return fnType(data, dataRoot) === true
        ? first(data, dataRoot) && second(data, dataRoot)
        : false;
    };

    return function validatePairSchemaObject(data, dataRoot) {
      return first(data, dataRoot) && second(data, dataRoot);
    };
  }

  if (validators.length === 3) {
    const first = validators[0];
    const second = validators[1];
    const thirth = validators[2];
    if (fnType != null) return function validateTernarySchemaObjectTyped(data, dataRoot) {
      return fnType(data, dataRoot) === true
        ? first(data, dataRoot)
          && second(data, dataRoot)
          && thirth(data, dataRoot)
        : false;
    };

    return function validateTernarySchemaObject(data, dataRoot) {
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
    if (fnType != null) return function validateQuaternarySchemaObjectTyped(data, dataRoot) {
      return fnType(data, dataRoot) === true
        ? first(data, dataRoot)
          && second(data, dataRoot)
          && thirth(data, dataRoot)
          && fourth(data, dataRoot)
        : false;
    };

    return function validateQuaternarySchemaObject(data, dataRoot) {
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot)
        && fourth(data, dataRoot);
    };
  }

  if (fnType != null) return function validateAllSchemaObjectTyped(data, dataRoot) {
    if (fnType(data, dataRoot) === false) return false;
    for (let i = 0; i < validators.length; ++i) {
      if (validators[i](data, dataRoot) === false) return false;
    }
    return true;
  };

  return function validateAllSchemaObject(data, dataRoot) {
    for (let i = 0; i < validators.length; ++i) {
      if (validators[i](data, dataRoot) === false) return false;
    }
    return true;
  };
}
