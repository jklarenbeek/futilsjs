import {
  getSchemaFormatCompiler,
} from './registerFormatCompiler';

export function compileFormatBasic(owner, schema, addMember) {
  const compiler = getSchemaFormatCompiler(schema.format);
  if (compiler) {
    return compiler(owner, schema, addMember);
  }
  return undefined;
}
