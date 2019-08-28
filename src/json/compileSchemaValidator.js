/* eslint-disable function-paren-newline */
import {
  fallbackFn,
  falseThat,
  trueThat,
  isFn,
} from '../types/isFunctionType';

import {
  isStrictObjectType,
} from '../types/isDataType';

import { compileTypeBasic } from './compileTypeValidator';
import { compileFormatBasic } from './compileFormatValidator';
import { compileEnumBasic } from './compileEnumValidator';
import { compileNumberBasic } from './compileNumberValidator';
import { compileStringBasic } from './compileStringValidator';
import { compileObjectBasic, compileObjectChildren } from './compileObjectValidator';
import { compileArrayBasic, compileArrayChildren } from './compileArrayValidator';
import { compileMapChildren } from './compileMapValidator';
import { compileSetChildren } from './compileSetValidator';
import { compileTupleChildren } from './compileTupleValidator';
import { compileCombineSchema } from './compileCombineValidator';
import { compileConditionSchema } from './compileConditionValidator';

function compileSchemaBasic(schemaObj, jsonSchema) {
  const compilers = [];
  function addCompiler(compiler) {
    if (isFn(compiler)) compilers.push(compiler);
  }

  addCompiler(compileFormatBasic(schemaObj, jsonSchema));
  addCompiler(compileEnumBasic(schemaObj, jsonSchema));
  addCompiler(compileNumberBasic(schemaObj, jsonSchema));
  addCompiler(compileStringBasic(schemaObj, jsonSchema));
  addCompiler(compileObjectBasic(schemaObj, jsonSchema));
  addCompiler(compileArrayBasic(schemaObj, jsonSchema));

  if (compilers.length === 0) return undefined;
  if (compilers.length === 1) return compilers[0];
  if (compilers.length === 2) {
    const first = compilers[0];
    const second = compilers[1];
    return function validateSchemaBasicPair(data, dataRoot) {
      return first(data, dataRoot) && second(data, dataRoot);
    };
  }
  else {
    return function validateSchemaBasic(data, dataRoot) {
      for (let i = 0; i < compilers.length; ++i) {
        const compiler = compilers[i];
        if (compiler(data, dataRoot) === false) return false;
      }
      return true;
    };
  }
}

function compileSchemaChildren(schemaObj, jsonSchema) {
  const compilers = [];
  function addCompiler(compiler) {
    if (isFn(compiler)) compilers.push(compiler);
  }

  addCompiler(compileObjectChildren(schemaObj, jsonSchema));
  addCompiler(compileMapChildren(schemaObj, jsonSchema));
  addCompiler(compileArrayChildren(schemaObj, jsonSchema));
  addCompiler(compileSetChildren(schemaObj, jsonSchema));
  addCompiler(compileTupleChildren(schemaObj, jsonSchema));

  if (compilers.length === 0) return undefined;
  if (compilers.length === 1) return compilers[0];
  if (compilers.length === 2) {
    const first = compilers[0];
    const second = compilers[1];
    return function validateSchemaChildrenPair(data, dataRoot) {
      return first(data, dataRoot) && second(data, dataRoot);
    };
  }
  else {
    return function validateSchemaChildren(data, dataRoot) {
      for (let i = 0; i < compilers.length; ++i) {
        const compiler = compilers[i];
        if (compiler(data, dataRoot) === false) return false;
      }
      return true;
    };
  }
}

// eslint-disable-next-line no-unused-vars
function compileSchemaAdvanced(schemaObj, jsonSchema) {
  const fnCombine = compileCombineSchema(schemaObj, jsonSchema);
  const fnCondition = compileConditionSchema(schemaObj, jsonSchema);

  if (fnCombine && fnCondition) {
    return function validateAdvandedSchema(data, dataRoot) {
      return fnCombine(data, dataRoot) && fnCondition(data, dataRoot);
    };
  }
  return fnCombine || fnCondition;
}

export function compileSchemaObject(schemaObj, jsonSchema) {
  const compilers = [];
  function addCompiler(compiler) {
    if (isFn(compiler)) compilers.push(compiler);
  }

  if (jsonSchema === true) return trueThat;
  if (jsonSchema === false) return falseThat;
  if (!isStrictObjectType(jsonSchema)) {
    return falseThat;
  }

  const fnType = compileTypeBasic(schemaObj, jsonSchema);

  addCompiler(compileSchemaBasic(schemaObj, jsonSchema));
  addCompiler(compileSchemaChildren(schemaObj, jsonSchema));
  addCompiler(compileSchemaAdvanced(schemaObj, jsonSchema));

  if (compilers.length === 0) {
    if (fnType) return fnType;
    return undefined;
  }

  if (compilers.length === 1) {
    const first = compilers[0];
    if (fnType) return function validateSchemaObjectSingle(data, dataRoot) {
      const vType = fnType(data, dataRoot);
      if (vType === false) return false;
      if (data === undefined) return true;

      return first(data, dataRoot);
    };
    return first;
  }

  if (compilers.length === 2) {
    const first = compilers[0];
    const second = compilers[1];
    if (fnType) return function validateSchemaObjectTypedPair(data, dataRoot) {
      const vType = fnType(data, dataRoot);
      if (vType === false) return false;
      if (data === undefined) return true;

      return first(data, dataRoot) && second(data, dataRoot);
    };
    return function validateSchemaObjectPair(data, dataRoot) {
      if (data === undefined) return true;
      return first(data, dataRoot) && second(data, dataRoot);
    };
  }

  if (compilers.length === 3) {
    const first = compilers[0];
    const second = compilers[1];
    const thirth = compilers[2];

    if (fnType) return function validateSchemaObjectTypedAll(data, dataRoot) {
      const vType = fnType(data, dataRoot);
      if (vType === false) return false;
      if (data === undefined) return true;
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot);
    };

    return function validateSchemaObjectAll(data, dataRoot) {
      if (data === undefined) return true;
      return first(data, dataRoot)
        && second(data, dataRoot)
        && thirth(data, dataRoot);
    };
  }

  return undefined;
}
