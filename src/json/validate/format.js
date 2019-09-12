import { isStringType } from '../../types/core';
import { falseThat } from '../../types/functions';

import {
  getSchemaFormatCompiler,
} from '../schema/register';

export function compileFormatBasic(schemaObj, jsonSchema) {
  if (!isStringType(jsonSchema.format)) return undefined;
  const compiler = getSchemaFormatCompiler(jsonSchema.format);
  if (compiler)
    return compiler(schemaObj, jsonSchema);
  else
    return falseThat;
}
