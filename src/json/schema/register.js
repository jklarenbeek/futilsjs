import { getDefaultFormatCompilers } from '../format/index';

import {
  isComplexType,
  isNumberType,
  isIntegerType,
  isBigIntType,
  isStringType,
} from '../../types/core';

export function createFormatNumberCompiler(name, format) {
  if (isComplexType(format)) {
    // TODO: isNumeric
    if (['integer', 'bigint', 'number'].includes(format.type)) {
      const rix = Number(format.minimum) || false;
      const rax = Number(format.maximum) || false;

      const isDataType = format.type === 'integer'
        ? isIntegerType
        : format.type === 'bigint'
          ? isBigIntType
          : format.type === 'number'
            ? isNumberType
            : undefined;

      if (isDataType) {
        return function compileFormatNumber(schemaObj, jsonSchema) {
          const fix = Math.max(Number(jsonSchema.formatMinimum) || rix, rix);
          const _fie = jsonSchema.formatExclusiveMinimum === true
            ? fix
            : Number(jsonSchema.formatExclusiveMinimum) || false;
          const fie = fix !== false && _fie !== false
            ? Math.max(fix, _fie)
            : _fie;

          const fax = Math.min(Number(jsonSchema.formatMaximum) || rax, rax);
          const _fae = jsonSchema.formatExclusiveMaximum === true
            ? fax
            : Number(jsonSchema.formatExclusiveMaximum) || false;
          const fae = fax !== false && _fae !== false
            ? Math.max(fax, _fae)
            : _fae;

          if (fie && fae) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatExclusiveMinimum', 'formatExclusiveMaximum'],
              [fie, fae],
              format.type,
            );
            return function betweenExclusive(data) {
              if (!isDataType(data)) return true;
              if (data > fie && data < fae) return true;
              return addError(data);
            };
          }
          else if (fie && fax) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatExclusiveMinimum', 'formatMaximum'],
              [fie, fax],
              format.type,
            );
            return function betweenExclusiveMinimum(data) {
              if (!isDataType(data)) return true;
              if (data > fie && data <= fax) return true;
              return addError(data);
            };
          }
          else if (fae && fix) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatMinimum', 'formatExclusiveMaximum'],
              [fix, fae],
              format.type,
            );
            return function betweenExclusiveMaximum(data) {
              if (!isDataType(data)) return true;
              if (data >= fix && data < fae) return true;
              return addError(data);
            };
          }
          else if (fix && fax) {
            const addError = schemaObj.createSingleErrorHandler(
              ['formatMinimum', 'formatMaximum'],
              [fie, fae],
              format.type,
            );
            return function formatBetween(data) {
              if (!isDataType(data)) return true;
              if (data >= fix && data <= fax) return true;
              return addError(data);
            };
          }
          else if (fie) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatExclusiveMinimum',
              fie,
              format.type,
            );
            return function formatExclusiveMinimum(data) {
              if (!isDataType(data)) return true;
              if (data > fie) return true;
              return addError(data);
            };
          }
          else if (fae) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatExclusiveMaximum',
              fae,
              format.type,
            );
            return function formatExclusiveMaximum(data) {
              if (!isDataType(data)) return true;
              if (data < fae) return true;
              return addError(data);
            };
          }
          else if (fax) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatMaximum',
              fax,
              format.type,
            );
            return function formatMaximum(data) {
              if (!isDataType(data)) return true;
              if (data <= fax) return true;
              return addError(data);
            };
          }
          else if (fix) {
            const addError = schemaObj.createSingleErrorHandler(
              'formatMinimum',
              fix,
              format.type,
            );
            return function formatMinimum(data) {
              if (!isDataType(data)) return true;
              if (data >= fix) return true;
              return addError(data);
            };
          }
          return undefined;
        };
      }
    }
  }
  return undefined;
}

export function registerDefaultFormatCompilers() {
  const formatCompilers = getDefaultFormatCompilers();
  const keys = Object.keys(formatCompilers);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    const item = formatCompilers[key];
    registerFormatCompiler(key, item);
  }
}

const registeredSchemaFormatters = {};
export function registerFormatCompiler(name, jsonSchema) {
  if (registeredSchemaFormatters[name] == null) {
    const r = typeof jsonSchema;
    if (r === 'function') {
      registeredSchemaFormatters[name] = jsonSchema;
      return true;
    }
    else {
      const fn = createFormatNumberCompiler(name, jsonSchema);
      if (fn) {
        registeredSchemaFormatters[name] = fn;
        return true;
      }
    }
  }
  return false;
}

export function getSchemaFormatCompiler(name) {
  if (isStringType(name))
    return registeredSchemaFormatters[name];
  else
    return undefined;
}
