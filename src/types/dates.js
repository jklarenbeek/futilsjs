/* eslint-disable function-paren-newline */
export const CONST_SECOND = 1000;
export const CONST_HOUR = CONST_SECOND * 60 * 60;
export const CONST_DAY = CONST_HOUR * 24;

export const CONST_DATETIME_ZERO = new Date('1970-00-01-T00:00:00Z');
export const CONST_TIME_INSERTDATE = '1970-00-01T';
export const CONST_TIME_APPENDOFFS = '+00:00'; // TODO add timezone data
export const CONST_DATE_APPENDTIME = 'T00:00:00' + CONST_TIME_APPENDOFFS;

export function isLeapYear(year) {
  // https://tools.ietf.org/html/rfc3339#appendix-C
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export const CONST_RFC3339_DAYS = Object.freeze(
  [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
);

// full-date from http://tools.ietf.org/html/rfc3339#section-5.6
export const CONST_RFC3339_REGEX_ISDATE = /^(\d\d\d\d)-([0-1]\d)-([0-3]\d)z?$/i;

export function isDateWith(year, month, day) {
  return month >= 1
    && month <= 12
    && day >= 1
    && day <= (month === 2 && isLeapYear(year)
      ? 29
      : CONST_RFC3339_DAYS[month]);
}

export function isDateRFC3339(str) {
  const matches = str.match(CONST_RFC3339_REGEX_ISDATE);
  return matches != null
    && isDateWith(
      matches[1],
      matches[2],
      matches[3]);
}

export function getDateTypeOfRFC3339Date(str) {
  const matches = str.match(CONST_RFC3339_REGEX_ISDATE);
  return (matches != null
    && isDateWith(
      matches[1], // year
      matches[2], // month
      matches[3]) // day
    && new Date(Date.UTC(
      matches[1], // year
      matches[2], // month
      matches[3])) // day
  ) || undefined;
}

// full-date from http://tools.ietf.org/html/rfc3339#section-5.6
export const CONST_RFC3339_REGEX_ISTIME = /^(\d\d):(\d\d):(\d\d)(\.\d{3})?(z|(([+-])(\d\d):(\d\d)))$/i;

export function isTimeWith(hrs = 0, min = 0, sec = 0, tzh = 0, tzm = 0) {
  return ((hrs === 23 && min === 59 && sec === 60)
    || (hrs >= 0 && hrs <= 23
      && min >= 0 && min <= 59
      && sec >= 0 && sec <= 59))
    && (tzh >= 0 && tzh <= 23
      && tzm >= 0 && tzm <= 59);
}

export function isTimeRFC3339(str) {
  const matches = str.match(CONST_RFC3339_REGEX_ISTIME);
  return matches != null
    && isTimeWith(
      matches[1], // hours
      matches[2], // minutes
      matches[3], // seconds
      (matches[8] | 0), // timezone hours
      (matches[9] | 0)); // timezone minutes
}

export function getDateTypeOfRFC3339Time(str) {
  const matches = str.match(CONST_RFC3339_REGEX_ISTIME);
  return matches != null
    && isTimeWith(
      matches[1], // hours
      matches[2], // minutes
      matches[3], // seconds
      (matches[8] | 0), // timezone hours
      (matches[9] | 0)) // timezone minutes
    && new Date(Date.parse(CONST_TIME_INSERTDATE + str));
}

export function isDateTimeRFC3339(str) {
  // http://tools.ietf.org/html/rfc3339#section-5.6
  const dateTime = str.split(/t|\s/i);
  return dateTime.length === 2
    && isDateRFC3339(dateTime[0])
    && isTimeRFC3339(dateTime[1]);
}

export function getDateTypeOfRFC3339DateTime(str) {
  const dateTime = str.split(/t|\s/i);
  const date = getDateTypeOfRFC3339Date(dateTime[0]);
  const time = getDateTypeOfRFC3339Time(dateTime[1]);
  return date != null && time != null && (date + time)
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
