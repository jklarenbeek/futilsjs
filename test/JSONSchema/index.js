import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

assert.isTrue(compileJSONSchema('booleanNot1', {
  not: true,
}), 'compiling');
const root = getJSONSchema('booleanNot1');
assert.isFalse(root.validate('foo'), 'any value is invalid');
