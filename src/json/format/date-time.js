/* eslint-disable function-paren-newline */
import {
  isDateishType,
  isStringType,
  isStringOrDateType,
} from '../../types/core';

import {
  getTypeExclusiveBound,
  getDateType,
} from '../../types/getters';

import {
  isDateTimeRFC3339,
  getDateTypeOfDateTimeRFC3339,
} from '../../types/dates';

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

function compileDateTimeMinimum(schemaObj, jsonSchema) {
  const [min, emin] = getTypeExclusiveBound(
    getDateTypeOfDateTimeRFC3339,
    jsonSchema.formatMinimum,
    jsonSchema.formatExclusiveMinimum,
  );

  if (emin != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatExclusiveMinimum',
      emin,
      compileDateTimeMinimum);
    if (addError == null) return undefined;

    return function formatDateTimeExclusiveMinimum(data) {
      const date = getDateType(data, getDateTypeOfDateTimeRFC3339(data));
      return date == null
        ? true
        : data > emin
          ? true
          : addError(data);
    };
  }
  else if (min) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatMinimum',
      min,
      compileDateTimeMinimum);
    if (addError == null) return undefined;

    return function formatDateTimeMinimum(data) {
      const date = getDateType(data, getDateTypeOfDateTimeRFC3339(data));
      return date == null
        ? true
        : data >= min
          ? true
          : addError(data);
    };
  }

  return undefined;
}

function compileDateTimeMaximum(schemaObj, jsonSchema) {
  const [max, emax] = getTypeExclusiveBound(
    getDateTypeOfDateTimeRFC3339,
    jsonSchema.formatMaximum,
    jsonSchema.formatExclusiveMaximum,
  );

  if (emax != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatExclusiveMaximum',
      emax,
      compileDateTimeMaximum);
    if (addError == null) return undefined;

    return function formatDateTimeExclusiveMaximum(data) {
      const date = getDateType(data) || (isStringType(data) && getDateTypeOfDateTimeRFC3339(data));
      return date == null
        ? true
        : date < emax
          ? true
          : addError(data);
    };
  }
  else if (max != null) {
    const addError = schemaObj.createSingleErrorHandler(
      'formatMaximum',
      max,
      compileDateTimeMaximum);
    if (addError == null) return undefined;

    return function formatDateTimeMaximum(data) {
      const date = getDateType(data) || (isStringType(data) && getDateTypeOfDateTimeRFC3339(data));
      return date == null
        ? true
        : date <= max
          ? true
          : addError(data);
    };
  }
  return undefined;
}

function compileDateTimeFormat(schemaObj, jsonSchema) {
  if (jsonSchema.format !== 'date-time')
    return undefined;

  const addError = schemaObj.createSingleErrorHandler(
    'format',
    jsonSchema.format,
    compileDateTimeFormat);
  if (addError == null) return undefined;

  const validateMin = compileDateTimeMinimum(schemaObj, jsonSchema);
  const validateMax = compileDateTimeMaximum(schemaObj, jsonSchema);

  if (validateMin == null && validateMax == null) {
    return function validateDateTime(data) {
      return isStringOrDateType(data)
        ? (isDateTimeRFC3339(data) || addError(data))
        : true;
    };
  }
  if (validateMin == null) {
    return function validateDateTimeMinimum(data) {
      return isStringOrDateType(data)
        ? (isDateTimeRFC3339(data) || addError(data))
        : true;
    };

  }
  return [
    function isDateTimeType(data) {
      return !isStringType(data) || isDateTimeRFC3339(data) || addError(data);
    },
    ,
    compileDateTimeMaximum(schemaObj, jsonSchema),
  ];
}

function compileDateOnlyFormat(schemaObj, jsonSchema) {
  if (jsonSchema.format !== 'date')
    return undefined;

  const format = {
    formatExclusiveMaximum: getDateOnly(jsonSchema.formatExclusiveMaximum),
    formatMaximum: getDateOnly(jsonSchema.formatMaximum),
    formatExclusiveMinimum: getDateOnly(jsonSchema.formatExclusiveMinimum),
    formatMinimum: getDateOnly(jsonSchema.formatMinimum),
  };

  const addError = schemaObj.createSingleErrorHandler(
    'format',
    jsonSchema.format,
    compileDateOnlyFormat);
  if (addError == null) return undefined;

  return [
    function validateDateTimeType(data) {
      return data == null || isDateishType(data) || addError(data);
    },
    compileDateTimeMinimum(schemaObj, format),
    compileDateTimeMaximum(schemaObj, format),
  ];
}

function compileTimeOnlyFormat(schemaObj, jsonSchema) {
  if (jsonSchema.format !== 'time')
    return undefined;

  const format = {
    formatExclusiveMaximum: getTimeOnly(jsonSchema.formatExclusiveMaximum),
    formatMaximum: getTimeOnly(jsonSchema.formatMaximum),
    formatExclusiveMinimum: getTimeOnly(jsonSchema.formatExclusiveMinimum),
    formatMinimum: getTimeOnly(jsonSchema.formatMinimum),
  };

  const addError = schemaObj.createSingleErrorHandler(
    'format',
    jsonSchema.format,
    compileTimeOnlyFormat);
  if (addError == null) return undefined;

  return [
    function validateDateTimeType(data) {
      return data == null || getTimeOnly(data) != null || addError(data);
    },
    compileDateTimeMinimum(schemaObj, format),
    compileDateTimeMaximum(schemaObj, format),
  ];
}

export const formatCompilers = {
  'date-time': compileDateTimeFormat,
  date: compileDateOnlyFormat,
  time: compileTimeOnlyFormat,
};
