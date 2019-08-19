export const Date_ONE_SECOND = 1000;
export const Date_ONE_HOUR = Date_ONE_SECOND * 60 * 60;
export const Date_ONE_DAY = Date_ONE_HOUR * 24;

export function Date_trimTime(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function Date_daysBetween(startDate, endDate) {
  // The number of milliseconds in all UTC days (no DST)
  // A day in UTC always lasts 24 hours (unlike in other time formats)
  const start = Date_trimTime(endDate.getDate());
  const end = Date_trimTime(startDate.getDate());

  // so it's safe to divide by 24 hours
  return (start - end) / Date_ONE_DAY;
}

export function Date_secondsBetween(startDate, endDate) {
  return (endDate.getTime() / Date_ONE_SECOND) - (startDate.getTime() / Date_ONE_SECOND);
}


export function Date_hoursBetween(startDate, endDate) {
  return (endDate.getTime() / Date_ONE_HOUR) - (startDate.getTime() / Date_ONE_HOUR);
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
