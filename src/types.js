export function isPrimitiveTypeEx(typeString) {
  return typeString === 'integer'
    || typeString === 'number'
    || typeString === 'string'
    || typeString === 'boolean';
}

export function isPrimitiveType(obj) {
  const tp = typeof obj;
  return isPrimitiveTypeEx(tp);
}

export function isPureObject(obj) {
  return (obj !== undefined
    && obj !== null
    && obj.constructor !== Array
    && typeof obj === 'object');
}

export function sanitizePrimitiveValue(value, nullable) {
  if (nullable) {
    if (!value) return null;
    return isPrimitiveType(value) ? value : null;
  }
  if (!value) return undefined;
  return isPrimitiveType(value) ? value : undefined;
}

export function checkIfValueDisabled(value, nullable, disabled) {
  if (disabled) return true;
  if (value === undefined) return true;
  if (nullable && value === null) return false;
  return !isPrimitiveType(value);
}
