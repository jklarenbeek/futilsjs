import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

compileJSONSchema('emptyAllOf1', {
  allOf: [{}],
});
const root = getJSONSchema('emptyAllOf1');
assert.isTrue(root.validate(1), 'any value is valid');
