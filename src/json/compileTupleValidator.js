import {
  isStrictArrayType,
  isArrayishType,
} from '../types/isDataType';

import {
  getObjectishType,
  getNumberishType,
  getArrayishType,
} from '../types/getDataType';

import {
  getStringOrArray,
} from '../types/getDataTypeExtra';

import {
  fallbackFn,
  falseThat,
} from '../types/isFunctionType';

export function compileTupleChildren(schemaObj, jsonSchema) {
  const items = getArrayishType(jsonSchema.items);
  const additional = getObjectishType(jsonSchema.additionalItems);
  const maxItems = getNumberishType(jsonSchema.maxItems, 0);


  if (items == null && additional == null) return undefined;

  // check if we are really in a tuple
  if (items == null) {
    const type = getStringOrArray(jsonSchema.type);
    let istuple = false;
    if (isStrictArrayType(type)) {
      istuple = type.includes('tuple');
    }
    else if (type === 'tuple') {
      istuple = true;
    }
    if (istuple !== true) return undefined;
  }

  function compileItems() {
    if (items == null) return undefined;
    const member = schemaObj.createMember('items', compileTupleChildren);
    const validators = new Array(items.length);
    for (let i = 0; i < items.length; ++i) {
      const validator = member.createPairValidator(member, i, items[i]);
      validators[i] = validator;
    }

    return function validateItem(i, data, dataRoot) {
      if (validators.length < i) {
        const validator = validators[i];
        if (validator != null) {
          return validator(data[i], dataRoot);
        }
      }
      return false;
    };
  }

  function compileAdditionalItems() {
    if (additional == null) return undefined;

    const validate = schemaObj.createSingleValidator(
      'additionalItems',
      additional,
      compileTupleChildren,
    );
    if (validate == null) return undefined;
    return function validateContains(data, dataRoot) {
      return validate(data, dataRoot);
    };
  }

  const validateItem = fallbackFn(compileItems(), falseThat);
  const validateAdditional = fallbackFn(compileAdditionalItems(), falseThat);

  return function validateTuple(data, dataRoot) {
    let valid = true;
    if (isArrayishType(data)) {
      let errors = 0;
      const len = maxItems > 0
        ? Math.min(maxItems, data.length)
        : data.length;
      for (let i = 0; i < len; ++i) {
        if (errors > 32) break;
        const val = data[i];
        if (!validateItem(i, val, dataRoot)) {
          if (validateAdditional(i, val, dataRoot) === true)
            continue;
          valid = false;
          errors++;
        }
      }
    }
    return valid;
  };
}
