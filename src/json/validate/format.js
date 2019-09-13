import { isStringType } from '../../types/core';

import {
  getSchemaFormatCompiler,
} from '../schema/register';

export function compileFormatBasic(schemaObj, jsonSchema) {
  if (!isStringType(jsonSchema.format)) return undefined;
  const compiler = getSchemaFormatCompiler(jsonSchema.format);
  if (compiler)
    return compiler(schemaObj, jsonSchema);
  else
    return undefined; // TODO: add syntax/undefined format error to loading process!
}
