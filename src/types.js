export const PRIMITIVES = ['boolean', 'integer', 'number', 'string'];

export function isPureObject(obj) {
  return (obj !== undefined
    && obj !== null
    && obj.constructor !== Array
    && typeof obj === 'object');
}

export function sanitizePrimitiveValue(value, nullable) {
  if (nullable) {
    if (!value) return null;
    if (!PRIMITIVES.includes(typeof value)) return null;
    return value;
  }
  else {
    if (!value) return undefined;
    if (!PRIMITIVES.includes(typeof value)) return undefined;
    return value;
  }
}

export function checkIfValueDisabled(value, nullable, disabled) {
  if (disabled) return true;
  if (typeof value === 'undefined') return true;

  if (nullable && value === null) return false;
  return !PRIMITIVES.includes(typeof value);
}
