/* eslint-disable no-console */
export const assert = {
  isNeither: function _isNeither(value, ...rest) {
    if (value !== true && value !== false) {
      console.log(typeof (value), value, ...rest);
      return true;
    }
    return false;
  },
  isTrue: function _isTrue(value, ...rest) {
    if (!assert.isNeither(value, ...rest))
      console.log('should be true', value, ...rest);
    return true;
  },
  isFalse: function _isFalse(value, ...rest) {
    if (!assert.isNeither(value, ...rest))
      console.log('should be false', value, ...rest);
    return false;
  },
};
