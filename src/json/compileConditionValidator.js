import {
  fallbackFn,
} from '../types/functions';

import {
  getObjectType,
} from '../types/getters';

export function compileConditionSchema(schemaObj, jsonSchema) {
  const jsif = getObjectType(jsonSchema.if);
  const jsthen = getObjectType(jsonSchema.then);
  const jselse = getObjectType(jsonSchema.else);
  if (jsif == null) return undefined;
  if (jsthen == null && jselse == null) return undefined;

  const validateIf = schemaObj.createSingleValidator('if', jsif, compileConditionSchema);
  const tmpThen = schemaObj.createSingleValidator('then', jsthen, compileConditionSchema);
  const tmpElse = schemaObj.createSingleValidator('else', jselse, compileConditionSchema);
  if (validateIf == null) return undefined;
  if (tmpThen == null && tmpElse == null) return undefined;

  const validateThen = fallbackFn(tmpThen);
  const validateElse = fallbackFn(tmpElse);
  return function validateCondition(data, dataRoot) {
    if (validateIf(data))
      return validateThen(data, dataRoot);
    else
      return validateElse(data, dataRoot);
  };
}
