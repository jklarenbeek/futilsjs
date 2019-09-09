import {
  isStringType,
  isDateType,
} from './core';

import {
  getDateishType,
} from './getters';

export const CONST_SECOND = 1000;
export const CONST_HOUR = CONST_SECOND * 60 * 60;
export const CONST_DAY = CONST_HOUR * 24;

export const CONST_DATETIME_ZERO = new Date('1970-01-01-T00:00:00Z');
export const CONST_TIME_INSERTDATE = '1970-01-01T';
export const CONST_TIME_APPENDOFFS = '+00:00'; // TODO add timezone data
export const CONST_DATE_APPENDTIME = 'T00:00:00' + CONST_TIME_APPENDOFFS;

export function getDateOnly(value) {
  const date = getDateishType(value);
  return isDateType(date)
    ? Date_trimTime(date)
    : undefined;
}

export function getTimeOnly(value) {
  return isStringType(value)
    ? getDateishType(CONST_TIME_INSERTDATE + value)
    : isDateType(value)
      ? Date_trimDate(value)
      : undefined;
}

export function Date_getTimezoneOffset() {
  new Date(
    Date.UTC(1970, 0, 1),
  ).getTimezoneOffset();
}

export function Date_trimTime(date) {
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ));
}

export function Date_trimDate(date) {
  return new Date(1970, 0, 1,
    date.getUTCHour(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds());
}

export function Date_isLeapYear(year) {
  // https://tools.ietf.org/html/rfc3339#appendix-C
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function Date_daysBetween(startDate, endDate) {
  // The number of milliseconds in all UTC days (no DST)
  // A day in UTC always lasts 24 hours (unlike in other time formats)
  const start = Date_trimTime(startDate.getDate());
  const end = Date_trimTime(endDate.getDate());

  // so it's safe to divide by 24 hours
  return (start - end) / CONST_DAY;
}

export function Date_secondsBetween(startDate, endDate) {
  return (endDate.getTime() / CONST_SECOND) - (startDate.getTime() / CONST_SECOND);
}


export function Date_hoursBetween(startDate, endDate) {
  return (endDate.getTime() / CONST_HOUR) - (startDate.getTime() / CONST_HOUR);
}

export function Date_inBetween(value, startDate, endDate,
  exclusiveStart = false, exclusiveEnd = false) {
  if (!value || value.constructor !== Date) return false;
  const hs = startDate && startDate.constructor === Date;
  const he = endDate && endDate.constructor === Date;
  if (hs && he) {
    const sdt = startDate.getTime();
    const edt = endDate.getTime();
    const vdt = value.getTime();
    if (exclusiveStart && exclusiveEnd) {
      return (vdt > sdt) && (vdt < edt);
    }
    else if (exclusiveStart) {
      return (vdt > sdt) && (vdt <= edt);
    }
    else if (exclusiveEnd) {
      return (vdt >= sdt) && (vdt < edt);
    }
    else {
      return (vdt >= sdt) && (vdt <= edt);
    }
  }
  else if (hs) {
    const sdt = startDate.getTime();
    const vdt = value.getTime();
    return vdt > sdt;
  }
  else if (he) {
    const edt = endDate.getTime();
    const vdt = value.getTime();
    return vdt < edt;
  }
  return true;
}
