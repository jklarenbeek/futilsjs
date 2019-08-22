import { trueThat, fallbackFn, falseThat } from '../types/isFunctionType';
import { getStrictArray } from '../types/getDataType';

function compileAllOf(schemaObj, jsonSchema) {
  const allOf = getStrictArray(jsonSchema.allOf);
  if (allOf == null) return undefined;
  return falseThat;
}

function compileAnyOf(schemaObj, jsonSchema) {
  const anyOf = getStrictArray(jsonSchema.anyOf);
  if (anyOf == null) return undefined;
  return falseThat;
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
  const fnAllOf = fallbackFn(compileAllOf(schemaObj, jsonSchema), trueThat);
  const fnAnyOf = fallbackFn(compileAnyOf(schemaObj, jsonSchema), trueThat);
  const fnOneOf = fallbackFn(compileOneOf(schemaObj, jsonSchema), trueThat);
  const fnNotOf = fallbackFn(compileNotOf(schemaObj, jsonSchema), trueThat);
  return fnAllOf && fnAnyOf && fnOneOf && fnNotOf;
}
