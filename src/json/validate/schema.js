/* eslint-disable function-paren-newline */
import {
  isObjectTyped,
} from '../../types/core';

import {
  getBoolishType,
  getStringType,
  getBoolOrArrayTyped,
  getArrayTypeOfSet,
} from '../../types/getters';

import {
  falseThat,
  trueThat,
  addFunctionToArray,
  createIsDataTypeHandler,
} from '../../types/functions';

import { compileFormatBasic } from './format';
import { compileEnumBasic } from './enum';
import { compileNumberBasic } from './number';
import { compileBigIntBasic } from './bigint';
import { compileStringBasic } from './string';
import { compileObjectSchema } from './object';
import { compileArraySchema } from './array';
import { compileCombineSchema } from './combine';
import { compileConditionSchema } from './condition';

import {
  CONST_SCHEMA_TYPE_GENERAL,
} from '../schema/types';

function compileTypeSimple(schemaObj, jsonSchema) {
  const type = getStringType(jsonSchema.type);
  if (type == null) return undefined;

  const isDataType = createIsDataTypeHandler(type);
  if (!isDataType) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'type',
    type,
    CONST_SCHEMA_TYPE_GENERAL);
  if (!addError) return undefined;

  return function validateTypeSimple(data) {
    return isDataType(data)
      ? true
      : addError(data);
  };
}

function compileTypeArray(schemaObj, jsonSchema) {
  const schemaType = getArrayTypeOfSet(jsonSchema.type);
  if (schemaType == null) return undefined;

  // collect all testable data types
  const types = [];
  const names = [];
  for (let i = 0; i < schemaType.length; ++i) {
    const type = schemaType[i];
    const callback = createIsDataTypeHandler(type);
    if (callback) {
      types.push(callback);
      names.push(type);
    }
  }

  // if non has been found exit
  if (types.length === 0) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'type',
    names,
    CONST_SCHEMA_TYPE_GENERAL);
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
      CONST_SCHEMA_TYPE_GENERAL)
    : undefined;

  const addNullableError = nullable != null
    ? schemaObj.createSingleErrorHandler(
      'nullable',
      nullable,
      CONST_SCHEMA_TYPE_GENERAL)
    : undefined;

  if (addRequiredError == null) {
    if (fnType != null) {
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

  if (fnType != null) {
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
  addFunctionToArray(validators, compileEnumBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileNumberBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileBigIntBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileStringBasic(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileFormatBasic(schemaObj, jsonSchema));

  addFunctionToArray(validators, compileArraySchema(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileObjectSchema(schemaObj, jsonSchema));


  addFunctionToArray(validators, compileCombineSchema(schemaObj, jsonSchema));
  addFunctionToArray(validators, compileConditionSchema(schemaObj, jsonSchema));

  // same as empty schema
  if (validators.length === 0)
    return fnType || trueThat;

  if (validators.length === 1) {
    const first = validators[0];
    if (fnType != null) {
      return function validateSingleSchemaObjectType(data, dataRoot) {
        return fnType(data, dataRoot) === true
          ? first(data, dataRoot)
          : false;
      };
    }
    return first;
  }

  if (validators.length === 2) {
    const first = validators[0];
    const second = validators[1];
    if (fnType != null) {
      return function validatePairSchemaObjectType(data, dataRoot) {
        return fnType(data, dataRoot) === true
          ? first(data, dataRoot) && second(data, dataRoot)
          : false;
      };
    }

    return function validatePairSchemaObject(data, dataRoot) {
      return first(data, dataRoot) && second(data, dataRoot);
    };
  }

  if (validators.length === 3) {
    const first = validators[0];
    const second = validators[1];
    const thirth = validators[2];
    if (fnType != null) {
      return function validateTernarySchemaObjectType(data, dataRoot) {
        return fnType(data, dataRoot) === true
          ? first(data, dataRoot)
          && second(data, dataRoot)
          && thirth(data, dataRoot)
          : false;
      };
    }

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
    if (fnType != null) {
      return function validateQuaternarySchemaObjectType(data, dataRoot) {
        return fnType(data, dataRoot) === true
          ? first(data, dataRoot)
          && second(data, dataRoot)
          && thirth(data, dataRoot)
          && fourth(data, dataRoot)
          : false;
      };
    }

    return function validateQuaternarySchemaObject(data, dataRoot) {
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot)
        && fourth(data, dataRoot);
    };
  }

  if (fnType != null) {
    return function validateAllSchemaObjectType(data, dataRoot) {
      if (fnType(data, dataRoot) === false) return false;
      for (let i = 0; i < validators.length; ++i) {
        if (validators[i](data, dataRoot) === false) return false;
      }
      return true;
    };
  }

  return function validateAllSchemaObject(data, dataRoot) {
    for (let i = 0; i < validators.length; ++i) {
      if (validators[i](data, dataRoot) === false) return false;
    }
    return true;
  };
}
