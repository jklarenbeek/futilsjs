/* eslint-disable function-paren-newline */
import {
  isStringType,
  isDateType,
} from '../../types/core';

import {
  getTypeExclusiveBound,
} from '../../types/getters';

import {
  getDateTypeOfDateTimeRFC3339,
  getDateTypeOfDateOnlyRFC3339,
  getDateTypeOfTimeOnlyRFC3339,
} from '../../types/dates';

import {
  CONST_SCHEMA_TYPE_STRING,
} from '../schema/types';

// dataTimeFormats
export const numberFormats = {
  year: {
    type: 'integer',
    minimum: 1970,
    maximum: 2378,
  },
  month: {
    type: 'integer',
    minimum: 1,
    maximum: 12,
  },
  months: {
    type: 'array',
    items: [
      {
        title: 'januari',
        const: 31,
      },
      {
        title: 'februari (wrong)',
        const: 28,
      },
      {
        title: 'march',
        const: 31,
      },
      {
        title: 'april',
        const: 30,
      },
      {
        title: 'may',
        const: 31,
      },
      {
        title: 'june',
        const: 30,
      },
      {
        title: 'juli',
        const: 31,
      },
      {
        title: 'august',
        const: 31,
      },
      {
        title: 'september',
        const: 30,
      },
      {
        title: 'october',
        const: 31,
      },
      {
        title: 'november',
        const: 30,
      },
      {
        title: 'december',
        const: 31,
      },
    ],
  },
  week: {
    type: 'integer',
    minimum: 1,
    maximum: 52,
  },
  hour: {
    type: 'integer',
    minimum: 0,
    maximum: 23,
  },
  minute: {
    type: 'integer',
    minimum: 0,
    maximum: 59,
  },
  second: {
    type: 'integer',
    minimum: 0,
    maximum: 59,
  },
};

//#region generalized
function compileFormatMinimumByType(parseType, schemaObj, jsonSchema) {
  const [min, emin] = getTypeExclusiveBound(
    parseType,
    jsonSchema.formatMinimum,
    jsonSchema.formatExclusiveMinimum);

  if (emin != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatExclusiveMinimum',
      emin,
      CONST_SCHEMA_TYPE_STRING,
      parseType);
    if (addError == null) return undefined;

    return function isFormatExclusiveMinimum(date) {
      return date > emin || addError(date);
    };
  }
  else if (min) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatMinimum',
      min,
      CONST_SCHEMA_TYPE_STRING,
      parseType);
    if (addError == null) return undefined;

    return function isFormatMinimum(date) {
      return date >= min || addError(date);
    };
  }

  return undefined;
}

function compileFormatMaximumByType(parseType, schemaObj, jsonSchema) {
  const [max, emax] = getTypeExclusiveBound(
    parseType,
    jsonSchema.formatMaximum,
    jsonSchema.formatExclusiveMaximum);

  if (emax != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatExclusiveMaximum',
      emax,
      CONST_SCHEMA_TYPE_STRING,
      parseType);
    if (addError == null) return undefined;

    return function isFormatExclusiveMaximum(date) {
      return date < emax || addError(date);
    };
  }
  else if (max != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatMaximum',
      max,
      CONST_SCHEMA_TYPE_STRING,
      parseType);
    if (addError == null) return undefined;

    return function isFormatMaximum(date) {
      return date <= max || addError(date);
    };
  }
  return undefined;
}

function compileFormatByType(name, parseType, schemaObj, jsonSchema) {
  if (jsonSchema.format !== name)
    return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'format',
    jsonSchema.format,
    CONST_SCHEMA_TYPE_STRING,
    parseType);
  if (addError == null) return undefined;

  const validateMin = compileFormatMinimumByType(
    parseType,
    schemaObj,
    jsonSchema);
  const validateMax = compileFormatMaximumByType(
    parseType,
    schemaObj,
    jsonSchema);

  if (validateMin != null && validateMax != null) {
    return function validateFormatBetween(data) {
      if (isStringType(data)) {
        const date = parseType(data);
        return date == null
          ? addError(data)
          : validateMin(date)
            && validateMax(date);
      }
      else if (isDateType(data))
        return validateMin(data)
          && validateMax(data);
      else
        return data == null;
    };
  }
  if (validateMin != null) {
    return function validateFormatMinimum(data) {
      if (isStringType(data)) {
        const date = parseType(data);
        return date == null
          ? addError(data)
          : validateMin(date);
      }
      else if (isDateType(data))
        return validateMin(data);
      else
        return data == null;
    };
  }
  if (validateMax != null) {
    return function validateFormatMaximum(data) {
      if (isStringType(data))
        return validateMax(parseType(data));
      else if (isDateType(data))
        return validateMax(data);
      return true;
    };
  }

  return function validateDateTime(data) {
    if (isStringType(data)) {
      const date = parseType(data);
      return date == null
        ? addError(data)
        : true;
    }
    else return true;
  };
}
//#endregion

function compileDateTimeFormat(schemaObj, jsonSchema) {
  return compileFormatByType(
    'date-time',
    getDateTypeOfDateTimeRFC3339,
    schemaObj,
    jsonSchema);
}

function compileDateOnlyFormat(schemaObj, jsonSchema) {
  return compileFormatByType(
    'date',
    getDateTypeOfDateOnlyRFC3339,
    schemaObj,
    jsonSchema);
}

function compileTimeOnlyFormat(schemaObj, jsonSchema) {
  return compileFormatByType(
    'time',
    getDateTypeOfTimeOnlyRFC3339,
    schemaObj,
    jsonSchema);
}

export const formatCompilers = {
  'date-time': compileDateTimeFormat,
  date: compileDateOnlyFormat,
  time: compileTimeOnlyFormat,
};
