import { falseThat, trueThat } from '../types/isFunctionType';
import { getObjectishType } from '../types/getDataType';

export function compileConditionSchema(schemaObj, jsonSchema) {
  const jsif = getObjectishType(jsonSchema.if);
  const jsthen = getObjectishType(jsonSchema.then);
  const jselse = getObjectishType(jsonSchema.else);
  if (jsif == null && jsthen == null && jselse == null) return trueThat;
  return falseThat;
}
