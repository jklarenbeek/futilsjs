import {
  getArrayMinItems,
} from './getDataTypeExtra';

import {
  isPrimitiveSchema,
} from './isSchemaType';

export function compileEnumBasic(schema, addMember) {
  const enums = getArrayMinItems(schema.enum, 1);
  if (enums) {
    if (isPrimitiveSchema(schema)) {
      const addError = addMember('enum', enums, compileEnumBasic);
      return function validateEnumBasic(data) {
        if (data != null && typeof data !== 'object') {
          if (!enums.includes(data)) {
            addError(data);
            return false;
          }
        }
        return true;
      };
    }
  }
  return undefined;
}