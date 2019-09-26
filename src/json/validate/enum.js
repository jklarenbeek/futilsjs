/* eslint-disable function-paren-newline */
/* eslint-disable no-unused-vars */
import {
  isScalarType,
} from '../../types/core';

import {
  getArrayTypeMinItems,
} from '../../types/getters';

import {
  equalsDeep,
} from '../../types/objects';

import {
  CONST_SCHEMA_TYPE_GENERAL,
} from '../schema/types';

export const exampleEnumDataStructure = {
  allOf: [
    {
      enum: {
        source: false, // jsonpath!!
        data: [
          { color: 0xFFFFFF, name: 'white', type: 'greys' },
          { color: 0x000000, name: 'black', type: 'greys' },
          null, // this null will not be included in resulting enum array.
          { color: 0xFF0000, name: 'red', type: 'reds' },
          { color: 0x00FF00, name: 'green', type: 'greens' },
          { color: 0x0000FF, name: 'blue', type: 'blues' },
        ],
        group: 'type',
        label: 'name',
        value: 'color',
      },
    },
    {
      enum: {
        source: false, // jsonpath!!
        data: [
          [0xFFFFFF, 'white', 'greys'],
          [0x000000, 'black', 'greys'],
          null, // null will be ignored
          [0xFF0000, 'red', 'reds'],
          [0x00FF00, 'green', 'greens'],
          [0x0000FF, 'blue', 'blues'],
        ],
        group: 2,
        label: 1,
        value: 0,
      },
    },
    {
      enum: {
        data: [
          { value: 0xFFFFFF, label: 'white', group: 'greys' },
          { value: 0x000000, label: 'black', group: 'greys' },
          null, // null will be ignored
          { value: 0xFF0000, label: 'red', group: 'reds' },
          { value: 0x00FF00, label: 'green', group: 'greens' },
          { value: 0x0000FF, label: 'blue', group: 'blues' },
        ],
      },
    },
    {
      enum: {
        data: [
          [0xFFFFFF, 'white', 'greys'],
          [0x000000, 'black', 'greys'],
          null, // null will be ignored
          [0xFF0000, 'red', 'reds'],
          [0x00FF00, 'green', 'greens'],
          [0x0000FF, 'blue', 'blues'],
        ],
      },
    },
  ],
};

function compileConst(schemaObj, jsonSchema) {
  const constant = jsonSchema.const;
  if (constant === undefined) return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'const',
    constant,
    CONST_SCHEMA_TYPE_GENERAL);
  if (addError == null) return undefined;

  if (constant === null || isScalarType(constant)) {
    return function validatePrimitiveConst(data, dataRoot) {
      return constant === data || addError(data);
    };
  }
  else {
    return function validatePrimitiveConst(data, dataRoot) {
      return equalsDeep(constant, data) || addError(data);
    };
  }
}

function compileEnum(schemaObj, jsonSchema) {
  const enums = getArrayTypeMinItems(jsonSchema.enum, 1);
  if (enums == null) return undefined;

  let hasObjects = false;
  for (let i = 0; i < enums.length; ++i) {
    const e = enums[i];
    if (e != null && typeof e === 'object') {
      hasObjects = true;
      break;
    }
  }

  const addError = schemaObj.createSingleErrorHandler(
    'enum',
    enums,
    CONST_SCHEMA_TYPE_GENERAL);
  if (addError == null) return undefined;

  if (hasObjects === false) {
    return function validateEnumSimple(data, dataRoot) {
      return data === undefined
        ? true
        : enums.includes(data)
          ? true
          : addError(data);
    };
  }
  else {
    return function validateEnumDeep(data, dataRoot) {
      if (data === undefined) return true;
      if (data === null || typeof data !== 'object')
        return enums.includes(data)
          ? true
          : addError(data);

      for (let i = 0; i < enums.length; ++i) {
        if (equalsDeep(enums[i], data) === true)
          return true;
      }
      return addError(data);
    };
  }
}

export function compileEnumBasic(schemaObj, jsonSchema) {
  return [
    compileConst(schemaObj, jsonSchema),
    compileEnum(schemaObj, jsonSchema),
  ];
}
