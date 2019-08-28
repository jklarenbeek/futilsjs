import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

compileJSONSchema('arrayContains2', { contains: { minimum: 5 } });
const root = getJSONSchema('arrayContains2');
assert.isTrue(root.validate([3, 4, 5]), 'last item 5 is valid');
assert.isTrue(root.validate([3, 4, 6]), 'last item 6 is valid');
assert.isTrue(root.validate([3, 4, 5, 6]), 'last two items are valid');
assert.isFalse(root.validate([2, 3, 4]), 'no matching lower items');
assert.isFalse(root.validate([]), 'empty array is invalid');
assert.isTrue(root.validate({}), 'not array is valid');
