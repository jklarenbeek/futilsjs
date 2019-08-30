export function isPrimitiveTypeEx(typeString) {
  // primitives: boolean = 1, integer = 32, float = 64, bigint = 0, letter = 16
  // complex: struct, array, string, map
  return typeString === 'integer'
    || typeString === 'number'
    || typeString === 'string'
    || typeString === 'bigint'
    || typeString === 'boolean';
}

export function isPrimitiveType(obj) {
  return obj != null && isPrimitiveTypeEx(typeof obj);
}

export function isStrictBooleanType(data) {
  return data === false || data === true;
}
isStrictBooleanType.typeName = 'boolean';

export function isBooleanishType(data) {
  return data === true
    || data === false
    || data === 'true'
    || data === 'false';
  // || data === 0
  // || data === 1;
}
isBooleanishType.typeName = 'boolean';

export function isStrictIntegerType(data) {
  return Number.isInteger(data);
}
isStrictIntegerType.typeName = 'integer';

export function isIntegerishType(data) {
  return Number.isInteger(Number(data));
}
isIntegerishType.typeName = 'integer';

export function isStrictBigIntType(data) {
  // eslint-disable-next-line valid-typeof
  return typeof data === 'bigint';
}
isStrictBigIntType.typeName = 'bigint';

export function isStrictNumberType(data) {
  return typeof data === 'number';
}
isStrictNumberType.typeName = 'number';

export function isNumberishType(data) {
  return (Number(data) || data === 0 || false) !== false;
}
isNumberishType.typeName = 'number';

export function isStrictStringType(data) {
  return typeof data === 'string';
}
isStrictStringType.typeName = 'string';

export function isStrictNullValue(data) {
  return data === null;
}

export function isStrictObjectType(data) {
  return data != null
    && typeof data === 'object'
    && !(data instanceof Array
      || data.constructor === Map
      || data.constructor === Set
      || data.constructor === Int8Array
      || data.constructor === Uint8Array
      || data.constructor === Uint8ClampedArray
      || data.constructor === Int16Array
      || data.constructor === Uint16Array
      || data.constructor === Int32Array
      || data.constructor === Uint32Array
      // eslint-disable-next-line no-undef
      || data.constructor === BigInt64Array
      // eslint-disable-next-line no-undef
      || data.constructor === BigUint64Array
    );
}
isStrictObjectOfType.typeName = 'object';

export function isObjectishType(data) {
  return data != null
    && typeof data === 'object'
    && !(data.constructor === Array
      || data.constructor === Map
      || data.constructor === Set);
}
isObjectishType.typeName = 'object';

export function isStrictObjectOfType(data, fn) {
  return data != null && data.constructor === fn;
}
isStrictObjectOfType.typeName = 'object';

export function isStrictArrayType(data) {
  return data != null
    && data.constructor === Array;
}
isStrictArrayType.typeName = 'array';

export function isStrictTypedArray(data) {
  return data != null
    && (data.constructor === Int8Array
    || data.constructor === Uint8Array
    || data.constructor === Uint8ClampedArray
    || data.constructor === Int16Array
    || data.constructor === Uint16Array
    || data.constructor === Int32Array
    || data.constructor === Uint32Array
    // eslint-disable-next-line no-undef
    || data.constructor === BigInt64Array
    // eslint-disable-next-line no-undef
    || data.constructor === BigUint64Array);
}
isStrictTypedArray.typeName = 'array';

export function isArrayishType(data) {
  return data != null
    && (data instanceof Array
    || isStrictTypedArray(data));
}
isArrayishType.typeName = 'array';

// isStrictNumberType(string type) return bool {
//   return ['integer', 'float', 'boolean']
//     includes type;
// }
// operator bool includes(array<string> source, string type);

// isObjectishType(string type) return bool {
//  return type != null
//    && ['Array', 'Set', 'Map'] includes type
// }
