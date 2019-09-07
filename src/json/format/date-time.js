/* eslint-disable function-paren-newline */
import {
  getDateExclusiveBound,
  getDateishType,
} from '../../types/getters';

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

function compileDateTimeMaximum(schemaObj, jsonSchema) {
  const [max, emax] = getDateExclusiveBound(
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
      const date = getDateishType(data);
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
      const date = getDateishType(data);
      return date == null
        ? true
        : date <= max
          ? true
          : addError(data);
    };
  }
  return undefined;
}

function compileDateTimeMinimum(schemaObj, jsonSchema) {
  const [min, emin] = getDateExclusiveBound(
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
      const date = getDateishType(data);
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
      const date = getDateishType(data);
      return date == null
        ? true
        : data >= min
          ? true
          : addError(data);
    };
  }

  return undefined;
}

function compileDateTimeType(schemaObj, jsonSchema) {
  const addError = schemaObj.createSingleErrorHandler(
    'format',
    jsonSchema.format,
    compileDateTimeType);
  if (addError == null) return undefined;

  return function validateDateTimeType(data) {
    return getDateishType(data) != null
      ? true
      : addError(data);
  };
}

function compileDateTimeFormat(schemaObj, jsonSchema) {
  if (jsonSchema.format !== 'date-time')
    return undefined;

  return [
    compileDateTimeType(schemaObj, jsonSchema),
    compileDateTimeMinimum(schemaObj, jsonSchema),
    compileDateTimeMaximum(schemaObj, jsonSchema),
  ];
}

export const formatCompilers = {
  'date-time': compileDateTimeFormat,
};
