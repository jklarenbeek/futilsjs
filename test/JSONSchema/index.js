import {
  compileJSONSchema,
  getJSONSchema,
  // registerDefaultFormatCompilers,
} from '../../src/json';

import {
  assert,
} from './util';

// registerDefaultFormatCompilers();

assert.isTrue(compileJSONSchema('withoutIf1', {
  if: { exclusiveMaximum: 0 },
  then: { minimum: -10 },
}), 'compiling');

const root = getJSONSchema('withoutIf1');
assert.isTrue(root.validate(-1), 'valid through then');
assert.isFalse(root.validate(-100), 'invalid through then');
assert.isTrue(root.validate(3), 'valid when if test fails');
