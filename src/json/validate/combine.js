import {
  isFn,
} from '../../types/core';

import {
  getArrayType,
  getBoolOrObjectType,
} from '../../types/getters';

import {
  falseThat,
  trueThat,
} from '../../types/functions';

function compileAllOf(schemaObj, jsonSchema) {
  const allOf = getArrayType(jsonSchema.allOf);
  if (allOf == null) return undefined;

  const member = schemaObj.createMember('allOf', compileAllOf);
  const validators = [];
  for (let i = 0; i < allOf.length; ++i) {
    const child = allOf[i];
    if (child === true)
      validators.push(trueThat);
    else if (child === false)
      validators.push(falseThat);
    else {
      const validator = schemaObj.createPairValidator(member, i, child);
      if (isFn(validator))
        validators.push(validator);
    }
  }

  if (validators.length === 0) return undefined;

  return function validateAllOf(data, dataRoot) { // TODO: addError??
    if (data !== undefined) {
      for (let i = 0; i < validators.length; ++i) {
        const validator = validators[i];
        if (validator(data, dataRoot) === false) return false;
      }
    }
    return true;
  };
}

function compileAnyOf(schemaObj, jsonSchema) {
  const anyOf = getArrayType(jsonSchema.anyOf);
  if (anyOf == null) return undefined;

  const member = schemaObj.createMember('anyOf', compileAnyOf);
  const validators = [];
  for (let i = 0; i < anyOf.length; ++i) {
    const child = anyOf[i];
    if (child === true)
      validators.push(trueThat);
    else if (child === false)
      validators.push(falseThat);
    else {
      const validator = schemaObj.createPairValidator(member, i, child);
      if (isFn(validator))
        validators.push(validator);
    }
  }

  if (validators.length === 0) return undefined;

  return function validateAnyOf(data, dataRoot) { // TODO: addError??
    if (data !== undefined) {
      for (let i = 0; i < validators.length; ++i) {
        const validator = validators[i];
        if (validator(data, dataRoot) === true) return true;
      }
      return false;
    }
    return true;
  };
}

function compileOneOf(schemaObj, jsonSchema) {
  const oneOf = getArrayType(jsonSchema.oneOf);
  if (oneOf == null) return undefined;

  const member = schemaObj.createMember('oneOf', compileOneOf);
  const validators = [];
  for (let i = 0; i < oneOf.length; ++i) {
    const child = oneOf[i];
    if (child === true)
      validators.push(trueThat);
    else if (child === false)
      validators.push(falseThat);
    else {
      const validator = schemaObj.createPairValidator(member, i, child);
      if (isFn(validator))
        validators.push(validator);
    }
  }

  if (validators.length === 0) return undefined;

  return function validateOneOf(data, dataRoot) { // TODO: addError??
    let found = false;
    for (let i = 0; i < validators.length; ++i) {
      const validator = validators[i];
      if (validator(data, dataRoot) === true) {
        if (found === true) return false;
        found = true;
      } // TODO: else how to silent this error?
    }
    return found;
  };
}

function compileNotOf(schemaObj, jsonSchema) {
  const notOf = getBoolOrObjectType(jsonSchema.not);
  if (notOf == null) return undefined;
  if (notOf === true) return falseThat;
  if (notOf === false) return trueThat;

  const validate = schemaObj.createSingleValidator('not', notOf, compileNotOf);
  if (!validate) return undefined;

  return function validateNotOf(data, dataRoot) { // TODO: addError??
    if (data === undefined) return true;
    return validate(data, dataRoot) === false; // TODO: howto silent this error???
    // NOTE: we can push the context on schemaObj = schemaObj.pushSchemaContext()?
  };
}

export function compileCombineSchema(schemaObj, jsonSchema) {
  const compilers = [];
  function addCompiler(compiler) {
    if (isFn(compiler))
      compilers.push(compiler);
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
