import { isStringOrDateType } from '../../types/core';

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

function compileDateTimeFormat(schemaObj, jsonSchema) {
  if (jsonSchema.format !== 'date-time')
    return undefined;

  const fmin = jsonSchema.formatMinimum;
  const femin = jsonSchema.formatExclusiveMinimum;
  const min = Date.parse(fmin) || undefined;
  const emin = femin === true ? min
    : Date.parse(femin) || undefined;

  const fmax = jsonSchema.formatMaximum;
  const femax = jsonSchema.formatExclusiveMaximum;
  const max = Date.parse(fmax);
  const emax = femax === true ? max
    : Date.parse(femax) || undefined;

  // eslint-disable-next-line no-inner-declarations
  function compileMinimum() {
    if (emin) {
      const addError = schemaObj.createSingleErrorHandler('formatExclusiveMinimum', emin, compileDateTimeFormat);
      return function formatExclusiveMinimum(date) {
        if (!(date > emin)) return addError(date);
        return true;
      };
    }
    else if (min) {
      const addError = schemaObj.createSingleErrorHandler('formatMinimum', min, compileDateTimeFormat);
      return function formatMinimum(date) {
        if (!(date >= min)) return addError(date);
        return true;
      };
    }
    return undefined;
  }

  // eslint-disable-next-line no-inner-declarations
  function compileMaximum() {
    if (emax) {
      const addError = schemaObj.createSingleErrorHandler('formatExclusiveMaximum', emax, compileDateTimeFormat);
      return function formatExclusiveMaximum(date) {
        if (!(date < emax)) return addError(date);
        return true;
      };
    }
    else if (max) {
      const addError = schemaObj.createSingleErrorHandler('formatMaximum', max, compileDateTimeFormat);
      return function formatMaximum(date) {
        if (!(date <= max)) return addError(date);
        return true;
      };
    }
    return undefined;
  }

  // eslint-disable-next-line no-inner-declarations
  function compileDateType() {
    const addError = schemaObj.createSingleErrorHandler('format', 'date', compileDateTimeFormat);
    return function validateDate(data) {
      if (isStringOrDateType(data)) {
        const date = Date.parse(data) || false;
        return (date !== false)
          ? date
          : addError(data);
      }
      return true;
    };
  }

  return [
    compileDateType(),
    compileMinimum(),
    compileMaximum(),
  ];
}

export const compileFormat = compileDateTimeFormat;
