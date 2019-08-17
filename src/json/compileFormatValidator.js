import {
  isStrictStringType,
} from './isDataType';

import {
  createNumberFormatCompiler,
} from './createNumberFormatCompiler';

const registeredSchemaFormatters = {};
export function registerSchemaFormatCompiler(name, schema) {
  if (registeredSchemaFormatters[name] == null) {
    const r = typeof schema;
    if (r === 'function') {
      registeredSchemaFormatters[name] = schema;
      return true;
    }
    else {
      const fn = createNumberFormatCompiler(name, schema);
      if (fn) {
        registeredSchemaFormatters[name] = fn;
        return true;
      }
    }
  }
  return false;
}

function getSchemaFormatCompiler(name) {
  if (isStrictStringType(name))
    return registeredSchemaFormatters[name];
  else
    return undefined;
}

export function compileFormatBasic(owner, schema, addMember) {
  const compiler = getSchemaFormatCompiler(schema.format);
  if (compiler) {
    return compiler(owner, schema, addMember);
  }
  return undefined;
}
