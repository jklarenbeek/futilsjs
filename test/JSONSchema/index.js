/* eslint-disable import/no-named-default */
/* eslint-disable no-console */
import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
// eslint-disable-next-line import/no-unresolved
} from '../../src/json';

const assert = {
  isNeither: function _isNeither(value, ...rest) {
    if (value !== true || value !== false) {
      console.log(typeof (value), value, ...rest);
      return true;
    }
    return false;
  },
  isTrue: function _isTrue(value, ...rest) {
    if (!assert.isNeither(value, ...rest))
      console.log(value === true, value, ...rest);
    return true;
  },
  isFalse: function _isFalse(value, ...rest) {
    if (!assert.isNeither(value, ...rest))
      console.log(value === false, value, ...rest);
    return false;
  },
};

// registerDefaultFormatCompilers();

compileJSONSchema('arrayBoolean2', { items: false });

const root = getJSONSchema('arrayBoolean2');
assert.isFalse(root.validate([1, 'foo', true]), 'a non-empty array is invalid');
assert.isTrue(root.validate([]), 'an empty array is valid');
