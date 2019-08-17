import {
  isStrictIntegerType,
  isStrictBigIntType,
  isStrictNumberType,
} from './isDataType';

export function createNumberFormatCompiler(name, format) {
  if (format != null && format === 'object') {
    if (['integer', 'bigint', 'number'].includes(format.type)) {
      //const rbts = getPureNumber(r.bits);
      //const rsgn = getPureBool(r.signed);

      const rix = Number(format.minimum) || false;
      const rax = Number(format.maximum) || false;

      const isDataType = format.type === 'integer'
        ? isStrictIntegerType
        : format.type === 'bigint'
          ? isStrictBigIntType
          : format.type === 'number'
            ? isStrictNumberType
            : undefined;

      if (isDataType) {
        return function compileFormatNumber(owner, schema, addMember) {
          const fix = Math.max(Number(schema.formatMinimum) || rix, rix);
          const _fie = schema.formatExclusiveMinimum === true
            ? fix
            : Number(schema.formatExclusiveMinimum) || false;
          const fie = fix !== false && _fie !== false
            ? Math.max(fix, _fie)
            : _fie;

          const fax = Math.min(Number(schema.formatMaximum) || rax, rax);
          const _fae = schema.formatExclusiveMaximum === true
            ? fax
            : Number(schema.formatExclusiveMaximum) || false;
          const fae = fax !== false && _fae !== false
            ? Math.max(fax, _fae)
            : _fae;

          if (fie && fae) {
            const addError = addMember(
              ['formatExclusiveMinimum', 'formatExclusiveMaximum'],
              [fie, fae],
              compileFormatNumber,
            );
            return function betweenExclusive(data) {
              if (!isDataType(data)) return true;
              if (data > fie && data < fae) return true;
              return addError(data);
            };
          }
          else if (fie && fax) {
            const addError = addMember(
              ['formatExclusiveMinimum', 'formatMaximum'],
              [fie, fax],
              compileFormatNumber,
            );
            return function betweenExclusiveMinimum(data) {
              if (!isDataType(data)) return true;
              if (data > fie && data <= fax) return true;
              return addError(data);
            };
          }
          else if (fae && fix) {
            const addError = addMember(
              ['formatMinimum', 'formatExclusiveMaximum'],
              [fix, fae],
              compileFormatNumber,
            );
            return function betweenExclusiveMaximum(data) {
              if (!isDataType(data)) return true;
              if (data >= fix && data < fae) return true;
              return addError(data);
            };
          }
          else if (fix && fax) {
            const addError = addMember(
              ['formatMinimum', 'formatMaximum'],
              [fie, fae],
              compileFormatNumber,
            );
            return function formatBetween(data) {
              if (!isDataType(data)) return true;
              if (data >= fix && data <= fax) return true;
              return addError(data);
            };
          }
          else if (fie) {
            const addError = addMember(
              'formatExclusiveMinimum',
              fie,
              compileFormatNumber,
            );
            return function formatExclusiveMinimum(data) {
              if (!isDataType(data)) return true;
              if (data > fie) return true;
              return addError(data);
            };
          }
          else if (fae) {
            const addError = addMember(
              'formatExclusiveMaximum',
              fae,
              compileFormatNumber,
            );
            return function formatExclusiveMaximum(data) {
              if (!isDataType(data)) return true;
              if (data < fae) return true;
              return addError(data);
            };
          }
          else if (fax) {
            const addError = addMember(
              'formatMaximum',
              fax,
              compileFormatNumber,
            );
            return function formatMaximum(data) {
              if (!isDataType(data)) return true;
              if (data <= fax) return true;
              return addError(data);
            };
          }
          else if (fix) {
            const addError = addMember(
              'formatMinimum',
              fix,
              compileFormatNumber,
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
