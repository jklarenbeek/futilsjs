/* eslint-disable function-paren-newline */
export const CONST_TICKS_SECOND = 1000;
export const CONST_TICKS_HOUR = CONST_TICKS_SECOND * 60 * 60;
export const CONST_TICKS_DAY = CONST_TICKS_HOUR * 24;

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

export function isDateOnlyInRange(year, month, day) {
  return month >= 1
    && month <= 12
    && day >= 1
    && day <= (month === 2 && isLeapYear(year)
      ? 29
      : CONST_RFC3339_DAYS[month]);
}

export function isDateOnlyRFC3339(str) {
  const matches = str.match(CONST_RFC3339_REGEX_ISDATE);
  return matches != null
    && isDateOnlyInRange(
      matches[1],
      matches[2],
      matches[3]);
}

export function getDateTypeOfDateOnlyRFC3339(str, def = undefined) {
  const matches = str.match(CONST_RFC3339_REGEX_ISDATE);
  return (matches != null
    && isDateOnlyInRange(
      matches[1], // year
      matches[2], // month
      matches[3]) // day
    && new Date(Date.UTC(
      matches[1], // year
      matches[2], // month
      matches[3])) // day
  ) || def;
}

// full-date from http://tools.ietf.org/html/rfc3339#section-5.6
export const CONST_RFC3339_REGEX_ISTIME = /^(\d\d):(\d\d):(\d\d)(\.\d{3})?(z|(([+-])(\d\d):(\d\d)))$/i;

export function isTimeOnlyInRange(hrs = 0, min = 0, sec = 0, tzh = 0, tzm = 0) {
  return ((hrs === 23 && min === 59 && sec === 60)
    || (hrs >= 0 && hrs <= 23
      && min >= 0 && min <= 59
      && sec >= 0 && sec <= 59))
    && (tzh >= 0 && tzh <= 23
      && tzm >= 0 && tzm <= 59);
}

export function isTimeOnlyRFC3339(str) {
  const matches = str.match(CONST_RFC3339_REGEX_ISTIME);
  return matches != null
    && isTimeOnlyInRange(
      matches[1], // hours
      matches[2], // minutes
      matches[3], // seconds
      (matches[8] | 0), // timezone hours
      (matches[9] | 0)); // timezone minutes
}

export function getDateTypeOfTimeOnlyRFC3339(str, def = undefined) {
  const matches = str.match(CONST_RFC3339_REGEX_ISTIME);
  return (matches != null
    && isTimeOnlyInRange(
      matches[1], // hours
      matches[2], // minutes
      matches[3], // seconds
      (matches[8] | 0), // timezone hours
      (matches[9] | 0)) // timezone minutes
    && new Date(Date.parse(CONST_TIME_INSERTDATE + str)))
    || def;
}

export function isDateTimeRFC3339(str) {
  // http://tools.ietf.org/html/rfc3339#section-5.6
  const dateTime = str.split(/t|\s/i);
  return dateTime.length === 2
    && isDateOnlyRFC3339(dateTime[0])
    && isTimeOnlyRFC3339(dateTime[1]);
}

export function getDateTypeOfDateTimeRFC3339(str, def = undefined) {
  const dateTime = str.split(/t|\s/i);
  const date = getDateTypeOfDateOnlyRFC3339(dateTime[0]);
  const time = getDateTypeOfTimeOnlyRFC3339(dateTime[1]);
  return (date != null && time != null && (date + time)) || def;
}

export function getDateTypeTimezoneOffset() {
  return new Date(0).getTimezoneOffset();
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

export function Date_daysBetween(startDate, endDate) {
  // The number of milliseconds in all UTC days (no DST)
  // A day in UTC always lasts 24 hours (unlike in other time formats)
  const start = Date_trimTime(startDate.getDate());
  const end = Date_trimTime(endDate.getDate());

  // so it's safe to divide by 24 hours
  return (start - end) / CONST_TICKS_DAY;
}

export function Date_secondsBetween(startDate, endDate) {
  return (endDate.getTime() / CONST_TICKS_SECOND) - (startDate.getTime() / CONST_TICKS_SECOND);
}


export function Date_hoursBetween(startDate, endDate) {
  return (endDate.getTime() / CONST_TICKS_HOUR) - (startDate.getTime() / CONST_TICKS_HOUR);
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
