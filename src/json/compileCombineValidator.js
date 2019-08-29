import {
  falseThat,
  isFn,
  trueThat,
} from '../types/isFunctionType';

import {
  getStrictArray,
} from '../types/getDataType';

function compileAllOf(schemaObj, jsonSchema) {
  const allOf = getStrictArray(jsonSchema.allOf);
  if (allOf == null) return undefined;

  const member = schemaObj.createMember('allOf', compileAllOf);
  const validators = [];
  for (let i = 0; i < allOf.length; ++i) {
    const child = allOf[i];
    if (child === true) validators[i] = trueThat;
    else if (child === false) validators[i] = falseThat;
    else {
      const validator = schemaObj.createPairValidator(member, i, child);
      validators[i] = validator;
    }
  }

  return function validateAllOf(data, dataRoot) {
    if (data !== undefined) {
      for (let i = 0; i < validators.length; ++i) {
        const validator = validators[i];
        if (validator && validator(data, dataRoot) === false) return false;
      }
    }
    return true;
  };
}

function compileAnyOf(schemaObj, jsonSchema) {
  const anyOf = getStrictArray(jsonSchema.anyOf);
  if (anyOf == null) return undefined;

  const member = schemaObj.createMember('anyOf', compileAnyOf);
  const validators = [];
  for (let i = 0; i < anyOf.length; ++i) {
    const child = anyOf[i];
    if (child === true) validators[i] = trueThat;
    else if (child === false) validators[i] = falseThat;
    else {
      const validator = schemaObj.createPairValidator(member, i, child);
      validators[i] = validator;
    }
  }

  return function validateAnyOf(data, dataRoot) {
    if (data !== undefined) {
      for (let i = 0; i < validators.length; ++i) {
        const validator = validators[i];
        if (validator && validator(data, dataRoot) === true) return true;
      }
      return false;
    }
    return true;
  };
}

function compileOneOf(schemaObj, jsonSchema) {
  const oneOf = getStrictArray(jsonSchema.oneOf);
  if (oneOf == null) return undefined;
  return falseThat;
}

function compileNotOf(schemaObj, jsonSchema) {
  const notOf = getStrictArray(jsonSchema.not);
  if (notOf == null) return undefined;
  return falseThat;
}

export function compileCombineSchema(schemaObj, jsonSchema) {
  const compilers = [];
  function addCompiler(compiler) {
    if (isFn(compiler)) compilers.push(compiler);
  }

  addCompiler(compileAllOf(schemaObj, jsonSchema));
  addCompiler(compileAnyOf(schemaObj, jsonSchema));
  addCompiler(compileOneOf(schemaObj, jsonSchema));
  addCompiler(compileNotOf(schemaObj, jsonSchema));

  if (compilers.length === 0) return undefined;
  if (compilers.length === 1) return compilers[0];
  if (compilers.length === 2) {
    const first = compilers[0];
    const second = compilers[1];
    return function validateCombinaSchemaPair(data, dataRoot) {
      return first(data, dataRoot) && second(data, dataRoot);
    };
  }
  else {
    return function validateCombineSchema(data, dataRoot) {
      for (let i = 0; i < compilers.length; ++i) {
        const compiler = compilers[i];
        if (compiler(data, dataRoot) === false) return false;
      }
      return true;
    };
  }
}
