import {
  getArrayMinItems,
} from '../types/getDataTypeExtra';

export function compileEnumBasic(schemaObj, jsonSchema) {
  const enums = getArrayMinItems(jsonSchema.enum, 1);
  if (enums) { // TODO remove type checking! simplify!
    const addError = schemaObj.createMemberError(
      'enum',
      enums,
      compileEnumBasic,
    );
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
  return undefined;
}
