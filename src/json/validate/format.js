import {
  getSchemaFormatCompiler,
} from '../schema/register';

export function compileFormatBasic(schemaObj, jsonSchema) {
  const compiler = getSchemaFormatCompiler(jsonSchema.format);
  if (compiler) {
    return compiler(schemaObj, jsonSchema);
  }
  return undefined;
}
